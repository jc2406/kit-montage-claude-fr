#!/usr/bin/env node
// Agent 2 — Couper les erreurs et les répétitions : appliquer les coupes validées
// Prend une liste de coupes VALIDÉE (produite après l'étape de validation) + la transcription
// et la vidéo d'entrée, retire ces plages, recale la transcription et, en option, rend la vidéo
// coupée (ffmpeg trim+concat, image et son gardés synchronisés).
//
// Forme du fichier de coupes validées : { "cuts": [ { "start": <s>, "end": <s>, "reason": "..." }, ... ] }
//   (start/end en secondes sur la timeline de la transcription / vidéo d'ENTRÉE)
//
// Sorties (à côté de la transcription, ou dans --out-dir) :
//   <stem>.mistakes-edl.json          plages gardées/supprimées + résumé
//   <stem>.mistakes-transcript.json   mots recalés sur la nouvelle timeline
//   <stem>.mistakes-decisions.md      ce qui a été retiré + pourquoi
//   <stem>.mistakes-filter.txt        graphe de filtres ffmpeg (avec --video)
//   <video-stem>.mistakes-cut.mp4     la vidéo coupée (avec --apply)
//
// Utilisation :
//   node apply-cuts.mjs <transcript.json> --cuts <approved.json> \
//     [--video in.mp4] [--output out.mp4] [--out-dir dossier] [--apply]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve, basename, extname } from "node:path";
import { spawnSync } from "node:child_process";
import { argv, exit } from "node:process";

function die(m, c = 1) { console.error(m); exit(c); }

const args = argv.slice(2);
if (args.length === 0 || args.includes("--help")) {
  console.log("Utilisation : node apply-cuts.mjs <transcript.json> --cuts <approved.json> [--video in.mp4] [--output out.mp4] [--out-dir dossier] [--apply]");
  exit(args.length === 0 ? 1 : 0);
}
const opts = { transcript: null, cuts: null, video: null, output: null, outDir: null, apply: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--cuts") opts.cuts = args[++i];
  else if (a === "--video") opts.video = args[++i];
  else if (a === "--output" || a === "-o") opts.output = args[++i];
  else if (a === "--out-dir") opts.outDir = args[++i];
  else if (a === "--apply") opts.apply = true;
  else if (a.startsWith("--")) die(`option inconnue : ${a}`);
  else if (!opts.transcript) opts.transcript = a;
}
if (!opts.transcript) die("aucune transcription fournie");
if (!opts.cuts) die("aucun fichier --cuts fourni");

const transcriptPath = resolve(opts.transcript);
const transcript = JSON.parse(readFileSync(transcriptPath, "utf8"));
const cutsDoc = JSON.parse(readFileSync(resolve(opts.cuts), "utf8"));
const approved = cutsDoc.cuts ?? cutsDoc;
if (!Array.isArray(approved)) die('cuts doit être un tableau (un tableau vide est valide)');
if (approved.some(c => !c || typeof c.start !== 'number' || typeof c.end !== 'number' || !Number.isFinite(c.start) || !Number.isFinite(c.end) || c.end <= c.start)) die('Chaque plage de coupe doit avoir un début et une fin numériques finis, avec début < fin');
if (!Array.isArray(transcript.words)) die('la transcription n\'a pas de tableau words');

const words = transcript.words
  .filter((w) => (w.type ? w.type === "word" : true))
  .filter((w) => Number.isFinite(Number(w.start)) && Number.isFinite(Number(w.end)))
  .map((w) => ({ text: w.text, start: Number(w.start), end: Number(w.end) }));
if (!words.length) die('la transcription n\'a aucun mot horodaté');

let duration = Number(transcript.audio_duration_secs);
if (!Number.isFinite(duration)) {
  if (opts.video && existsSync(resolve(opts.video))) {
    const p = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", resolve(opts.video)]);
    duration = Number(p.stdout?.toString().trim());
  }
  if (!Number.isFinite(duration)) duration = words.at(-1).end + 0.2;
}
if (!Number.isFinite(duration) || duration <= 0) die('Durée source invalide');
if (approved.some(c => c.start < 0 || c.end > duration)) die('La plage de coupe sort des limites de la durée source');

function mergeRanges(ranges) {
  const sorted = ranges.map((r) => ({ start: Number(r.start), end: Number(r.end), reasons: r.reason ? [r.reason] : [] }))
    .sort((a, b) => a.start - b.start);
  const merged = [];
  for (const r of sorted) {
    const last = merged.at(-1);
    if (!last || r.start > last.end) merged.push({ ...r });
    else { last.end = Math.max(last.end, r.end); last.reasons.push(...r.reasons); }
  }
  return merged;
}
const mergedDeletes = mergeRanges(approved);

const keepRanges = [];
let cursor = 0;
for (const d of mergedDeletes) {
  if (d.start > cursor) keepRanges.push({ start: cursor, end: d.start });
  cursor = Math.max(cursor, d.end);
}
if (cursor < duration) keepRanges.push({ start: cursor, end: duration });
const usableKeepRanges = keepRanges.filter((r) => r.end > r.start);
if (!usableKeepRanges.length) die('Les plages de coupe suppriment toute la durée source');

const removedTotal = mergedDeletes.reduce((s, r) => s + (r.end - r.start), 0);
const editedDuration = Number((duration - removedTotal).toFixed(3));

function removedBefore(t) {
  let removed = 0;
  for (const d of mergedDeletes) {
    if (d.end <= t) removed += d.end - d.start;
    else if (d.start < t) removed += t - d.start;
    else break;
  }
  return removed;
}
const inDeleted = (w) => mergedDeletes.some((d) => w.start < d.end && d.start < w.end);

const editedWords = [];
for (const w of words) {
  if (inDeleted(w)) continue;
  editedWords.push({
    text: w.text,
    source_start: w.start, source_end: w.end,
    start: Number((w.start - removedBefore(w.start)).toFixed(3)),
    end: Number((w.end - removedBefore(w.end)).toFixed(3)),
  });
}

function buildFilterScript(ranges) {
  const lines = [];
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    lines.push(`[0:v]trim=start=${r.start.toFixed(3)}:end=${r.end.toFixed(3)},setpts=PTS-STARTPTS[v${i}];`);
    lines.push(`[0:a]atrim=start=${r.start.toFixed(3)}:end=${r.end.toFixed(3)},asetpts=PTS-STARTPTS[a${i}];`);
  }
  lines.push(`${ranges.map((_, i) => `[v${i}][a${i}]`).join("")}concat=n=${ranges.length}:v=1:a=1[v][a]`);
  return lines.join("\n");
}
function fmt(s) { const m = Math.floor(s / 60); return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(2).padStart(5, "0")}`; }

const stem = basename(transcriptPath, extname(transcriptPath)).replace(/[-.]?(silence-|mistakes-)?transcript.*$/i, "") || "source";
const outDir = opts.outDir ? resolve(opts.outDir) : dirname(transcriptPath);
mkdirSync(outDir, { recursive: true });

const edl = { agent: "cut-mistakes", source_duration: duration, edited_duration: editedDuration, removed: Number(removedTotal.toFixed(3)), delete_ranges: mergedDeletes, keep_ranges: usableKeepRanges };
const transcriptOut = { language_code: transcript.language_code, source_audio_duration_secs: duration, audio_duration_secs: editedDuration, produced_by: "cut-mistakes", words: editedWords };

writeFileSync(join(outDir, `${stem}.mistakes-edl.json`), JSON.stringify(edl, null, 2));
writeFileSync(join(outDir, `${stem}.mistakes-transcript.json`), JSON.stringify(transcriptOut, null, 2));
writeFileSync(join(outDir, `${stem}.mistakes-decisions.md`), [
  "# Décisions de coupe des erreurs (appliquées)",
  "",
  `Durée d'entrée : ${fmt(duration)} (${duration.toFixed(2)} s)`,
  `Durée de sortie : ${fmt(editedDuration)} (${editedDuration.toFixed(2)} s)`,
  `Retiré : ${removedTotal.toFixed(2)} s en ${mergedDeletes.length} coupes`,
  "",
  ...mergedDeletes.map((d) => `- ${fmt(d.start)}–${fmt(d.end)} (${(d.end - d.start).toFixed(2)}s): ${d.reasons.join("; ") || "coupe validée"}`),
].join("\n"));

const summary = {
  inputDuration: Number(duration.toFixed(3)), editedDuration,
  removed: Number(removedTotal.toFixed(3)), removedPct: Number(((removedTotal / duration) * 100).toFixed(1)),
  cuts: mergedDeletes.length, editedWords: editedWords.length, outDir,
};

if (opts.video) {
  const videoPath = resolve(opts.video);
  if (!existsSync(videoPath)) die(`--video introuvable : ${videoPath}`);
  const outputPath = resolve(opts.output ?? join(outDir, `${basename(videoPath, extname(videoPath))}.mistakes-cut.mp4`));
  if (outputPath === videoPath) die('La sortie doit avoir un chemin différent de la vidéo source');
  const scriptPath = join(outDir, `${stem}.mistakes-filter.txt`);
  writeFileSync(scriptPath, buildFilterScript(usableKeepRanges));
  summary.video = { input: videoPath, output: outputPath, rendered: false };
  if (opts.apply) {
    console.error(`rendu de la vidéo coupée -> ${outputPath}`);
    const ff = spawnSync("ffmpeg", ["-y", "-i", videoPath, "-/filter_complex", scriptPath, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", outputPath], { stdio: ["ignore", "ignore", "inherit"] });
    if (ff.status !== 0) die(`échec de ffmpeg (code ${ff.status})`, ff.status ?? 1);
    summary.video.rendered = true;
  } else summary.hint = "relancer avec --apply pour faire le rendu";
}

console.log(JSON.stringify(summary, null, 2));
