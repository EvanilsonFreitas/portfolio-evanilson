/**
 * Geometria da figura do hero (Fontes → Modelo → Aplicação → Decisão).
 * Nós e conectores derivam da mesma estrutura; cada conector declara origem e destino
 * e suas extremidades são calculadas sobre as bordas dos nós.
 */
export interface FigureNode {
  id: string;
  label: string;
  cx: number;
  y: number;
  w: number;
  invert?: boolean;
}

export const NODE_H = 34;

export const figureNodes: FigureNode[] = [
  { id: 'sistemas', label: 'Sistemas', cx: 180, y: 28, w: 88 },
  { id: 'planilhas', label: 'Planilhas', cx: 280, y: 28, w: 88 },
  { id: 'apis', label: 'APIs', cx: 380, y: 28, w: 88 },
  { id: 'modelo', label: 'Modelo dimensional', cx: 280, y: 128, w: 188 },
  { id: 'api', label: 'API', cx: 230, y: 228, w: 88 },
  { id: 'interface', label: 'Interface', cx: 330, y: 228, w: 88 },
  { id: 'indicador', label: 'Indicador', cx: 330, y: 328, w: 108, invert: true },
];

export const figureLayers = [
  { label: 'FONTES', y: 28 },
  { label: 'MODELO', y: 128 },
  { label: 'APLICAÇÃO', y: 228 },
  { label: 'DECISÃO', y: 328 },
];

type Side = 'top' | 'bottom' | 'left' | 'right';
interface Point { x: number; y: number }

export interface FigureEdge {
  id: string;
  from: string;
  to: string;
  fromSide: Side;
  toSide: Side;
  /** Deslocamento horizontal da âncora no nó de destino (distribui chegadas na mesma borda). */
  toOffset?: number;
  fromOffset?: number;
}

export const figureEdges: FigureEdge[] = [
  { id: 'sistemas-modelo', from: 'sistemas', to: 'modelo', fromSide: 'bottom', toSide: 'top', toOffset: -60 },
  { id: 'planilhas-modelo', from: 'planilhas', to: 'modelo', fromSide: 'bottom', toSide: 'top' },
  { id: 'apis-modelo', from: 'apis', to: 'modelo', fromSide: 'bottom', toSide: 'top', toOffset: 60 },
  { id: 'modelo-api', from: 'modelo', to: 'api', fromSide: 'bottom', toSide: 'top', fromOffset: -50 },
  { id: 'api-interface', from: 'api', to: 'interface', fromSide: 'right', toSide: 'left' },
  { id: 'interface-indicador', from: 'interface', to: 'indicador', fromSide: 'bottom', toSide: 'top' },
];

const byId = (id: string) => {
  const n = figureNodes.find((x) => x.id === id);
  if (!n) throw new Error(`Nó inexistente: ${id}`);
  return n;
};

export function anchor(node: FigureNode, side: Side, offset = 0): Point {
  switch (side) {
    case 'top': return { x: node.cx + offset, y: node.y };
    case 'bottom': return { x: node.cx + offset, y: node.y + NODE_H };
    case 'left': return { x: node.cx - node.w / 2, y: node.y + NODE_H / 2 + offset };
    case 'right': return { x: node.cx + node.w / 2, y: node.y + NODE_H / 2 + offset };
  }
}

export interface RoutedEdge extends FigureEdge {
  start: Point;
  end: Point;
  d: string;
}

/** Roteamento ortogonal: horizontal direto, vertical reto ou com barramento intermediário. */
export function routeEdges(): RoutedEdge[] {
  return figureEdges.map((e) => {
    const start = anchor(byId(e.from), e.fromSide, e.fromOffset);
    const end = anchor(byId(e.to), e.toSide, e.toOffset);
    let d: string;
    if (start.y === end.y) d = `M${start.x} ${start.y} H${end.x}`;
    else if (start.x === end.x) d = `M${start.x} ${start.y} V${end.y}`;
    else {
      const mid = (start.y + end.y) / 2;
      d = `M${start.x} ${start.y} V${mid} H${end.x} V${end.y}`;
    }
    return { ...e, start, end, d };
  });
}
