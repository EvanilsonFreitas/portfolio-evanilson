import { NODE_H, figureLayers, figureNodes, routeEdges } from '../../lib/figure';

/** Figura técnica do hero: do dado à decisão. A geometria vem de `lib/figure` (testada). */
export default function HeroFigure() {
  const edges = routeEdges();
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 460 392"
        role="img"
        aria-label="Diagrama em quatro camadas: fontes (sistemas, planilhas e APIs) alimentam um modelo dimensional, que sustenta uma API e uma interface, que produzem o indicador de decisão"
        className="h-auto w-full text-ink"
      >
        <defs>
          <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--text-2)" />
          </marker>
        </defs>

        {figureLayers.map((l) => (
          <g key={l.label}>
            <line x1="0" x2="460" y1={l.y - 14} y2={l.y - 14} stroke="var(--border)" strokeWidth="1" />
            <text x="0" y={l.y + 21} fontSize="11" letterSpacing="1.2" fill="var(--text-2)" fontFamily="var(--font-mono)">
              {l.label}
            </text>
          </g>
        ))}

        <g fill="none" stroke="var(--text-2)" strokeWidth="1.25" strokeLinejoin="miter">
          {edges.map((e) => (
            <path key={e.id} d={e.d} markerEnd="url(#seta)" />
          ))}
        </g>

        {figureNodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.cx - n.w / 2}
              y={n.y}
              width={n.w}
              height={NODE_H}
              rx="2"
              fill={n.invert ? 'var(--text)' : 'var(--surface)'}
              stroke="var(--text)"
              strokeWidth="1.25"
            />
            <text
              x={n.cx}
              y={n.y + NODE_H / 2 + 4.5}
              textAnchor="middle"
              fontSize="13"
              fontWeight={n.invert ? 600 : 500}
              fill={n.invert ? 'var(--bg)' : 'var(--text)'}
              fontFamily="var(--font-sans)"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="eyebrow mt-3">Fig. 1 — Do dado à decisão</figcaption>
    </figure>
  );
}
