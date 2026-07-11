// Math verification for M2.5 engines — run: node tests/m25-check.mjs
import { pmt, amortizeBiweekly, amortizeLoan } from '../src/lib/loan.js';
import { computeFHA, computeVA, vaFundingFeePct } from '../src/lib/gov-loans.js';
import { computeAffordability, housingCost } from '../src/lib/affordability.js';

let failures = 0;
function check(name, actual, expected, tol = 0.01) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: got ${Number(actual).toFixed(4)}, expected ${expected} (±${tol})`);
}

console.log('--- biweekly ---');
// Bankrate's published example: $250,000 · 30yr · 5% → monthly $1,342.05,
// monthly-plan interest $233,139.46; biweekly interest ≈ $189,734.44 and
// payoff ~4yr 9mo early. Their accrual method differs slightly from the
// standard rate/26 model, so interest is checked to ±$1,500.
check('monthly PI 250k/30y/5%', pmt(250000, 5, 360), 1342.05);
const bw = amortizeBiweekly(250000, 5, 30);
check('biweekly half payment', bw.halfPayment, 1342.05 / 2, 0.01);
check('biweekly interest ≈ Bankrate 189,734', bw.totalInterest, 189734, 1500);
check('biweekly payoff ≈ 25.3 yr (4yr9mo early)', bw.years, 25.3, 0.35);
// invariant: principal repaid = loan
const bwPrincipal = bw.halfPayment * bw.periods - bw.totalInterest;
check('biweekly total paid − interest ≈ loan', bwPrincipal, 250000, bw.halfPayment + 1);

console.log('--- FHA ---');
// $300,000 price, 3.5% down: base 289,500, LTV 96.5% → MIP 0.55% life
const fha = computeFHA({ price: 300000, down: 10500, annualRate: 6.5, termYears: 30 });
check('FHA base loan', fha.baseLoan, 289500, 0);
check('FHA UFMIP 1.75%', fha.ufmip, 5066.25, 0.01);
check('FHA total loan', fha.totalLoan, 294566.25, 0.01);
check('FHA MIP rate 0.55 (LTV>95)', fha.mipRate, 0.55, 0);
check('FHA MIP life of loan', fha.mipMonths === Infinity ? 1 : 0, 1, 0);
check('FHA payment = pmt(total)', fha.payment, pmt(294566.25, 6.5, 360), 0.001);
check('FHA first MIP = 0.55%×total/12', fha.firstMIP, (294566.25 * 0.0055) / 12, 0.01);
// 10% down → LTV 90% → 0.50%, 132 months
const fha2 = computeFHA({ price: 300000, down: 30000, annualRate: 6.5, termYears: 30 });
check('FHA 10% down → MIP 0.50', fha2.mipRate, 0.5, 0);
check('FHA 10% down → 132 months', fha2.mipMonths, 132, 0);
check('FHA MIP stops after 11 yr', fha2.rows[132].mip, 0, 0);
check('FHA 15-yr low-LTV rate 0.15', computeFHA({ price: 300000, down: 45000, annualRate: 6, termYears: 15 }).mipRate, 0.15, 0);
check('FHA schedule sums to total loan', fha.rows.reduce((s, x) => s + x.principal, 0), 294566.25, 0.02);

console.log('--- VA ---');
check('VA fee first <5%', vaFundingFeePct(0, false), 2.15, 0);
check('VA fee first 5-9.99%', vaFundingFeePct(0.05, false), 1.5, 0);
check('VA fee first ≥10%', vaFundingFeePct(0.1, false), 1.25, 0);
check('VA fee subsequent <5%', vaFundingFeePct(0.03, true), 3.3, 0);
check('VA fee subsequent 5-9.99%', vaFundingFeePct(0.07, true), 1.5, 0);
check('VA fee subsequent ≥10%', vaFundingFeePct(0.15, true), 1.25, 0);
// $350,000, $0 down, first use, fee financed: fee 2.15% = 7,525 → loan 357,525
const va = computeVA({ price: 350000, down: 0, annualRate: 6.25, termYears: 30, subsequentUse: false, exempt: false, financeFee: true });
check('VA fee amount', va.feeAmount, 7525, 0.01);
check('VA total loan', va.totalLoan, 357525, 0.01);
check('VA payment', va.payment, pmt(357525, 6.25, 360), 0.001);
check('VA exempt → zero fee', computeVA({ price: 350000, down: 0, annualRate: 6.25, termYears: 30, subsequentUse: false, exempt: true, financeFee: true }).feeAmount, 0, 0);
check('VA upfront fee mode', computeVA({ price: 350000, down: 0, annualRate: 6.25, termYears: 30, subsequentUse: false, exempt: false, financeFee: false }).totalLoan, 350000, 0);

console.log('--- affordability ---');
const aff = {
  annualIncome: 120000, monthlyDebts: 500, down: 40000, annualRate: 6.5,
  termYears: 30, taxRate: 1.1, insAnnual: 1800, pmiRate: 0.5, hoaMonthly: 0,
  frontPct: 28, backPct: 36,
};
const a = computeAffordability(aff);
check('front budget 28% of 10k', a.frontBudget, 2800, 0.01);
check('back budget 36%−debts', a.backBudget, 3100, 0.01);
check('binding = front (smaller)', a.binding === 'front' ? 1 : 0, 1, 0);
// Solver: housing cost at maxPrice equals the budget
check('cost(maxPrice) == budget', housingCost(a.maxPrice, aff).total, 2800, 0.05);
// Identity check with taxes/ins/PMI zeroed: maxLoan = budget / pmt-per-dollar
const bare = { ...aff, taxRate: 0, insAnnual: 0, pmiRate: 0 };
const b = computeAffordability(bare);
const expectedLoan = 2800 / pmt(1, 6.5, 360);
check('bare identity: maxPrice = down + budget/factor', b.maxPrice, 40000 + expectedLoan, 1);
// Heavier debts flip the binding constraint to back-end
check('binding flips to back', computeAffordability({ ...aff, monthlyDebts: 1500 }).binding === 'back' ? 1 : 0, 1, 0);

console.log(failures === 0 ? '\nALL M2.5 CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
