import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Icon from '../../../components/ui/Icon';
import ProjectVisual from '../../../components/projects/ProjectVisual';
import LayerDiagram from '../../../components/projects/LayerDiagram';
import LegacyRedirect from '../../../components/projects/LegacyRedirect';
import OperationsDemo from '../../../components/demos/OperationsDemo';
import PricingDemo from '../../../components/demos/PricingDemo';
import { getProject, legacySlugs, projects } from '../../../content/projects';
import { pageMetadata } from '../../../lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [...projects.map((p) => p.slug), ...Object.keys(legacySlugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return pageMetadata({ title: 'Projeto atualizado', description: 'Este endereço foi substituído por um projeto atual.', path: `/projetos/${slug}/`, noindex: true });
  }
  return pageMetadata({
    title: `${project.title} — case study`,
    description: project.summary,
    path: `/projetos/${slug}/`,
  });
}

function Block({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-6 border-t border-rule py-12 md:grid-cols-12 md:gap-10" aria-labelledby={`s-${number}`}>
      <h2 id={`s-${number}`} className="md:col-span-3">
        <span className="eyebrow block text-accent-ink">{number}</span>
        <span className="display text-3xl">{title}</span>
      </h2>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    const target = legacySlugs[slug];
    const dest = target ? getProject(target) : undefined;
    if (!dest) notFound();
    return <LegacyRedirect to={dest.slug} title={dest.title} />;
  }

  const next = getProject(project.next)!;
  const meta: [string, string][] = [
    ['Natureza', project.natureLabel],
    ['Atuação', project.role],
    ['Estado', project.status],
    ['Acesso', project.access],
  ];

  return (
    <article className="wrap pb-24 pt-12">
      <nav aria-label="Navegação estrutural" className="mb-10 text-sm text-muted">
        <Link href="/projetos/" className="inline-flex items-center gap-2 hover:text-ink">
          <Icon name="arrow" className="rotate-180" /> Projetos
        </Link>
      </nav>

      <header className="mb-14">
        <p className="eyebrow mb-5">
          <span className="text-accent-ink">{project.number}</span> — {project.category}
        </p>
        <h1 className="display text-[clamp(3rem,8vw,6.5rem)]">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-xl text-muted">{project.summary}</p>
      </header>

      <div className="mb-16 max-w-3xl">
        <ProjectVisual slug={project.slug} />
      </div>

      <Block number="01" title="Identificação">
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow mb-1">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div className="sm:col-span-2">
            <dt className="eyebrow mb-1">{project.stackNote ? 'Conceitos e ferramentas' : 'Stack'}</dt>
            <dd className="mono text-sm">{project.stack.join(' · ')}</dd>
            {project.stackNote && <dd className="mt-2 text-sm text-muted">{project.stackNote}</dd>}
          </div>
        </dl>
      </Block>

      <Block number="02" title="Contexto">
        <div className="space-y-5">
          <p><span className="eyebrow mr-2">Problema</span>{project.context.problem}</p>
          <p><span className="eyebrow mr-2">Ambiente</span>{project.context.environment}</p>
          <p><span className="eyebrow mr-2">Objetivo</span>{project.context.objective}</p>
          <ul className="space-y-1.5 text-sm text-muted">
            {project.context.constraints.map((c) => (
              <li key={c} className="flex gap-3"><span className="mt-2.5 h-px w-3 shrink-0 bg-muted" aria-hidden="true" />{c}</li>
            ))}
          </ul>
        </div>
      </Block>

      <Block number="03" title="Estratégia de solução">
        <p className="mb-8 max-w-2xl">{project.strategy.approach}</p>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Decisões e justificativas, rolável">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <caption className="sr-only">Decisões de engenharia e suas justificativas</caption>
            <thead>
              <tr className="border-b border-rule text-left">
                <th scope="col" className="eyebrow w-2/5 py-2 font-normal">Decisão</th>
                <th scope="col" className="eyebrow py-2 font-normal">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {project.strategy.decisions.map((d) => (
                <tr key={d.decision} className="border-b border-line align-top">
                  <th scope="row" className="py-3 pr-4 text-left font-medium">{d.decision}</th>
                  <td className="py-3 text-muted">{d.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block number="04" title="Arquitetura">
        <LayerDiagram layers={project.architecture.layers} crosscutting={project.architecture.crosscutting} caption={project.architecture.caption} />
      </Block>

      <Block number="05" title="Implementação">
        <p className="mb-6 max-w-2xl">{project.implementation.intro}</p>
        <h3 className="eyebrow mb-3">{project.implementation.flowTitle}</h3>
        <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {project.implementation.flow.map((step, i) => (
            <li key={step} className="flex gap-3 bg-paper p-4 text-sm">
              <span className="mono text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
              {step}
            </li>
          ))}
        </ol>
        {project.implementation.code && (
          <figure className="mt-8">
            <figcaption className="eyebrow mb-2">{project.implementation.code.label}</figcaption>
            <pre className="mono overflow-x-auto border border-line bg-surface2 p-4 text-sm leading-relaxed" tabIndex={0}>
              <code>{project.implementation.code.source}</code>
            </pre>
          </figure>
        )}
      </Block>

      <section className="border-t border-rule py-12" aria-labelledby="s-06">
        <h2 id="s-06" className="mb-8">
          <span className="eyebrow block text-accent-ink">06</span>
          <span className="display text-3xl">Demonstração</span>
        </h2>
        {project.demo === 'pricing' && <PricingDemo />}
        {project.demo === 'operations' && <OperationsDemo />}
        {!project.demo && (
          <p className="max-w-2xl text-muted">
            Não há demonstração pública: o repositório é privado e nenhum dado financeiro é exibido neste portfólio.
          </p>
        )}
      </section>

      <Block number="07" title="Desafios">
        <ul className="space-y-6">
          {project.challenges.map((c) => (
            <li key={c.title}>
              <h3 className="font-medium">{c.title}</h3>
              <p className="mt-1 max-w-2xl text-muted">{c.text}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block number="08" title="Resultados e aprendizados">
        <ul className="space-y-3">
          {project.outcomes.map((o) => (
            <li key={o} className="flex gap-3"><span className="mt-3 h-px w-3 shrink-0 bg-ink" aria-hidden="true" />{o}</li>
          ))}
        </ul>
        <p className="display mt-8 max-w-2xl text-3xl text-muted">{project.learning}</p>
      </Block>

      <section className="border-t border-rule pt-12" aria-labelledby="s-09">
        <h2 id="s-09" className="eyebrow mb-4">
          <span className="text-accent-ink">09</span> — Próximo projeto
        </h2>
        <Link href={`/projetos/${next.slug}/`} className="group block">
          <p className="display text-[clamp(2.5rem,6vw,4.5rem)] group-hover:text-accent-ink">
            {next.title} <Icon name="arrow" size={36} className="inline" />
          </p>
          <p className="mt-2 text-muted">{next.summary}</p>
        </Link>
      </section>
    </article>
  );
}
