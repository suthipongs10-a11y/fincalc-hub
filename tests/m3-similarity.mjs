// Gate M3: "no two pages >70% identical text".
// Measures pairwise similarity of the ARTICLE text (the per-state written
// content: header intro + article sections + FAQ) across all 50 built
// state pages, using 5-word shingle Jaccard similarity. The calculator UI
// chrome is excluded — it is a shared application, not page text.
// Run after `npm run build`: node tests/m3-similarity.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const states = JSON.parse(readFileSync(new URL('../src/data/states.json', import.meta.url), 'utf8')).states;

function articleText(slug) {
  const html = readFileSync(new URL(`${slug}/mortgage-calculator/index.html`, dist), 'utf8');
  // take <header> intro + <article> content
  const parts = [];
  const h = html.match(/<header[^>]*>([\s\S]*?)<\/header>/g) || [];
  parts.push(...h);
  const a = html.match(/<article[\s\S]*?<\/article>/);
  if (a) parts.push(a[0]);
  return parts
    .join(' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function shingles(text, k = 5) {
  const words = text.split(' ');
  const set = new Set();
  for (let i = 0; i + k <= words.length; i++) set.add(words.slice(i, i + k).join(' '));
  return set;
}

const sets = new Map();
for (const s of states) {
  if (!existsSync(new URL(`${s.slug}/mortgage-calculator/index.html`, dist))) {
    console.log(`FAIL  missing built page for ${s.slug}`);
    process.exit(1);
  }
  sets.set(s.slug, shingles(articleText(s.slug)));
}

let max = 0;
let maxPair = '';
const offenders = [];
const slugs = [...sets.keys()];
for (let i = 0; i < slugs.length; i++) {
  for (let j = i + 1; j < slugs.length; j++) {
    const a = sets.get(slugs[i]);
    const b = sets.get(slugs[j]);
    let inter = 0;
    for (const x of a) if (b.has(x)) inter++;
    const sim = inter / (a.size + b.size - inter);
    if (sim > max) { max = sim; maxPair = `${slugs[i]} vs ${slugs[j]}`; }
    if (sim > 0.7) offenders.push(`${slugs[i]} vs ${slugs[j]}: ${(sim * 100).toFixed(1)}%`);
  }
}

console.log(`pairs checked: ${(slugs.length * (slugs.length - 1)) / 2}`);
console.log(`max similarity: ${(max * 100).toFixed(1)}% (${maxPair})`);
if (offenders.length) {
  console.log(`FAIL  ${offenders.length} pair(s) exceed 70%:`);
  offenders.slice(0, 10).forEach((o) => console.log('  ' + o));
  process.exit(1);
}
console.log('PASS  no pair exceeds 70% similarity');
