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
            <p>Marcos de evolução, sem cargos ou datas além das comprovadas.</p>
          </SectionHead>
          <ol className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-5">
            {trajectory.map((m, i) => (
              <li key={m.title} className="flex flex-col bg-paper p-5">
                <p className="eyebrow mb-3">
                  <span className="text-accent-ink">{String(i + 1).padStart(2, '0')}</span> — {m.label}
                </p>
                <h3 className="display text-2xl">{m.title}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] text-muted">{m.text}</p>
                {m.when && <p className="mono mt-4 text-[0.8125rem] text-muted">{m.when}</p>}
                {m.href && (
                  <Link href={m.href} className="link-arrow mt-4 text-sm">
                    Ver mais <Icon name="arrow" />
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
