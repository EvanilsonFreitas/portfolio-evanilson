import Link from 'next/link';
import Icon from '../ui/Icon';
import { resumeFiles, site } from '../../content/site';
import { withBasePath } from '../../lib/paths';

export default function Hero() {
  return (
    <section id="inicio" className="wrap pb-20 pt-12 sm:pt-20 lg:pb-28">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6">{site.name} / Portfólio</p>
          <p className="eyebrow mb-8 !text-ink">{site.areas}</p>

          {/* Texto sempre visível desde a renderização inicial: sem animação de entrada. */}
          <h1 className="display text-[clamp(2.6rem,5.4vw,5rem)]">
            <span className="block">Transformo desafios</span>
            <span className="block">de negócio em soluções</span>
            <em className="block">de dados e software.</em>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{site.summary}</p>

          <p className="mt-6">
            <Link href="/educacao/" className="link-arrow">
              MBA em Data Science · USP/ESALQ <Icon name="arrow" />
            </Link>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/projetos/" className="btn">
              Explorar projetos <Icon name="arrow" />
            </Link>
            <a href={withBasePath(resumeFiles.pdf.path)} download className="btn btn-ghost">
              <Icon name="download" /> Baixar currículo
            </a>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-muted">
            <a href={withBasePath(resumeFiles.docx.path)} download className="underline underline-offset-4 hover:text-ink">
              Versão em Word
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-ink"
            >
              <Icon name="whatsapp" size={16} /> WhatsApp
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-ink"
            >
              <Icon name="github" size={16} /> GitHub
            </a>
          </p>
        </div>

        <div className="lg:col-span-5">
          <figure className="mx-auto max-w-sm lg:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(site.photo)}
              alt={`Retrato de ${site.fullName}`}
              width={560}
              height={560}
              fetchPriority="high"
              className="aspect-square w-full border border-line object-cover"
            />
            <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-muted">
              <span>{site.fullName}</span>
              <span className="eyebrow">{site.location}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
