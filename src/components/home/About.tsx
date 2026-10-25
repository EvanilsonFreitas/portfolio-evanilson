import Link from 'next/link';
import Icon from '../ui/Icon';
import SectionHead from '../ui/SectionHead';
import { about, trajectory } from '../../content/about';

export default function About() {
  return (
    <>
      <section id="sobre" className="section">
        <div className="wrap">
          <SectionHead number="01" label="Sobre" title="Do problema de negócio à decisão." />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="max-w-2xl space-y-5 text-lg leading-relaxed lg:col-span-8">
              {about.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="trajetoria" className="section">
        <div className="wrap">
          <SectionHead number="02" label="Trajetória" title="Como a atuação foi se ampliando.">
            <p>Da operação ao produto, em cinco etapas.</p>
          </SectionHead>
          <ol className="border-t border-rule">
            {trajectory.map((m, i) => (
              <li key={m.title} className="grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-10">
                <p className="eyebrow md:col-span-3">
                  <span className="text-accent-ink">{String(i + 1).padStart(2, '0')}</span> — {m.label}
                </p>
                <div className="md:col-span-9">
                  <h3 className="display text-[clamp(1.75rem,3vw,2.5rem)]">{m.title}</h3>
                  <p className="mt-4 max-w-2xl text-muted">{m.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {m.topics.map((t) => (
                      <li key={t} className="border border-line px-2.5 py-1 text-[0.8125rem]">{t}</li>
                    ))}
                  </ul>
                  {m.href && (
                    <Link href={m.href} className="link-arrow mt-5 text-sm">
                      {m.linkLabel ?? 'Ver mais'} <Icon name="arrow" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
