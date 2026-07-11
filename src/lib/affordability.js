// @ts-check
/**
 * Home affordability via the classic 28/36 qualifying ratios (limits are
 * user-adjustable in the UI):
 * - Front-end: housing costs (PITI + PMI + HOA) ≤ frontPct% of gross
 *   monthly income.
 * - Back-end: housing + other monthly debt payments ≤ backPct% of gross
 *   monthly income.
 * The binding budget is the smaller of the two. Max price is solved by
 * bisection so that full housing cost at that price equals the budget.
 */
import { pmt } from './loan.js';

/**
 * Full monthly housing cost for a given price under the user's assumptions.
 * @param {number} price
 * @param {{down:number, annualRate:number, termYears:number, taxRate:number,
 *          insAnnual:number, pmiRate:number, hoaMonthly:number}} a
 */
export function housingCost(price, a) {
  const loan = Math.max(0, price - a.down);
  const pi = pmt(loan, a.annualRate, Math.round(a.termYears * 12));
  const tax = (price * a.taxRate) / 100 / 12;
  const ins = a.insAnnual / 12;
  const pmi = price > 0 && a.down / price < 0.2 ? (loan * a.pmiRate) / 100 / 12 : 0;
  return { total: pi + tax + ins + pmi + a.hoaMonthly, pi, tax, ins, pmi };
}

/**
 * @param {{annualIncome:number, monthlyDebts:number, down:number,
 *          annualRate:number, termYears:number, taxRate:number,
 *          insAnnual:number, pmiRate:number, hoaMonthly:number,
 *          frontPct:number, backPct:number}} o
 */
export function computeAffordability(o) {
  const gross = o.annualIncome / 12;
  const frontBudget = (gross * o.frontPct) / 100;
  const backBudget = (gross * o.backPct) / 100 - o.monthlyDebts;
  const budget = Math.min(frontBudget, backBudget);
  if (budget <= o.insAnnual / 12 + o.hoaMonthly) {
    return { budget, frontBudget, backBudget, maxPrice: 0, breakdown: null, binding: backBudget < frontBudget ? 'back' : 'front' };
  }
  // Bisection: housingCost is strictly increasing in price.
  let lo = o.down;
  let hi = o.down + 20000000;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (housingCost(mid, o).total > budget) hi = mid;
    else lo = mid;
  }
  const maxPrice = lo;
  return {
    budget,
    frontBudget,
    backBudget,
    binding: backBudget < frontBudget ? 'back' : 'front',
    maxPrice,
    breakdown: housingCost(maxPrice, o),
  };
}
