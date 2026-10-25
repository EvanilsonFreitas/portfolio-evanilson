import Link from 'next/link';
import Icon from '../ui/Icon';
import Flow from '../diagrams/Flow';
import Reveal from '../ui/Reveal';
import SectionHead from '../ui/SectionHead';
import { businessDomains } from '../../content/about';

export default function Business() {
  return (
    <section id="atuacao" className="section">
      <div className="wrap">
        <SectionHead number="04" label="Atuação" title="Conhecimento de negócio por trás dos dados.">
          <p>Cada área parte de uma pergunta de gestão e termina em indicador, regra ou integração.</p>
        </SectionHead>

        <div className="grid gap-6 md:grid-cols-2">
          {businessDomains.map((d, i) => (
            <Reveal key={d.title} className={i === businessDomains.length - 1 && businessDomains.length % 2 === 1 ? 'md:col-span-2' : ''}>
              <article className="flex h-full flex-col border border-line bg-paper p-6 sm:p-8">
                <p className="eyebrow mb-3">
                  <span className="text-accent-ink">{d.number}</span> — {d.title}
                </p>
                <h3 className="display text-3xl">{d.question}</h3>
                <p className="mt-4 text-muted">{d.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {d.topics.map((t) => (
                    <li key={t} className="border border-line px-2.5 py-1 text-[0.8125rem]">{t}</li>
                  ))}
                </ul>
                <Link href={d.href} className="link-arrow mt-6 self-start">
                  {d.linkLabel} <Icon name="arrow" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 max-w-4xl">
          <Flow id="crm-erp-tms-bi" caption="Como os sistemas se relacionam (visão conceitual, sem estrutura interna real)" />
        </div>
      </div>
    </section>
  );
}
