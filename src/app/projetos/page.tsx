import Link from 'next/link';
import type { Metadata } from 'next';
import Icon from '../../components/ui/Icon';
import { projects } from '../../content/projects';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Projetos',
  description: 'Case studies de software, dados e Business Intelligence: EasyPrice, Marivan Finance e uma demonstração de BI operacional com dados simulados.',
  path: '/projetos/',
});

export default function ProjetosPage() {
  return (
    <div className="wrap pb-24 pt-16">
      <p className="eyebrow mb-4">Projetos</p>
      <h1 className="display mb-6 text-[clamp(2.75rem,7vw,5.5rem)]">Case studies.</h1>
      <p className="mb-14 max-w-xl text-lg text-muted">
        Cada projeto indica sua natureza: corporativo, autoral ou demonstração com dados simulados.
      </p>

      <ul className="border-t border-rule">
        {projects.map((p) => (
          <li key={p.slug} className="border-b border-rule">
            <Link href={`/projetos/${p.slug}/`} className="group grid gap-3 py-8 md:grid-cols-12 md:gap-8">
              <p className="display text-5xl text-muted/50 md:col-span-1" aria-hidden="true">{p.number}</p>
              <div className="md:col-span-6">
                <h2 className="display text-4xl group-hover:text-accent-ink">{p.title}</h2>
                <p className="mt-2 text-muted">{p.summary}</p>
              </div>
              <div className="md:col-span-4">
                <p className="eyebrow">{p.category}</p>
                <p className="mt-1 text-sm">{p.natureLabel}</p>
                <p className="tag mt-3">{p.stack.join(' · ')}</p>
              </div>
              <span className="hidden self-center justify-self-end md:col-span-1 md:block" aria-hidden="true">
                <Icon name="arrow" size={22} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
