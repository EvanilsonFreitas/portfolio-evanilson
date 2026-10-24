import Link from 'next/link';
import Icon from '../ui/Icon';
import Reveal from '../ui/Reveal';
import SectionHead from '../ui/SectionHead';
import ProjectVisual from '../projects/ProjectVisual';
import { projects } from '../../content/projects';

export default function ProjectsPreview() {
  return (
    <section id="projetos" className="section">
      <div className="wrap">
        <SectionHead number="01" label="Projetos" title="Projetos selecionados.">
          <p>Sistemas, análises e demonstrações, cada um identificado pela sua natureza.</p>
        </SectionHead>

        <div className="space-y-20 lg:space-y-28">
          {projects.map((p, i) => (
            <Reveal key={p.slug}>
              <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <p className="display text-7xl text-muted/50" aria-hidden="true">{p.number}</p>
                  <p className="eyebrow mt-2">{p.category} · {p.natureLabel}</p>
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
      </div>
    </section>
  );
}
