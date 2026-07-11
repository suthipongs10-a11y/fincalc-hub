// @ts-check
/**
 * Engines for the M4.5 tool wave. All reuse the verified pmt/amortize
 * primitives; tests in tests/m45-check.mjs.
 */
import { pmt, monthsToPayoff, amortizeLoan } from './loan.js';
import { simulate } from './snowball.js';

/** Points break-even: cost of discount points vs monthly savings. */
export function pointsBreakEven({ loan, termYears, baseRate, points, reducedRate }) {
  const n = Math.round(termYears * 12);
  const cost = (loan * points) / 100;
  const payBase = pmt(loan, baseRate, n);
  const payReduced = pmt(loan, reducedRate, n);
  const monthlySavings = payBase - payReduced;
  return {
    cost,
    payBase,
    payReduced,
    monthlySavings,
    breakEvenMonths: monthlySavings > 0 ? Math.ceil(cost / monthlySavings) : Infinity,
    lifetimeSavings: monthlySavings * n - cost,
  };
}

/** Cash-out refinance: new loan = balance + cash (+ costs if financed). */
export function cashOutRefi({ balance, currentRate, remainingYears, cash, newRate, newTermYears, closingCosts, financeCosts }) {
  const curMonths = Math.round(remainingYears * 12);
  const currentPayment = pmt(balance, currentRate, curMonths);
  const newPrincipal = balance + cash + (financeCosts ? closingCosts : 0);
  const newMonths = Math.round(newTermYears * 12);
  const newPayment = pmt(newPrincipal, newRate, newMonths);
  const curInterest = currentPayment * curMonths - balance;
  const newInterest = newPayment * newMonths - newPrincipal;
  // Cost of accessing the cash: extra total outlay vs keeping old loan.
  const totalCostOfCash = newPayment * newMonths + (financeCosts ? 0 : closingCosts) - currentPayment * curMonths - cash;
  return { currentPayment, newPrincipal, newPayment, curInterest, newInterest, totalCostOfCash, newMonths, curMonths };
}

/** Max vehicle price from a monthly budget (tax-aware, bisection). */
export function carAffordability({ budget, down, tradeIn, annualRate, termMonths, taxRate, tradeInReducesTax, feesUpfront }) {
  const perDollar = pmt(1, annualRate, termMonths);
  const loanMax = budget / perDollar;
  // price -> loan needed
  const loanFor = (price) => {
    const taxable = Math.max(0, tradeInReducesTax ? price - tradeIn : price);
    const tax = (taxable * taxRate) / 100;
    return Math.max(0, price - down - tradeIn + (feesUpfront ? 0 : tax));
  };
  let lo = 0, hi = 5000000;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (loanFor(mid) > loanMax) hi = mid;
    else lo = mid;
  }
  return { maxPrice: lo, loan: loanFor(lo), payment: pmt(loanFor(lo), annualRate, termMonths) };
}

/** Debt consolidation: current debts (fixed payments) vs one new loan. */
export function consolidationCompare({ debts, extraBudget, newRate, newTermMonths, fee }) {
  const current = simulate(debts, extraBudget, 'avalanche');
  const principal = debts.reduce((s, d) => s + d.balance, 0);
  const financed = principal * (1 + fee / 100);
  const newPayment = pmt(financed, newRate, newTermMonths);
  const sched = amortizeLoan({ principal: financed, annualRate: newRate, payment: newPayment, maxMonths: newTermMonths + 1 });
  const currentBudget = debts.reduce((s, d) => s + d.minPayment, 0) + extraBudget;
  // Fair comparison: pay the same total budget on the new loan if it exceeds the required payment.
  const acceleratedPayment = Math.max(newPayment, currentBudget);
  const accel = amortizeLoan({ principal: financed, annualRate: newRate, payment: acceleratedPayment });
  return {
    principal,
    feeAmount: financed - principal,
    current,
    newPayment,
    newMonths: sched.months,
    newInterest: sched.totalInterest + (financed - principal),
    accelMonths: accel.months,
    accelInterest: accel.totalInterest + (financed - principal),
    currentBudget,
  };
}

/**
 * Rent vs buy over a horizon (simplified, assumptions explicit):
 * renting cost = rent growing g%/yr, minus investment growth on the money
 * a buyer would have spent up front (down + closing).
 * buying cost = mortgage P&I + tax + ins + maintenance − equity at sale
 * (after selling costs) using appreciation a%/yr.
 * Returns cumulative net cost of each path per year.
 */
export function rentVsBuy(o) {
  const {
    price, down, rate, termYears, taxRate, insAnnual, maintPct,
    rent, rentGrowthPct, appreciationPct, horizonYears,
    closingBuyPct = 3, sellCostPct = 7,
  } = o;
  const loan = price - down;
  const pay = pmt(loan, rate, termYears * 12);
  const sched = amortizeLoan({ principal: loan, annualRate: rate, payment: pay });
  const years = [];
  let rentPaid = 0;
  let ownOutlay = down + (price * closingBuyPct) / 100;
  let curRent = rent;
  for (let y = 1; y <= horizonYears; y++) {
    rentPaid += curRent * 12;
    curRent *= 1 + rentGrowthPct / 100;
    const ownYear = pay * 12 + (price * taxRate) / 100 + insAnnual + (price * maintPct) / 100;
    ownOutlay += ownYear;
    const balance = sched.rows[Math.min(y * 12, sched.rows.length) - 1]?.balance ?? 0;
    const value = price * Math.pow(1 + appreciationPct / 100, y);
    const equityAfterSale = value * (1 - sellCostPct / 100) - balance;
    years.push({ y, rentCost: rentPaid, ownCost: ownOutlay - equityAfterSale });
  }
  const crossover = years.find((r) => r.ownCost < r.rentCost)?.y ?? null;
  return { payment: pay, years, crossover };
}
