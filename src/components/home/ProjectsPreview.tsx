import Link from 'next/link';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';
import SectionHead from '../ui/SectionHead';
import ProjectVisual from '../projects/ProjectVisual';
import { projects } from '../../content/projects';
import { studies } from '../../content/studies';

export default function ProjectsPreview() {
  return (
    <section id="projetos" className="section">
      <div className="wrap">
        <SectionHead number="07" label="Projetos" title="Projetos e estudos.">
          <p>Projetos corporativos, autorais e demonstrações, mais estudos técnicos. A natureza de cada um está indicada.</p>
        </SectionHead>

        <div className="space-y-20 lg:space-y-28">
          {projects.map((p, i) => (
            <Reveal key={p.slug}>
              <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <p className="display text-7xl text-muted/50" aria-hidden="true">{p.number}</p>
                  <p className="eyebrow mt-2">{p.domain} · {p.natureLabel}</p>
                  <h3 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">
                    <Link href={`/projetos/${p.slug}/`} className="hover:text-accent-ink">{p.title}</Link>
                  </h3>
                  <p className="mt-4 text-muted">{p.summary}</p>
                  <p className="tag mt-5">{p.stack.join(' · ')}</p>
                  <Link href={`/projetos/${p.slug}/`} className="link-arrow mt-6">
                    Ler case study <Icon name="arrow" />
                  </Link>
                </div>
                <div className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <ProjectVisual slug={p.slug} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 border-t border-rule pt-10">
          <h3 className="eyebrow mb-6">Estudos técnicos</h3>
          <ul className="grid gap-x-10 md:grid-cols-2">
            {studies.map((st) => (
              <li key={st.slug} className="border-b border-line">
                <Link href={`/projetos/${st.slug}/`} className="group flex items-start justify-between gap-4 py-5">
                  <span>
                    <span className="eyebrow block">{st.domain}</span>
                    <span className="display mt-1 block text-2xl group-hover:text-accent-ink">{st.title}</span>
                  </span>
                  <Icon name="arrow" size={18} className="mt-6 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/projetos/" className="link-arrow mt-8">
            Ver todos, por área <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
