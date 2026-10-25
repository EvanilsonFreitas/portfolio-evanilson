import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagrams } from '../content/diagrams.ts';
import { diagramSize, nodeRect, routeDiagram, validateDiagram } from './diagram.ts';

for (const [id, d] of Object.entries(diagrams)) {
  test(`diagrama "${id}": conectores ancorados nas bordas, ortogonais e sem atravessar nós`, () => {
    assert.deepEqual(validateDiagram(d), []);
  });

  test(`diagrama "${id}": todos os nós participam de ao menos um conector e cabem no desenho`, () => {
    const { width, height } = diagramSize(d);
    for (const n of d.nodes) {
      assert.ok(d.edges.some((e) => e.from === n.id || e.to === n.id), `${n.id} sem conexão`);
      const r = nodeRect(n);
      assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.w <= width && r.y + r.h <= height, `${n.id} fora da área`);
    }
    for (const e of routeDiagram(d)) {
      for (const p of e.points) assert.ok(p.x >= 0 && p.y >= 0 && p.x <= width && p.y <= height, `${e.from}→${e.to} sai da área`);
    }
  });
}

test('o validador detecta conector que atravessa um nó', () => {
  const bad = {
    id: 'x',
    title: 'x',
    nodes: [
      { id: 'a', label: 'A', col: 0, row: 0 },
      { id: 'b', label: 'B', col: 1, row: 0 },
      { id: 'c', label: 'C', col: 2, row: 0 },
    ],
    edges: [{ from: 'a', to: 'c' }],
  };
  assert.ok(validateDiagram(bad).some((p) => p.includes('atravessa b')));
});
