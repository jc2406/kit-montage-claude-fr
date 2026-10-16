#!/usr/bin/env node
// Adaptateur : EDL video-use + transcriptions Scribe -> transcript.json « Gate 0 » de HyperFrames
//
// video-use écrit les réponses ElevenLabs Scribe de chaque source sur la timeline
// D'ORIGINE. Le edited.mp4 qu'il rend vit sur une timeline COUPÉE. Le validateur
// Gate 0 de HyperFrames (scripts/validate-beat-sync.mjs) a besoin des horodatages
// des mots sur la timeline montée. Cet adaptateur applique le même calcul de timeline
// de sortie que render.py:build_master_srt — out_t = (src_t - seg_start) + seg_offset —
// et produit { words: [{ text, start, end }, ...] } mot par mot.
//
// Utilisation :
//   node scripts/video-use-to-hyperframes-transcript.mjs <edl.json>
//
// Lit :    <edl_dir>/transcripts/<source>.json pour chaque source citée dans EDL.ranges
// Écrit :  <edl_dir>/transcript.json
//
// Codes de sortie : 0 si succès, 1 si entrées manquantes ou EDL mal formée, 2 si sortie vide.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { argv, exit } from "node:process";

const edlArg = argv[2];
if (!edlArg) {
  console.error("utilisation : node scripts/video-use-to-hyperframes-transcript.mjs <edl.json>");
  exit(1);
}

const edlPath = resolve(edlArg);
if (!existsSync(edlPath)) {
  console.error(`EDL introuvable : ${edlPath}`);
  exit(1);
}

const edl = JSON.parse(readFileSync(edlPath, "utf8"));
if (!Array.isArray(edl.ranges) || edl.ranges.length === 0) {
  console.error("l'EDL n'a pas de ranges[]");
  exit(1);
}

const editDir = dirname(edlPath);
const transcriptsDir = join(editDir, "transcripts");

const outWords = [];
let segOffset = 0;

for (const r of edl.ranges) {
  const source = r.source;
  const segStart = Number(r.start);
  const segEnd = Number(r.end);
  if (!source || Number.isNaN(segStart) || Number.isNaN(segEnd)) {
    console.error(`entrée de plage invalide : ${JSON.stringify(r)}`);
    exit(1);
  }
  const segDuration = segEnd - segStart;

  const trPath = join(transcriptsDir, `${source}.json`);
  if (!existsSync(trPath)) {
    console.warn(`  pas de transcription pour ${source}, ignorée (${segDuration.toFixed(2)} s d'audio)`);
    segOffset += segDuration;
    continue;
  }

  const tr = JSON.parse(readFileSync(trPath, "utf8"));
  const words = Array.isArray(tr.words) ? tr.words : [];

  for (const w of words) {
    if (w.type && w.type !== "word" && w.type !== "audio_event") continue;
    const wStart = Number(w.start);
    const wEnd = Number(w.end ?? w.start);
    if (Number.isNaN(wStart)) continue;
    if (wEnd < segStart || wStart > segEnd) continue;

    const localStart = Math.max(segStart, wStart);
    const localEnd = Math.min(segEnd, wEnd);
    const outStart = Math.max(0, localStart - segStart) + segOffset;
    const outEnd = Math.max(outStart, localEnd - segStart + segOffset);

    const text = (w.text ?? w.word ?? "").toString().trim();
    if (!text) continue;

    outWords.push({
      text,
      start: round3(outStart),
      end: round3(outEnd),
    });
  }

  segOffset += segDuration;
}

outWords.sort((a, b) => a.start - b.start);

if (outWords.length === 0) {
  console.error("aucun mot produit ; vérifiez que les noms de sources de l'EDL correspondent à transcripts/*.json");
  exit(2);
}

const outPath = join(editDir, "transcript.json");
writeFileSync(outPath, JSON.stringify({ words: outWords }, null, 2));
console.log(`écrit : ${outPath} (${outWords.length} mots, timeline de ${segOffset.toFixed(2)} s)`);

function round3(n) {
  return Math.round(n * 1000) / 1000;
}
