// M4.5 engine verification — node tests/m45-check.mjs
import { pmt, monthsToPayoff, amortizeLoan } from '../src/lib/loan.js';
import { pointsBreakEven, cashOutRefi, carAffordability, consolidationCompare, rentVsBuy } from '../src/lib/tools-extra.js';

let failures = 0;
function check(name, actual, expected, tol = 0.01) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: got ${Number(actual).toFixed(4)}, expected ${expected} (±${tol})`);
}

console.log('--- points ---');
// 1 point on 400k = $4,000; 6.75 -> 6.5 on 30yr
const pts = pointsBreakEven({ loan: 400000, termYears: 30, baseRate: 6.75, points: 1, reducedRate: 6.5 });
check('points cost', pts.cost, 4000, 0);
check('points pay base = pmt', pts.payBase, pmt(400000, 6.75, 360), 0.001);
check('points break-even = ceil(cost/savings)', pts.breakEvenMonths, Math.ceil(4000 / (pmt(400000, 6.75, 360) - pmt(400000, 6.5, 360))), 0);
check('points lifetime identity', pts.lifetimeSavings, pts.monthlySavings * 360 - 4000, 0.01);

console.log('--- cash-out ---');
const co = cashOutRefi({ balance: 200000, currentRate: 6.5, remainingYears: 25, cash: 50000, newRate: 6.75, newTermYears: 30, closingCosts: 4000, financeCosts: true });
check('cash-out principal', co.newPrincipal, 254000, 0);
check('cash-out payment = pmt', co.newPayment, pmt(254000, 6.75, 360), 0.001);
// cost of cash: total new outlay - old outlay - cash received
check('cost-of-cash identity', co.totalCostOfCash, co.newPayment * 360 - co.currentPayment * 300 - 50000, 0.01);

console.log('--- car affordability ---');
const ca = carAffordability({ budget: 500, down: 3000, tradeIn: 0, annualRate: 7, termMonths: 60, taxRate: 6, tradeInReducesTax: true, feesUpfront: false });
check('car payment at max == budget', ca.payment, 500, 0.01);
// identity: loan + down = price + tax  =>  price = (loan + down - ... ) via loanFor
const taxable = ca.maxPrice; // no trade-in
check('car loan construction', ca.loan, ca.maxPrice - 3000 + (taxable * 6) / 100, 0.5);

console.log('--- consolidation ---');
const debts = [
  { name: 'A', balance: 6000, rate: 24, minPayment: 180 },
  { name: 'B', balance: 4000, rate: 19, minPayment: 120 },
];
const cons = consolidationCompare({ debts, extraBudget: 100, newRate: 11, newTermMonths: 36, fee: 3 });
check('cons principal', cons.principal, 10000, 0);
check('cons fee 3%', cons.feeAmount, 300, 0.01);
check('cons payment = pmt(10300,11,36)', cons.newPayment, pmt(10300, 11, 36), 0.001);
check('cons accel months <= sched months', cons.accelMonths <= cons.newMonths ? 1 : 0, 1, 0);
check('cons current sim finishes', cons.current.months > 0 && !cons.current.unpayable ? 1 : 0, 1, 0);

console.log('--- rent vs buy ---');
const rvb = rentVsBuy({ price: 400000, down: 80000, rate: 6.5, termYears: 30, taxRate: 1.1, insAnnual: 2000, maintPct: 1, rent: 2200, rentGrowthPct: 3, appreciationPct: 3, horizonYears: 10 });
check('rvb payment = pmt(320k)', rvb.payment, pmt(320000, 6.5, 360), 0.001);
check('rvb 10 rows', rvb.years.length, 10, 0);
// year-1 rent cost identity
check('rvb year1 rent = 12×2200', rvb.years[0].rentCost, 26400, 0.01);
// own cost must decrease relative to rent over time (equity builds): gap shrinks
const gap1 = rvb.years[0].ownCost - rvb.years[0].rentCost;
const gap10 = rvb.years[9].ownCost - rvb.years[9].rentCost;
check('rvb gap shrinks (equity+appreciation)', gap10 < gap1 ? 1 : 0, 1, 0);
// zero appreciation + zero rent growth sanity: renting cheap short-term
const rvb2 = rentVsBuy({ price: 400000, down: 80000, rate: 6.5, termYears: 30, taxRate: 1.1, insAnnual: 2000, maintPct: 1, rent: 2200, rentGrowthPct: 0, appreciationPct: 0, horizonYears: 3 });
check('rvb short horizon favors renting', rvb2.years[2].rentCost < rvb2.years[2].ownCost ? 1 : 0, 1, 0);

console.log(failures === 0 ? '\nALL M4.5 CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
