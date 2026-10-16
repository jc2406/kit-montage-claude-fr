#!/usr/bin/env node
// Caler une prise musicale sur la grille de coupes, au temps près, avec ffmpeg.
//
// Utilisation :
//   node splice-music.mjs <take.mp3> --period 0.4644 --phase 0.073 \
//     --segments "4-28,48-56.7" --length 15 --gap 16 --fade 0.9 --out assets/audio/music-bed.wav
//
// --period/--phase  tirés de music-grid.mjs (utilise la phase de la bande du KICK)
// --segments        plages de temps source, jouées dans l'ordre. Le temps 0 de sortie = le début du premier segment.
//                   Reel typique de 15 s à ~129 BPM : intro + montée (16 temps) finissant sur le premier
//                   temps du drop, drop (8), break (4, sous la rafale), puis le coup du retour + une queue.
// --gap N           baisser à −16 dB le demi-temps avant le temps de SORTIE N (le trou avant le drop)
// --fade S          fondu sur les S dernières secondes
// Chaque coupe tombe 12 ms avant un point de la grille pour que l'attaque survive, raccordée par un fondu
// enchaîné de 12 ms ; chaque segment sauf le dernier est prolongé du fondu pour que les temps restent sur la grille.
// Remesure le résultat avec music-grid.mjs : sa phase de kick doit être proche de 0.
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const get = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const take = args[0];
const P = Number(get('period')), PH = Number(get('phase', 0)), LEN = Number(get('length', 15));
const segs = String(get('segments', '')).split(',').filter(Boolean).map((s) => s.split('-').map(Number));
const gap = get('gap') !== undefined ? Number(get('gap')) : null, fade = Number(get('fade', 0.9)), out = get('out', 'music-bed.wav');
if (!take || !P || !segs.length) { console.error('Utilisation : node splice-music.mjs <take> --period <s> --phase <s> --segments "a-b,c-d" [--length 15] [--gap 16] [--fade 0.9] [--out bed.wav]'); process.exit(1); }

const PRE = 0.012, XF = 0.012;
const t = (beat) => Math.max(0, PH + beat * P - PRE);
const parts = segs.map(([a, b], i) => `[0:a]asetpts=PTS-STARTPTS,atrim=start=${t(a).toFixed(5)}:end=${(t(b) + (i < segs.length - 1 ? XF : 0)).toFixed(5)},asetpts=PTS-STARTPTS[s${i}]`);
let chain = '[s0]';
for (let i = 1; i < segs.length; i++) { parts.push(`${chain}[s${i}]acrossfade=d=${XF}:c1=qsin:c2=qsin[x${i}]`); chain = `[x${i}]`; }
const post = [`apad=whole_dur=${LEN}`, `atrim=0:${LEN}`];
if (gap !== null) { const g0 = (gap - 0.5) * P, g1 = gap * P - 0.004; post.push(`volume=0.158:enable='between(t,${g0.toFixed(4)},${g1.toFixed(4)})'`); }
if (fade > 0) post.push(`afade=t=out:st=${(LEN - fade).toFixed(3)}:d=${fade}`);
parts.push(`${chain}${post.join(',')}[out]`);
const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', take, '-filter_complex', parts.join(';'), '-map', '[out]', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s24le', out], { encoding: 'utf8' });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
console.log(`${out} : ${segs.map(([a, b]) => `temps source ${a}-${b}`).join(' + ')}, ${LEN} s${gap !== null ? `, trou avant le temps ${gap} (${(gap * P).toFixed(3)} s)` : ''}`);
