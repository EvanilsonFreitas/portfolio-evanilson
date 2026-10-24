import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MONTHS,
  REGIONS,
  byRegion,
  filterRows,
  generateOperationsData,
  metricValue,
  previousRange,
  seriesByMonth,
  summarize,
} from './operations.ts';

const rows = generateOperationsData();

test('os dados sintéticos são determinísticos', () => {
  assert.deepEqual(generateOperationsData(), generateOperationsData());
  assert.equal(rows.length, MONTHS.length * REGIONS.length);
});

test('o SLA é a razão das somas, não a média dos percentuais', () => {
  const range = { from: '2025-01', to: '2025-03' };
  const sel = filterRows(rows, range, 'all');
  const s = summarize(sel);
  const sumOnTime = sel.reduce((a, r) => a + (r.onTime ?? 0), 0);
  const sumDeliveries = sel.reduce((a, r) => a + (r.deliveries ?? 0), 0);
  assert.equal(s.sla, sumOnTime / sumDeliveries);
  const avgOfPct = sel.reduce((a, r) => a + (r.onTime! / r.deliveries!), 0) / sel.length;
  assert.notEqual(s.sla, avgOfPct);
});

test('dados ausentes são excluídos das somas e reportados na cobertura', () => {
  const s = summarize(filterRows(rows, { from: '2025-04', to: '2025-04' }, 'Nordeste'));
  assert.equal(s.cellsWithData, 0);
  assert.equal(s.cellsExpected, 1);
  assert.equal(metricValue(s, 'sla'), null);

  const all = summarize(filterRows(rows, { from: '2025-04', to: '2025-04' }, 'all'));
  assert.equal(all.cellsWithData, REGIONS.length - 1);
  assert.equal(all.cellsExpected, REGIONS.length);
});

test('a série mensal mostra lacuna (null) onde não há dados', () => {
  const series = seriesByMonth(rows, { from: '2025-03', to: '2025-05' }, 'Nordeste', 'deliveries');
  assert.equal(series.length, 3);
  assert.equal(series[1].value, null);
  assert.notEqual(series[0].value, null);
});

test('o período anterior tem a mesma duração e termina antes do início', () => {
  assert.deepEqual(previousRange({ from: '2025-07', to: '2025-09' }), { from: '2025-04', to: '2025-06' });
  assert.deepEqual(previousRange({ from: '2025-07', to: '2025-12' }), { from: '2025-01', to: '2025-06' });
  assert.equal(previousRange({ from: '2025-01', to: '2025-03' }), null);
  assert.equal(previousRange({ from: '2025-02', to: '2025-12' }), null);
});

test('a distribuição por região soma o total de entregas do período', () => {
  const range = { from: '2025-01', to: '2025-12' };
  const parts = byRegion(rows, range, 'deliveries').reduce((a, r) => a + (r.value ?? 0), 0);
  assert.equal(parts, summarize(filterRows(rows, range, 'all')).deliveries);
});

test('a demonstração contém uma queda de SLA no Nordeste a investigar', () => {
  const q4 = summarize(filterRows(rows, { from: '2025-10', to: '2025-12' }, 'Nordeste')).sla!;
  const h1 = summarize(filterRows(rows, { from: '2025-01', to: '2025-06' }, 'Nordeste')).sla!;
  assert.ok(q4 < h1 - 0.02);
});
