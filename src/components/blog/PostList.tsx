import Link from 'next/link';
import type { BlogPostMeta } from '../../lib/blog';

function shortDate(d: string) {
  return new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
}

export default function PostList({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <ul className="border-t border-rule">
      {posts.map((p) => (
        <li key={p.slug} className="border-b border-rule">
          <Link href={`/blog/${p.slug}/`} className="group grid gap-2 py-7 md:grid-cols-12 md:gap-8">
            <p className="mono text-sm text-muted md:col-span-2">
              <time dateTime={p.date}>{shortDate(p.date)}</time>
            </p>
            <div className="md:col-span-7">
              <h3 className="display text-3xl group-hover:text-accent-ink">{p.title}</h3>
              <p className="mt-2 text-muted">{p.excerpt}</p>
            </div>
            <p className="eyebrow md:col-span-3 md:text-right">
              {p.category} · {p.readTime}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
