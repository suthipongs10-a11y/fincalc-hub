// Math verification for the mortgage engine — run: node tests/mortgage-check.mjs
// Reference values are published, widely-cited amortization examples
// (see tests/manual.md for sources). Exits non-zero on any failure.
import { monthlyPI, computeMortgage } from '../src/lib/mortgage.js';

let failures = 0;
function check(name, actual, expected, tol = 0.01) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: got ${actual.toFixed(4)}, expected ${expected} (±${tol})`);
}

// Case A — $200,000 loan, 30yr, 6.00% → P&I $1,199.10
check('A monthlyPI 200k/30y/6%', monthlyPI(200000, 6, 30), 1199.1);

// Case B — $300,000 loan, 30yr, 7.00% → P&I $1,995.91
check('B monthlyPI 300k/30y/7%', monthlyPI(300000, 7, 30), 1995.91);

// Case C — $100,000 loan, 15yr, 5.00% → P&I $790.79
check('C monthlyPI 100k/15y/5%', monthlyPI(100000, 5, 15), 790.79);

// Full-schedule invariants on case A wrapped in PITI inputs
const inp = {
  homePrice: 250000, downPayment: 50000, annualRate: 6, termYears: 30,
  taxRate: 1.2, insuranceAnnual: 1800, pmiRate: 0.5, hoaMonthly: 0,
  extraMonthly: 0, startYear: 2026, startMonth: 8,
};
const r = computeMortgage(inp);
check('A loan amount', r.loan, 200000, 0);
check('A months', r.months, 360, 0);
// principal repaid over the schedule must equal the loan exactly
check('A sum(principal) == loan', r.rows.reduce((s, x) => s + x.principal, 0), 200000, 0.01);
// total interest for 200k/30y/6% ≈ $231,676.38 (360 × 1199.10 − 200000, published)
check('A total interest', r.totalInterest, 231676.38, 1);
// 20% down → no PMI ever
check('A PMI is zero at 20% down', r.totalPMI, 0, 0);
// monthly tax = 250000 * 1.2% / 12 = 250; insurance = 150
check('A monthly tax', r.monthlyTax, 250, 0);
check('A monthly insurance', r.monthlyIns, 150, 0);
check('A total monthly PITI', r.totalMonthly, 1199.1 + 250 + 150, 0.01);
check('A payoff month/year', (r.payoff.year * 100 + r.payoff.month), 205607, 0);

// PMI activation & auto-cancel at 78% LTV: 5% down on 250k → loan 237.5k
const pmiCase = computeMortgage({ ...inp, downPayment: 12500 });
check('PMI monthly (237.5k × 0.5% / 12)', pmiCase.monthlyPMI, 98.958333, 0.001);
const stop = 0.78 * 250000; // 195,000
const lastPMIRow = pmiCase.rows.filter((x) => x.pmi > 0).pop();
const firstNoPMIRow = pmiCase.rows.find((x) => x.pmi === 0);
console.log(`${firstNoPMIRow && lastPMIRow.n + 1 === firstNoPMIRow.n ? 'PASS' : 'FAIL'}  PMI cancels once, never returns`);
// PMI is charged while the pre-payment balance is above 78% of value: the
// row BEFORE the first no-PMI payment must have ended at or below the stop
// threshold, and the row before that must still be above it.
check('balance crossed 78% exactly at PMI stop',
  (pmiCase.rows[firstNoPMIRow.n - 2].balance <= stop && pmiCase.rows[firstNoPMIRow.n - 3].balance > stop) ? 1 : 0, 1, 0);

// Extra payments: $100/mo extra on 200k/30y/6%.
// Closed-form check: n = -ln(1 - rP/M)/ln(1+r) with M = 1199.10 + 100
//   = -ln(1 - 0.005·200000/1299.10)/ln(1.005) = 294.46 → 295 payments,
//   i.e. 65 months early; interest ≈ 294.46×1299.10 − 200000 ≈ $182.5k.
const extra = computeMortgage({ ...inp, extraMonthly: 100 });
check('extra sum(principal) == loan', extra.rows.reduce((s, x) => s + x.principal, 0), 200000, 0.01);
check('extra payoff at payment 295', extra.months, 295, 0);
check('extra months saved = 65', extra.savings.monthsSaved, 65, 0);
check('extra interest saved ≈ $49,138', extra.savings.interestSaved, 49138, 150);

// Zero-rate edge: payment = loan / n
check('0% rate edge', monthlyPI(120000, 0, 10), 1000, 0);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
