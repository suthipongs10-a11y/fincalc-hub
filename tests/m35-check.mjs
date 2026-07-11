// M3.5 verification — run after build: node tests/m35-check.mjs
// (1) Engine identities for the rate-matrix values on sample amounts.
// (2) Spot-check 5 built pages: the numbers printed in HTML match the
//     verified engine to the cent (gate: matrices vs verified engine).
import { readFileSync, existsSync } from 'node:fs';
import { pmt } from '../src/lib/loan.js';
import { AMOUNTS, MATRIX_RATES, ILLUSTRATIVE_RATE } from '../src/data/amounts.js';

let failures = 0;
const check = (name, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) failures++; };

check('29 amounts', AMOUNTS.length === 29);
check('amounts ascending & unique', AMOUNTS.every((a, i) => i === 0 || a > AMOUNTS[i - 1]));

// Identity: pmt scales linearly with amount
const unit = pmt(1, ILLUSTRATIVE_RATE, 360);
check('pmt linear in amount', Math.abs(pmt(300000, ILLUSTRATIVE_RATE, 360) - 300000 * unit) < 0.01);

// Published anchor: $300k @ 7% / 30yr = $1,995.91 (same engine family as M1/M2)
check('300k @7%/30y = 1995.91', Math.abs(pmt(300000, 7, 360) - 1995.91) < 0.01);

const dist = new URL('../dist/', import.meta.url);
const fmt2 = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

for (const amount of [100000, 300000, 500000, 800000, 2000000]) {
  const p = new URL(`mortgage-payment/${amount}/index.html`, dist);
  if (!existsSync(p)) { check(`built page ${amount}`, false); continue; }
  const html = readFileSync(p, 'utf8');
  let all = true;
  for (const r of MATRIX_RATES) {
    if (!html.includes(fmt2(pmt(amount, r, 360)))) all = false;
    if (!html.includes(fmt2(pmt(amount, r, 180)))) all = false;
  }
  check(`page ${amount}: all 14 matrix values match engine`, all);
}

console.log(failures === 0 ? '\nALL M3.5 CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
