import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_PRICING,
  MARGIN_RANGE,
  SCENARIOS,
  compareScenarios,
  markupFromMargin,
  priceFromCost,
  sensitivity,
  simulate,
} from './pricing.ts';

test('preço = custo ÷ (1 − margem)', () => {
  assert.equal(priceFromCost(1000, 0.2), 1250);
  assert.equal(priceFromCost(900, 0.1), 1000);
});

test('a margem efetiva sobre o preço é igual à margem-alvo', () => {
  const r = simulate({ baseCost: 4200, targetMargin: 0.18, volume: 120 }, SCENARIOS[1]);
  assert.ok(Math.abs(r.unitProfit / r.price - 0.18) < 0.001);
});

test('markup = margem ÷ (1 − margem)', () => {
  assert.equal(markupFromMargin(0.2), 0.25);
  assert.equal(markupFromMargin(0), 0);
});

test('margens inválidas e custo negativo são rejeitados', () => {
  assert.throws(() => priceFromCost(100, 1), RangeError);
  assert.throws(() => priceFromCost(100, -0.1), RangeError);
  assert.throws(() => priceFromCost(-1, 0.1), RangeError);
});

test('os cenários mantêm a ordem esperada de preço', () => {
  const [pressured, base, efficient] = compareScenarios(DEFAULT_PRICING);
  assert.ok(pressured.price > base.price);
  assert.ok(base.price > efficient.price);
});

test('receita e resultado mensal derivam de preço, custo e volume', () => {
  const r = simulate(DEFAULT_PRICING, SCENARIOS[1]);
  assert.equal(r.monthlyRevenue, Math.round(r.price * r.volume * 100) / 100);
  assert.equal(r.monthlyProfit, Math.round((r.price - r.cost) * r.volume * 100) / 100);
});

test('a sensibilidade cresce com a margem em todos os cenários', () => {
  for (const s of sensitivity(DEFAULT_PRICING, MARGIN_RANGE)) {
    for (let i = 1; i < s.points.length; i++) assert.ok(s.points[i].price > s.points[i - 1].price);
  }
});
