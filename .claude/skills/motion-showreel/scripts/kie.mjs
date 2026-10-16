#!/usr/bin/env node
// Client Kie.ai minimal pour les médias de showreel : musique instrumentale (Suno), images héros
// fixes (Seedream image vers image à partir de ton logo) et mouvements de caméra (Kling image vers vidéo).
// Chaque commande est un appel PAYANT sur tes propres crédits Kie.ai. Demande d'abord confirmation à l'utilisateur.
//
//   node kie.mjs credit
//   node kie.mjs music --title "Broadcast" --style "punchy electronic showreel, 128 bpm, big drop" --out assets/audio
//   node kie.mjs image --ref logo.png --prompt "photoreal 3D sculpture of this exact icon..." --out assets/img/hero.png
//   node kie.mjs video --image assets/img/hero.png --prompt "slow orbit, object stays rigid..." --out assets/video/hero-raw.mp4
//
// Lit KIE_API_KEY dans l'environnement ou le .env de l'espace de travail. Doc de l'API : https://docs.kie.ai/
// Kling rend en 24 images/s. Accélère et réencode tout en intra pour un rendu sûr au retour arrière, par ex.
//   ffmpeg -i hero-raw.mp4 -an -vf "setpts=PTS/3,fps=60" -c:v libx264 -crf 16 -g 1 -keyint_min 1 -bf 0 -pix_fmt yuv420p hero-60.mp4
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, basename, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

function loadKey() {
  if (process.env.KIE_API_KEY) return process.env.KIE_API_KEY;
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++, dir = dirname(dir)) {
    const f = join(dir, '.env');
    if (existsSync(f)) {
      const m = readFileSync(f, 'utf8').match(/^\s*KIE_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
      if (m) return m[1].trim();
    }
  }
  throw new Error('KIE_API_KEY n\'est pas défini. Ajoute-le dans .env (voir docs/TOOLS-AND-API-KEYS.md).');
}
const KEY = loadKey();
const H = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };

export async function upload(file) {
  const b64 = readFileSync(file).toString('base64');
  const r = await fetch('https://kieai.redpandaai.co/api/file-base64-upload', {
    method: 'POST', headers: H,
    body: JSON.stringify({ base64Data: `data:${MIME[extname(file).toLowerCase()] ?? 'application/octet-stream'};base64,${b64}`, uploadPath: 'motion-showreel', fileName: basename(file) }),
  });
  const j = await r.json();
  if (!j.data?.downloadUrl) throw new Error('échec de l\'envoi : ' + JSON.stringify(j).slice(0, 300));
  return j.data.downloadUrl;
}
export async function create(model, input) {
  const r = await fetch('https://api.kie.ai/api/v1/jobs/createTask', { method: 'POST', headers: H, body: JSON.stringify({ model, input }) });
  const j = await r.json();
  if (j.code !== 200) throw new Error(`échec de la création ${model} : ` + JSON.stringify(j).slice(0, 300));
  return j.data.taskId;
}
export async function poll(taskId, every = 8000, max = 1_800_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < max) {
    const j = await (await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, { headers: H })).json();
    if (j.data?.state === 'success') return JSON.parse(j.data.resultJson);
    if (j.data?.state === 'fail') throw new Error('échec de la tâche : ' + JSON.stringify(j.data).slice(0, 300));
    await new Promise((res) => setTimeout(res, every));
  }
  throw new Error('délai dépassé en attendant ' + taskId);
}
export async function download(url, out) {
  mkdirSync(dirname(resolve(out)), { recursive: true });
  const r = await fetch(url);
  writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  return out;
}

const [cmd, ...rest] = process.argv.slice(2);
const get = (name) => { const i = rest.indexOf(`--${name}`); return i >= 0 ? rest[i + 1] : undefined; };
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    if (cmd === 'credit') {
      console.log(await (await fetch('https://api.kie.ai/api/v1/chat/credit', { headers: H })).json());
    } else if (cmd === 'music') {
      const id = await create('ai-music-api/generate', {
        custom_mode: true, instrumental: true, model: 'V6', title: get('title') ?? 'Showreel', prompt: '',
        style: get('style') ?? 'punchy modern electronic motion-design showreel, instrumental, 128 bpm, starts instantly, riser into a big drop, clean modern mix, no vocals',
        negative_tags: get('negative') ?? 'vocals, singing, lyrics, choir, lo-fi, sad, acoustic, orchestral',
      });
      console.log('task', id);
      const r = await poll(id, 10000);
      const out = get('out') ?? '.';
      const urls = [...new Set(JSON.stringify(r).match(/https?:[^"]+?\.(?:mp3|wav)/g) ?? [])].filter((u) => !u.includes('/stream/'));
      let i = 0; for (const u of urls) console.log('enregistré', await download(u, join(out, `take-${i++}.mp3`)));
    } else if (cmd === 'image') {
      const ref = get('ref');
      const input = { prompt: get('prompt'), aspect_ratio: get('aspect') ?? '16:9', quality: 'high', output_format: 'png' };
      if (ref) input.image_urls = [await upload(ref)];
      const id = await create(ref ? 'seedream/5-pro-image-to-image' : 'seedream/5-pro-text-to-image', input);
      console.log('task', id);
      const r = await poll(id, 6000);
      console.log('enregistré', await download(r.resultUrls[0], get('out') ?? 'still.png'));
    } else if (cmd === 'video') {
      const id = await create('kling/v3-turbo-image-to-video', { prompt: get('prompt'), image_urls: [await upload(get('image'))], duration: get('duration') ?? '5', resolution: '1080p' });
      console.log('task', id);
      const r = await poll(id, 10000);
      console.log('enregistré', await download(r.resultUrls[0], get('out') ?? 'clip-raw.mp4'));
    } else {
      console.error('Commandes : credit | music | image | video (voir l\'en-tête de ce fichier)');
      process.exitCode = 1;
    }
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}
