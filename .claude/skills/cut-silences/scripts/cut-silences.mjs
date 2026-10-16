#!/usr/bin/env node
// Agent 1 — Couper les silences
// Supprime uniquement les pauses et les silences. Prend toute transcription mot à mot (format
// ElevenLabs Scribe, ou { words: [{ text, start, end }] }) et retire seulement les silences :
//   - les blancs avant le premier mot et après le dernier (coupe du début et de la fin)
//   - les pauses entre les mots plus longues que --gap, réduites à une respiration naturelle
//
// Il ne coupe PAS les répétitions, les faux départs ni les erreurs : c'est le travail de l'agent 2.
//
// Sorties (à côté de la transcription, ou dans --out-dir) :
//   <stem>.silence-edl.json          plages gardées/supprimées + résumé + paramètres
//   <stem>.silence-transcript.json   mots recalés sur la timeline montée
//   <stem>.silence-decisions.md       résumé lisible par un humain
// Et, avec --video, la commande ffmpeg pour faire la coupe (lancée avec --apply).
//
// Utilisation :
//   node cut-silences.mjs <transcript.json> [options]
//
// Options :
//   --video <chemin>       vidéo source ; active la vraie coupe / la commande ffmpeg
//   --out-dir <dossier>    dossier de sortie (par défaut : à côté de la transcription)
//   --output <chemin>      chemin de la vidéo coupée (par défaut : <video-stem>.silenced.mp4)
//   --gap <secondes>       pause minimale traitée comme un silence à réduire (0.55 par défaut)
//   --head-pad <secondes>  silence gardé avant le premier mot (0.22 par défaut)
//   --tail-pad <secondes>  silence gardé après le dernier mot (0.34 par défaut)
//   --apply                lancer vraiment ffmpeg pour rendre la vidéo coupée
//   --help

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve, basename, extname } from "node:path";
import { spawnSync } from "node:child_process";
import { argv, exit } from "node:process";

function die(msg, code = 1) {
  console.error(msg);
  exit(code);
}

// ---- lecture des arguments ----
const args = argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(
    "Utilisation : node cut-silences.mjs <transcript.json> [--video chemin] [--out-dir dossier]\n" +
      "              [--output chemin] [--gap 0.55] [--head-pad 0.22] [--tail-pad 0.34] [--apply]",
  );
  exit(args.length === 0 ? 1 : 0);
}

const opts = {
  transcript: null,
  video: null,
  outDir: null,
  output: null,
  gap: 0.55,
  headPad: 0.22,
  tailPad: 0.34,
  apply: false,
};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--video") opts.video = args[++i];
  else if (a === "--out-dir") opts.outDir = args[++i];
  else if (a === "--output" || a === "-o") opts.output = args[++i];
  else if (a === "--gap") opts.gap = Number(args[++i]);
  else if (a === "--head-pad") opts.headPad = Number(args[++i]);
  else if (a === "--tail-pad") opts.tailPad = Number(args[++i]);
  else if (a === "--apply") opts.apply = true;
  else if (a.startsWith("--")) die(`option inconnue : ${a}`);
  else if (!opts.transcript) opts.transcript = a;
  else die(`argument inattendu : ${a}`);
}
if (!opts.transcript) die("aucun fichier de transcription fourni");
if (!Number.isFinite(opts.gap) || opts.gap <= 0) die("--gap doit être un nombre positif");

const transcriptPath = resolve(opts.transcript);
if (!existsSync(transcriptPath)) die(`transcription introuvable : ${transcriptPath}`);

// ---- chargement et normalisation de la transcription ----
const transcript = JSON.parse(readFileSync(transcriptPath, "utf8"));
if (!Array.isArray(transcript.words)) die("la transcription n'a pas de tableau `words`");

// Ne garder que les vrais mots prononcés avec un timing numérique. ElevenLabs marque les espaces
// et les événements audio avec type !== "word" ; une transcription générique peut omettre `type`.
const words = transcript.words
  .filter((w) => (w.type ? w.type === "word" : true))
  .filter((w) => Number.isFinite(Number(w.start)) && Number.isFinite(Number(w.end)))
  .map((w, index) => ({ index, text: w.text, start: Number(w.start), end: Number(w.end) }));

if (words.length === 0) die("aucun mot horodaté dans la transcription");

// Durée source : d'abord la valeur de la transcription, sinon sonder la vidéo, sinon
// se rabattre sur un peu après le dernier mot.
let duration = Number(transcript.audio_duration_secs);
if (!Number.isFinite(duration)) {
  if (opts.video && existsSync(resolve(opts.video))) {
    const probe = spawnSync("ffprobe", [
      "-v", "error", "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1", resolve(opts.video),
    ]);
    const d = Number(probe.stdout?.toString().trim());
    if (Number.isFinite(d)) duration = d;
  }
}
if (!Number.isFinite(duration)) duration = words.at(-1).end + opts.tailPad;

// ---- construction des plages à supprimer (silences seulement) ----
function mergeRanges(ranges) {
  const sorted = ranges
    .filter((r) => Number.isFinite(r.start) && Number.isFinite(r.end) && r.end > r.start)
    .sort((a, b) => a.start - b.start);
  const merged = [];
  for (const range of sorted) {
    const last = merged.at(-1);
    if (!last || range.start > last.end) {
      merged.push({ start: range.start, end: range.end, reasons: [range.reason] });
    } else {
      last.end = Math.max(last.end, range.end);
      last.reasons.push(range.reason);
    }
  }
  return merged;
}

const deleteRanges = [];

// blancs du début et de la fin
const headEnd = words[0].start - opts.headPad;
if (headEnd > 0) deleteRanges.push({ start: 0, end: headEnd, reason: "coupe du début avant le premier mot" });
const tailStart = words.at(-1).end + opts.tailPad;
if (duration > tailStart) deleteRanges.push({ start: tailStart, end: duration, reason: "coupe de la fin après le dernier mot" });

// pauses entre les mots
for (let i = 1; i < words.length; i++) {
  const prev = words[i - 1];
  const next = words[i];
  const gap = next.start - prev.end;
  if (gap < opts.gap) continue;

  // Garder une respiration naturelle : plus longue pour les grandes pauses et les fins de phrase.
  const sentenceBreak = /[.!?]$/.test(prev.text ?? "");
  const keep = gap >= 2 ? 0.24 : sentenceBreak ? 0.2 : 0.14;
  // Placer la respiration gardée un peu plus du côté de la fin de la phrase précédente.
  const delStart = prev.end + keep * 0.55;
  const delEnd = next.start - keep * 0.45;
  if (delEnd > delStart) {
    deleteRanges.push({ start: delStart, end: delEnd, reason: `pause ${gap.toFixed(2)}s -> ${keep.toFixed(2)}s` });
  }
}

const mergedDeletes = mergeRanges(deleteRanges);

// ---- plages gardées = le complément des suppressions ----
const keepRanges = [];
let cursor = 0;
for (const del of mergedDeletes) {
  if (del.start > cursor) keepRanges.push({ start: cursor, end: del.start });
  cursor = Math.max(cursor, del.end);
}
if (cursor < duration) keepRanges.push({ start: cursor, end: duration });
const usableKeepRanges = keepRanges.filter((r) => r.end - r.start >= 0.04);

const removedTotal = mergedDeletes.reduce((sum, r) => sum + (r.end - r.start), 0);
const editedDuration = Number((duration - removedTotal).toFixed(3));

// ---- recaler la transcription sur la timeline montée ----
function removedBefore(time) {
  let removed = 0;
  for (const del of mergedDeletes) {
    if (del.end <= time) removed += del.end - del.start;
    else if (del.start < time) removed += time - del.start;
    else break;
  }
  return removed;
}
function inDeleted(word) {
  return mergedDeletes.some((del) => word.start < del.end && del.start < word.end);
}

const editedWords = [];
for (const word of words) {
  if (inDeleted(word)) continue; // un mot entièrement avalé par une coupe (rare pour du silence pur)
  editedWords.push({
    text: word.text,
    source_start: word.start,
    source_end: word.end,
    start: Number((word.start - removedBefore(word.start)).toFixed(3)),
    end: Number((word.end - removedBefore(word.end)).toFixed(3)),
  });
}

// ---- graphe de filtres ffmpeg trim+concat (coupe fiable, image et son synchronisés) ----
function buildFilterScript(ranges) {
  const lines = [];
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    lines.push(`[0:v]trim=start=${r.start.toFixed(3)}:end=${r.end.toFixed(3)},setpts=PTS-STARTPTS[v${i}];`);
    lines.push(`[0:a]atrim=start=${r.start.toFixed(3)}:end=${r.end.toFixed(3)},asetpts=PTS-STARTPTS[a${i}];`);
  }
  const inputs = ranges.map((_, i) => `[v${i}][a${i}]`).join("");
  lines.push(`${inputs}concat=n=${ranges.length}:v=1:a=1[v][a]`);
  return lines.join("\n");
}

// ---- écriture des sorties ----
const stem = basename(transcriptPath, extname(transcriptPath)).replace(/[-.]?transcript.*$/i, "") || "source";
const outDir = opts.outDir ? resolve(opts.outDir) : dirname(transcriptPath);
mkdirSync(outDir, { recursive: true });

const params = { gap: opts.gap, headPad: opts.headPad, tailPad: opts.tailPad };
const edl = {
  agent: "cut-silences",
  params,
  source_duration: duration,
  edited_duration: editedDuration,
  removed: Number(removedTotal.toFixed(3)),
  delete_ranges: mergedDeletes,
  keep_ranges: usableKeepRanges,
};
const transcriptOut = {
  language_code: transcript.language_code,
  source_audio_duration_secs: duration,
  audio_duration_secs: editedDuration,
  produced_by: "cut-silences",
  words: editedWords,
};

function fmt(s) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(2).padStart(5, "0")}`;
}
const pauseDeletes = mergedDeletes.filter((d) => d.reasons.some((r) => r?.startsWith("pause")));
const decisions = [
  "# Décisions de coupe des silences",
  "",
  `Durée source : ${fmt(duration)} (${duration.toFixed(2)} s)`,
  `Durée montée : ${fmt(editedDuration)} (${editedDuration.toFixed(2)} s)`,
  `Retiré : ${removedTotal.toFixed(2)} s de silence en ${mergedDeletes.length} plages`,
  `Paramètres : gap>=${params.gap} s, head-pad ${params.headPad} s, tail-pad ${params.tailPad} s`,
  "",
  `## Plus grandes pauses réduites (15 premières)`,
  "",
  ...pauseDeletes
    .map((d) => ({ ...d, len: d.end - d.start }))
    .sort((a, b) => b.len - a.len)
    .slice(0, 15)
    .map((d) => `- ${fmt(d.start)}-${fmt(d.end)} : ${d.len.toFixed(2)} s retirées`),
].join("\n");

const edlPath = join(outDir, `${stem}.silence-edl.json`);
const tPath = join(outDir, `${stem}.silence-transcript.json`);
const decPath = join(outDir, `${stem}.silence-decisions.md`);
writeFileSync(edlPath, JSON.stringify(edl, null, 2));
writeFileSync(tPath, JSON.stringify(transcriptOut, null, 2));
writeFileSync(decPath, decisions);

const summary = {
  sourceDuration: Number(duration.toFixed(3)),
  editedDuration,
  removed: Number(removedTotal.toFixed(3)),
  removedPct: Number(((removedTotal / duration) * 100).toFixed(1)),
  deleteRanges: mergedDeletes.length,
  keepRanges: usableKeepRanges.length,
  editedWords: editedWords.length,
  outputs: { edl: edlPath, transcript: tPath, decisions: decPath },
};

// ---- optionnel : produire la vidéo coupée ----
if (opts.video) {
  const videoPath = resolve(opts.video);
  if (!existsSync(videoPath)) die(`--video introuvable : ${videoPath}`);
  const outputPath = resolve(
    opts.output ?? join(outDir, `${basename(videoPath, extname(videoPath))}.silenced.mp4`),
  );
  const scriptPath = join(outDir, `${stem}.silence-filter.txt`);
  writeFileSync(scriptPath, buildFilterScript(usableKeepRanges));
  summary.video = { input: videoPath, output: outputPath, filterScript: scriptPath };

  const ffArgs = [
    "-y", "-i", videoPath,
    "-/filter_complex", scriptPath,
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
    outputPath,
  ];
  summary.ffmpegCommand = `ffmpeg ${ffArgs.map((a) => (a.includes(" ") ? `"${a}"` : a)).join(" ")}`;

  if (opts.apply) {
    console.error(`rendu de la vidéo coupée -> ${outputPath}`);
    const ff = spawnSync("ffmpeg", ffArgs, { stdio: ["ignore", "ignore", "inherit"] });
    if (ff.status !== 0) die(`échec de ffmpeg (code ${ff.status})`, ff.status ?? 1);
    summary.video.rendered = true;
  } else {
    summary.video.rendered = false;
    summary.hint = "relancer avec --apply pour rendre la vidéo coupée";
  }
}

console.log(JSON.stringify(summary, null, 2));
