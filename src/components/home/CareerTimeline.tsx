'use client';

import Link from 'next/link';
import { flushSync } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import Disclosure from '../ui/Disclosure';
import { career } from '../../content/career';
import { focusIndex } from '../../lib/career';

/**
 * Linha do tempo da evolução profissional. O HTML do servidor é completo (responsabilidades abertas,
 * linha desenhada em CSS): sem JavaScript ou com movimento reduzido, nada fica escondido. Com
 * JavaScript, o marco em foco é realçado pela posição de rolagem e, em telas estreitas, as
 * responsabilidades começam recolhidas, com um controle explícito para expandir.
 */
export default function CareerTimeline() {
  const [focus, setFocus] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const list = useRef<HTMLOListElement>(null);
  const lastFocus = useRef(0);

  useEffect(() => {
    // Leitura direta do layout: barata (5 retângulos) e sem depender de observadores.
    const measure = () => {
      const rects = items.current.filter((el): el is HTMLLIElement => el !== null).map((el) => el.getBoundingClientRect());
      const next = focusIndex(rects, window.innerHeight * 0.4);
      if (next === lastFocus.current) return;
      lastFocus.current = next;
      // Atualização síncrona: o realce acompanha a rolagem sem ficar um passo atrás.
      flushSync(() => setFocus(next));
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    // Expandir ou recolher muda a altura dos marcos: o foco é recalculado.
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    if (list.current) ro?.observe(list.current);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, []);

  return (
    <ol ref={list} className="relative" aria-label="Evolução profissional">
      {career.map((c, i) => {
        const current = i === focus;
        const reached = i <= focus;
        const last = i === career.length - 1;
        return (
          <li
            key={c.id}
            ref={(el) => {
              items.current[i] = el;
            }}
            aria-current={current ? 'step' : undefined}
            className="relative grid gap-3 pb-12 pl-9 last:pb-0 md:grid-cols-12 md:gap-x-10 md:pb-16 md:pl-0"
          >
            {/* Segmento da linha: do marcador desta etapa até o da próxima. Contínuo e feito só com CSS. */}
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute -bottom-3 left-[5px] top-3 w-px transition-colors duration-200 md:left-[calc(25%-1px)] ${i < focus ? 'bg-ink' : 'bg-line'}`}
              />
            )}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-[0.4rem] z-[1] h-[11px] w-[11px] rotate-45 border transition-colors duration-200 md:left-[calc(25%-6px)] ${
                current ? 'border-ink bg-ink' : reached ? 'border-ink bg-paper' : 'border-line bg-paper'
              }`}
            />

            <p className="eyebrow md:col-span-3 md:pr-10 md:text-right">
              <span className={current ? 'text-ink' : 'text-accent-ink'}>{String(i + 1).padStart(2, '0')}</span> — {c.stage}
            </p>

            <div className="min-w-0 md:col-span-8 md:col-start-5">
              <h3 className={`display text-[clamp(1.75rem,3vw,2.5rem)] transition-colors duration-200 ${current ? '' : 'text-muted'}`}>{c.headline}</h3>
              <p className="mt-3 max-w-2xl text-muted md:mt-4">{c.context}</p>

              <Disclosure id={c.id}>
                <ul className="mt-2 space-y-2">
                  {c.responsibilities.map((r) => (
                    <li key={r} className="flex max-w-2xl gap-3 text-[0.9375rem]">
                      <span className="mt-[0.7rem] h-px w-3 shrink-0 bg-ink" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Disclosure>

              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tecnologias">
                {c.technologies.map((t) => (
                  <li key={t} className="border border-line px-2 py-0.5 text-[0.75rem] leading-5 text-muted">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.8125rem] text-muted">Áreas: {c.domains.join(' · ')}</p>

              <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6" aria-label="Projetos relacionados">
                {c.projects.map((p) => (
                  <li key={p.href + p.label}>
                    <Link href={p.href} className="link-arrow text-[0.9375rem]">
                      {p.label} <Icon name="arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
