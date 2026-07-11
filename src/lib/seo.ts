import { SITE } from '../config';

export interface Faq {
  q: string;
  a: string;
}

/** Standard JSON-LD set for a calculator page: WebApplication + BreadcrumbList + FAQPage. */
export function calcSchema(opts: { name: string; path: string; description: string; crumbName: string; faqs: Faq[] }) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: opts.name,
      url: `${SITE.url}${opts.path}`,
      description: opts.description,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      browserRequirements: 'Requires JavaScript',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
        { '@type': 'ListItem', position: 2, name: opts.crumbName, item: `${SITE.url}${opts.path}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: opts.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];
}
