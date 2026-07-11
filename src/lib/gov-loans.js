// @ts-check
/**
 * FHA and VA loan math.
 *
 * FHA data (HUD Mortgagee Letter 2023-05, unchanged as of July 2026):
 * - Upfront MIP (UFMIP): 1.75% of the base loan, typically financed.
 * - Annual MIP, terms > 15 years, base loan within the standard tier:
 *   LTV > 95% → 0.55%; LTV ≤ 95% → 0.50%.
 *   Terms ≤ 15 years: LTV > 90% → 0.40%; LTV ≤ 90% → 0.15%.
 * - Duration: LTV ≤ 90% (≥10% down) → 132 months (11 years); else life.
 * - Monthly MIP here = annual rate × current balance ÷ 12, recalculated
 *   monthly (declining). HUD's official basis is average annual balance;
 *   the difference is small and this approximation is documented on-page.
 *
 * VA funding fee (VA.gov, permanent schedule effective 2023-04-07,
 * unchanged as of July 2026), purchase loans:
 * - First use:      <5% down 2.15% · 5–9.99% 1.50% · ≥10% 1.25%
 * - Subsequent use: <5% down 3.30% · 5–9.99% 1.50% · ≥10% 1.25%
 * - Exempt: veterans receiving disability compensation (and others per VA).
 * - No down payment required and no monthly mortgage insurance on VA loans.
 */
import { pmt, amortizeLoan } from './loan.js';

/**
 * @param {{price:number, down:number, annualRate:number, termYears:number}} o
 */
export function computeFHA(o) {
  const baseLoan = Math.max(0, o.price - o.down);
  const ltv = o.price > 0 ? baseLoan / o.price : 0;
  const ufmip = baseLoan * 0.0175;
  const totalLoan = baseLoan + ufmip; // UFMIP financed (typical)
  const longTerm = o.termYears > 15;
  const mipRate = longTerm ? (ltv > 0.95 ? 0.55 : 0.5) : ltv > 0.9 ? 0.4 : 0.15;
  const mipMonths = ltv <= 0.9 ? 132 : Infinity;

  const n = Math.round(o.termYears * 12);
  const payment = pmt(totalLoan, o.annualRate, n);
  const r = o.annualRate / 100 / 12;

  let balance = totalLoan;
  let totalMIP = 0;
  let totalInterest = 0;
  const rows = [];
  for (let i = 1; i <= n && balance > 0.005; i++) {
    const interest = balance * r;
    let principal = payment - interest;
    if (principal > balance) principal = balance;
    const mip = i <= mipMonths ? (balance * mipRate) / 100 / 12 : 0;
    balance -= principal;
    totalInterest += interest;
    totalMIP += mip;
    rows.push({ n: i, year: Math.ceil(i / 12), month: ((i - 1) % 12) + 1, interest, principal, balance, mip });
  }
  const firstMIP = rows.length ? rows[0].mip : 0;
  return { baseLoan, ltv, ufmip, totalLoan, mipRate, mipMonths, payment, firstMIP, totalMIP, totalInterest, rows };
}

/**
 * @param {number} downPct down payment as a fraction of price (0.05 = 5%)
 * @param {boolean} subsequentUse
 * @returns {number} funding fee percent of the base loan
 */
export function vaFundingFeePct(downPct, subsequentUse) {
  if (downPct >= 0.1) return 1.25;
  if (downPct >= 0.05) return 1.5;
  return subsequentUse ? 3.3 : 2.15;
}

/**
 * @param {{price:number, down:number, annualRate:number, termYears:number,
 *          subsequentUse:boolean, exempt:boolean, financeFee:boolean}} o
 */
export function computeVA(o) {
  const baseLoan = Math.max(0, o.price - o.down);
  const downPct = o.price > 0 ? o.down / o.price : 0;
  const feePct = o.exempt ? 0 : vaFundingFeePct(downPct, o.subsequentUse);
  const feeAmount = (baseLoan * feePct) / 100;
  const totalLoan = baseLoan + (o.financeFee ? feeAmount : 0);
  const n = Math.round(o.termYears * 12);
  const payment = pmt(totalLoan, o.annualRate, n);
  const sched = amortizeLoan({ principal: totalLoan, annualRate: o.annualRate, payment, maxMonths: n + 1 });
  return { baseLoan, feePct, feeAmount, totalLoan, payment, totalInterest: sched.totalInterest, rows: sched.rows, upfrontFee: o.financeFee ? 0 : feeAmount };
}
