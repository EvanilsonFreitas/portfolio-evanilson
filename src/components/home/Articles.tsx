import Link from 'next/link';
import Icon from '../ui/Icon';
import SectionHead from '../ui/SectionHead';
import PostList from '../blog/PostList';
import type { BlogPostMeta } from '../../lib/blog';

export default function Articles({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <section id="artigos" className="section">
      <div className="wrap">
        <SectionHead number="04" label="Artigos" title="Notas técnicas.">
          <Link href="/blog/" className="link-arrow">
            Todos os artigos <Icon name="arrow" />
          </Link>
        </SectionHead>
        <PostList posts={posts} />
      </div>
    </section>
  );
}
