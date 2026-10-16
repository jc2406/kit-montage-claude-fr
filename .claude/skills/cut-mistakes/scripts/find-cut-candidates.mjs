#!/usr/bin/env node
// Agent 2 — Couper les erreurs et les répétitions : recherche des candidats
// Parcourt une transcription mot à mot à la recherche d'erreurs probables que l'orateur voudrait voir disparaître :
//   - bégaiements / répétitions immédiates d'un mot (« le le », « je-je-je », « que que »)
//   - reprises / phrases en double (une phrase réenregistrée ; garder la prise propre)
//   - faux départs (une phrase abandonnée qui redémarre)
//
// C'est une détection UNIQUEMENT MÉCANIQUE. Elle propose des plages de coupe candidates avec un
// contexte riche, une confiance et une recommandation par défaut, mais elle ne DÉCIDE PAS.
// L'agent examine chaque candidat dans son contexte (étape de validation) avant qu'apply-cuts
// ne rende quoi que ce soit.
//
// Adaptation française : les jetons gardent les lettres accentuées (Unicode) et la liste de mots
// vides couvre le français et l'anglais, pour que reprises et faux départs soient bien détectés.
//
// Entrée : toute transcription { words: [{ text, start, end, type? }] } — en général le
// <stem>.silence-transcript.json de l'agent 1 (pour que les coupes tombent sur la timeline sans silences).
//
// Sortie (à côté de la transcription, ou dans --out-dir) :
//   <stem>.cut-candidates.json   candidats structurés à examiner par l'agent
//   <stem>.cut-candidates.md     proposition lisible par un humain
//
// Utilisation :
//   node find-cut-candidates.mjs <transcript.json> [--out-dir dossier]

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve, basename, extname } from "node:path";
import { argv, exit } from "node:process";

const args = argv.slice(2);
if (args.length === 0 || args.includes("--help")) {
  console.log("Utilisation : node find-cut-candidates.mjs <transcript.json> [--out-dir dossier]");
  exit(args.length === 0 ? 1 : 0);
}
let transcriptArg = null, outDirArg = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out-dir") outDirArg = args[++i];
  else if (!transcriptArg) transcriptArg = args[i];
}
const transcriptPath = resolve(transcriptArg);
const transcript = JSON.parse(readFileSync(transcriptPath, "utf8"));
if (!Array.isArray(transcript.words)) { console.error("la transcription n'a pas de tableau words[]"); exit(1); }

function cleanToken(text) {
  // \p{L} garde les lettres accentuées (é, à, ç…) ; l'apostrophe reste pour les élisions (l', qu').
  return (text ?? "").toLowerCase().replace(/^[^\p{L}\p{N}$%]+|[^\p{L}\p{N}$%]+$/gu, "");
}
function displayText(ws) {
  return ws.map((w) => w.text).join(" ").replace(/\s+([,.!?;:])/g, "$1");
}
function fmt(s) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(2).padStart(5, "0")}`;
}

const words = transcript.words
  .filter((w) => (w.type ? w.type === "word" : true))
  .filter((w) => Number.isFinite(Number(w.start)) && Number.isFinite(Number(w.end)))
  .map((w, index) => ({ index, text: w.text, token: cleanToken(w.text), start: Number(w.start), end: Number(w.end) }));

if (words.length === 0) { console.error("aucun mot horodaté"); exit(1); }

const candidates = [];
let cid = 0;
const ctx = (i, before = 6, after = 6) =>
  displayText(words.slice(Math.max(0, i - before), Math.min(words.length, i + after)));

// ---- 1) bégaiements / répétitions immédiates ----
for (let i = 1; i < words.length; i++) {
  const a = words[i - 1], b = words[i];
  if (!b.token || b.token.length < 1) continue;
  const closeGap = b.start - a.end < 0.5;
  if (a.token === b.token && closeGap) {
    candidates.push({
      id: `c${String(++cid).padStart(3, "0")}`,
      type: "stutter",
      confidence: "high",
      recommend: "cut",
      // retirer la première occurrence, garder la seconde
      cut: { start: Number(a.start.toFixed(3)), end: Number(b.start.toFixed(3)) },
      removes: a.text,
      keeps: b.text,
      context: ctx(i),
      note: `« ${a.token} » répété`,
    });
  }
}

// ---- construire les segments (pour détecter reprises et faux départs) ----
const segments = [];
let segStart = 0;
for (let i = 1; i < words.length; i++) {
  const prev = words[i - 1], cur = words[i];
  const gap = cur.start - prev.end;
  const elapsed = cur.end - words[segStart].start;
  const sentenceEnd = /[.!?]$/.test(prev.text ?? "");
  if (gap > 0.85 || (sentenceEnd && elapsed >= 7.5) || elapsed >= 16) {
    segments.push({ id: segments.length + 1, wordStart: segStart, wordEnd: i - 1, start: words[segStart].start, end: prev.end, text: displayText(words.slice(segStart, i)) });
    segStart = i;
  }
}
segments.push({ id: segments.length + 1, wordStart: segStart, wordEnd: words.length - 1, start: words[segStart].start, end: words.at(-1).end, text: displayText(words.slice(segStart)) });

// Mots vides ignorés dans la signature d'un segment : français + anglais (le kit d'origine était en anglais).
const stop = new Set((
  "a an and are as at be but by for from i if in is it of on or so that this to was we with you your they their there what when where why how like um uh " +
  "le la les un une des du de d l au aux et ou mais donc or ni car que qu qui quoi dont où ce cet cette ces se s " +
  "je j tu il elle on nous vous ils elles me m te t lui leur leurs mon ma mes ton ta tes son sa ses notre nos votre vos " +
  "est sont suis es sommes êtes était été être avoir ai as avons avez ont avait fait faire " +
  "en dans sur sous par pour avec sans chez entre vers ne n pas plus très bien aussi alors comme tout tous toute toutes " +
  "ça cela ceci voilà voici oui non euh heu bah ben hein bon enfin genre quoi"
).split(" "));
function signature(seg) {
  return seg.text.toLowerCase().replace(/[’']/g, " ").replace(/[^\p{L}\p{N}\s$%]/gu, " ").split(/\s+/).filter((t) => t.length > 2 && !stop.has(t)).slice(0, 18);
}
function jaccard(a, b) {
  const as = new Set(a), bs = new Set(b);
  let overlap = 0;
  for (const x of as) if (bs.has(x)) overlap++;
  return overlap / Math.max(1, new Set([...as, ...bs]).size);
}
const sigs = segments.map(signature);

// ---- 2) reprises / phrases en double (garder la prise la plus récente, plus propre) ----
for (let i = 0; i < segments.length; i++) {
  for (let j = i + 1; j < Math.min(segments.length, i + 9); j++) {
    if (segments[j].start - segments[i].end > 75) break;
    const score = jaccard(sigs[i], sigs[j]);
    const sameOpening = sigs[i].slice(0, 4).filter((t, idx) => t === sigs[j][idx]).length >= 2;
    if (score >= 0.34 || (score >= 0.24 && sameOpening)) {
      const firstLen = segments[i].end - segments[i].start;
      // Une première prise courte qui redémarre peu après se lit comme un faux départ.
      const isFalseStart = sameOpening && firstLen < 6 && segments[j].start - segments[i].end < 12;
      candidates.push({
        id: `c${String(++cid).padStart(3, "0")}`,
        type: isFalseStart ? "false_start" : "retake",
        confidence: score >= 0.45 ? "high" : score >= 0.34 ? "medium" : "low",
        recommend: score >= 0.34 ? "cut" : "review",
        score: Number(score.toFixed(3)),
        // par défaut : retirer la prise précédente jusqu'au début de la reprise plus propre
        cut: { start: Number(segments[i].start.toFixed(3)), end: Number(segments[j].start.toFixed(3)) },
        removes: segments[i].text,
        keeps: segments[j].text,
        gapBetween: Number((segments[j].start - segments[i].end).toFixed(2)),
        note: `seg ${segments[i].id} ~ seg ${segments[j].id} (jaccard ${score.toFixed(2)}${sameOpening ? ", même début" : ""})`,
      });
    }
  }
}

// trier par temps (les propositions qui se chevauchent sont à départager à l'examen)
candidates.sort((a, b) => a.cut.start - b.cut.start);

const byType = candidates.reduce((m, c) => ((m[c.type] = (m[c.type] || 0) + 1), m), {});
const totalProposed = candidates.filter((c) => c.recommend === "cut").reduce((s, c) => s + (c.cut.end - c.cut.start), 0);

const stem = basename(transcriptPath, extname(transcriptPath)).replace(/[-.]?(silence-)?transcript.*$/i, "") || "source";
const outDir = outDirArg ? resolve(outDirArg) : dirname(transcriptPath);
mkdirSync(outDir, { recursive: true });

const out = {
  agent: "cut-mistakes",
  source_transcript: transcriptPath,
  word_count: words.length,
  segment_count: segments.length,
  counts: byType,
  proposed_cut_seconds: Number(totalProposed.toFixed(2)),
  candidates,
};
const jsonPath = join(outDir, `${stem}.cut-candidates.json`);
writeFileSync(jsonPath, JSON.stringify(out, null, 2));

const typeLabel = { stutter: "bégaiement", retake: "reprise", false_start: "faux départ" };
const confLabel = { high: "élevée", medium: "moyenne", low: "faible" };
const recLabel = { cut: "couper", review: "à examiner" };
const md = [
  "# Candidats à la coupe des erreurs",
  "",
  `Transcription : ${basename(transcriptPath)} · ${words.length} mots · ${segments.length} segments`,
  `Trouvés : ${candidates.length} candidats (` + Object.entries(byType).map(([k, v]) => `${v} ${typeLabel[k] ?? k}`).join(", ") + ")",
  `Total des coupes proposées par défaut : ~${totalProposed.toFixed(1)} s. **À examiner avant d'appliquer.**`,
  "",
  ...candidates.map((c) =>
    [
      `## ${c.id} · ${typeLabel[c.type] ?? c.type} · confiance ${confLabel[c.confidence] ?? c.confidence} · recommandation : ${recLabel[c.recommend] ?? c.recommend}`,
      `coupe ${fmt(c.cut.start)}–${fmt(c.cut.end)} (${(c.cut.end - c.cut.start).toFixed(2)} s) — ${c.note}`,
      "",
      `- retire :   ${c.removes}`,
      c.keeps ? `- garde :    ${c.keeps}` : null,
      c.context ? `- contexte : …${c.context}…` : null,
      "",
    ].filter(Boolean).join("\n")),
].join("\n");
writeFileSync(join(outDir, `${stem}.cut-candidates.md`), md);

console.log(JSON.stringify({ candidates: candidates.length, counts: byType, proposedCutSeconds: Number(totalProposed.toFixed(2)), outputs: { json: jsonPath, md: join(outDir, `${stem}.cut-candidates.md`) } }, null, 2));
