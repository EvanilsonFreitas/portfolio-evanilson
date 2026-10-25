import Link from 'next/link';
import Icon from '../ui/Icon';
import Disclosure from '../ui/Disclosure';
import { career, employment, type EmploymentRole } from '../../content/career';
import { employmentMonths, formatDuration, formatPeriod, monthsBetween, roleStructure, sortEmployment, sortRoles } from '../../lib/career';

// Fixado no build: a página é estática e as durações são recalculadas a cada publicação.
const NOW = new Date().toISOString().slice(0, 7);

/** Ícone-texto "tipo · modalidade · local", sem campos vazios. */
const meta = (r: EmploymentRole) =>
  [r.type, r.mode, r.location].filter(Boolean).join(' · ');

function Role({ role, id }: { role: EmploymentRole; id: string }) {
  const detail = role.responsibilities && role.responsibilities.length > 0;
  const milestones = role.milestones?.map((m) => career.find((c) => c.id === m)?.stage).filter(Boolean);

  return (
    <li className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <h4 className="text-lg font-medium">{role.title}</h4>
      <p className="mt-1 text-sm text-muted">
        {formatPeriod(role.period)} · {formatDuration(monthsBetween(role.period, NOW))}
      </p>
      {meta(role) && <p className="mt-0.5 text-sm text-muted">{meta(role)}</p>}

      {detail && (
        <Disclosure id={id} className="mt-3">
          <ul className="mt-2 space-y-2">
            {role.responsibilities!.map((x) => (
              <li key={x} className="flex max-w-2xl gap-3 text-[0.9375rem]">
                <span className="mt-[0.7rem] h-px w-3 shrink-0 bg-ink" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </Disclosure>
      )}

      {role.technologies && role.technologies.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`Competências, ${role.title}`}>
          {role.technologies.map((t) => (
            <li key={t} className="border border-line px-2 py-0.5 text-[0.75rem] leading-5 text-muted">
              {t}
            </li>
          ))}
        </ul>
      )}

      {milestones && milestones.length > 0 && <p className="mt-3 text-[0.8125rem] text-muted">Etapas de evolução: {milestones.join(' · ')}</p>}

      {role.projects && role.projects.length > 0 && (
        <div className="mt-3">
          <p className="text-[0.8125rem] text-muted">Projetos da mesma área</p>
          <ul className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6" aria-label={`Projetos da área, ${role.title}`}>
            {role.projects.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="link-arrow text-[0.9375rem]">
                  {p.label} <Icon name="arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

/**
 * Experiência profissional formal (empresas, cargos e períodos). Não repete a evolução de competências
 * da timeline. Cargos simultâneos e períodos separados são mostrados como informados.
 */
export default function EmploymentHistory() {
  if (employment.length === 0) return null;
  return (
    <ul className="border-t border-rule">
      {sortEmployment(employment).map((e) => {
        const structure = roleStructure(e, NOW);
        // Rótulo neutro conforme a estrutura temporal: sem afirmar promoção formal.
        const note = structure.separate ? 'Períodos separados na empresa' : structure.parallel ? 'Cargos exercidos em paralelo' : e.roles.length > 1 ? 'Evolução de funções na empresa' : '';
        return (
          <li key={e.id} className="grid gap-4 border-b border-rule py-9 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              {e.company.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.company.logo} alt="" className="mb-3 h-8 w-auto max-w-[8rem] object-contain" />
              )}
              <h3 className="display text-[clamp(1.75rem,3vw,2.25rem)]">
                {e.company.url ? (
                  <a href={e.company.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-ink" aria-label={`${e.company.name}, página da empresa no LinkedIn (abre em nova aba)`}>
                    {e.company.name}
                  </a>
                ) : (
                  e.company.name
                )}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {structure.separate ? 'Tempo acumulado' : 'Tempo na empresa'}: {formatDuration(employmentMonths(e, NOW))}
              </p>
              {e.location && <p className="mt-0.5 text-sm text-muted">{e.location}</p>}
              {note && <p className="mt-1 text-[0.8125rem] text-muted">{note}</p>}
              {e.areas && (
                <p className="mt-4 max-w-xs text-[0.8125rem] text-muted">
                  <span className="eyebrow mb-1 block">Atuação</span>
                  {e.areas.join(' · ')}
                </p>
              )}
            </div>
            <ul className="space-y-5 md:col-span-8">
              {sortRoles(e.roles).map((r) => (
                <Role key={r.title + r.period.start} role={r} id={`${e.id}-${r.period.start}`} />
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
