import Link from 'next/link';
import type { Metadata } from 'next';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import Icon from '../../components/ui/Icon';
import { projects } from '../../content/projects';
import { studies } from '../../content/studies';
import type { DomainName } from '../../content/types';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Projetos e estudos',
  description:
    'Projetos e estudos técnicos organizados por área: precificação, inteligência comercial, BI operacional, engenharia de dados e software, integrações e IA aplicada.',
  path: '/projetos/',
});

const DOMAIN_ORDER: DomainName[] = [
  'Precificação e Rentabilidade',
  'Business Intelligence Comercial',
  'Business Intelligence Operacional',
  'Engenharia de Dados',
  'Engenharia de Software',
  'Integrações e Automações',
  'Inteligência Artificial Aplicada',
  'Cloud e Infraestrutura',
];

interface Item {
  slug: string;
  title: string;
  summary: string;
  domain: DomainName;
  label: string;
  meta?: string;
}

const items: Item[] = [
  ...projects.map((p) => ({ slug: p.slug, title: p.title, summary: p.summary, domain: p.domain, label: p.natureLabel, meta: p.stack.join(' · ') })),
  ...studies.map((s) => ({ slug: s.slug, title: s.title, summary: s.summary, domain: s.domain, label: s.natureLabel })),
];

export default function ProjetosPage() {
  const groups = DOMAIN_ORDER.map((domain) => ({ domain, list: items.filter((i) => i.domain === domain) })).filter((g) => g.list.length > 0);

  return (
    <div className="wrap pb-24 pt-12">
      <Breadcrumbs items={[{ label: 'Projetos' }]} />
      <p className="eyebrow mb-4">Projetos e estudos</p>
      <h1 className="display mb-6 text-[clamp(2.75rem,7vw,5.5rem)]">Trabalho por área.</h1>
      <p className="mb-14 max-w-xl text-lg text-muted">
        Cada item indica sua natureza: projeto corporativo, projeto autoral, demonstração com dados sintéticos ou estudo técnico.
      </p>

      <div className="space-y-16">
        {groups.map((g) => (
          <section key={g.domain} aria-labelledby={`d-${g.domain}`}>
            <h2 id={`d-${g.domain}`} className="eyebrow mb-4 text-accent-ink">{g.domain}</h2>
            <ul className="border-t border-rule">
              {g.list.map((p) => (
                <li key={p.slug} className="border-b border-rule">
                  <Link href={`/projetos/${p.slug}/`} className="group grid gap-3 py-7 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-7">
                      <h3 className="display text-4xl group-hover:text-accent-ink">{p.title}</h3>
                      <p className="mt-2 text-muted">{p.summary}</p>
                    </div>
                    <div className="md:col-span-4">
                      <p className="eyebrow">{p.label}</p>
                      {p.meta && <p className="tag mt-3">{p.meta}</p>}
                    </div>
                    <span className="hidden self-center justify-self-end md:col-span-1 md:block" aria-hidden="true">
                      <Icon name="arrow" size={22} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
