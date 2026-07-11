/**
 * Site-wide constants. Working name + placeholder contact email until the
 * owner finalizes the domain and author entity (see STATUS.md → Pending
 * decisions). Swap values here once decided — nothing else needs to change.
 */
export const SITE = {
  name: 'FinCalc Hub',
  tagline: 'Free financial calculators you can actually trust',
  url: 'https://fincalc-hub.pages.dev',
  contactEmail: 'tanakonp99@gmail.com',
  /** Placeholder author entity until owner picks a real/pen name. */
  author: 'FinCalc Hub Editorial Team',
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
    status: 'coming-soon',
  },
  {
    slug: 'debt-snowball-calculator',
    name: 'Debt Snowball Calculator',
    description:
      'Compare the snowball and avalanche payoff methods side by side across all your debts.',
    status: 'coming-soon',
  },
  {
    slug: 'refinance-calculator',
    name: 'Refinance Calculator',
    description:
      'Find your break-even month and lifetime savings before you refinance.',
    status: 'coming-soon',
  },
  {
    slug: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    description:
      'Estimate car payments including trade-in value and state sales tax.',
    status: 'coming-soon',
  },
] as const;
