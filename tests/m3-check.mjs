// M3 data validation — run: node tests/m3-check.mjs
// Validates states.json integrity + sane ranges (typo guards), and the
// verified spot-check anchors from published sources (see tests/manual.md).
import { readFileSync } from 'node:fs';
const { states, meta } = JSON.parse(readFileSync(new URL('../src/data/states.json', import.meta.url), 'utf8'));

let failures = 0;
const fail = (msg) => { failures++; console.log(`FAIL  ${msg}`); };
const pass = (msg) => console.log(`PASS  ${msg}`);

states.length === 50 ? pass('exactly 50 states') : fail(`state count = ${states.length}`);
const slugs = new Set(states.map((s) => s.slug));
slugs.size === 50 ? pass('slugs unique') : fail('duplicate slugs');
new Set(states.map((s) => s.code)).size === 50 ? pass('codes unique') : fail('duplicate codes');

for (const s of states) {
  if (!(s.tax >= 0.2 && s.tax <= 2.5)) fail(`${s.slug}: tax ${s.tax} out of sane range`);
  if (!(s.home >= 150000 && s.home <= 900000)) fail(`${s.slug}: home ${s.home} out of sane range`);
  if (!(s.ins >= 500 && s.ins <= 7000)) fail(`${s.slug}: ins ${s.ins} out of sane range`);
  if (!s.transfer || s.transfer.length < 10) fail(`${s.slug}: missing transfer note`);
  if (!Array.isArray(s.neighbors) || s.neighbors.length !== 4) fail(`${s.slug}: needs exactly 4 neighbors`);
  for (const n of s.neighbors) {
    if (!slugs.has(n)) fail(`${s.slug}: unknown neighbor '${n}'`);
    if (n === s.slug) fail(`${s.slug}: self-neighbor`);
  }
}
if (failures === 0) pass('all field/range/neighbor checks');

// Verified anchors (published sources, spot-checked 2026-07-11)
const anchors = [
  ['new-jersey', 'tax', 2.23], ['illinois', 'tax', 2.07], ['texas', 'tax', 1.58],
  ['hawaii', 'tax', 0.27], ['connecticut', 'tax', 1.92],
  ['nebraska', 'ins', 6425], ['louisiana', 'ins', 6274], ['florida', 'ins', 5735], ['hawaii', 'ins', 850],
];
for (const [slug, field, val] of anchors) {
  const s = states.find((x) => x.slug === slug);
  s[field] === val ? pass(`anchor ${slug}.${field} = ${val}`) : fail(`anchor ${slug}.${field}: got ${s[field]}, expected ${val}`);
}
meta.sources.length >= 4 ? pass('sources documented') : fail('missing sources');

console.log(failures === 0 ? '\nALL M3 DATA CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
