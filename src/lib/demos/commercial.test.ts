import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STAGES, generateOpportunities, summarize, totals } from './commercial.ts';

test('a geração é determinística e respeita a quantidade', () => {
  assert.deepEqual(generateOpportunities(7, 30), generateOpportunities(7, 30));
  assert.equal(generateOpportunities(7, 30).length, 30);
});

test('a soma por estágio fecha com o total de oportunidades', () => {
  const ops = generateOpportunities();
  const t = totals(summarize(ops));
  assert.equal(t.count, ops.length);
  assert.equal(t.pipeline, ops.reduce((s, o) => s + o.value, 0));
});

test('o forecast ponderado é menor que o pipeline e usa a probabilidade do estágio', () => {
  const ops = [
    { id: 1, stageIndex: 0, value: 1000, segment: 'A' },
    { id: 2, stageIndex: 2, value: 1000, segment: 'A' },
  ];
  const t = totals(summarize(ops));
  assert.equal(t.forecast, 1000 * STAGES[0].probability + 1000 * STAGES[2].probability);
  assert.ok(t.forecast < t.pipeline);
});

test('a conversão é razão de contagens entre estágios', () => {
  const ops = [
    { id: 1, stageIndex: 0, value: 1, segment: 'A' },
    { id: 2, stageIndex: 1, value: 1, segment: 'A' },
    { id: 3, stageIndex: 2, value: 1, segment: 'A' },
    { id: 4, stageIndex: 3, value: 1, segment: 'A' },
  ];
  const s = summarize(ops);
  // Chegaram à qualificação: 4; passaram para proposta: 3.
  assert.equal(s[0].conversionToNext, 3 / 4);
  assert.equal(s[3].conversionToNext, undefined);
});

test('o filtro por segmento não altera os demais cálculos', () => {
  const ops = generateOpportunities();
  const seg = ops[0].segment;
  const n = ops.filter((o) => o.segment === seg).length;
  assert.equal(totals(summarize(ops, seg)).count, n);
});
