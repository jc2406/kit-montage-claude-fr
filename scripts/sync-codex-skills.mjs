#!/usr/bin/env node
// Skills Claude de référence -> miroirs Codex portables. Aucun lien symbolique nécessaire.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '.claude/skills');
const target = join(root, '.agents/skills');
const check = process.argv.includes('--check');
let count = 0;
let failures = 0;
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (['__pycache__', 'node_modules', '.DS_Store'].includes(e.name) || e.name.endsWith('.pyc')) return [];
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const expected = new Set();
for (const p of walk(source)) {
  const rel = relative(source, p);
  expected.add(rel);
  const dest = join(target, rel);
  // Seules les instructions changent les chemins d'exécution ; les scripts et ressources restent identiques.
  const bytes = p.endsWith('.md')
    ? Buffer.from(readFileSync(p, 'utf8').replaceAll('.claude/skills/', '.agents/skills/'))
    : readFileSync(p);
  if (check) {
    if (!existsSync(dest) || !readFileSync(dest).equals(bytes)) {
      console.error(`Désynchronisé : ${rel}`); failures++;
    }
  } else {
    mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, bytes);
  }
  count++;
}
if (existsSync(target)) for (const p of walk(target)) {
  if (!expected.has(relative(target, p))) {
    console.error(`Fichier miroir en trop : ${relative(target, p)} (à archiver à la main s'il est obsolète)`); failures++;
  }
}
console.log(`${count} fichiers de skills ${check ? 'vérifiés' : 'synchronisés'} ; ${failures} écart(s).`);
process.exitCode = failures ? 1 : 0;
