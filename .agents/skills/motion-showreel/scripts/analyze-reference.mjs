#!/usr/bin/env node
// Décomposer un reel de référence (ou ton propre rendu) en chiffres sur lesquels concevoir.
//
// Utilisation : node analyze-reference.mjs <video> <dossier-sortie> [--fps 6] [--bpm 128] [--phase 0]
//
// Écrit dans <dossier-sortie> :
//   sheet_NN.png  planches contact, tuiles 4x4, --fps tuiles par seconde. La tuile i de la planche k
//                 est à (k*16 + i) / fps secondes ; report.txt indique la plage de chaque planche.
//   report.txt    coupes franches, luminance toutes les 0,5 s, RMS audio toutes les 0,25 s, attaques, et
//                 (avec --bpm) l'écart de chaque coupe avec le temps et le demi-temps les plus proches.
// Demande ffmpeg et ffprobe dans le PATH (une version complète avec les filtres fps, scale et tile).
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? Number(args[i + 1]) : def; };
const [video, out] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!video || !out) { console.error('Utilisation : node analyze-reference.mjs <video> <dossier-sortie> [--fps 6] [--bpm 128] [--phase 0]'); process.exit(1); }
const FPS = opt('fps', 6), BPM = opt('bpm', 0), PHASE = opt('phase', 0);
mkdirSync(out, { recursive: true });

const run = (cmd, a, opts = {}) => {
  const r = spawnSync(cmd, a, { maxBuffer: 1 << 30, ...opts });
  if (r.status !== 0) throw new Error(`échec de ${cmd} : ${String(r.stderr).slice(0, 400)}`);
  return r.stdout;
};

// planches contact
run('ffmpeg', ['-v', 'error', '-y', '-i', video, '-vf', `fps=${FPS},scale=480:270,tile=layout=4x4`, join(out, 'sheet_%02d.png')]);

// luminance image par image et coupes franches à la cadence native
const rate = String(run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', video])).trim();
const [num, den] = rate.split('/').map(Number);
const vfps = num / (den || 1);
const W = 64, H = 36, F = W * H;
const gray = run('ffmpeg', ['-v', 'error', '-i', video, '-vf', `scale=${W}:${H},format=gray`, '-f', 'rawvideo', '-']);
const n = Math.floor(gray.length / F);
const lum = [], diff = [];
for (let f = 0; f < n; f++) {
  let s = 0, d = 0;
  for (let i = 0; i < F; i++) { const v = gray[f * F + i]; s += v; if (f) d += Math.abs(v - gray[(f - 1) * F + i]); }
  lum.push(s / F); if (f) diff.push(d / F);
}
const cuts = [];
diff.forEach((d, i) => { if (d > 40 && (i === 0 || diff[i - 1] < 40)) cuts.push((i + 1) / vfps); });

const lines = [`frames ${n} at ${vfps} fps = ${(n / vfps).toFixed(2)}s`];
const sheets = Math.ceil((n / vfps) * FPS / 16);
for (let k = 0; k < sheets; k++) lines.push(`sheet_${String(k + 1).padStart(2, '0')}.png  ${(k * 16 / FPS).toFixed(2)}s - ${Math.min(n / vfps, (k * 16 + 15) / FPS).toFixed(2)}s`);
lines.push('hard cuts (s): ' + cuts.map(c => c.toFixed(3)).join(' '));
const lumRow = []; for (let f = 0; f < n; f += Math.round(vfps / 2)) lumRow.push(lum[f].toFixed(0));
lines.push('luminance every 0.5s: ' + lumRow.join(' '));

// RMS audio et attaques
const pcm = spawnSync('ffmpeg', ['-v', 'error', '-i', video, '-ac', '1', '-ar', '22050', '-f', 's16le', '-'], { maxBuffer: 1 << 30 });
if (pcm.status === 0 && pcm.stdout.length > 0) {
  const x = new Int16Array(pcm.stdout.buffer, pcm.stdout.byteOffset, pcm.stdout.length >> 1);
  const SR = 22050, HOP = 512, e = [];
  for (let i = 0; i + HOP < x.length; i += HOP) { let s = 0; for (let j = 0; j < HOP; j++) { const v = x[i + j] / 32768; s += v * v; } e.push(Math.sqrt(s / HOP)); }
  const db = v => (20 * Math.log10(v + 1e-9)).toFixed(0);
  const rms = []; for (let t = 0; t < x.length / SR - 0.05; t += 0.25) rms.push(db(e[Math.floor(t * SR / HOP)] ?? 0));
  lines.push('RMS dB every 0.25s: ' + rms.join(' '));
  const on = e.slice(1).map((v, i) => Math.max(0, v - e[i]));
  const mean = on.reduce((a, b) => a + b, 0) / on.length;
  const sd = Math.sqrt(on.reduce((a, b) => a + (b - mean) ** 2, 0) / on.length);
  const pk = [];
  for (let p = 1; p < on.length - 1; p++) if (on[p] > mean + 2.5 * sd && on[p] >= on[p - 1] && on[p] >= on[p + 1]) pk.push(((p + 1) * HOP / SR).toFixed(2));
  lines.push('onsets (s): ' + pk.join(' '));
} else lines.push('no audio stream');

if (BPM) {
  const P = 60 / BPM;
  const off = (c, q) => ((((c - PHASE + q / 2) % q) + q) % q) - q / 2;
  lines.push(`cut offset from nearest beat (ms, beat ${P.toFixed(4)}s, phase ${PHASE}): ` + cuts.map(c => `${off(c, P) >= 0 ? '+' : ''}${(off(c, P) * 1000).toFixed(0)}`).join(' '));
  lines.push('cut offset from nearest half beat (ms): ' + cuts.map(c => `${off(c, P / 2) >= 0 ? '+' : ''}${(off(c, P / 2) * 1000).toFixed(0)}`).join(' '));
}
writeFileSync(join(out, 'report.txt'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
