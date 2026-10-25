import { diagrams, type DiagramId } from '../../content/diagrams';
import { NODE_H, diagramSize, nodeRect, routeDiagram } from '../../lib/diagram';

/**
 * Diagrama de fluxo em SVG. Geometria calculada em `lib/diagram` (validada por testes).
 * Em telas estreitas o desenho mantém a escala legível e rola horizontalmente.
 */
export default function Flow({ id, caption }: { id: DiagramId; caption: string }) {
  const d = diagrams[id];
  const { width, height } = diagramSize(d);
  const edges = routeDiagram(d);
  const mid = `seta-${id}`;

  return (
    <figure>
      <div className="overflow-x-auto border border-line bg-surface" tabIndex={0} role="region" aria-label={`${d.title}. Rolável na horizontal em telas pequenas.`}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={d.title} className="block h-auto w-full min-w-[600px] text-ink">
          <defs>
            <marker id={mid} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--text-2)" />
            </marker>
          </defs>

          <g fill="none" stroke="var(--text-2)" strokeWidth="1.4" strokeLinejoin="miter">
            {edges.map((e) => (
              <path key={`${e.from}-${e.to}`} d={e.d} strokeDasharray={e.dashed ? '5 4' : undefined} markerEnd={`url(#${mid})`} />
            ))}
          </g>

          {edges.map((e) =>
            e.label && e.label_at ? (
              <text
                key={`l-${e.from}-${e.to}`}
                x={e.label_at.x}
                y={e.label_at.y - 6}
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill="var(--text-2)"
                stroke="var(--surface)"
                strokeWidth="5"
                paintOrder="stroke"
              >
                {e.label}
              </text>
            ) : null,
          )}

          {d.nodes.map((n) => {
            const r = nodeRect(n);
            const lines = n.label.split('\n');
            const strong = n.tone === 'strong';
            const lineH = 15;
            const hasSub = Boolean(n.sub);
            const total = lines.length * lineH + (hasSub ? 14 : 0);
            const y0 = r.y + (NODE_H - total) / 2 + 12;
            return (
              <g key={n.id}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx="2"
                  fill={strong ? 'var(--text)' : 'var(--bg)'}
                  stroke="var(--text)"
                  strokeWidth="1.3"
                  strokeDasharray={n.tone === 'dashed' ? '5 4' : undefined}
                />
                {lines.map((l, i) => (
                  <text
                    key={i}
                    x={r.x + r.w / 2}
                    y={y0 + i * lineH}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight={strong ? 600 : 500}
                    fill={strong ? 'var(--bg)' : 'var(--text)'}
                    fontFamily="var(--font-sans)"
                  >
                    {l}
                  </text>
                ))}
                {n.sub && (
                  <text
                    x={r.x + r.w / 2}
                    y={y0 + lines.length * lineH - 1}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontFamily="var(--font-mono)"
                    fill={strong ? 'var(--bg)' : 'var(--text-2)'}
                    opacity={strong ? 0.85 : 1}
                  >
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="eyebrow mt-3">{caption}</figcaption>
    </figure>
  );
}
