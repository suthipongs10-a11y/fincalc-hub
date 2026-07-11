// @ts-check
/**
 * Loan amounts for the /mortgage-payment/{amount}/ programmatic pages
 * (SEO_PLAN §2.2): $100k–$500k step $25k, $550k–$1M step $50k, plus
 * $1.5M and $2M. 29 pages total. Shared by the page template, the hub,
 * and tests.
 */
export const AMOUNTS = [
  ...Array.from({ length: 17 }, (_, i) => 100000 + i * 25000), // 100k..500k
  ...Array.from({ length: 10 }, (_, i) => 550000 + i * 50000), // 550k..1M
  1500000,
  2000000,
];

/** 2025 baseline conforming loan limit (FHFA); loans above are jumbo. */
export const CONFORMING_LIMIT = 806500;

export const MATRIX_RATES = [5, 5.5, 6, 6.5, 7, 7.5, 8];
export const ILLUSTRATIVE_RATE = 6.5;

/** Short label like "300k" or "1.5M" for URLs/anchors. */
export function label(amount) {
  return amount >= 1000000 ? `$${(amount / 1000000).toLocaleString('en-US')}M` : `$${amount / 1000}k`;
}
