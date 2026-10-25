import type { Metadata } from 'next';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import PostList from '../../components/blog/PostList';
import { getAllPosts } from '../../lib/blog';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Artigos',
  description: 'Notas técnicas sobre Business Intelligence, DAX, modelagem dimensional e precificação logística.',
  path: '/blog/',
});

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="wrap pb-24 pt-12">
      <Breadcrumbs items={[{ label: 'Artigos' }]} />
      <p className="eyebrow mb-4">Artigos</p>
      <h1 className="display mb-6 text-[clamp(2.75rem,7vw,5.5rem)]">Notas técnicas.</h1>
      <p className="mb-14 max-w-xl text-lg text-muted">
        Business Intelligence, modelagem dimensional, DAX e precificação logística.
      </p>
      <PostList posts={posts} />
    </div>
  );
}
