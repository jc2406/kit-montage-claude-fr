import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = resolve(import.meta.dirname, '..');
const fixture = join(root, 'examples/editing/source.json');
function run(script, args) { return spawnSync(process.execPath, [join(root, script), ...args], { encoding: 'utf8', cwd: root }); }
function scratch() { return mkdtempSync(join(tmpdir(), 'hyperframes-kit-test-')); }
const apply = '.agents/skills/cut-mistakes/scripts/apply-cuts.mjs';

test('la coupe des silences garde la parole et produit des horodatages plus courts et ordonnés', () => {
  const out = scratch();
  const result = run('.agents/skills/cut-silences/scripts/cut-silences.mjs', [fixture, '--out-dir', out]);
  assert.equal(result.status, 0, result.stderr);
  const doc = JSON.parse(readFileSync(join(out, 'source.silence-transcript.json')));
  assert.equal(doc.words.map(w => w.text).join(' '), 'We we build a small garden. Plants need light.');
  assert.ok(doc.audio_duration_secs < 6 && doc.audio_duration_secs > 3);
  assert.ok(doc.words.every((w, i) => w.end > w.start && (!i || w.start >= doc.words[i-1].end)));
});

test('une coupe de bégaiement validée ne retire que le premier mot et recale le mot suivant', () => {
  const out = scratch();
  const result = run(apply, [fixture, '--cuts', join(root, 'examples/editing/approved-cuts.json'), '--out-dir', out]);
  assert.equal(result.status, 0, result.stderr);
  const doc = JSON.parse(readFileSync(join(out, 'source.mistakes-transcript.json')));
  assert.equal(doc.audio_duration_secs, 7.71);
  assert.equal(doc.words[0].text, 'we');
  assert.equal(doc.words[0].start, .61);
  assert.equal(doc.words.at(-1).text, 'light.');
});

test('une relecture sans aucune erreur donne un montage identique valide', () => {
  const out = scratch(), cuts = join(out, 'cuts.json');
  writeFileSync(cuts, '{"cuts":[]}');
  const result = run(apply, [fixture, '--cuts', cuts, '--out-dir', out]);
  assert.equal(result.status, 0, result.stderr);
  const doc = JSON.parse(readFileSync(join(out, 'source.mistakes-transcript.json')));
  assert.equal(doc.audio_duration_secs, 8);
  assert.equal(doc.words.length, 9);
  assert.equal(doc.words[0].start, .6);
});

test('les coupes hors de la source échouent au lieu de corrompre la timeline du montage', () => {
  const out = scratch(), cuts = join(out, 'cuts.json');
  writeFileSync(cuts, '{"cuts":[{"start":-1,"end":9}]}');
  const result = run(apply, [fixture, '--cuts', cuts, '--out-dir', out]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /plage|durée|limites/i);
});

test('le validateur de temps forts accepte des attributs dans le désordre et impose les limites d\'avance et de retard', () => {
  const out = scratch(); mkdirSync(join(out, 'assets')); mkdirSync(join(out, 'compositions'));
  writeFileSync(join(out, 'assets/transcript.json'), '{"words":[{"text":"Hello","start":2.5,"end":2.8}]}');
  writeFileSync(join(out, 'compositions/beat.html'), '<div data-anchor="Hello"></div>');
  for (const [start, expected] of [[2,0],[0,1],[3,1]]) {
    writeFileSync(join(out, 'index.html'), `<div data-duration="1" data-start="${start}" id="intro-card" data-composition-src="compositions/beat.html"></div>`);
    const result = run('scripts/validate-beat-sync.mjs', [out, '--json']);
    assert.equal(result.status, expected, result.stderr);
    assert.equal(JSON.parse(result.stdout).rows.length, 1);
  }
});
