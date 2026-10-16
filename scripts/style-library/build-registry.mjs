#!/usr/bin/env node
// Parcourt style-library/ à la recherche des dossiers de style NN-slug, lit chaque style.json et produit
// style-library/registry.json — l'index maître que l'agent 3 interroge.
// Utilisation : node scripts/style-library/build-registry.mjs

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const LIB = resolve(dirname(fileURLToPath(import.meta.url)), "../../style-library");

const styleDirs = readdirSync(LIB)
  .filter((d) => /^\d\d-/.test(d) && statSync(join(LIB, d)).isDirectory())
  .sort();

const styles = [];
const warnings = [];
for (const dir of styleDirs) {
  const manifestPath = join(LIB, dir, "style.json");
  if (!existsSync(manifestPath)) { warnings.push(`${dir} : pas de style.json`); continue; }
  let m;
  try { m = JSON.parse(readFileSync(manifestPath, "utf8")); }
  catch (e) { warnings.push(`${dir} : style.json invalide (${e.message})`); continue; }

  const cards = (m.cards ?? []).map((c) => {
    const file = join(LIB, dir, c.file ?? "");
    if (c.file && !existsSync(file)) warnings.push(`${dir} : fichier de carte manquant — ${c.file}`);
    return {
      id: c.id, style: m.id, tier: c.tier, purpose: c.purpose,
      file: `${dir}/${c.file}`,
      slots: (c.slots ?? []).map((s) => s.name),
      duration: c.duration ?? null,
      preview: c.preview ? { mp4: `${dir}/${c.preview.mp4}`, poster: `${dir}/${c.preview.poster}` } : null,
    };
  });

  styles.push({
    id: m.id, number: m.number, name: m.name, status: m.status ?? "draft",
    folder: dir, inspiration: m.inspiration ?? null,
    palette: m.palette ?? null, fonts: m.fonts ?? null,
    cardCount: cards.length,
    cards,
  });
}

const registry = {
  generated_by: "scripts/style-library/build-registry.mjs",
  styleCount: styles.length,
  cardCount: styles.reduce((n, s) => n + s.cardCount, 0),
  tiers: ["tier1", "tier2", "custom"],
  styles,
  warnings,
};
writeFileSync(join(LIB, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(JSON.stringify({ styles: styles.length, cards: registry.cardCount, warnings }, null, 2));
