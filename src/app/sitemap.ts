import type { MetadataRoute } from 'next';
import { catalog } from '../content/catalog';
import { getAllPosts } from '../lib/blog';
import { absoluteUrl } from '../lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['/', '/projetos/', '/educacao/', '/blog/'].map((p) => ({ url: absoluteUrl(p) }));
  const projectUrls = catalog.map((e) => ({ url: absoluteUrl(`/projetos/${e.slug}/`) }));
  const posts = getAllPosts().map((p) => ({ url: absoluteUrl(`/blog/${p.slug}/`), lastModified: p.date }));
  return [...fixed, ...projectUrls, ...posts];
}
