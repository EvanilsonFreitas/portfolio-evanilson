import type { MetadataRoute } from 'next';
import { projects } from '../content/projects';
import { getAllPosts } from '../lib/blog';
import { absoluteUrl } from '../lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['/', '/projetos/', '/educacao/', '/blog/'].map((p) => ({ url: absoluteUrl(p) }));
  const projectUrls = projects.map((p) => ({ url: absoluteUrl(`/projetos/${p.slug}/`) }));
  const posts = getAllPosts().map((p) => ({ url: absoluteUrl(`/blog/${p.slug}/`), lastModified: p.date }));
  return [...fixed, ...projectUrls, ...posts];
}
