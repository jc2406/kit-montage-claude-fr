#!/usr/bin/env node
// Échafaude un nouveau dossier de style en clonant _blueprint/ et en remplaçant l'identifiant.
// Utilisation : node scripts/style-library/new-style.mjs <NN> <slug> ["Nom lisible"]
//   par ex. node scripts/style-library/new-style.mjs 01 vox-explainer "Vox Explainer"

import { cpSync, existsSync, readFileSync, writeFileSync, renameSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { argv, exit } from "node:process";

const LIB = resolve(dirname(fileURLToPath(import.meta.url)), "../../style-library");
const [, , numRaw, slug, ...nameParts] = argv;
if (!numRaw || !slug) { console.error('Utilisation : new-style.mjs <NN> <slug> ["Nom lisible"]'); exit(1); }
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) { console.error("le slug doit être en kebab-case"); exit(1); }

const num = String(numRaw).padStart(2, "0");
const id = slug;
const name = nameParts.join(" ") || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const dest = join(LIB, `${num}-${slug}`);
if (existsSync(dest)) { console.error(`existe déjà : ${dest}`); exit(1); }

cpSync(join(LIB, "_blueprint"), dest, { recursive: true });

// remplacer les marqueurs STYLE_ID / NN / nom dans les fichiers texte
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(json|css|md|html)$/.test(entry)) continue;
    let txt = readFileSync(p, "utf8");
    const next = txt.replaceAll("STYLE_ID", id).replaceAll('"number": "NN"', `"number": "${num}"`).replaceAll("Human Readable Style Name", name);
    if (next !== txt) writeFileSync(p, next);
  }
}
walk(dest);

// renommer les fichiers de cartes d'exemple pour les rattacher au style (confort optionnel)
console.log(JSON.stringify({ created: dest, id, number: num, name, next: [
  `1. ajouter les images de référence dans ${num}-${slug}/references/`,
  `2. remplir DESIGN.md + tokens.css + les champs d'identité de style.json`,
  `3. construire les cartes dans ${num}-${slug}/cards/`,
  `4. node scripts/style-library/build-registry.mjs`,
] }, null, 2));
