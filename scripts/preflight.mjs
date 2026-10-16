#!/usr/bin/env node
// Pré-contrôle de l'aperçu Hyperframes.
// Échoue VITE sur les bugs d'écriture précis qui font afficher « 0:00 / 0:00 » au Studio
// ou laissent la barre de lecture inerte. Complète `npx hyperframes lint` — ce script
// ne vérifie que les conditions bloquantes pour l'aperçu que lint signale sans échouer.
//
// Utilisation : node scripts/preflight.mjs <dossier-du-projet>
// Exemple : node scripts/preflight.mjs video-projects/may-shorts-19

import { readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

const SHADER_BLOCK_NAMES = new Set([
  "glitch", "whip-pan", "cinematic-zoom", "flash-through-white", "light-leak",
  "ripple-waves", "chromatic-radial-split", "cross-warp-morph", "domain-warp-dissolve",
  "gravitational-lens", "ridged-burn", "sdf-iris", "swirl-vortex", "thermal-distortion",
]);

const ansi = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function readAttr(raw, name) {
  const m = raw.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return m ? m[1] : null;
}

function findRootDiv(html) {
  const re = /<div\b([^>]*\bdata-composition-id\s*=\s*["'][^"']+["'][^>]*)>/gi;
  const m = re.exec(html);
  if (!m) return null;
  return { raw: `<div${m[1]}>`, attrs: m[1] };
}

function scanAllTags(html, tagName) {
  const out = [];
  const re = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  let m;
  while ((m = re.exec(html)) !== null) out.push({ raw: m[0], index: m.index });
  return out;
}

function hasTimelineContent(scriptBody) {
  return /\b(?:mainTl|tl|masterTL|timeline)\s*\.\s*(?:to|from|fromTo|set|add|call)\s*\(/.test(
    scriptBody
  );
}

function timelineKeyMatchesRoot(scriptBody, compositionId) {
  const re = new RegExp(
    `window\\.__timelines\\s*\\[\\s*["']([^"']+)["']\\s*\\]\\s*=`,
    "g"
  );
  const keys = [];
  let m;
  while ((m = re.exec(scriptBody)) !== null) keys.push(m[1]);
  return { keys, match: keys.includes(compositionId) };
}

function scanSubCompSrcs(html) {
  const out = [];
  const re = /data-composition-src\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}

function countShaderBlocks(html, compositionsDir) {
  let count = 0;
  const srcs = scanSubCompSrcs(html);
  for (const src of srcs) {
    const stem = src
      .replace(/\\/g, "/")
      .split("/")
      .pop()
      .replace(/\.html$/, "");
    if (SHADER_BLOCK_NAMES.has(stem)) count++;
  }
  return count;
}

function listSubCompIds(html) {
  const out = [];
  const re =
    /data-composition-id\s*=\s*["']([^"']+)["'][^>]*data-composition-src\s*=\s*["']([^"']+)["']|data-composition-src\s*=\s*["']([^"']+)["'][^>]*data-composition-id\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ id: m[1] || m[4], src: m[2] || m[3] });
  }
  return out;
}

function extractInlineScript(html) {
  const parts = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!/\bsrc\s*=/.test(m[1])) parts.push(m[2]);
  }
  return parts.join("\n");
}

function fail(label, msg) {
  console.log(`  ${ansi.red("✗")} ${ansi.bold(label)}: ${msg}`);
}
function warn(label, msg) {
  console.log(`  ${ansi.yellow("⚠")} ${ansi.bold(label)}: ${msg}`);
}
function ok(label, msg) {
  console.log(`  ${ansi.green("✓")} ${ansi.bold(label)}${msg ? `: ${msg}` : ""}`);
}

const projectArg = process.argv[2];
if (!projectArg) {
  console.error("Utilisation : node scripts/preflight.mjs <dossier-du-projet>");
  process.exit(2);
}

const projectDir = resolve(projectArg);
if (!existsSync(projectDir) || !statSync(projectDir).isDirectory()) {
  console.error(`Dossier de projet introuvable : ${projectDir}`);
  process.exit(2);
}

const indexPath = join(projectDir, "index.html");
console.log(`\n${ansi.bold("◆")} Pré-contrôle : ${projectDir.replace(/\\/g, "/")}`);

if (!existsSync(indexPath)) {
  fail("index_missing", `pas d'index.html dans ${projectDir}`);
  process.exit(1);
}

const html = readFileSync(indexPath, "utf8");
let hardFail = 0;
let warns = 0;

// 1) Div racine + attributs requis
const root = findRootDiv(html);
if (!root) {
  fail(
    "root_composition_missing",
    "aucune <div data-composition-id=...> trouvée — le Studio ne saura pas quoi rendre"
  );
  hardFail++;
  process.exit(1);
}
const rootId = readAttr(root.raw, "data-composition-id");
const rootWidth = readAttr(root.raw, "data-width");
const rootHeight = readAttr(root.raw, "data-height");
const rootStart = readAttr(root.raw, "data-start");
const rootDuration = readAttr(root.raw, "data-duration");
const rootDomId = readAttr(root.raw, "id");

if (!rootDomId) {
  warn("root_missing_id", `root <div data-composition-id="${rootId}"> n'a pas d'id=... (convention : id="root")`);
  warns++;
}
if (!rootWidth || !rootHeight) {
  fail(
    "root_missing_dimensions",
    `root <div data-composition-id="${rootId}"> sans data-width/data-height — le Studio ne peut pas dimensionner la scène`
  );
  hardFail++;
} else {
  ok("root_dimensions", `${rootWidth}x${rootHeight}`);
}

// D'après l'avertissement root_composition_missing_data_start de la CLI, le runtime veut
// data-start="0". Mais avec une <video data-start=...> en ligne, la règle video_nested_in_timed_element
// se déclenche si la racine a aussi data-start. On montre le compromis — sans échouer dans un cas comme dans l'autre.
const inlineVideos = scanAllTags(html, "video");
const videoWithDataStart = inlineVideos.find((v) => readAttr(v.raw, "data-start") !== null);

if (!rootStart) {
  if (videoWithDataStart) {
    warn(
      "root_data_start_omitted_intentionally",
      `la racine n'a pas data-start="0" — c'est le bon choix quand une <video data-start=...> en ligne existe (évite l'erreur de lint video_nested_in_timed_element). Acceptable.`
    );
  } else {
    warn(
      "root_missing_data_start",
      `la <div> racine n'a pas data-start="0" (le lint de la CLI le signale ; ajoutez-le s'il n'y a pas de <video data-start=...> en ligne)`
    );
    warns++;
  }
} else {
  if (videoWithDataStart) {
    fail(
      "root_data_start_conflicts_with_video",
      `la racine a data-start="${rootStart}" ET une <video ${readAttr(videoWithDataStart.raw, "id") ? `id="${readAttr(videoWithDataStart.raw, "id")}"` : ""} data-start=...> en ligne. Ça déclenche video_nested_in_timed_element au rendu. Retirez data-start de la racine, ou retirez data-start de la <video>.`
    );
    hardFail++;
  } else {
    ok("root_data_start", `"${rootStart}"`);
  }
}

// 2) Enregistrement de la timeline dans le script en ligne + durée
const scriptBody = extractInlineScript(html);
const reg = timelineKeyMatchesRoot(scriptBody, rootId);
if (reg.keys.length === 0) {
  fail(
    "no_timeline_registered",
    `aucune affectation window.__timelines[...] = ... trouvée dans <script>. Le Studio affichera 0:00 / 0:00.`
  );
  hardFail++;
} else if (!reg.match) {
  fail(
    "timeline_key_mismatch",
    `la racine a data-composition-id="${rootId}" mais <script> enregistre window.__timelines[${reg.keys
      .map((k) => `"${k}"`)
      .join(", ")}]. Le Studio se branchera sur la mauvaise timeline (ou une vide). Corrigez la clé pour qu'elle corresponde à la racine.`
  );
  hardFail++;
} else {
  ok("timeline_registration", `window.__timelines["${rootId}"]`);
}

if (!hasTimelineContent(scriptBody)) {
  fail(
    "empty_timeline",
    `le script ne contient aucun appel tl.to / tl.from / tl.set / tl.add — tl.duration() vaudra 0 et le Studio affichera 0:00 / 0:00. Ajoutez au minimum un remplissage comme tl.to({}, { duration: <secondes> }, 0).`
  );
  hardFail++;
} else {
  ok("timeline_content", `contient des appels .to/.from/.set/.add`);
}

// 3) Les fichiers cibles des <template data-composition-src="..."> existent
const srcs = scanSubCompSrcs(html);
const missing = [];
for (const src of srcs) {
  const abs = join(projectDir, src.replace(/^\.\//, ""));
  if (!existsSync(abs)) missing.push(src);
}
if (missing.length) {
  fail(
    "sub_composition_src_missing",
    `${missing.length} cible(s) data-composition-src introuvable(s) : ${missing.join(", ")}`
  );
  hardFail++;
} else if (srcs.length) {
  ok("sub_composition_srcs", `${srcs.length} cibles trouvées`);
}

// 4) Nombre de blocs shader et lien d'aperçu par sous-composition
const shaderCount = countShaderBlocks(html, join(projectDir, "compositions"));
if (shaderCount > 3) {
  warn(
    "shader_heavy_master",
    `${shaderCount} blocs de shader WebGL dans la composition principale. Sur les machines en WebGL logiciel (sans accélération matérielle dans Chromium), le Studio va bloquer en chargeant l'URL principale. Prévisualisez plutôt les sous-compositions une par une :`
  );
  const subs = listSubCompIds(html);
  for (const { id } of subs.slice(0, 12)) {
    console.log(`    ${ansi.dim("→")} http://localhost:3002/?comp=${encodeURIComponent(id)}`);
  }
}

// 5) Résumé
console.log("");
if (hardFail > 0) {
  console.log(
    `${ansi.red("◇")} ${hardFail} blocage(s), ${warns} avertissement(s) — l'aperçu ${ansi.red(
      "VA échouer"
    )}. Corrigez les blocages avant de lancer \`hyperframes preview\`.`
  );
  process.exit(1);
} else if (warns > 0) {
  console.log(
    `${ansi.yellow("◇")} 0 blocage, ${warns} avertissement(s) — l'aperçu devrait marcher. Relisez les avertissements si le Studio se comporte encore mal.`
  );
  process.exit(0);
} else {
  console.log(`${ansi.green("◇")} tous les pré-contrôles sont passés`);
  process.exit(0);
}
