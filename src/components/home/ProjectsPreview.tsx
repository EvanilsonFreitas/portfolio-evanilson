import Link from 'next/link';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';
import SectionHead from '../ui/SectionHead';
import EntryTile from '../catalog/EntryTile';
import { catalog, homeFeatured } from '../../content/catalog';
import { categories } from '../../content/taxonomy';

/**
 * Curadoria de projetos representativos. Os dois destaques com imagem abrem a seção; os demais
 * formam uma grade de texto. Não há numeração, linha do tempo nem conectores: os projetos são independentes.
 */
export default function ProjectsPreview() {
  const featured = homeFeatured.map((slug) => catalog.find((e) => e.slug === slug)!);
  const leads = featured.filter((e) => e.image);
  const rest = featured.filter((e) => !e.image);

  return (
    <section id="projetos" className="section">
      <div className="wrap">
        <SectionHead number="07" label="Projetos" title="Soluções construídas.">
          <p>Business intelligence, Excel e automação, engenharia de dados e software. Cada projeto é independente e tem página própria.</p>
        </SectionHead>

        <Reveal>
          <ul className="grid border-l border-t border-line lg:grid-cols-2">
            {leads.map((e) => (
              <li key={e.slug} className="border-b border-r border-line bg-paper">
                <EntryTile entry={e} variant="lead" />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((e) => (
              <li key={e.slug}>
                <EntryTile entry={e} variant="text" />
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-16 border-t border-rule pt-10">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow mb-3">Catálogo completo</p>
              <p className="display text-[clamp(1.75rem,3.5vw,2.5rem)]">{catalog.length} projetos e estudos, por categoria, tecnologia e tipo de solução.</p>
            </div>
            <div className="md:col-span-5 md:justify-self-end">
              <Link href="/projetos/" className="btn">
                Ver o catálogo completo <Icon name="arrow" />
              </Link>
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/projetos/?categoria=${c.id}`} className="inline-flex min-h-11 items-center border border-line px-3.5 text-[0.875rem] hover:border-ink">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
