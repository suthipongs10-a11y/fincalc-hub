// @ts-check
/**
 * Auto loan math: trade-in, loan payoff on the trade, state sales tax
 * (with or without trade-in credit), fees, and optional financing of
 * tax + fees into the loan.
 */
import { pmt, amortizeLoan } from './loan.js';

/**
 * @param {{price:number, down:number, tradeIn:number, owedOnTrade:number,
 *          taxRate:number, tradeInReducesTax:boolean, fees:number,
 *          financeTaxFees:boolean, annualRate:number, termMonths:number,
 *          startYear?:number, startMonth?:number}} o
 */
export function computeAuto(o) {
  const taxable = Math.max(0, o.tradeInReducesTax ? o.price - o.tradeIn : o.price);
  const salesTax = (taxable * o.taxRate) / 100;

  let loan = o.price - o.tradeIn + o.owedOnTrade - o.down;
  let upfront = o.down;
  if (o.financeTaxFees) {
    loan += salesTax + o.fees;
  } else {
    upfront += salesTax + o.fees;
  }
  loan = Math.max(0, loan);

  const payment = pmt(loan, o.annualRate, o.termMonths);
  const sched = amortizeLoan({
    principal: loan,
    annualRate: o.annualRate,
    payment,
    startYear: o.startYear,
    startMonth: o.startMonth,
    maxMonths: o.termMonths + 1,
  });

  return {
    taxable,
    salesTax,
    loan,
    upfront,
    payment,
    totalInterest: sched.totalInterest,
    totalLoanCost: loan + sched.totalInterest,
    rows: sched.rows,
    months: sched.months,
  };
}
