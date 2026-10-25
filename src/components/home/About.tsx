import CareerTimeline from './CareerTimeline';
import EmploymentHistory from './EmploymentHistory';
import SectionHead from '../ui/SectionHead';
import Icon from '../ui/Icon';
import { about } from '../../content/about';

/** Destaca discretamente um trecho do parágrafo, sem alterar o texto. */
function withHighlight(text: string, part: string) {
  const i = text.indexOf(part);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-medium text-ink">{part}</strong>
      {text.slice(i + part.length)}
    </>
  );
}

export default function About() {
  return (
    <>
      <section id="sobre" className="section">
        <div className="wrap">
          <header className="mb-8 md:mb-10">
            <p className="eyebrow mb-4">
              <span className="text-accent-ink">01</span> — Sobre
            </p>
            <h2 className="display max-w-4xl text-[clamp(2.25rem,5vw,3.75rem)]">{about.title}</h2>
          </header>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="max-w-2xl space-y-5 text-lg leading-relaxed lg:col-span-8">
              {about.paragraphs.map((t) => (
                <p key={t}>{withHighlight(t, about.highlight)}</p>
              ))}
              <p className="pt-2">
                <a href="#trajetoria" className="link-arrow">
                  {about.cta} <Icon name="arrow" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="trajetoria" className="section section-tight">
        <div className="wrap">
          <SectionHead number="02" label="Evolução" title="Da operação à engenharia de software.">
            <p>Sequência de evolução descrita pelo autor, da operação ao produto.</p>
          </SectionHead>
          <CareerTimeline />
        </div>
      </section>

      <section id="experiencia" className="section section-tight">
        <div className="wrap">
          <SectionHead number="03" label="Experiência" title="Onde atuei.">
            <p>Empresas, cargos e períodos, como no registro profissional.</p>
          </SectionHead>
          <EmploymentHistory />
        </div>
      </section>
    </>
  );
}
