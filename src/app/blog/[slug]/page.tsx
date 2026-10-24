import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import Icon from '../../../components/ui/Icon';
import { formatDate, getAllSlugs, getPostBySlug, getRelatedPosts } from '../../../lib/blog';
import { absoluteUrl, jsonLd, pageMetadata } from '../../../lib/seo';
import { site } from '../../../content/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Artigo não encontrado' };
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}/`,
    type: 'article',
    publishedTime: post.date,
  });
}

const mdxComponents = {
  table: (props: React.ComponentProps<'table'>) => (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela rolável">
      <table {...props} />
    </div>
  ),
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: site.fullName, url: site.github },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}/`),
  };

  return (
    <article className="wrap pb-24 pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <nav aria-label="Navegação estrutural" className="mb-10 text-sm text-muted">
        <Link href="/blog/" className="inline-flex items-center gap-2 hover:text-ink">
          <Icon name="arrow" className="rotate-180" /> Artigos
        </Link>
      </nav>

      <header className="mb-12 max-w-4xl">
        <p className="eyebrow mb-5">
          {post.category} · <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readTime}
        </p>
        <h1 className="display text-[clamp(2.5rem,6vw,4.75rem)]">{post.title}</h1>
        <p className="mt-6 max-w-2xl text-xl text-muted">{post.excerpt}</p>
      </header>

      <hr className="rule mb-12" />

      <div className="prose-editorial">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypePrettyCode, { theme: { light: 'github-light', dark: 'github-dark' }, keepBackground: false }],
              ],
            },
          }}
        />
      </div>

      {related.length > 0 && (
        <aside className="mt-20 max-w-2xl border-t border-rule pt-8" aria-labelledby="relacionados">
          <h2 id="relacionados" className="eyebrow mb-4">Leia também</h2>
          <ul className="space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}/`} className="display text-2xl hover:text-accent-ink">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
