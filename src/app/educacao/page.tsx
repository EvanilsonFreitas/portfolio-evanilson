import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import Icon from '../../components/ui/Icon';
import { education } from '../../content/education';
import { diplomaFile } from '../../content/site';
import { withBasePath } from '../../lib/paths';
import { pageMetadata } from '../../lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Formação',
  description: 'MBA em Data Science (USP/ESALQ) e Tecnologia em Análise e Desenvolvimento de Sistemas (Uninove).',
  path: '/educacao/',
});

export default function EducacaoPage() {
  const [mba, ...others] = education;
  return (
    <div className="wrap pb-24 pt-12">
      <Breadcrumbs items={[{ label: 'Formação' }]} />
      <p className="eyebrow mb-4">Formação</p>
      <h1 className="display mb-16 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)]">
        Base acadêmica em <em>dados e software.</em>
      </h1>

      <section className="grid gap-10 border-t border-rule py-14 lg:grid-cols-12 lg:gap-12" aria-labelledby="mba">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4">
            <span className="text-accent-ink">{mba.status}</span> · Pós-graduação lato sensu
          </p>
          <h2 id="mba" className="display text-[clamp(2.5rem,6vw,4.75rem)]">
            {mba.title}
          </h2>
          <p className="display mt-2 text-[clamp(1.75rem,3.5vw,2.75rem)] text-muted">{mba.institution}</p>
          <p className="mt-8 max-w-xl text-lg">{mba.summary}</p>
        </div>
        <div className="lg:col-span-5 lg:pt-6">
          <h3 className="eyebrow mb-4">Onde se conecta ao trabalho</h3>
          <ul className="space-y-4">
            {mba.appliedIn.map((t) => (
              <li key={t} className="flex gap-3 text-muted">
                <span className="mt-3 h-px w-3 shrink-0 bg-ink" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/projetos/bi-operacional-logistica/" className="link-arrow">BI operacional (demonstração)</Link>
          </p>
          {mba.note && <p className="mt-8 border-l-2 border-rule pl-4 text-sm text-muted">{mba.note}</p>}
        </div>
      </section>

      {others.map((e) => (
        <section key={e.id} className="grid gap-6 border-t border-rule py-12 lg:grid-cols-12 lg:gap-12" aria-labelledby={e.id}>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">
              Graduação tecnológica · {e.status}
            </p>
            <h2 id={e.id} className="display text-[clamp(2rem,4.5vw,3.5rem)]">
              {e.title}
            </h2>
            {e.institution && <p className="mt-2 text-lg text-muted">{e.institution}</p>}
            <p className="mt-5 max-w-xl text-muted">{e.summary}</p>
          </div>
          <div className="lg:col-span-5">
            {e.dates.length > 0 && (
              <ul className="mono mb-5 space-y-1 text-sm">
                {e.dates.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            {e.id === 'ads' && (
              <p className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a href={withBasePath(diplomaFile.path)} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  Visualizar diploma <Icon name="arrow" />
                </a>
                <a href={withBasePath(diplomaFile.path)} download className="text-base text-muted underline underline-offset-4 hover:text-ink">
                  Baixar diploma (PDF)
                </a>
              </p>
            )}
            {e.appliedIn.length > 0 && (
              <ul className="space-y-3 text-muted">
                {e.appliedIn.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-3 h-px w-3 shrink-0 bg-ink" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <p className="border-t border-rule pt-8 text-sm text-muted">
        O diploma da graduação é publicado por autorização do titular. Demais documentos comprobatórios não são publicados.
      </p>
    </div>
  );
}
