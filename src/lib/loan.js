// @ts-check
/**
 * Generic fixed-rate loan math — shared by the loan-payoff, refinance, and
 * auto-loan calculators. Plain JS + JSDoc so Node can verify it directly
 * (tests/m2-check.mjs). Money in dollars; round only at display.
 */

/**
 * Standard amortization payment.
 * @param {number} principal @param {number} annualRate percent @param {number} months
 * @returns {number}
 */
export function pmt(principal, annualRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/**
 * Months needed to pay `principal` at `annualRate` with a fixed `payment`.
 * Returns Infinity when the payment doesn't cover interest.
 * @param {number} principal @param {number} annualRate @param {number} payment
 */
export function monthsToPayoff(principal, annualRate, payment) {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / payment;
  if (payment <= principal * r) return Infinity;
  return -Math.log(1 - (r * principal) / payment) / Math.log(1 + r);
}

/**
 * Accelerated biweekly amortization: half the monthly payment every two
 * weeks (26 half-payments/yr ≈ 13 monthly payments), interest accrued per
 * biweekly period at annualRate/26. This is the standard "biweekly
 * mortgage" model; lenders' daily-accrual results differ slightly.
 * @param {number} principal @param {number} annualRate percent @param {number} termYears
 */
export function amortizeBiweekly(principal, annualRate, termYears) {
  const half = pmt(principal, annualRate, Math.round(termYears * 12)) / 2;
  const r = annualRate / 100 / 26;
  let balance = principal;
  let totalInterest = 0;
  let periods = 0;
  const cap = Math.ceil(termYears * 26) + 26;
  const balances = [principal]; // per period, for charting
  while (balance > 0.005 && periods < cap) {
    const interest = balance * r;
    let pr = half - interest;
    if (pr > balance) pr = balance;
    if (pr < 0) break; // pathological guard
    balance -= pr;
    totalInterest += interest;
    periods++;
    balances.push(balance);
  }
  return { halfPayment: half, periods, years: periods / 26, totalInterest, balances };
}

/**
 * Amortize a loan under a fixed payment (+ optional extra). Final payment
 * clamps to the payoff amount.
 * @param {{principal:number, annualRate:number, payment:number,
 *          extraMonthly?:number, startYear?:number, startMonth?:number,
 *          maxMonths?:number}} o
 * @returns {{rows:{n:number,year:number,month:number,interest:number,principal:number,balance:number}[],
 *            months:number, totalInterest:number, unpayable:boolean}}
 */
export function amortizeLoan(o) {
  const r = o.annualRate / 100 / 12;
  const extra = o.extraMonthly || 0;
  const cap = o.maxMonths || 1200;
  let balance = o.principal;
  let year = o.startYear ?? 2026;
  let month = o.startMonth ?? 1;
  const rows = [];
  let totalInterest = 0;

  if (balance > 0 && o.payment + extra <= balance * r) {
    return { rows: [], months: 0, totalInterest: 0, unpayable: true };
  }
  for (let n = 1; n <= cap && balance > 0.005; n++) {
    const interest = balance * r;
    let principal = o.payment - interest + extra;
    if (principal > balance) principal = balance;
    if (principal < 0) principal = 0;
    balance -= principal;
    totalInterest += interest;
    rows.push({ n, year, month, interest, principal, balance });
    month++;
    if (month > 12) { month = 1; year++; }
  }
  return { rows, months: rows.length, totalInterest, unpayable: false };
}
