#!/usr/bin/env node
// Gate 0 : validateur de synchronisation avec la transcription pour un projet vidéo explicite.
// Parcourt index.html, calcule l'instant de début absolu de chaque temps fort, lit data-anchor
// dans le HTML de chaque temps fort, trouve l'ancre dans assets/transcript.json, et
// impose -0,2 s <= (début du mot - début du temps fort) <= 1,8 s.
//
// Utilisation :
//   node scripts/validate-beat-sync.mjs                # tableau lisible, code 1 au moindre FAIL
//   node scripts/validate-beat-sync.mjs --json         # lisible par machine
//   node scripts/validate-beat-sync.mjs --suggest-fix  # affiche le data-start absolu de chaque temps fort
//
// Codes de sortie : 0 = tout est vert, 1 = au moins un FAIL, 2 = références non résolues / fichier manquant.

import { readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const cliArgs = process.argv.slice(2);
if (cliArgs.includes('--help')) {
  console.log('Utilisation : node scripts/validate-beat-sync.mjs [dossier-du-projet] [--json] [--suggest-fix]');
  process.exit(0);
}
const PROJECT_ROOT = resolve(cliArgs.find(a => !a.startsWith('--')) ?? process.cwd());
const INDEX_HTML = join(PROJECT_ROOT, "index.html");
const TRANSCRIPT_JSON = join(PROJECT_ROOT, "assets", "transcript.json");

const LEAD_MIN = -0.2; // le temps fort peut arriver jusqu'à 0,2 s APRÈS le mot d'ancrage (à peine tolérable)
const LEAD_MAX = 1.8; // et jusqu'à 1,8 s AVANT (plus = prématuré / décroché)
const LEAD_SUGGESTED = 0.5; // pour la sortie --suggest-fix : avance visée

const flags = new Set(process.argv.slice(2));
const JSON_OUT = flags.has("--json");
const SUGGEST = flags.has("--suggest-fix");

/** Analyse index.html pour trouver chaque temps fort en sous-composition. */
function parseIndex(html) {
  // Repère des blocs comme :
  // <div id="bXXX..." ... data-composition-src="..." data-start="..." data-duration="..." ...></div>
  const beatRe = /<(?:div|template)\b[^>]*\bdata-composition-src\s*=\s*["'][^"']+["'][^>]*>/gi;
  const beats = [];
  let m;
  while ((m = beatRe.exec(html))) {
    const attr = name => m[0].match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1];
    const id = attr('id'), src = attr('data-composition-src');
    const startExpr = attr('data-start'), duration = Number(attr('data-duration'));
    if (!id || startExpr == null || !Number.isFinite(duration) || duration <= 0) throw new Error('Chaque sous-composition doit avoir id, data-start et un data-duration positif');
    if (beats.some(b => b.id === id)) throw new Error(`Identifiant de temps fort en double : ${id}`);
    beats.push({ id, src, startExpr: startExpr.trim(), duration });
  }
  return beats;
}

/** Calcule le début absolu de chaque temps fort en suivant les références. */
function resolveStarts(beats) {
  const byId = new Map(beats.map((b) => [b.id, b]));
  const resolved = new Map();

  function resolveOne(id, stack = new Set()) {
    if (resolved.has(id)) return resolved.get(id);
    if (stack.has(id)) {
      throw new Error(`Référence data-start circulaire sur ${id}`);
    }
    stack.add(id);
    const b = byId.get(id);
    if (!b) throw new Error(`Identifiant de temps fort inconnu référencé : ${id}`);
    const expr = b.startExpr;
    // Nombre simple :
    if (/^-?\d+(\.\d+)?$/.test(expr)) {
      const v = parseFloat(expr);
      resolved.set(id, v);
      return v;
    }
    // "bID", "bID + N" ou "bID - N"
    const refMatch = expr.match(/^([a-z][a-z0-9_-]*?)\s*([+\-]\s*\d+(?:\.\d+)?)?$/i);
    if (!refMatch) {
      throw new Error(`Impossible d'analyser data-start="${expr}" sur ${id}`);
    }
    const refId = refMatch[1];
    const offsetStr = refMatch[2];
    const refStart = resolveOne(refId, stack);
    const refBeat = byId.get(refId);
    const baseEnd = refBeat ? refStart + refBeat.duration : refStart;
    let v;
    if (offsetStr == null) {
      // "bID" seul veut dire qu'il commence quand bID se termine (data-start enchaîné au précédent).
      v = baseEnd;
    } else {
      const offset = parseFloat(offsetStr.replace(/\s+/g, ""));
      // "bID + N" et "bID - N" s'ancrent sur refStart, pas sur sa fin.
      v = refStart + offset;
    }
    resolved.set(id, v);
    return v;
  }

  for (const b of beats) resolveOne(b.id);
  return resolved;
}

/** Lit data-anchor dans le fichier HTML d'un temps fort ; renvoie null s'il manque. */
function readAnchor(srcRelative) {
  const p = join(PROJECT_ROOT, srcRelative);
  let html;
  try {
    html = readFileSync(p, "utf8");
  } catch (e) {
    return { err: `fichier-manquant : ${srcRelative}` };
  }
  // Div racine : la div juste à l'intérieur de <template id="..."> — son data-composition-id
  // correspond au branchement extérieur. On prend data-anchor sur N'IMPORTE quelle div du fichier (première occurrence).
  const m = html.match(/data-anchor\s*=\s*["']([^"']*)["']/);
  if (!m) return { anchor: null };
  return { anchor: m[1].trim() };
}

/** Trouve le premier mot de la transcription, à partir de minStart, dont le texte joint contient la phrase. */
function findAnchorStart(words, phrase, minStart, maxStart = Infinity) {
  if (!phrase) return null;
  const needle = phrase.toLowerCase();
  const needleTokens = needle.split(/\s+/).filter(Boolean);
  if (needleTokens.length === 0) return null;
  // Correspondance sur plusieurs mots : faire glisser une fenêtre sur words[] à partir de l'indice i ; comparer en minuscules le texte joint
  for (let i = 0; i < words.length; i++) {
    if (words[i].start < minStart) continue;
    if (words[i].start > maxStart) break;
    // Construire la fenêtre candidate = words[i..i+needleTokens.length-1]
    const window = [];
    for (let k = 0; k < needleTokens.length && i + k < words.length; k++) {
      window.push((words[i + k].word || "").toLowerCase());
    }
    const joined = window.join(" ").replace(/[^a-z0-9\/\.\-]/g, " ").replace(/\s+/g, " ").trim();
    const norm = needle.replace(/[^a-z0-9\/\.\-]/g, " ").replace(/\s+/g, " ").trim();
    if (joined.startsWith(norm)) {
      return words[i].start;
    }
    // Essayer aussi une sous-chaîne d'un seul mot (pour des cas comme « /context » dans « slash context »)
    if (needleTokens.length === 1) {
      const w = (words[i].word || "").toLowerCase().replace(/[^a-z0-9\/\.\-]/g, "");
      const need = needle.replace(/[^a-z0-9\/\.\-]/g, "");
      if (need && w.includes(need)) return words[i].start;
    }
  }
  return null;
}

/** Charge les mots de la transcription. Accepte un tableau de premier niveau, { words: [...] } ou { segments: [{ words: [...] }] }. */
function loadWords() {
  const raw = JSON.parse(readFileSync(TRANSCRIPT_JSON, "utf8"));
  let words;
  if (Array.isArray(raw)) {
    words = raw;
  } else if (Array.isArray(raw.words)) {
    words = raw.words;
  } else if (Array.isArray(raw.segments)) {
    words = [];
    for (const seg of raw.segments) {
      if (Array.isArray(seg.words)) words.push(...seg.words);
    }
  }
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error("transcript.json n'a pas de words[] (vérifiés : premier niveau, .words, .segments[].words)");
  }
  return words.map((w) => ({
    start: typeof w.start === "number" ? w.start : parseFloat(w.start),
    word: (w.word ?? w.text ?? "").toString(),
  }));
}

function main() {
  const html = readFileSync(INDEX_HTML, "utf8");
  const beats = parseIndex(html);
  if (beats.length === 0) {
    console.error("Aucun temps fort trouvé dans index.html — vérifiez l'expression régulière / le format du fichier");
    process.exit(2);
  }
  const starts = resolveStarts(beats);
  const words = loadWords();

  const rows = [];
  for (const b of beats) {
    const { anchor, err } = readAnchor(b.src);
    const start = starts.get(b.id);
    const row = {
      id: b.id,
      start: round2(start),
      duration: b.duration,
      src: b.src,
      startExpr: b.startExpr,
      anchor: anchor ?? null,
      wordStart: null,
      slack: null,
      status: "OK",
      detail: "",
    };
    if (err) {
      row.status = "ERROR";
      row.detail = err;
      rows.push(row);
      continue;
    }
    if (anchor == null) {
      row.status = "NO-ANCHOR";
      row.detail = "pas d'attribut data-anchor dans le HTML du temps fort";
      rows.push(row);
      continue;
    }
    const wordStart = findAnchorStart(words, anchor, Math.max(0, start - 10));
    if (wordStart == null) {
      row.status = "ANCHOR-MISS";
      row.detail = `phrase d'ancrage « ${anchor} » introuvable dans la transcription après t=${(start - 10).toFixed(2)} s`;
      rows.push(row);
      continue;
    }
    row.wordStart = round2(wordStart);
    const slack = wordStart - start;
    row.slack = round2(slack);
    if (slack < LEAD_MIN) {
      row.status = "LATE";
      row.detail = `le temps fort arrive ${Math.abs(slack - LEAD_MIN).toFixed(2)} s trop tard`;
    } else if (slack > LEAD_MAX) {
      row.status = "EARLY";
      row.detail = `le temps fort précède le mot de ${slack.toFixed(2)} s (max. ${LEAD_MAX} s)`;
    }
    rows.push(row);
  }

  if (JSON_OUT) {
    console.log(JSON.stringify({ rows, LEAD_MIN, LEAD_MAX }, null, 2));
  } else {
    printTable(rows);
  }

  if (SUGGEST) {
    console.log("\n# --- valeurs data-start absolues suggérées (ancre - avance de 0,5 s) ---");
    for (const r of rows) {
      if (r.wordStart != null) {
        const suggested = Math.max(0, r.wordStart - LEAD_SUGGESTED);
        console.log(`${r.id}\tdata-start="${suggested.toFixed(2)}"\t(ancre à ${r.wordStart} s)`);
      }
    }
  }

  const fails = rows.filter(
    (r) => r.status !== 'OK',
  );
  const warns = rows.filter((r) => r.status === "EARLY");
  if (!JSON_OUT) console.log(
    `\nRésumé : ${rows.length} temps forts | ${rows.length - fails.length} OK | ${fails.length} FAIL | ${warns.length} EARLY`,
  );
  process.exit(fails.length > 0 ? 1 : 0);
}

function round2(n) {
  if (n == null) return null;
  return Math.round(n * 100) / 100;
}

function printTable(rows) {
  const headers = ["id", "start", "dur", "anchor", "wordStart", "slack", "status", "detail"];
  const widths = headers.map((h) => h.length);
  const data = rows.map((r) => [
    r.id,
    r.start != null ? r.start.toFixed(2) : "",
    r.duration.toFixed(2),
    (r.anchor ?? "—").slice(0, 32),
    r.wordStart != null ? r.wordStart.toFixed(2) : "",
    r.slack != null ? r.slack.toFixed(2) : "",
    r.status,
    r.detail,
  ]);
  for (const row of data) {
    row.forEach((v, i) => {
      widths[i] = Math.max(widths[i], String(v).length);
    });
  }
  const fmt = (cells) =>
    cells.map((c, i) => String(c).padEnd(widths[i])).join("  ");
  console.log(fmt(headers));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const row of data) console.log(fmt(row));
}

try { main(); } catch (error) { console.error(error.message); process.exitCode = 2; }
