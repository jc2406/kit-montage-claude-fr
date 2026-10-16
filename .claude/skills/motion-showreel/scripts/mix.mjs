#!/usr/bin/env node
// Prémixer le fond musical et les bruitages placés sur les temps dans un seul wav master avec ffmpeg.
//
// Utilisation : node mix.mjs --bed music-bed.wav --events events.json --out master.wav [--length 15] [--lufs -14] [--bed-gain 0.9]
//   events.json : [{ "t": 0.4644, "file": "assets/audio/sfx/dot_pop.mp3", "gain": 0.5, "max": 0.5 }, ...]
//   t      secondes (à calculer depuis la feuille des temps : temps * période)
//   gain   gain linéaire sur le son tel que généré (commence vers 0,2-0,6 ; coups héros jusqu'à 0,9)
//   max    optionnel : couper un son long à ce nombre de secondes, avec un fondu de 40 ms
// loudnorm en deux passes jusqu'à --lufs (−14 LUFS par défaut, −1,2 dBTP). Place le résultat comme unique
// piste <audio> de la composition. HyperFrames réencode l'audio un peu plus bas ; après le
// rendu, remultiplexe le master : ffmpeg -i render.mp4 -i master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest final.mp4
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const get = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const bed = get('bed'), eventsFile = get('events'), out = get('out', 'master.wav');
const LEN = Number(get('length', 15)), LUFS = Number(get('lufs', -14)), BED = Number(get('bed-gain', 0.9));
if (!bed || !eventsFile) { console.error('Utilisation : node mix.mjs --bed bed.wav --events events.json --out master.wav'); process.exit(1); }
const events = JSON.parse(readFileSync(eventsFile, 'utf8'));

const inputs = ['-i', bed], parts = [`[0:a]aresample=48000,volume=${BED}[b]`], labels = ['[b]'];
events.forEach((e, i) => {
  inputs.push('-i', e.file);
  const trim = e.max ? `atrim=0:${e.max},afade=t=out:st=${Math.max(0, e.max - 0.04)}:d=0.04,` : '';
  const ms = Math.round(e.t * 1000);
  parts.push(`[${i + 1}:a]aresample=48000,aformat=channel_layouts=stereo,${trim}volume=${e.gain},adelay=${ms}|${ms}[e${i}]`);
  labels.push(`[e${i}]`);
});
parts.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=first,atrim=0:${LEN}[m]`);
const graph = parts.join(';');
const ff = (tail, extra) => spawnSync('ffmpeg', ['-hide_banner', ...inputs, '-filter_complex', graph + tail, ...extra], { encoding: 'utf8', maxBuffer: 1 << 26 });

// passe 1 : mesurer
const m = ff(`;[m]loudnorm=I=${LUFS}:TP=-1.2:LRA=11:print_format=json[o]`, ['-map', '[o]', '-f', 'null', '-']);
if (m.status !== 0) { console.error(m.stderr.slice(-800)); process.exit(1); }
const js = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf('{'), m.stderr.lastIndexOf('}') + 1));
// passe 2 : normaliser linéairement, puis un limiteur de sécurité
const af = `loudnorm=I=${LUFS}:TP=-1.2:LRA=11:measured_I=${js.input_i}:measured_TP=${js.input_tp}:measured_LRA=${js.input_lra}:measured_thresh=${js.input_thresh}:offset=${js.target_offset}:linear=true,alimiter=limit=0.87:level=false,aresample=48000`;
const r = ff(`;[m]${af}[o]`, ['-v', 'error', '-y', '-map', '[o]', '-t', String(LEN), '-c:a', 'pcm_s24le', out]);
if (r.status !== 0) { console.error(r.stderr.slice(-800)); process.exit(1); }
console.log(`${out} : fond + ${events.length} sons, entrée ${js.input_i} LUFS -> ${LUFS} LUFS`);
