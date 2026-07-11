// @ts-check
/**
 * Refinance break-even math. Compares the remaining life of the current
 * loan against a new loan for the same balance (optionally with closing
 * costs rolled in).
 */
import { pmt, amortizeLoan } from './loan.js';

/**
 * @param {{balance:number, currentRate:number, remainingYears:number,
 *          newRate:number, newTermYears:number, closingCosts:number,
 *          financeClosingCosts:boolean}} o
 */
export function computeRefinance(o) {
  const curMonths = Math.round(o.remainingYears * 12);
  const newMonths = Math.round(o.newTermYears * 12);
  const currentPayment = pmt(o.balance, o.currentRate, curMonths);

  const newPrincipal = o.balance + (o.financeClosingCosts ? o.closingCosts : 0);
  const newPayment = pmt(newPrincipal, o.newRate, newMonths);
  const monthlySavings = currentPayment - newPayment;

  const cur = amortizeLoan({ principal: o.balance, annualRate: o.currentRate, payment: currentPayment, maxMonths: curMonths + 1 });
  const nw = amortizeLoan({ principal: newPrincipal, annualRate: o.newRate, payment: newPayment, maxMonths: newMonths + 1 });

  // Out-of-pocket cost to recover: upfront costs, or (if financed) the
  // costs are in the balance — break-even still measures when payment
  // savings have covered the added cost.
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(o.closingCosts / monthlySavings) : Infinity;

  const totalCostCurrent = currentPayment * cur.months; // principal + interest
  const totalCostNew = newPayment * nw.months + (o.financeClosingCosts ? 0 : o.closingCosts);

  return {
    currentPayment,
    newPayment,
    newPrincipal,
    monthlySavings,
    breakEvenMonths,
    currentInterest: cur.totalInterest,
    newInterest: nw.totalInterest,
    lifetimeSavings: totalCostCurrent - totalCostNew,
    curMonths: cur.months,
    newMonths: nw.months,
    newRows: nw.rows,
  };
}
