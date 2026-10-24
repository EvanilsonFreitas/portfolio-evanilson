import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLine } from './charts.ts';
import { MONTHS, REGIONS, generateOperationsData, seriesByMonth } from './demos/operations.ts';

const x = (i: number) => i * 10;
const y = (v: number) => 100 - v;

test('valores consecutivos geram um único caminho contínuo', () => {
  const g = buildLine([1, 2, 3, 4], x, y);
  assert.equal(g.d, 'M0 99 L10 98 L20 97 L30 96');
  assert.equal((g.d.match(/M/g) ?? []).length, 1);
  assert.deepEqual(g.runs, [{ from: 0, to: 3 }]);
  assert.deepEqual(g.gaps, []);
});

test('um valor ausente segmenta a série e registra a lacuna, sem interpolar', () => {
  const g = buildLine([1, 2, null, 4, 5], x, y);
  assert.equal(g.d, 'M0 99 L10 98 M30 96 L40 95');
  assert.deepEqual(g.runs, [{ from: 0, to: 1 }, { from: 3, to: 4 }]);
  assert.deepEqual(g.gaps, [{ from: 2, to: 2 }]);
  assert.ok(!g.d.includes('20 '), 'nenhum ponto no índice ausente');
});

test('lacunas nas pontas e várias consecutivas', () => {
  const g = buildLine([null, null, 3, null, null, null], x, y);
  assert.equal(g.d, 'M20 97');
  assert.deepEqual(g.gaps, [{ from: 0, to: 1 }, { from: 3, to: 5 }]);
  assert.deepEqual(g.runs, [{ from: 2, to: 2 }]);
});

test('série vazia ou toda ausente não gera caminho', () => {
  assert.equal(buildLine([], x, y).d, '');
  assert.equal(buildLine([null, null], x, y).d, '');
});

test('nos dados da demonstração só o Nordeste tem lacuna, em abril', () => {
  const rows = generateOperationsData();
  const range = { from: MONTHS[0], to: MONTHS[MONTHS.length - 1] };
  for (const region of REGIONS) {
    const values = seriesByMonth(rows, range, region, 'sla').map((p) => p.value);
    const g = buildLine(values, x, (v) => v);
    if (region === 'Nordeste') {
      assert.deepEqual(g.gaps, [{ from: 3, to: 3 }]);
      assert.equal(g.runs.length, 2);
    } else {
      assert.deepEqual(g.gaps, [], `${region} deveria ser contínua`);
      assert.equal((g.d.match(/M/g) ?? []).length, 1);
    }
  }
});

test('o agregado de todas as regiões não tem lacuna (cobertura parcial em abril)', () => {
  const rows = generateOperationsData();
  const values = seriesByMonth(rows, { from: MONTHS[0], to: MONTHS[11] }, 'all', 'sla').map((p) => p.value);
  assert.equal(buildLine(values, x, (v) => v).gaps.length, 0);
});
