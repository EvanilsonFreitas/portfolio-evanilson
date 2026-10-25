/**
 * Motor de diagramas de fluxo em grade.
 * Nós ocupam células (coluna, linha); conectores são ortogonais e derivados das âncoras
 * dos nós (centro de uma borda), no mesmo sistema de coordenadas. `validateDiagram`
 * verifica origem/destino sobre as bordas, ausência de diagonais e de travessia de nós.
 */
export type Side = 'top' | 'bottom' | 'left' | 'right';
export type RouteKind = 'auto' | 'vhv' | 'hvh' | 'u' | 'ut';

export interface DNode {
  id: string;
  /** Rótulo; use "\n" para quebrar linha. */
  label: string;
  /** Linha pequena em fonte técnica abaixo do rótulo. */
  sub?: string;
  col: number;
  row: number;
  /** Largura em colunas (padrão 1). */
  span?: number;
  /** strong = destaque por inversão; dashed = elemento opcional/condicional. */
  tone?: 'plain' | 'strong' | 'dashed';
}

export interface DEdge {
  from: string;
  to: string;
  fromSide?: Side;
  toSide?: Side;
  route?: RouteKind;
  label?: string;
  dashed?: boolean;
  /** Desloca a âncora de origem/destino ao longo da borda (unidades do diagrama). */
  fromOffset?: number;
  toOffset?: number;
}

export interface Diagram {
  id: string;
  /** Descrição acessível. */
  title: string;
  nodes: DNode[];
  edges: DEdge[];
}

export const CELL_W = 176;
export const CELL_H = 104;
export const NODE_W = 140;
export const NODE_H = 54;
export const PAD = 20;

export interface Rect { x: number; y: number; w: number; h: number }
export interface Point { x: number; y: number }

export function nodeRect(n: DNode): Rect {
  const span = n.span ?? 1;
  const w = NODE_W + (span - 1) * CELL_W;
  return { x: PAD + n.col * CELL_W + (CELL_W - NODE_W) / 2, y: PAD + n.row * CELL_H + (CELL_H - NODE_H) / 2, w, h: NODE_H };
}

export function diagramSize(d: Diagram) {
  const cols = Math.max(...d.nodes.map((n) => n.col + (n.span ?? 1)));
  const rows = Math.max(...d.nodes.map((n) => n.row + 1));
  return { width: PAD * 2 + cols * CELL_W, height: PAD * 2 + rows * CELL_H };
}

export function anchor(r: Rect, side: Side, offset = 0): Point {
  switch (side) {
    case 'top': return { x: r.x + r.w / 2 + offset, y: r.y };
    case 'bottom': return { x: r.x + r.w / 2 + offset, y: r.y + r.h };
    case 'left': return { x: r.x, y: r.y + r.h / 2 + offset };
    case 'right': return { x: r.x + r.w, y: r.y + r.h / 2 + offset };
  }
}

export interface RoutedEdge extends DEdge {
  start: Point;
  end: Point;
  points: Point[];
  d: string;
  label_at?: Point;
}

function defaultSides(a: Rect, b: Rect): [Side, Side] {
  const sameRow = Math.abs(a.y - b.y) < 1;
  const sameCol = Math.abs(a.x + a.w / 2 - (b.x + b.w / 2)) < 1;
  if (sameRow) return a.x < b.x ? ['right', 'left'] : ['left', 'right'];
  if (sameCol) return a.y < b.y ? ['bottom', 'top'] : ['top', 'bottom'];
  return a.y < b.y ? ['bottom', 'top'] : ['top', 'bottom'];
}

export function routeDiagram(d: Diagram): RoutedEdge[] {
  const rect = (id: string) => {
    const n = d.nodes.find((x) => x.id === id);
    if (!n) throw new Error(`Nó inexistente: ${id}`);
    return nodeRect(n);
  };
  return d.edges.map((e) => {
    const a = rect(e.from);
    const b = rect(e.to);
    const [fs, ts] = defaultSides(a, b);
    const fromSide = e.fromSide ?? fs;
    const toSide = e.toSide ?? ts;
    const start = anchor(a, fromSide, e.fromOffset);
    const end = anchor(b, toSide, e.toOffset);
    const kind: RouteKind = e.route ?? 'auto';
    let pts: Point[];
    if (kind === 'ut') {
      const y = Math.min(start.y, end.y) - (CELL_H - NODE_H) / 2 + 2;
      pts = [start, { x: start.x, y }, { x: end.x, y }, end];
    } else if (kind === 'u') {
      const y = Math.max(start.y, end.y) + (CELL_H - NODE_H) / 2 + 2;
      pts = [start, { x: start.x, y }, { x: end.x, y }, end];
    } else if (kind === 'hvh' || (kind === 'auto' && (fromSide === 'left' || fromSide === 'right') && Math.abs(start.y - end.y) > 0.5)) {
      const mx = (start.x + end.x) / 2;
      pts = [start, { x: mx, y: start.y }, { x: mx, y: end.y }, end];
    } else if (Math.abs(start.x - end.x) < 0.5 || Math.abs(start.y - end.y) < 0.5) {
      pts = [start, end];
    } else {
      const my = (start.y + end.y) / 2;
      pts = [start, { x: start.x, y: my }, { x: end.x, y: my }, end];
    }
    const dstr = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${round(p.x)} ${round(p.y)}`).join(' ');
    // Rótulo no ponto médio do segmento mais longo.
    let best = 0;
    let at = pts[0];
    for (let i = 0; i < pts.length - 1; i++) {
      const len = Math.abs(pts[i + 1].x - pts[i].x) + Math.abs(pts[i + 1].y - pts[i].y);
      if (len > best) {
        best = len;
        at = { x: (pts[i].x + pts[i + 1].x) / 2, y: (pts[i].y + pts[i + 1].y) / 2 };
      }
    }
    return { ...e, start, end, points: pts, d: dstr, label_at: at };
  });
}

const round = (n: number) => Math.round(n * 100) / 100;

function onBorder(p: Point, r: Rect) {
  const eps = 0.01;
  const inX = p.x >= r.x - eps && p.x <= r.x + r.w + eps;
  const inY = p.y >= r.y - eps && p.y <= r.y + r.h + eps;
  return (
    (inX && (Math.abs(p.y - r.y) < eps || Math.abs(p.y - (r.y + r.h)) < eps)) ||
    (inY && (Math.abs(p.x - r.x) < eps || Math.abs(p.x - (r.x + r.w)) < eps))
  );
}

function segmentCrossesRect(a: Point, b: Point, r: Rect) {
  const x0 = Math.min(a.x, b.x);
  const x1 = Math.max(a.x, b.x);
  const y0 = Math.min(a.y, b.y);
  const y1 = Math.max(a.y, b.y);
  return x1 > r.x + 0.5 && x0 < r.x + r.w - 0.5 && y1 > r.y + 0.5 && y0 < r.y + r.h - 0.5;
}

/** Retorna a lista de problemas geométricos (vazia = diagrama válido). */
export function validateDiagram(d: Diagram): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const cells = new Set<string>();
  for (const n of d.nodes) {
    if (ids.has(n.id)) problems.push(`id duplicado: ${n.id}`);
    ids.add(n.id);
    for (let c = n.col; c < n.col + (n.span ?? 1); c++) {
      const k = `${c},${n.row}`;
      if (cells.has(k)) problems.push(`células sobrepostas em ${k}`);
      cells.add(k);
    }
  }
  for (const e of routeDiagram(d)) {
    const name = `${e.from}→${e.to}`;
    const a = nodeRect(d.nodes.find((n) => n.id === e.from)!);
    const b = nodeRect(d.nodes.find((n) => n.id === e.to)!);
    if (!onBorder(e.start, a)) problems.push(`${name}: origem fora da borda`);
    if (!onBorder(e.end, b)) problems.push(`${name}: destino fora da borda`);
    for (let i = 0; i < e.points.length - 1; i++) {
      const p = e.points[i];
      const q = e.points[i + 1];
      if (Math.abs(p.x - q.x) > 0.01 && Math.abs(p.y - q.y) > 0.01) problems.push(`${name}: segmento diagonal`);
      for (const n of d.nodes) {
        if (n.id === e.from || n.id === e.to) continue;
        if (segmentCrossesRect(p, q, nodeRect(n))) problems.push(`${name}: atravessa ${n.id}`);
      }
    }
  }
  return problems;
}
