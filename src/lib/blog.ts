import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de leitura`;
}

/** O título da página já é o <h1>; remove o `# título` repetido no início do MDX. */
function stripLeadingH1(content: string): string {
  return content.replace(/^\s*#\s+[^\r\n]+(\r?\n)+/, '');
}

function parse(slug: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf-8');
  const { data, content } = matter(raw);
  const body = stripLeadingH1(content);
  const tags: string[] = data.tags ?? [];
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    readTime: readingTime(body),
    excerpt: data.excerpt ?? '',
    category: tags[0] ?? 'Artigo',
    tags,
    author: data.author ?? 'Evanilson Freitas',
    content: body,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const { content, ...meta } = parse(slug);
      void content;
      return meta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!getAllSlugs().includes(slug)) return null;
  return parse(slug);
}

/** Artigos que compartilham ao menos uma tag. */
export function getRelatedPosts(slug: string, limit = 2): BlogPostMeta[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  return all
    .filter((p) => p.slug !== slug && p.tags.some((t) => current.tags.includes(t)))
    .slice(0, limit);
}

export function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}
