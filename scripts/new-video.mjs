#!/usr/bin/env node
import { cpSync, mkdirSync, existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
if (!slug || slug === '--help') {
  console.log('Utilisation : npm run new-video -- <slug-du-projet-en-minuscules>');
  process.exit(slug ? 0 : 1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Utilisez un slug en kebab-case minuscule, pas un chemin.');
const dest = join(root, 'video-projects', slug);
if (existsSync(dest)) throw new Error(`Le projet existe déjà : ${slug}. Choisissez un autre nom.`);
const gsap = join(root, 'node_modules/gsap/dist/gsap.min.js');
if (!existsSync(gsap)) throw new Error('Lancez d\'abord npm ci à la racine du kit.');
cpSync(join(root, 'examples/starter'), dest, { recursive: true, errorOnExist: true });
mkdirSync(join(dest, 'assets'), { recursive: true });
mkdirSync(join(dest, 'compositions'), { recursive: true });
mkdirSync(join(dest, 'renders'), { recursive: true });
copyFileSync(gsap, join(dest, 'assets/gsap.min.js'));
const meta = JSON.parse(readFileSync(join(dest, 'meta.json'), 'utf8'));
meta.name = slug;
writeFileSync(join(dest, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
console.log(`video-projects/${slug} créé. Lancez HyperFrames depuis ce dossier.`);
