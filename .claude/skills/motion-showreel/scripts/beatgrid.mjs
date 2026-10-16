#!/usr/bin/env node
// Poser les chapitres sur une grille rythmique et afficher la feuille de coupes (secondes et images).
//
// Utilisation :
//   node beatgrid.mjs --period 0.4644 --fps 60 --length 15 \
//     --chapters "01 Physique:4, 02 Typo cinétique:8, 03 Grille:4, 04 Drop:4, 05 Lookdev:4, Rafale:4, 07 Fin:rest"
//
// La longueur d'un chapitre est en temps ; « rest » remplit jusqu'à --length. Dans un chapitre dont le
// nom commence par « Flurry » ou « Rafale », les coupes sont listées une par temps, puis une par demi-temps.
// La répartition par défaut correspond au reel de référence : environ 75 % de développement, 13 % de
// rafale, 12 % de résolution. Colle la sortie dans STORYBOARD.md ; dans GSAP, t = image / fps.
const args = process.argv.slice(2);
const get = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const bpm = Number(get('bpm') ?? 0), period = Number(get('period') ?? 0);
const fps = Number(get('fps') ?? 60), length = Number(get('length') ?? 15), chapters = get('chapters');
if (!chapters || !(period || bpm)) {
  console.error('Utilisation : node beatgrid.mjs (--period <s> | --bpm <n>) [--fps 60] [--length 15] --chapters "Nom:temps, ..., Nom:rest"');
  process.exit(1);
}
const P = period || 60 / bpm;
const fr = (t) => Math.round(t * fps);
const pad = (s, w) => String(s).padStart(w);
console.log(`temps ${P.toFixed(4)} s (${(60 / P).toFixed(2)} BPM), ${fps} images/s, un temps = ${(P * fps).toFixed(2)} images\n`);
console.log(`${'chapitre'.padEnd(24)} ${pad('temps', 11)} ${pad('début s', 8)} ${pad('fin s', 8)} ${pad('images', 11)}`);
let b = 0;
for (const part of chapters.split(',').map((c) => c.trim()).filter(Boolean)) {
  const k = part.lastIndexOf(':');
  const name = part.slice(0, k).trim(), n = part.slice(k + 1).trim();
  const t0 = b * P;
  const nb = n === 'rest' ? length / P - b : Number(n);
  const t1 = n === 'rest' ? length : (b + nb) * P;
  console.log(`${name.padEnd(24)} ${pad(`${b.toFixed(1)}-${(b + nb).toFixed(1)}`, 11)} ${pad(t0.toFixed(3), 8)} ${pad(t1.toFixed(3), 8)} ${pad(`${fr(t0)}-${fr(t1)}`, 11)}`);
  if (/^(flurry|rafale)/i.test(name)) {
    // un temps par coupe, puis des demi-temps : le rythme des coupes accélère vers le logo final
    for (let s = 0; s < nb - 1e-6; s += s < nb / 2 ? 1 : 0.5) console.log(`${'  coupe'.padEnd(24)} ${pad((b + s).toFixed(1), 11)} ${pad(((b + s) * P).toFixed(3), 8)} ${pad('', 8)} ${pad(fr((b + s) * P), 11)}`);
  }
  b += nb;
}
console.log(`\ntotal ${length.toFixed(2)} s = ${fr(length)} images`);
