'use client';

import { useMemo, useState } from 'react';
import LineChart from '../charts/LineChart';
import {
  MONTHS,
  REGIONS,
  byRegion,
  filterRows,
  generateOperationsData,
  metricValue,
  monthLabel,
  previousRange,
  seriesByMonth,
  summarize,
  type MetricId,
  type Range,
  type RegionFilter,
} from '../../lib/demos/operations';
import { fmtDec1, fmtInt, fmtPct } from '../../lib/format';

const DATA = generateOperationsData();
const METRIC_OPTIONS: { id: MetricId; label: string }[] = [
  { id: 'sla', label: 'SLA (entregas no prazo)' },
  { id: 'deliveries', label: 'Entregas' },
  { id: 'incidents', label: 'Ocorrências por mil entregas' },
];

function formatMetric(metric: MetricId, v: number): string {
  if (metric === 'sla') return fmtPct(v);
  if (metric === 'incidents') return fmtDec1(v);
  return fmtInt(v);
}

function Delta({ metric, current, previous }: { metric: MetricId; current: number | null; previous: number | null }) {
  if (current === null || previous === null || previous === 0) return <span className="text-muted">sem base de comparação</span>;
  if (metric === 'sla') {
    const pp = (current - previous) * 100;
    return <span>{pp >= 0 ? '▲' : '▼'} {pp >= 0 ? '+' : '−'}{fmtDec1(Math.abs(pp))} p.p. vs. período anterior</span>;
  }
  const pct = ((current - previous) / previous) * 100;
  return <span>{pct >= 0 ? '▲' : '▼'} {pct >= 0 ? '+' : '−'}{fmtDec1(Math.abs(pct))}% vs. período anterior</span>;
}

export default function OperationsDemo() {
  const [range, setRange] = useState<Range>({ from: '2025-07', to: '2025-12' });
  const [region, setRegion] = useState<RegionFilter>('all');
  const [metric, setMetric] = useState<MetricId>('sla');
  const [compare, setCompare] = useState(true);

  const prev = compare ? previousRange(range) : null;
  const current = useMemo(() => summarize(filterRows(DATA, range, region)), [range, region]);
  const previous = useMemo(() => (prev ? summarize(filterRows(DATA, prev, region)) : null), [prev, region]);

  const xLabels = useMemo(() => {
    const a = MONTHS.indexOf(range.from);
    const b = MONTHS.indexOf(range.to);
    return MONTHS.slice(a, b + 1).map(monthLabel);
  }, [range]);

  const currentSeries = useMemo(() => seriesByMonth(DATA, range, region, metric).map((p) => p.value), [range, region, metric]);
  const previousSeries = useMemo(
    () => (prev ? seriesByMonth(DATA, prev, region, metric).map((p) => p.value) : null),
    [prev, region, metric],
  );
  const regions = useMemo(() => byRegion(DATA, range, metric), [range, metric]);
  const tableRows = useMemo(() => {
    const a = MONTHS.indexOf(range.from);
    const b = MONTHS.indexOf(range.to);
    return MONTHS.slice(a, b + 1).map((m) => ({ month: m, s: summarize(filterRows(DATA, { from: m, to: m }, region)) }));
  }, [range, region]);

  const setFrom = (from: string) => setRange((r) => ({ from, to: r.to < from ? from : r.to }));
  const setTo = (to: string) => setRange((r) => ({ from: r.from > to ? to : r.from, to }));

  const metricLabel = METRIC_OPTIONS.find((m) => m.id === metric)!.label;
  const regionValues = regions.map((r) => r.value).filter((v): v is number => v !== null);
  const domain: [number, number] =
    metric === 'sla' ? [0.8, 1] : [0, Math.max(...regionValues, 1) * 1.1];
  const pos = (v: number) => `${Math.min(100, Math.max(0, ((v - domain[0]) / (domain[1] - domain[0])) * 100))}%`;

  const kpis: { id: MetricId; label: string }[] = [
    { id: 'deliveries', label: 'Entregas' },
    { id: 'sla', label: 'SLA' },
    { id: 'incidents', label: 'Ocorrências por mil' },
  ];

  return (
    <div className="border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface2 px-4 py-2.5 sm:px-6">
        <p className="eyebrow !text-ink">
          Demonstração com dados simulados
        </p>
        <p className="text-[0.8125rem] text-muted">Operação fictícia, 2025. Não representa nenhuma empresa.</p>
      </div>

      <div className="space-y-10 p-4 sm:p-6">
        <div>
          <h3 className="display text-3xl">Onde e quando o SLA caiu?</h3>
          <p className="mt-2 max-w-2xl text-muted">
            Ajuste o período e a região para localizar o desvio. O SLA é calculado a partir das contagens, não da média de percentuais.
          </p>
        </div>

        <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" onSubmit={(e) => e.preventDefault()} aria-label="Filtros da demonstração">
          {[
            { id: 'op-from', label: 'De', value: range.from, onChange: setFrom, options: MONTHS.map((m) => ({ v: m, l: monthLabel(m) })) },
            { id: 'op-to', label: 'Até', value: range.to, onChange: setTo, options: MONTHS.map((m) => ({ v: m, l: monthLabel(m) })) },
            { id: 'op-region', label: 'Região', value: region, onChange: (v: string) => setRegion(v as RegionFilter), options: [{ v: 'all', l: 'Todas' }, ...REGIONS.map((r) => ({ v: r, l: r }))] },
            { id: 'op-metric', label: 'Métrica do gráfico', value: metric, onChange: (v: string) => setMetric(v as MetricId), options: METRIC_OPTIONS.map((m) => ({ v: m.id, l: m.label })) },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="eyebrow mb-1.5 block">{f.label}</label>
              <select
                id={f.id}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="h-11 w-full border border-line bg-paper px-3 text-sm"
              >
                {f.options.map((o) => (
                  <option key={o.v} value={o.v}>{o.l}</option>
                ))}
              </select>
            </div>
          ))}
          <div className="flex items-end">
            <label className="flex h-11 items-center gap-3 text-sm">
              <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="h-4 w-4 accent-[var(--accent-ink)]" />
              Comparar com período anterior
            </label>
          </div>
        </form>

        {compare && !prev && (
          <p role="status" className="border-l-2 border-accent pl-3 text-sm text-muted">
            Não há período anterior de mesma duração dentro do histórico simulado (2025). A comparação foi desativada para este intervalo.
          </p>
        )}

        <dl className="grid gap-px border border-line bg-line sm:grid-cols-3">
          {kpis.map((k) => (
            <div key={k.id} className="bg-surface p-5">
              <dt className="eyebrow">{k.label}</dt>
              <dd className="display mt-2 text-5xl">
                {metricValue(current, k.id) === null ? '—' : formatMetric(k.id, metricValue(current, k.id) as number)}
              </dd>
              <dd className="mt-2 text-[0.8125rem] text-muted">
                {prev && previous ? <Delta metric={k.id} current={metricValue(current, k.id)} previous={metricValue(previous, k.id)} /> : ' '}
              </dd>
            </div>
          ))}
        </dl>
        <p className="-mt-6 text-[0.8125rem] text-muted">
          Cobertura: {current.cellsWithData} de {current.cellsExpected} registros região-mês com dados.
          {current.cellsWithData < current.cellsExpected && ' Registros sem dados são excluídos das somas e não contam como zero.'}
          {previous && previous.cellsWithData / previous.cellsExpected !== current.cellsWithData / current.cellsExpected &&
            ` Atenção: a cobertura difere do período anterior (${previous.cellsWithData} de ${previous.cellsExpected}); totais de entregas não são diretamente comparáveis. Taxas como o SLA não são afetadas.`}
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <h4 className="mb-1 font-medium">{metricLabel} por mês</h4>
            <p className="mb-4 text-[0.8125rem] text-muted">
              {region === 'all' ? 'Todas as regiões' : region}
              {compare && prev ? ` · linha tracejada: ${monthLabel(prev.from)} a ${monthLabel(prev.to)}` : ''}
            </p>
            <LineChart
              ariaLabel={`${metricLabel} por mês`}
              xLabels={xLabels}
              zeroBased={metric !== 'sla'}
              format={(n) => formatMetric(metric, n)}
              series={[
                { id: 'cur', label: 'Período selecionado', values: currentSeries, tone: 'ink' },
                ...(previousSeries ? [{ id: 'prev', label: 'Período anterior', values: previousSeries, tone: 'muted' as const, dash: '5 4' }] : []),
              ]}
            />
          </div>

          <div className="min-w-0 lg:col-span-4">
            <h4 className="mb-1 font-medium">Por região</h4>
            <p className="mb-4 text-[0.8125rem] text-muted">{metricLabel}, no período selecionado</p>
            <ul className="space-y-4">
              {regions.map((r) => (
                <li key={r.region} className={region === r.region ? '' : region === 'all' ? '' : 'opacity-60'}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className={region === r.region ? 'font-medium' : ''}>{r.region}</span>
                    <span className="mono">{r.value === null ? 'sem dados' : formatMetric(metric, r.value)}</span>
                  </div>
                  <div className="relative h-5 border-b border-rule">
                    {r.value !== null && (
                      <>
                        <span className="absolute inset-y-0 left-0 w-px bg-rule" />
                        <span
                          className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper ${region === "all" || region === r.region ? "bg-ink" : "bg-muted"}`}
                          style={{ left: pos(r.value) }}
                        />
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mono mt-3 flex justify-between text-[0.7rem] text-muted">
              <span>{formatMetric(metric, domain[0])}</span>
              <span>{formatMetric(metric, domain[1])}</span>
            </p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-medium">Dados do período</h4>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabela de dados do período, rolável">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <caption className="sr-only">Entregas, SLA e ocorrências por mês no período e região selecionados</caption>
              <thead>
                <tr className="border-b border-rule text-left">
                  {['Mês', 'Entregas', 'No prazo', 'SLA', 'Ocorrências'].map((h, i) => (
                    <th key={h} scope="col" className={`eyebrow py-2 font-normal ${i > 0 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(({ month, s }) => {
                  const none = s.cellsWithData === 0;
                  return (
                    <tr key={month} className="border-b border-line">
                      <th scope="row" className="mono py-2 text-left font-normal">{monthLabel(month)}</th>
                      <td className="mono py-2 text-right">{none ? '—' : fmtInt(s.deliveries)}</td>
                      <td className="mono py-2 text-right">{none ? '—' : fmtInt(s.onTime)}</td>
                      <td className="mono py-2 text-right">{none ? 'sem dados' : fmtPct(s.sla as number)}</td>
                      <td className="mono py-2 text-right">{none ? '—' : fmtInt(s.incidents)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <details className="border-t border-line pt-4 text-sm text-muted">
          <summary className="cursor-pointer font-medium text-ink">Metodologia e origem dos dados</summary>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>Dados gerados por um algoritmo determinístico (semente fixa): sazonalidade, tendência e ruído. O resultado é sempre o mesmo.</li>
            <li>Grão: uma linha por região e mês. Quatro regiões, doze meses de 2025. Um registro (Nordeste, abril) foi deixado sem dados de propósito.</li>
            <li>SLA = soma de entregas no prazo ÷ soma de entregas. Ocorrências por mil = ocorrências ÷ entregas × 1.000.</li>
            <li>Comparação: período imediatamente anterior, com a mesma quantidade de meses.</li>
            <li>A queda do SLA no Nordeste no segundo semestre foi inserida para dar uma pergunta a investigar. Não é um resultado real.</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
