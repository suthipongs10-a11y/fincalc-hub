/**
 * Site-wide constants. Brand: Payoff Logic (payofflogic.com, live since
 * 2026-07-11). Contact email + author entity still pending owner decision
 * (see STATUS.md) — swap values here once decided.
 */
export const SITE = {
  name: 'Payoff Logic',
  tagline: 'Free financial calculators you can actually trust',
  url: 'https://payofflogic.com',
  contactEmail: 'tanakonp99@gmail.com',
  /** Placeholder author entity until owner picks a real/pen name. */
  author: 'Payoff Logic Editorial Team',
  launchedYear: 2026,
} as const;

/** Tools planned for M1–M2, used by the homepage directory. */
export const TOOLS = [
  {
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description:
      'Estimate your full monthly payment — principal, interest, property taxes, insurance, PMI, and HOA — with a complete amortization schedule.',
    status: 'live',
  },
  {
    slug: 'loan-payoff-calculator',
    name: 'Loan Payoff Calculator',
    description:
      'See how extra payments shorten your loan and how much interest you save.',
    status: 'live',
  },
  {
    slug: 'debt-snowball-calculator',
    name: 'Debt Snowball Calculator',
    description:
      'Compare the snowball and avalanche payoff methods side by side across all your debts.',
    status: 'live',
  },
  {
    slug: 'refinance-calculator',
    name: 'Refinance Calculator',
    description:
      'Find your break-even month and lifetime savings before you refinance.',
    status: 'live',
  },
  {
    slug: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    description:
      'Estimate car payments including trade-in value and state sales tax.',
    status: 'live',
  },
] as const;
