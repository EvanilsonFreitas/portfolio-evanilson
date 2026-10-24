import { buildLine } from '../../lib/charts';
import { MONTHS, REGIONS, generateOperationsData, seriesByMonth } from '../../lib/demos/operations';

/**
 * Cada projeto tem uma composição própria, desenhada em SVG a partir de conceitos reais do projeto.
 * Nenhuma delas é captura de tela e nenhuma exibe dados de empresas.
 */
const W = 640;
const H = 400;

function Frame({ label, caption, children }: { label: string; caption: string; children: React.ReactNode }) {
  return (
    <figure className="border border-line bg-surface">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-auto w-full text-ink">
        {children}
      </svg>
      <figcaption className="border-t border-line px-4 py-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

/** EasyPrice: a relação preço × margem do modelo cost-plus. */
function PricingVisual() {
  const x0 = 70;
  const x1 = 590;
  const y0 = 330;
  const y1 = 50;
  const mx = (m: number) => x0 + ((m - 0.05) / 0.4) * (x1 - x0);
  const my = (p: number) => y0 - ((p - 1) / 1.15) * (y0 - y1);
  const curve = (f: number) =>
    Array.from({ length: 41 }, (_, i) => {
      const m = 0.05 + (i / 40) * 0.4;
      return `${i === 0 ? 'M' : 'L'}${mx(m).toFixed(1)} ${my(f / (1 - m)).toFixed(1)}`;
    }).join(' ');
  const mk = 0.2;
  return (
    <Frame
      label="Curvas de preço em função da margem-alvo para três cenários de custo"
      caption="Preço = custo ÷ (1 − margem) · modelo cost-plus"
    >
      <g stroke="var(--border)">
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={x0} x2={x1} y1={y1 + i * 93.3} y2={y1 + i * 93.3} />
        ))}
      </g>
      <line x1={x0} x2={x1} y1={y0} y2={y0} stroke="currentColor" />
      <line x1={x0} x2={x0} y1={y1} y2={y0} stroke="currentColor" />
      <path d={curve(1.08)} fill="none" stroke="var(--text-2)" strokeWidth="1.4" strokeDasharray="5 4" />
      <path d={curve(1)} fill="none" stroke="currentColor" strokeWidth="2" />
      <path d={curve(0.96)} fill="none" stroke="var(--text-2)" strokeWidth="1.4" strokeDasharray="1 4" strokeLinecap="round" />
      <line x1={mx(mk)} x2={mx(mk)} y1={y0} y2={my(1 / (1 - mk))} stroke="var(--text)" strokeDasharray="3 3" />
      <circle cx={mx(mk)} cy={my(1 / (1 - mk))} r="6" fill="var(--text)" />
      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-2)">
        <text x={x0} y={y0 + 22}>5%</text>
        <text x={x1 - 22} y={y0 + 22}>45%</text>
        <text x={x0 + 150} y={y0 + 22}>margem-alvo</text>
        <text x="8" y={y1 + 4}>preço</text>
        <text x={mx(mk) + 12} y={my(1 / (1 - mk)) - 8} fill="var(--text)">margem de 20%</text>
        <text x={mx(0.33)} y={my(1.08 / 0.67) - 10}>custo +8%</text>
        <text x={mx(0.33)} y={my(1 / 0.67) - 10}>custo base</text>
        <text x={mx(0.33)} y={my(0.96 / 0.67) + 22}>custo −4%</text>
      </g>
    </Frame>
  );
}

/** Marivan Finance: despesas organizadas por categoria, com um rateio. */
function FinanceVisual() {
  const rows = [0.86, 0.64, 0.5, 0.38, 0.27];
  return (
    <Frame label="Composição abstrata de categorias de despesa e um rateio entre duas partes" caption="Categorias · rateios · comprovantes">
      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-2)">
        <text x="40" y="52">CATEGORIA</text>
        <text x="420" y="52">RATEIO</text>
      </g>
      {rows.map((w, i) => {
        const y = 76 + i * 56;
        return (
          <g key={i}>
            <rect x="40" y={y} width="340" height="16" fill="var(--surface-2)" />
            <rect x="40" y={y} width={340 * w} height="16" fill="currentColor" opacity={i === 0 ? 1 : 0.55} />
            <line x1="40" x2="600" y1={y + 34} y2={y + 34} stroke="var(--border)" />
          </g>
        );
      })}
      <rect x="420" y="76" width="180" height="16" fill="var(--surface-2)" />
      <rect x="420" y="76" width="108" height="16" fill="var(--text)" />
      <path d="M420 108v12h108v-12M528 108v12h72v-12" fill="none" stroke="var(--text-2)" />
      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-2)">
        <text x="460" y="138">60 %</text>
        <text x="552" y="138">40 %</text>
      </g>
      <rect x="420" y="170" width="180" height="104" fill="none" stroke="var(--rule)" strokeDasharray="4 4" />
      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-2)">
        <text x="436" y="226">comprovante</text>
      </g>
    </Frame>
  );
}

/** BI operacional: SLA por região a partir dos dados sintéticos da demonstração. */
function OperationsVisual() {
  const rows = generateOperationsData();
  const range = { from: MONTHS[0], to: MONTHS[MONTHS.length - 1] };
  const x0 = 60;
  const x1 = 600;
  const y0 = 330;
  const y1 = 50;
  const lo = 0.8;
  const hi = 1;
  const mx = (i: number) => x0 + (i / (MONTHS.length - 1)) * (x1 - x0);
  const my = (v: number) => y0 - ((v - lo) / (hi - lo)) * (y0 - y1);
  return (
    <Frame label="SLA mensal por região em dados sintéticos, com queda destacada no Nordeste" caption="SLA por região · dados simulados">
      <g stroke="var(--border)">
        {[0.8, 0.85, 0.9, 0.95, 1].map((v) => (
          <line key={v} x1={x0} x2={x1} y1={my(v)} y2={my(v)} />
        ))}
      </g>
      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-2)">
        {[0.8, 0.9, 1].map((v) => (
          <text key={v} x="8" y={my(v) + 4}>{Math.round(v * 100)}%</text>
        ))}
      </g>
      {REGIONS.map((region) => {
        const s = seriesByMonth(rows, range, region, 'sla');
        const geo = buildLine(s.map((p) => p.value), mx, my);
        const hl = region === 'Nordeste';
        return (
          <g key={region}>
            {hl &&
              geo.gaps.map((g) => (
                <g key={g.from}>
                  <rect x={mx(g.from - 1) + 3} y={y1} width={mx(g.to + 1) - mx(g.from - 1) - 6} height={y0 - y1} fill="var(--surface-2)" />
                  <text x={mx(g.from)} y={y1 + 16} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-2)">sem dados</text>
                </g>
              ))}
            <path
              d={geo.d}
              fill="none"
              stroke={hl ? 'var(--text)' : 'var(--text-2)'}
              strokeWidth={hl ? 2.6 : 1.3}
                            opacity={hl ? 1 : 0.55}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        );
      })}
      <text x={mx(10) - 30} y={my(0.84) + 26} fontFamily="var(--font-mono)" fontSize="12" fill="var(--text)">
        Nordeste
      </text>
    </Frame>
  );
}

export default function ProjectVisual({ slug }: { slug: string }) {
  if (slug === 'simulador-preco-rodoviario') return <PricingVisual />;
  if (slug === 'marivan-finance') return <FinanceVisual />;
  return <OperationsVisual />;
}
