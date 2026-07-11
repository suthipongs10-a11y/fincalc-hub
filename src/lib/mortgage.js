// @ts-check
/**
 * Mortgage calculation engine — pure functions, no DOM.
 * Plain JS + JSDoc so the same file runs in Astro islands AND directly in
 * Node for math verification (tests/mortgage-check.mjs, tests/manual.md).
 *
 * Conventions:
 * - Money in dollars (floats internally; round only at display).
 * - PMI applies when down payment < 20% of home price and cancels
 *   automatically once the balance reaches 78% of the original home value
 *   (the Homeowners Protection Act auto-termination threshold).
 * - Property tax modeled as an annual % of home price; insurance as an
 *   annual dollar amount; HOA as a monthly dollar amount.
 */

/**
 * @typedef {Object} MortgageInputs
 * @property {number} homePrice
 * @property {number} downPayment   dollars
 * @property {number} annualRate    percent, e.g. 6.5
 * @property {number} termYears
 * @property {number} taxRate       percent of home price per year
 * @property {number} insuranceAnnual dollars per year
 * @property {number} pmiRate       percent of loan amount per year
 * @property {number} hoaMonthly    dollars per month
 * @property {number} extraMonthly  extra principal per month, dollars
 * @property {number} startYear     e.g. 2026
 * @property {number} startMonth    1-12 (month of first payment)
 */

/**
 * @typedef {Object} ScheduleRow
 * @property {number} n        payment number, 1-based
 * @property {number} year     calendar year of this payment
 * @property {number} month    calendar month 1-12
 * @property {number} interest
 * @property {number} principal  scheduled principal + extra actually applied
 * @property {number} pmi
 * @property {number} balance  remaining after this payment
 */

/**
 * Standard amortization payment (principal & interest).
 * @param {number} loan @param {number} annualRate percent @param {number} termYears
 * @returns {number}
 */
export function monthlyPI(loan, annualRate, termYears) {
  const n = Math.round(termYears * 12);
  if (loan <= 0 || n <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return loan / n;
  const f = Math.pow(1 + r, n);
  return (loan * r * f) / (f - 1);
}

/**
 * Build the full schedule. Returns rows plus totals. When extraMonthly > 0
 * the loan ends early; the final payment is clamped to the payoff amount.
 * @param {MortgageInputs} inp
 */
export function amortize(inp) {
  const loan = Math.max(0, inp.homePrice - inp.downPayment);
  const basePI = monthlyPI(loan, inp.annualRate, inp.termYears);
  const r = inp.annualRate / 100 / 12;
  const nMax = Math.round(inp.termYears * 12);
  const pmiActive = inp.homePrice > 0 && inp.downPayment / inp.homePrice < 0.2 && inp.pmiRate > 0;
  const pmiMonthly = pmiActive ? (loan * inp.pmiRate) / 100 / 12 : 0;
  const pmiStopBalance = 0.78 * inp.homePrice;

  /** @type {ScheduleRow[]} */
  const rows = [];
  let balance = loan;
  let totalInterest = 0;
  let totalPMI = 0;
  let year = inp.startYear;
  let month = inp.startMonth;

  for (let n = 1; n <= nMax && balance > 0.005; n++) {
    const interest = balance * r;
    let principal = basePI - interest + (inp.extraMonthly || 0);
    if (principal > balance) principal = balance; // final payment clamp
    if (principal < 0) principal = 0; // pathological rate/term guard
    const pmi = pmiActive && balance > pmiStopBalance ? pmiMonthly : 0;
    balance -= principal;
    totalInterest += interest;
    totalPMI += pmi;
    rows.push({ n, year, month, interest, principal, pmi, balance });
    month++;
    if (month > 12) { month = 1; year++; }
  }

  return { loan, basePI, rows, totalInterest, totalPMI, months: rows.length };
}

/**
 * Full result for the UI: monthly PITI breakdown + schedule + (if extra
 * payments are set) savings vs the no-extra baseline.
 * @param {MortgageInputs} inp
 */
export function computeMortgage(inp) {
  const sched = amortize(inp);
  const monthlyTax = (inp.homePrice * inp.taxRate) / 100 / 12;
  const monthlyIns = inp.insuranceAnnual / 12;
  const firstPMI = sched.rows.length ? sched.rows[0].pmi : 0;
  const totalMonthly = sched.basePI + monthlyTax + monthlyIns + firstPMI + inp.hoaMonthly + (inp.extraMonthly || 0);

  let savings = null;
  if ((inp.extraMonthly || 0) > 0) {
    const base = amortize({ ...inp, extraMonthly: 0 });
    savings = {
      interestSaved: base.totalInterest - sched.totalInterest,
      monthsSaved: base.months - sched.months,
    };
  }

  const last = sched.rows[sched.rows.length - 1];
  return {
    loan: sched.loan,
    monthlyPI: sched.basePI,
    monthlyTax,
    monthlyIns,
    monthlyPMI: firstPMI,
    hoaMonthly: inp.hoaMonthly,
    extraMonthly: inp.extraMonthly || 0,
    totalMonthly,
    totalInterest: sched.totalInterest,
    totalPMI: sched.totalPMI,
    months: sched.months,
    payoff: last ? { year: last.year, month: last.month } : null,
    rows: sched.rows,
    savings,
  };
}
