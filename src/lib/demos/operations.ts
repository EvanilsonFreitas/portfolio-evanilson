import { mulberry32 } from './prng.ts';

/**
 * Dados SINTÉTICOS de uma operação logística fictícia.
 * Origem: gerador determinístico (semente fixa) com sazonalidade, tendência e ruído.
 * Grão: uma linha por região e mês. Não representa nenhuma empresa real.
 */
export const REGIONS = ['Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste'] as const;
export type Region = (typeof REGIONS)[number];
export type RegionFilter = Region | 'all';

export const MONTHS = Array.from({ length: 12 }, (_, i) => `2025-${String(i + 1).padStart(2, '0')}`);

export interface MonthRow {
  month: string;
  region: Region;
  deliveries: number | null;
  onTime: number | null;
  incidents: number | null;
  volumeTon: number | null;
}

export type MetricId = 'deliveries' | 'sla' | 'incidents' | 'volume';

export const METRICS: Record<MetricId, { label: string; unit: string }> = {
  deliveries: { label: 'Entregas', unit: 'entregas' },
  sla: { label: 'SLA (no prazo)', unit: '%' },
  incidents: { label: 'Ocorrências por mil entregas', unit: 'por mil' },
  volume: { label: 'Volume transportado', unit: 't' },
};

const BASE: Record<Region, { deliveries: number; sla: number; incidents: number; tons: number }> = {
  Sudeste: { deliveries: 5200, sla: 0.94, incidents: 12, tons: 0.9 },
  Sul: { deliveries: 2300, sla: 0.955, incidents: 10, tons: 1.05 },
  Nordeste: { deliveries: 1800, sla: 0.915, incidents: 17, tons: 0.85 },
  'Centro-Oeste': { deliveries: 1200, sla: 0.93, incidents: 14, tons: 1.2 },
};

/** Região e meses com queda de SLA, para dar à demonstração uma pergunta a investigar. */
const DIP: Partial<Record<Region, Record<number, number>>> = {
  Nordeste: { 9: -0.045, 10: -0.07, 11: -0.03 },
  Sudeste: { 7: -0.02 },
};

export function generateOperationsData(seed = 20250101): MonthRow[] {
  const rand = mulberry32(seed);
  const rows: MonthRow[] = [];
  MONTHS.forEach((month, m) => {
    for (const region of REGIONS) {
      const b = BASE[region];
      const season = 1 + 0.12 * Math.sin(((m - 2) / 12) * 2 * Math.PI);
      const trend = 1 + 0.006 * m;
      const deliveries = Math.round(b.deliveries * season * trend * (1 + (rand() - 0.5) * 0.06));
      const slaRaw = b.sla + (DIP[region]?.[m] ?? 0) + (rand() - 0.5) * 0.02;
      const sla = Math.min(0.995, Math.max(0.7, slaRaw));
      const onTime = Math.round(deliveries * sla);
      const incidentRate = b.incidents * (1 + (0.95 - sla) * 6) * (1 + (rand() - 0.5) * 0.1);
      const incidents = Math.round((deliveries * incidentRate) / 1000);
      const volumeTon = Math.round(deliveries * b.tons * (1 + (rand() - 0.5) * 0.04));
      const missing = region === 'Nordeste' && month === '2025-04';
      rows.push(
        missing
          ? { month, region, deliveries: null, onTime: null, incidents: null, volumeTon: null }
          : { month, region, deliveries, onTime, incidents, volumeTon },
      );
    }
  });
  return rows;
}

export interface Range {
  from: string;
  to: string;
}

export interface Summary {
  deliveries: number;
  onTime: number;
  incidents: number;
  volumeTon: number;
  /** Razão de somas (entregas no prazo ÷ entregas). null sem dados. */
  sla: number | null;
  incidentsPerThousand: number | null;
  cellsWithData: number;
  cellsExpected: number;
}

export function filterRows(rows: MonthRow[], range: Range, region: RegionFilter): MonthRow[] {
  return rows.filter((r) => r.month >= range.from && r.month <= range.to && (region === 'all' || r.region === region));
}

export function summarize(rows: MonthRow[]): Summary {
  let deliveries = 0;
  let onTime = 0;
  let incidents = 0;
  let volumeTon = 0;
  let cellsWithData = 0;
  for (const r of rows) {
    if (r.deliveries === null || r.onTime === null || r.incidents === null || r.volumeTon === null) continue;
    deliveries += r.deliveries;
    onTime += r.onTime;
    incidents += r.incidents;
    volumeTon += r.volumeTon;
    cellsWithData += 1;
  }
  return {
    deliveries,
    onTime,
    incidents,
    volumeTon,
    sla: deliveries > 0 ? onTime / deliveries : null,
    incidentsPerThousand: deliveries > 0 ? (incidents / deliveries) * 1000 : null,
    cellsWithData,
    cellsExpected: rows.length,
  };
}

export function metricValue(s: Summary, metric: MetricId): number | null {
  if (s.cellsWithData === 0) return null;
  switch (metric) {
    case 'deliveries':
      return s.deliveries;
    case 'sla':
      return s.sla;
    case 'incidents':
      return s.incidentsPerThousand;
    case 'volume':
      return s.volumeTon;
  }
}

/** Período imediatamente anterior, com a mesma duração. null se não houver meses suficientes. */
export function previousRange(range: Range): Range | null {
  const a = MONTHS.indexOf(range.from);
  const b = MONTHS.indexOf(range.to);
  if (a < 0 || b < a) return null;
  const length = b - a + 1;
  const start = a - length;
  if (start < 0) return null;
  return { from: MONTHS[start], to: MONTHS[a - 1] };
}

export function seriesByMonth(rows: MonthRow[], range: Range, region: RegionFilter, metric: MetricId) {
  const a = MONTHS.indexOf(range.from);
  const b = MONTHS.indexOf(range.to);
  return MONTHS.slice(a, b + 1).map((month) => ({
    month,
    value: metricValue(summarize(filterRows(rows, { from: month, to: month }, region)), metric),
  }));
}

export function byRegion(rows: MonthRow[], range: Range, metric: MetricId) {
  return REGIONS.map((region) => ({
    region,
    value: metricValue(summarize(filterRows(rows, range, region)), metric),
  }));
}

const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export function monthLabel(month: string): string {
  const [y, m] = month.split('-');
  return `${MONTH_NAMES[Number(m) - 1]}/${y.slice(2)}`;
}
