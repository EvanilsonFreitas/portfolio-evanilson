import Link from 'next/link';
import Reveal from '../ui/Reveal';
import SectionHead from '../ui/SectionHead';
import HeroFigure from './HeroFigure';
import { expertise } from '../../content/expertise';
import { evidenceLabels } from '../../content/types';

export default function Expertise() {
  return (
    <section id="especialidades" className="section">
      <div className="wrap">
        <SectionHead number="05" label="Especialidades" title="O que resolvo, e onde está a evidência.">
          <p>Cada área aponta para projetos, formação ou artigos. A natureza da evidência está sempre indicada.</p>
        </SectionHead>

        <div className="mb-14 grid items-center gap-8 lg:grid-cols-12">
          <p className="max-w-xl text-lg text-muted lg:col-span-6">
            O caminho comum às áreas: fontes diversas viram um modelo, o modelo sustenta uma API e uma interface, e o resultado é um indicador para decisão.
          </p>
          <div className="lg:col-span-6">
            <HeroFigure />
          </div>
        </div>

        <div className="border-t border-rule">
          {expertise.map((p) => (
            <Reveal key={p.number}>
              <div className="grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-8">
                <h3 className="md:col-span-4">
                  <span className="eyebrow mb-2 block text-accent-ink">{p.number}</span>
                  <span className="display text-3xl">{p.title}</span>
                </h3>
                <div className="md:col-span-5">
                  <p>{p.solves}</p>
                  <p className="tag mt-4 leading-relaxed">{p.tech.join(' · ')}</p>
                </div>
                <ul className="space-y-2.5 text-[0.9375rem] md:col-span-3">
                  {p.evidence.map((e) => (
                    <li key={e.label}>
                      <span className="eyebrow block !text-[0.75rem]">{evidenceLabels[e.kind]}</span>
                      {e.href ? (
                        <Link href={e.href} className="underline decoration-rule underline-offset-4 hover:decoration-accent-ink">
                          {e.label}
                        </Link>
                      ) : (
                        e.label
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
