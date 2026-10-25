import { mulberry32 } from './prng.ts';

/**
 * Funil comercial sintético e determinístico. Os números ilustram o método de cálculo
 * (conversão sobre contagens, forecast ponderado) e não representam nenhuma empresa.
 */

export interface Stage {
  id: string;
  label: string;
  /** Probabilidade de fechamento atribuída ao estágio (premissa didática). */
  probability: number;
}

export const STAGES: Stage[] = [
  { id: 'qualificacao', label: 'Qualificação', probability: 0.1 },
  { id: 'proposta', label: 'Proposta', probability: 0.3 },
  { id: 'negociacao', label: 'Negociação', probability: 0.6 },
  { id: 'fechamento', label: 'Fechamento', probability: 0.9 },
];

export interface Opportunity {
  id: number;
  stageIndex: number;
  value: number;
  segment: string;
}

export const SEGMENTS = ['Indústria', 'Varejo', 'Distribuição'];

export function generateOpportunities(seed = 7, count = 60): Opportunity[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    // Mais oportunidades nos estágios iniciais: o funil afunila.
    const r = rnd();
    const stageIndex = r < 0.4 ? 0 : r < 0.7 ? 1 : r < 0.9 ? 2 : 3;
    const value = Math.round(20 + rnd() * 180) * 1000;
    return { id: i + 1, stageIndex, value, segment: SEGMENTS[Math.floor(rnd() * SEGMENTS.length)] };
  });
}

export interface StageSummary {
  stage: Stage;
  count: number;
  value: number;
  weighted: number;
  /** Fração de oportunidades que chegaram ao estágio e alcançaram o próximo. */
  conversionToNext?: number;
}

/**
 * Cada oportunidade em estágio k passou por todos os estágios anteriores. "Chegaram" ao estágio
 * i são, portanto, as que estão em i ou além. A conversão é razão de contagens, nunca média de percentuais.
 */
export function summarize(ops: Opportunity[], segment?: string): StageSummary[] {
  const filtered = segment ? ops.filter((o) => o.segment === segment) : ops;
  return STAGES.map((stage, i) => {
    const inStage = filtered.filter((o) => o.stageIndex === i);
    const reached = filtered.filter((o) => o.stageIndex >= i).length;
    const reachedNext = filtered.filter((o) => o.stageIndex >= i + 1).length;
    const value = inStage.reduce((s, o) => s + o.value, 0);
    return {
      stage,
      count: inStage.length,
      value,
      weighted: Math.round(value * stage.probability * 100) / 100,
      conversionToNext: i < STAGES.length - 1 ? (reached === 0 ? undefined : reachedNext / reached) : undefined,
    };
  });
}

export function totals(summary: StageSummary[]) {
  return {
    count: summary.reduce((s, r) => s + r.count, 0),
    pipeline: summary.reduce((s, r) => s + r.value, 0),
    forecast: Math.round(summary.reduce((s, r) => s + r.weighted, 0) * 100) / 100,
  };
}
