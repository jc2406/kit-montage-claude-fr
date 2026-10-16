#!/usr/bin/env node
// Mesurer la vraie grille rythmique et la carte d'énergie d'une prise musicale pour la caler sur une grille de coupes.
//
// Utilisation : node music-grid.mjs <take.mp3> [--bpm 128] [--beats] [--json grid.json]
//
// Les détecteurs de tempo dérivent sur la musique générée : ce script fait une autocorrélation d'une
// enveloppe d'attaques autour du BPM visé et affine la période par un balayage de repliement. La phase
// (décalage du premier temps) est repliée sur la bande du KICK (passe-bas ffmpeg à 120 Hz). Le repliement
// sur toute la bande peut se caler sur des charlestons en contretemps et mettre chaque raccord un demi-temps
// en retard ; les deux sont affichés pour que tu le voies.
// Affiche une ligne par mesure (RMS en dB, graves en dB, densité d'attaques) ; --beats ajoute une ligne par temps.
// Utilise ces lignes pour trouver l'intro, la montée, le drop, le break et un coup de retour propre.
// Demande ffmpeg dans le PATH.
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const get = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const file = args[0];
if (!file || file.startsWith('--')) { console.error('Utilisation : node music-grid.mjs <take.mp3> [--bpm 128] [--beats] [--json grid.json]'); process.exit(1); }
const BPM = Number(get('bpm') ?? 128), SR = 22050;

function decode(filter) {
  const a = ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(SR)];
  if (filter) a.push('-af', filter);
  const r = spawnSync('ffmpeg', [...a, '-f', 's16le', '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error('échec de ffmpeg : ' + String(r.stderr).slice(0, 300));
  const s = new Int16Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length >> 1);
  return Float32Array.from(s, (v) => v / 32768);
}
const energy = (x, hop, win) => {
  const e = [];
  for (let i = 0; i + win < x.length; i += hop) { let s = 0; for (let j = 0; j < win; j++) s += x[i + j] * x[i + j]; e.push(s / win); }
  return e;
};
const onset = (e) => e.map((v, i) => (i ? Math.max(0, Math.log(v + 1e-10) - Math.log(e[i - 1] + 1e-10)) : 0));

const full = decode(), low = decode('lowpass=f=120,lowpass=f=120');
// Des fenêtres longues (46 ms) donnent une enveloppe lisse pour la période et les tableaux d'énergie.
// Des fenêtres courtes (12 ms) donnent la phase ; la trame i couvre [i*hop, i*hop + win) et une attaque
// est détectée quand elle entre dans la FIN de la fenêtre, donc les temps repliés sont décalés de la longueur de fenêtre.
const HOP = 256, WIN = 1024, fps = SR / HOP, dur = full.length / SR;
const eF = energy(full, HOP, WIN), eL = energy(low, HOP, WIN), oF = onset(eF);
const SHOP = 64, SWIN = 256, sfps = SR / SHOP;
const oFs = onset(energy(full, SHOP, SWIN)), oLs = onset(energy(low, SHOP, SWIN));

// période : pic d'autocorrélation à ±6 % de la cible, affiné par la force du repliement
const mean = oF.reduce((a, b) => a + b, 0) / oF.length, c = oF.map((v) => v - mean);
const lo = Math.floor((fps * 60) / (BPM * 1.06)), hi = Math.ceil((fps * 60) / (BPM * 0.94));
let lag = lo, best = -Infinity;
for (let L = lo; L <= hi; L++) { let s = 0; for (let i = 0; i + L < c.length; i++) s += c[i] * c[i + L]; if (s > best) { best = s; lag = L; } }
const fold = (o, P, bins, rate = fps, lead = WIN / SR) => {
  const b = new Float64Array(bins);
  o.forEach((v, i) => { b[Math.floor(((((i / rate + lead) % P) + P) % P / P) * bins) % bins] += v; });
  let k = 0; for (let i = 1; i < bins; i++) if (b[i] > b[k]) k = i;
  const avg = b.reduce((x, y) => x + y, 0) / bins;
  return { strength: b[k], phase: ((k + 0.5) / bins) * P, contrast: b[k] / avg };
};
let P = lag / fps, top = -Infinity;
for (let k = 0; k <= 80; k++) { const p = (lag / fps) * (0.99 + (0.02 * k) / 80); const f = fold(oF, p, 64, fps, 0); if (f.strength > top) { top = f.strength; P = p; } }
const fullPh = fold(oFs, P, 96, sfps, SWIN / SR), kick = fold(oLs, P, 96, sfps, SWIN / SR);
const PH = kick.phase;
console.log(`période ${P.toFixed(4)} s  bpm ${(60 / P).toFixed(2)}  durée ${dur.toFixed(2)} s`);
console.log(`phase bande kick ${PH.toFixed(3)} s (contraste ${kick.contrast.toFixed(1)})  phase toute bande ${fullPh.phase.toFixed(3)} s  -> utilise la phase du kick`);
const gap = Math.abs(((fullPh.phase - PH + P / 2) % P + P) % P - P / 2);
if (gap > P / 4) console.log('attention : la phase toute bande est à environ un demi-temps du kick ; les charlestons dominent la bande complète');

const db = (v) => 10 * Math.log10(v + 1e-12);
const span = (e, t0, t1) => { const a = Math.floor(t0 * fps), b = Math.max(a + 1, Math.floor(t1 * fps)); let s = 0; for (let i = a; i < b && i < e.length; i++) s += e[i]; return s / (b - a); };
const rows = [];
for (let b = 0; PH + (b + 1) * 4 * P <= dur; b++) {
  const t0 = PH + b * 4 * P, t1 = t0 + 4 * P;
  const r = { bar: b, beat: b * 4, t: +t0.toFixed(3), rms_db: +db(span(eF, t0, t1)).toFixed(1), low_db: +db(span(eL, t0, t1)).toFixed(1), onset: +span(oF, t0, t1).toFixed(3) };
  rows.push(r);
  console.log(`bar ${String(b).padStart(3)}  beat ${String(b * 4).padStart(3)}  t ${t0.toFixed(2).padStart(7)}  rms ${r.rms_db.toFixed(1).padStart(6)}  low ${r.low_db.toFixed(1).padStart(6)}  onset ${r.onset.toFixed(2)}  ` + '#'.repeat(Math.max(0, Math.round(r.rms_db + 40))));
}
const beats = [];
for (let n = 0; PH + (n + 1) * P <= dur; n++) { const t0 = PH + n * P; beats.push({ beat: n, t: +t0.toFixed(3), low_db: +db(span(eL, t0, t0 + P)).toFixed(1) }); }
if (args.includes('--beats')) for (const r of beats) console.log(`beat ${String(r.beat).padStart(3)}  t ${r.t.toFixed(2).padStart(7)}  low ${r.low_db.toFixed(1).padStart(6)}  ` + '#'.repeat(Math.max(0, Math.round(r.low_db + 60))));
const json = get('json');
if (json) writeFileSync(json, JSON.stringify({ period: P, phase: PH, fullBandPhase: fullPh.phase, bars: rows, beats }, null, 1));
