import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NODE_H, figureEdges, figureNodes, routeEdges } from './figure.ts';

const node = (id: string) => figureNodes.find((n) => n.id === id)!;

function onBorder(p: { x: number; y: number }, n: (typeof figureNodes)[number], side: string) {
  const left = n.cx - n.w / 2;
  const right = n.cx + n.w / 2;
  switch (side) {
    case 'top': return p.y === n.y && p.x >= left && p.x <= right;
    case 'bottom': return p.y === n.y + NODE_H && p.x >= left && p.x <= right;
    case 'left': return p.x === left && p.y >= n.y && p.y <= n.y + NODE_H;
    default: return p.x === right && p.y >= n.y && p.y <= n.y + NODE_H;
  }
}

test('todo conector parte da borda de um nó e termina na borda de outro', () => {
  for (const e of routeEdges()) {
    assert.ok(onBorder(e.start, node(e.from), e.fromSide), `${e.id}: origem fora da borda`);
    assert.ok(onBorder(e.end, node(e.to), e.toSide), `${e.id}: destino fora da borda`);
  }
});

test('o caminho SVG começa na origem e termina exatamente no destino', () => {
  for (const e of routeEdges()) {
    const nums = e.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    assert.deepEqual([nums[0], nums[1]], [e.start.x, e.start.y], `${e.id}: início`);
    // Último comando: V (y final) ou H (x final).
    const last = e.d.trim().split(/(?=[MVH])/).pop()!;
    const v = Number(last.slice(1));
    if (last[0] === 'V') assert.equal(v, e.end.y, `${e.id}: fim em y`);
    if (last[0] === 'H') assert.equal(v, e.end.x, `${e.id}: fim em x`);
  }
});

test('conectores são ortogonais, sem segmentos diagonais', () => {
  for (const e of routeEdges()) assert.match(e.d, /^M[\d.]+ [\d.]+( [VH][\d.]+)+$/, e.id);
});

test('não há conectores duplicados nem nós isolados', () => {
  const pairs = figureEdges.map((e) => `${e.from}>${e.to}`);
  assert.equal(new Set(pairs).size, pairs.length);
  for (const n of figureNodes) {
    assert.ok(figureEdges.some((e) => e.from === n.id || e.to === n.id), `${n.id} sem conexão`);
  }
});

test('os conectores verticais não atravessam outros nós', () => {
  for (const e of routeEdges()) {
    const segs = e.d.match(/[MVH][\d.]+( [\d.]+)?/g)!;
    void segs;
    for (const n of figureNodes) {
      if (n.id === e.from || n.id === e.to) continue;
      const left = n.cx - n.w / 2;
      const right = n.cx + n.w / 2;
      // Trecho vertical final: x = end.x, de y(mid) até end.y; trecho inicial: x = start.x.
      const verticals = [
        { x: e.start.x, y0: e.start.y, y1: (e.start.y + e.end.y) / 2 },
        { x: e.end.x, y0: (e.start.y + e.end.y) / 2, y1: e.end.y },
      ];
      if (e.start.y === e.end.y) continue;
      for (const v of verticals) {
        const lo = Math.min(v.y0, v.y1);
        const hi = Math.max(v.y0, v.y1);
        const crosses = v.x > left && v.x < right && hi > n.y && lo < n.y + NODE_H;
        assert.ok(!crosses, `${e.id} atravessa ${n.id}`);
      }
    }
  }
});
