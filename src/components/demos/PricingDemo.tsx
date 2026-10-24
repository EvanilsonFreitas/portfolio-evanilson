'use client';

import { useMemo, useState } from 'react';
import LineChart from '../charts/LineChart';
import { DEFAULT_PRICING, SCENARIOS, compareScenarios, markupFromMargin, sensitivity, type ScenarioId } from '../../lib/demos/pricing';
import { fmtBRL, fmtDec1, fmtPct } from '../../lib/format';

const MARGINS = Array.from({ length: 31 }, (_, i) => (5 + i) / 100);

export default function PricingDemo() {
  const [baseCost, setBaseCost] = useState(DEFAULT_PRICING.baseCost);
  const [marginPct, setMarginPct] = useState(Math.round(DEFAULT_PRICING.targetMargin * 100));
  const [volume, setVolume] = useState(DEFAULT_PRICING.volume);
  const [scenarioId, setScenarioId] = useState<ScenarioId>('base');

  const inputs = useMemo(() => ({ baseCost, targetMargin: marginPct / 100, volume }), [baseCost, marginPct, volume]);
  const results = useMemo(() => compareScenarios(inputs), [inputs]);
  const curves = useMemo(() => sensitivity(inputs, MARGINS), [inputs]);
  const selected = results.find((r) => r.scenario.id === scenarioId)!;
  const base = results.find((r) => r.scenario.id === 'base')!;
  const tone = { pressured: 'muted', base: 'ink', efficient: 'muted' } as const;
  const dash = { pressured: '6 4', base: undefined, efficient: '1 4' } as const;

  return (
    <div className="border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface2 px-4 py-2.5 sm:px-6">
        <p className="eyebrow !text-ink">
          Modelo didático com dados sintéticos
        </p>
        <p className="text-[0.8125rem] text-muted">Não representa regras comerciais reais.</p>
      </div>

      <div className="space-y-10 p-4 sm:p-6">
        <div>
          <h3 className="display text-3xl">Como a margem-alvo muda o preço?</h3>
          <p className="mt-2 max-w-2xl text-muted">
            Um preço cost-plus parte do custo e aplica a margem desejada. Compare três cenários de custo e veja a sensibilidade.
          </p>
        </div>

        <form className="grid gap-6 md:grid-cols-3" onSubmit={(e) => e.preventDefault()} aria-label="Parâmetros do modelo">
          <div>
            <label htmlFor="pr-cost" className="eyebrow mb-1.5 flex justify-between">
              <span>Custo-base por viagem</span>
              <output htmlFor="pr-cost" className="mono !text-ink">{fmtBRL(baseCost)}</output>
            </label>
            <input id="pr-cost" type="range" min={2000} max={8000} step={100} value={baseCost} onChange={(e) => setBaseCost(Number(e.target.value))} className="h-11 w-full accent-[var(--accent-ink)]" />
          </div>
          <div>
            <label htmlFor="pr-margin" className="eyebrow mb-1.5 flex justify-between">
              <span>Margem-alvo sobre o preço</span>
              <output htmlFor="pr-margin" className="mono !text-ink">{marginPct}%</output>
            </label>
            <input id="pr-margin" type="range" min={5} max={35} step={1} value={marginPct} onChange={(e) => setMarginPct(Number(e.target.value))} className="h-11 w-full accent-[var(--accent-ink)]" />
          </div>
          <div>
            <label htmlFor="pr-volume" className="eyebrow mb-1.5 flex justify-between">
              <span>Viagens por mês (referência)</span>
              <output htmlFor="pr-volume" className="mono !text-ink">{volume}</output>
            </label>
            <input id="pr-volume" type="range" min={40} max={400} step={10} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="h-11 w-full accent-[var(--accent-ink)]" />
          </div>
        </form>

        <fieldset>
          <legend className="eyebrow mb-2">Cenário em destaque</legend>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <label key={s.id} className={`cursor-pointer border px-4 py-2 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent-ink)] ${scenarioId === s.id ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}>
                <input type="radio" name="cenario" value={s.id} checked={scenarioId === s.id} onChange={() => setScenarioId(s.id)} className="sr-only" />
                {s.label}
                <span className="ml-2 text-[0.8125rem] opacity-70">{s.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <dl className="grid gap-px border border-line bg-line sm:grid-cols-3">
          <div className="bg-surface p-5">
            <dt className="eyebrow">Preço calculado</dt>
            <dd className="display mt-2 text-5xl">{fmtBRL(selected.price)}</dd>
            <dd className="mt-2 text-[0.8125rem] text-muted">
              {selected.scenario.id === 'base'
                ? 'Cenário base'
                : `${selected.price >= base.price ? '▲ +' : '▼ −'}${fmtBRL(Math.abs(selected.price - base.price))} vs. cenário base`}
            </dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="eyebrow">Resultado por viagem</dt>
            <dd className="display mt-2 text-5xl">{fmtBRL(selected.unitProfit)}</dd>
            <dd className="mt-2 text-[0.8125rem] text-muted">Custo no cenário: {fmtBRL(selected.cost)}</dd>
          </div>
          <div className="bg-surface p-5">
            <dt className="eyebrow">Markup equivalente</dt>
            <dd className="display mt-2 text-5xl">{fmtPct(markupFromMargin(inputs.targetMargin))}</dd>
            <dd className="mt-2 text-[0.8125rem] text-muted">Margem de {marginPct}% sobre o preço</dd>
          </div>
        </dl>

        <div>
          <h4 className="mb-3 font-medium">Comparação entre cenários</h4>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Comparação entre cenários, rolável">
            <table className="w-full min-w-[38rem] border-collapse text-sm">
              <caption className="sr-only">Custo, preço, resultado e volume por cenário</caption>
              <thead>
                <tr className="border-b border-rule">
                  {['Cenário', 'Custo', 'Preço', 'Viagens/mês', 'Receita mensal', 'Resultado mensal'].map((h, i) => (
                    <th key={h} scope="col" className={`eyebrow py-2 font-normal ${i > 0 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.scenario.id} className={`border-b border-line ${r.scenario.id === scenarioId ? 'bg-surface2' : ''}`}>
                    <th scope="row" className="py-2 text-left font-medium">{r.scenario.label}</th>
                    <td className="mono py-2 text-right">{fmtBRL(r.cost)}</td>
                    <td className="mono py-2 text-right">{fmtBRL(r.price)}</td>
                    <td className="mono py-2 text-right">{r.volume}</td>
                    <td className="mono py-2 text-right">{fmtBRL(r.monthlyRevenue)}</td>
                    <td className="mono py-2 text-right">{fmtBRL(r.monthlyProfit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="mb-1 font-medium">Sensibilidade: preço × margem-alvo</h4>
          <p className="mb-4 text-[0.8125rem] text-muted">A guia tracejada marca a margem escolhida. O preço sobe de forma não linear conforme a margem aumenta.</p>
          <LineChart
            ariaLabel="Preço por margem-alvo, em três cenários de custo"
            xLabels={MARGINS.map((m) => `${Math.round(m * 100)}%`)}
            xTitle="Margem"
            format={fmtBRL}
            highlightIndex={marginPct - 5}
            series={curves.map((c) => ({
              id: c.scenario.id,
              label: c.scenario.label,
              values: c.points.map((p) => p.price),
              tone: tone[c.scenario.id],
              dash: dash[c.scenario.id],
            }))}
          />
        </div>

        <div className="border-t border-line pt-4 text-sm text-muted">
          <p className="mb-2 font-medium text-ink">Premissas e cálculo</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <span className="mono text-ink">preço = custo ÷ (1 − margem)</span>: a margem é calculada sobre o preço. Para 20%, o markup equivalente sobre o custo é de {fmtDec1(markupFromMargin(0.2) * 100)}%.
            </li>
            <li>Os cenários alteram o custo e o volume por fatores fixos (ex.: custo +8% e volume −5%). Os fatores são premissas didáticas, não estimativas de mercado.</li>
            <li>Resultado mensal = (preço − custo) × viagens. Valores arredondados a centavos.</li>
            <li>Valores sintéticos. Nenhuma fórmula, parâmetro ou dado de empresa real é utilizado.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
