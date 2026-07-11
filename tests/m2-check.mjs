// Math verification for M2 engines — run: node tests/m2-check.mjs
// Reference values: published amortization examples + closed-form
// identities (see tests/manual.md). Exits non-zero on any failure.
import { pmt, monthsToPayoff, amortizeLoan } from '../src/lib/loan.js';
import { simulate, compare } from '../src/lib/snowball.js';
import { computeRefinance } from '../src/lib/refinance.js';
import { computeAuto } from '../src/lib/auto.js';

let failures = 0;
function check(name, actual, expected, tol = 0.01) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: got ${Number(actual).toFixed(4)}, expected ${expected} (±${tol})`);
}

console.log('--- loan.js ---');
// Published: $20,000 @ 6% / 60 mo → $386.66
check('pmt 20k/60mo/6%', pmt(20000, 6, 60), 386.66);
// Published: $25,000 @ 5% / 60 mo → $471.78
check('pmt 25k/60mo/5%', pmt(25000, 5, 60), 471.78);
// Same engine identity as verified mortgage engine: 200k/360/6% → 1199.10
check('pmt 200k/360mo/6%', pmt(200000, 6, 360), 1199.1);
// monthsToPayoff inverts pmt
check('monthsToPayoff inverts pmt', monthsToPayoff(20000, 6, 386.6560302), 60, 0.001);
check('monthsToPayoff: payment below interest → Infinity', monthsToPayoff(10000, 12, 100) === Infinity ? 1 : 0, 1, 0);

const base = amortizeLoan({ principal: 20000, annualRate: 6, payment: 386.6560302 });
check('amortize months', base.months, 60, 0);
check('amortize sum(principal)==loan', base.rows.reduce((s, x) => s + x.principal, 0), 20000, 0.01);
// total interest = 60×386.656 − 20000 = 3199.36
check('amortize total interest', base.totalInterest, 3199.36, 0.5);
// extra $100/mo: closed-form n = -ln(1-rP/M)/ln(1+r), M=486.656 → 46.55 → 47 payments
const extra = amortizeLoan({ principal: 20000, annualRate: 6, payment: 386.6560302, extraMonthly: 100 });
check('extra payoff at payment 47', extra.months, 47, 0);
check('unpayable flag', amortizeLoan({ principal: 10000, annualRate: 12, payment: 100 }).unpayable ? 1 : 0, 1, 0);

console.log('--- snowball.js ---');
// Single debt degenerates to plain amortization: identical months+interest
const one = simulate([{ name: 'A', balance: 20000, rate: 6, minPayment: 386.6560302 }], 0, 'snowball');
check('1-debt sim == amortization months', one.months, 60, 0);
check('1-debt sim interest matches', one.totalInterest, 3199.36, 1);
// Hand-checkable 2-month case: $500 @ 0%, min $200, extra $100 → 300/mo → 2 months
const tiny = simulate([{ name: 'T', balance: 500, rate: 0, minPayment: 200 }], 100, 'snowball');
check('0% tiny debt payoff months', tiny.months, 2, 0);
check('0% tiny debt zero interest', tiny.totalInterest, 0, 0);
// 3-debt scenario: avalanche interest ≤ snowball interest (mathematical property)
const debts = [
  { name: 'Card A', balance: 3000, rate: 24.99, minPayment: 90 },
  { name: 'Card B', balance: 8000, rate: 19.99, minPayment: 160 },
  { name: 'Car', balance: 12000, rate: 6.5, minPayment: 250 },
];
const cmp = compare(debts, 300);
check('avalanche interest <= snowball', cmp.avalanche.totalInterest <= cmp.snowball.totalInterest ? 1 : 0, 1, 0);
check('snowball pays smallest (Card A) first', cmp.snowball.payoffOrder[0].name === 'Card A' ? 1 : 0, 1, 0);
check('avalanche pays highest-APR (Card A=24.99%) first', cmp.avalanche.payoffOrder[0].name === 'Card A' ? 1 : 0, 1, 0);
// conservation: total paid = principal + interest (both methods)
for (const [label, r] of [['snowball', cmp.snowball], ['avalanche', cmp.avalanche]]) {
  check(`${label} conservation paid=principal+interest`, r.totalPaid, 23000 + r.totalInterest, 0.5);
}
check('unpayable snowball flag', simulate([{ name: 'X', balance: 10000, rate: 30, minPayment: 100 }], 0, 'snowball').unpayable ? 1 : 0, 1, 0);
// Scenario where methods truly diverge (smallest debt ≠ highest APR):
const div = compare([
  { name: 'Small 12%', balance: 3000, rate: 12, minPayment: 90 },
  { name: 'Big 24%', balance: 8000, rate: 24, minPayment: 160 },
  { name: 'Car 6%', balance: 12000, rate: 6.5, minPayment: 250 },
], 300);
check('divergent: snowball first = Small 12%', div.snowball.payoffOrder[0].name === 'Small 12%' ? 1 : 0, 1, 0);
check('divergent: avalanche first = Big 24%', div.avalanche.payoffOrder[0].name === 'Big 24%' ? 1 : 0, 1, 0);
check('divergent: avalanche interest STRICTLY less', div.avalanche.totalInterest < div.snowball.totalInterest - 1 ? 1 : 0, 1, 0);

console.log('--- refinance.js ---');
// 200k balance, 25y left @7% → payment 1413.56 (pmt identity)
// refi to 30y @5.5%, $4,000 costs paid upfront
const refi = computeRefinance({ balance: 200000, currentRate: 7, remainingYears: 25, newRate: 5.5, newTermYears: 30, closingCosts: 4000, financeClosingCosts: false });
check('current payment (pmt 200k/300/7%)', refi.currentPayment, pmt(200000, 7, 300), 0.001);
check('new payment (pmt 200k/360/5.5%)', refi.newPayment, pmt(200000, 5.5, 360), 0.001);
const savings = pmt(200000, 7, 300) - pmt(200000, 5.5, 360);
check('break-even = ceil(4000/savings)', refi.breakEvenMonths, Math.ceil(4000 / savings), 0);
// lifetime = old total payments − (new total payments + upfront costs)
check('lifetime savings identity', refi.lifetimeSavings,
  refi.currentPayment * refi.curMonths - (refi.newPayment * refi.newMonths + 4000), 0.5);
// financed costs: new principal includes costs
const refi2 = computeRefinance({ balance: 200000, currentRate: 7, remainingYears: 25, newRate: 5.5, newTermYears: 30, closingCosts: 4000, financeClosingCosts: true });
check('financed costs → principal 204k', refi2.newPrincipal, 204000, 0);
check('rate increase → negative monthly savings', computeRefinance({ balance: 100000, currentRate: 5, remainingYears: 20, newRate: 8, newTermYears: 20, closingCosts: 3000, financeClosingCosts: false }).monthlySavings < 0 ? 1 : 0, 1, 0);

console.log('--- auto.js ---');
// $35,000 car, $5,000 down, $8,000 trade-in (owe $2,000), 6% tax with
// trade-in credit, $500 fees financed, 7% APR / 60 mo.
// taxable = 27,000 → tax 1,620; loan = 35000−8000+2000−5000+1620+500 = 26,120
const auto = computeAuto({ price: 35000, down: 5000, tradeIn: 8000, owedOnTrade: 2000, taxRate: 6, tradeInReducesTax: true, fees: 500, financeTaxFees: true, annualRate: 7, termMonths: 60 });
check('auto taxable', auto.taxable, 27000, 0);
check('auto sales tax', auto.salesTax, 1620, 0);
check('auto loan amount', auto.loan, 26120, 0);
check('auto payment = pmt(26120,7,60)', auto.payment, pmt(26120, 7, 60), 0.001);
check('auto schedule sums to loan', auto.rows.reduce((s, x) => s + x.principal, 0), 26120, 0.01);
// no trade-in credit state: taxable = full price
const autoCA = computeAuto({ price: 35000, down: 5000, tradeIn: 8000, owedOnTrade: 0, taxRate: 7.25, tradeInReducesTax: false, fees: 0, financeTaxFees: false, annualRate: 7, termMonths: 60 });
check('CA-style full-price taxable', autoCA.taxable, 35000, 0);
check('tax+fees upfront → loan excludes tax', autoCA.loan, 22000, 0);
check('upfront = down + tax', autoCA.upfront, 5000 + 35000 * 0.0725, 0.01);

console.log(failures === 0 ? '\nALL M2 CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
