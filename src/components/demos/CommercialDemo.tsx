'use client';

import { useMemo, useState } from 'react';
import { SEGMENTS, generateOpportunities, summarize, totals } from '../../lib/demos/commercial';
import { fmtBRL, fmtBRLCompact, fmtInt, fmtPct } from '../../lib/format';

const OPPORTUNITIES = generateOpportunities();

export default function CommercialDemo() {
  const [segment, setSegment] = useState<string>('');
  const summary = useMemo(() => summarize(OPPORTUNITIES, segment || undefined), [segment]);
  const total = useMemo(() => totals(summary), [summary]);
  const maxCount = Math.max(1, ...summary.map((s) => s.count));

  return (
    <div className="border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface2 px-4 py-2.5 sm:px-6">
        <p className="eyebrow !text-ink">Demonstração com dados sintéticos</p>
        <p className="text-[0.8125rem] text-muted">Não representa nenhuma empresa.</p>
      </div>

      <div className="space-y-8 p-4 sm:p-6">
        <div>
          <h3 className="display text-3xl">Onde o funil afunila e quanto se espera fechar?</h3>
          <p className="mt-2 max-w-2xl text-muted">
            Sessenta oportunidades simuladas. A conversão é a razão entre contagens e o forecast pondera cada valor pela probabilidade do estágio.
          </p>
        </div>

        <div className="max-w-xs">
          <label htmlFor="cm-seg" className="eyebrow mb-1.5 block">Segmento</label>
          <select id="cm-seg" value={segment} onChange={(e) => setSegment(e.target.value)} className="h-11 w-full border border-line bg-surface px-3 text-sm">
            <option value="">Todos</option>
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <dl className="grid gap-px border border-line bg-line sm:grid-cols-3 [&>div]:min-w-0 [&_dd]:break-words">
          <div className="bg-surface p-5">
            <dt className="eyebrow">Oportunidades abertas</dt>
            <dd className="display mt-2 text-4xl">{fmtInt(total.count)}</dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="eyebrow">Pipeline</dt>
            <dd className="display mt-2 text-4xl">{fmtBRLCompact(total.pipeline)}</dd>
            <dd className="mt-2 text-[0.8125rem] text-muted">{fmtBRL(total.pipeline)}</dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="eyebrow">Forecast ponderado</dt>
            <dd className="display mt-2 text-4xl">{fmtBRLCompact(total.forecast)}</dd>
            <dd className="mt-2 text-[0.8125rem] text-muted">{fmtBRL(total.forecast)} · valor × probabilidade</dd>
          </div>
        </dl>

        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Funil por estágio, rolável">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <caption className="sr-only">Oportunidades, valor, forecast e conversão por estágio</caption>
            <thead>
              <tr className="border-b border-rule">
                {['Estágio', 'Oportunidades', '', 'Valor', 'Prob.', 'Forecast', 'Conversão p/ próximo'].map((h, i) => (
                  <th key={`${h}-${i}`} scope="col" className={`eyebrow py-2 font-normal ${i > 2 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.map((r) => (
                <tr key={r.stage.id} className="border-b border-line">
                  <th scope="row" className="py-2 text-left font-medium">{r.stage.label}</th>
                  <td className="mono py-2 pr-3">{r.count}</td>
                  <td className="w-32 py-2 pr-4" aria-hidden="true">
                    <div className="h-2 bg-surface2"><div className="h-2 bg-ink" style={{ width: `${(r.count / maxCount) * 100}%` }} /></div>
                  </td>
                  <td className="mono py-2 text-right">{fmtBRL(r.value)}</td>
                  <td className="mono py-2 text-right">{Math.round(r.stage.probability * 100)}%</td>
                  <td className="mono py-2 text-right">{fmtBRL(r.weighted)}</td>
                  <td className="mono py-2 text-right">{r.conversionToNext === undefined ? '—' : fmtPct(r.conversionToNext)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-line pt-4 text-sm text-muted">
          <p className="mb-2 font-medium text-ink">Premissas e cálculo</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Conversão = oportunidades que alcançaram o estágio seguinte ÷ oportunidades que alcançaram o estágio atual.</li>
            <li>As probabilidades por estágio são premissas didáticas, não taxas observadas.</li>
            <li>Valores sintéticos, gerados de forma determinística. Nenhum dado de empresa real é usado.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
