'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { buildLine } from '../../lib/charts';

export interface LineSeries {
  id: string;
  label: string;
  values: (number | null)[];
  tone: 'ink' | 'muted' | 'accent';
  /** Traço (stroke-dasharray). Diferencia séries além da cor. */
  dash?: string;
}

interface Props {
  xLabels: string[];
  series: LineSeries[];
  format: (n: number) => string;
  ariaLabel: string;
  /** Eixo Y parte do zero (contagens). Para razões, o eixo se ajusta aos dados. */
  zeroBased?: boolean;
  height?: number;
  /** Índice destacado por uma guia vertical (ex.: valor escolhido no controle). */
  highlightIndex?: number;
  xTitle?: string;
}

const M = { top: 14, right: 14, bottom: 30, left: 58 };
const TONE = { ink: 'var(--text)', muted: 'var(--text-2)', accent: 'var(--accent)' } as const;

function niceTicks(min: number, max: number, count = 4) {
  if (min === max) return [min];
  const span = max - min;
  const raw = span / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.001; v += step) ticks.push(Number(v.toFixed(10)));
  return ticks;
}

export default function LineChart({ xLabels, series, format, ariaLabel, zeroBased = false, height = 280, highlightIndex, xTitle }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<number | null>(null);
  const width = measured ?? 640;
  const [active, setActive] = useState<number | null>(null);
  const descId = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setMeasured(Math.max(240, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = xLabels.length;
  const innerW = width - M.left - M.right;
  const innerH = height - M.top - M.bottom;
  const all = series.flatMap((s) => s.values).filter((v): v is number => v !== null);
  const dataMin = all.length ? Math.min(...all) : 0;
  const dataMax = all.length ? Math.max(...all) : 1;
  const pad = (dataMax - dataMin || Math.abs(dataMax) || 1) * 0.12;
  const lo = zeroBased ? 0 : dataMin - pad;
  const hi = dataMax + pad;
  const ticks = niceTicks(lo, hi);
  const yMin = Math.min(lo, ticks[0]);
  const yMax = Math.max(hi, ticks[ticks.length - 1]);
  const x = (i: number) => M.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => M.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  const labelStep = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 56))));

  const geoms = series.map((s) => buildLine(s.values, x, y));
  /** Lacunas reais comuns a todas as séries: faixa e rótulo explícitos. */
  const sharedGaps = geoms.length ? geoms[0].gaps.filter((g) => geoms.every((m) => m.gaps.some((h) => h.from <= g.from && h.to >= g.to))) : [];

  const moveTo = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rel = clientX - rect.left - M.left;
    const idx = Math.round((rel / innerW) * (n - 1));
    setActive(Math.min(n - 1, Math.max(0, idx)));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
    else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? n) - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(n - 1);
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const readout =
    active === null
      ? ''
      : `${xLabels[active]}. ${series.map((s) => `${s.label}: ${s.values[active] === null ? 'sem dados' : format(s.values[active] as number)}`).join('. ')}.`;

  const tipLeft = active === null ? 0 : x(active);
  const flip = tipLeft > width * 0.6;

  return (
    <div>
      <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Legenda">
        {series.map((s) => (
          <li key={s.id} className="inline-flex items-center gap-2">
            <svg width="28" height="8" aria-hidden="true">
              <line x1="0" x2="28" y1="4" y2="4" stroke={TONE[s.tone]} strokeWidth="2" strokeDasharray={s.dash} />
            </svg>
            {s.label}
          </li>
        ))}
      </ul>

      <div
        ref={wrapRef}
        className="relative min-w-0 touch-pan-y outline-offset-4"
        tabIndex={0}
        role="group"
        aria-label={`${ariaLabel}. Use as setas para percorrer os pontos.`}
        aria-describedby={descId}
        onPointerMove={(e) => moveTo(e.clientX)}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <svg width={measured ?? '100%'} height={measured ? height : undefined} viewBox={`0 0 ${width} ${height}`} className="block max-w-full overflow-visible" aria-hidden="true">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke="var(--border)" />
              <text x={M.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--text-2)" fontFamily="var(--font-mono)">
                {format(t)}
              </text>
            </g>
          ))}
          {xLabels.map((l, i) =>
            i % labelStep === 0 ? (
              <text key={l + i} x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="var(--font-mono)">
                {l}
              </text>
            ) : null,
          )}

          {sharedGaps.map((g) => {
            const x0 = x(Math.max(0, g.from - 1)) + 2;
            const x1 = x(Math.min(n - 1, g.to + 1)) - 2;
            return (
              <g key={g.from}>
                <rect x={x0} y={M.top} width={Math.max(0, x1 - x0)} height={innerH} fill="var(--surface-2)" opacity="0.7" />
                <text x={(x0 + x1) / 2} y={M.top + 14} textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="var(--font-mono)">sem dados</text>
              </g>
            );
          })}

          {highlightIndex !== undefined && highlightIndex >= 0 && highlightIndex < n && (
            <line x1={x(highlightIndex)} x2={x(highlightIndex)} y1={M.top} y2={M.top + innerH} stroke="var(--accent)" strokeDasharray="3 3" />
          )}

          {series.map((s, si) => (
            <g key={s.id}>
              <path d={geoms[si].d} fill="none" stroke={TONE[s.tone]} strokeWidth={s.tone === 'ink' || s.tone === 'accent' ? 2.2 : 1.6} strokeDasharray={s.dash} strokeLinejoin="round" strokeLinecap="round" />
              {s.values.map((v, i) =>
                v === null ? (
                  <text key={i} x={x(i)} y={M.top + innerH - 4} textAnchor="middle" fontSize="12" fill="var(--text-2)">
                    ×
                  </text>
                ) : n <= 14 || highlightIndex === i ? (
                  <circle key={i} cx={x(i)} cy={y(v)} r={highlightIndex === i ? 4.5 : 2.6} fill={highlightIndex === i ? 'var(--accent)' : 'var(--surface)'} stroke={TONE[s.tone]} strokeWidth="1.5" />
                ) : null,
              )}
            </g>
          ))}

          {active !== null && (
            <>
              <line x1={x(active)} x2={x(active)} y1={M.top} y2={M.top + innerH} stroke="var(--text-2)" />
              {series.map((s) =>
                s.values[active] === null ? null : (
                  <circle key={s.id} cx={x(active)} cy={y(s.values[active] as number)} r="5" fill={TONE[s.tone]} stroke="var(--surface)" strokeWidth="2" />
                ),
              )}
            </>
          )}
        </svg>

        {active !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 z-10 min-w-40 border border-line bg-surface px-3 py-2 text-[0.8125rem] shadow-sm"
            style={{ left: flip ? undefined : tipLeft + 12, right: flip ? width - tipLeft + 12 : undefined }}
          >
            <p className="mono mb-1 text-muted">{xTitle ? `${xTitle} ${xLabels[active]}` : xLabels[active]}</p>
            {series.map((s) => (
              <p key={s.id} className="flex justify-between gap-4">
                <span className="text-muted">{s.label}</span>
                <span className="mono font-medium">{s.values[active] === null ? 'sem dados' : format(s.values[active] as number)}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      <p id={descId} className="sr-only" aria-live="polite">
        {readout}
      </p>
    </div>
  );
}
