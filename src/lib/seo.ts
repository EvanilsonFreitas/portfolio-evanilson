import type { Metadata } from 'next';
import { site, siteUrl } from '../content/site.ts';

export const OG_IMAGE = `${siteUrl}/og/portfolio.png`;

/** URL absoluta de uma rota (com basePath e barra final, conforme `trailingSlash`). */
export function absoluteUrl(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${clean}`;
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${opts.title} — ${site.name}`,
      description: opts.description,
      url,
      siteName: site.name,
      locale: 'pt_BR',
      type: opts.type ?? 'website',
      publishedTime: opts.publishedTime,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${site.name} — ${site.areas}` }],
    },
    twitter: { card: 'summary_large_image', title: `${opts.title} — ${site.name}`, description: opts.description, images: [OG_IMAGE] },
  };
}

/** Serializa JSON-LD escapando `<` para uso seguro dentro de <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
