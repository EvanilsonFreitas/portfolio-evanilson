/**
 * Construção de caminhos de linha para gráficos SVG.
 * Valores consecutivos geram UM único caminho contínuo (um `M` e vários `L`).
 * Cada `null` encerra o trecho: nunca se interpola entre períodos sem observação.
 */
export interface LineGeometry {
  /** Atributo `d` do path; vazio se não houver nenhum ponto. */
  d: string;
  /** Trechos contínuos: índices inicial e final (inclusive). */
  runs: { from: number; to: number }[];
  /** Intervalos de índices sem dados (lacunas reais), com extremos inclusivos. */
  gaps: { from: number; to: number }[];
}

const fmt = (n: number) => Number(n.toFixed(2)).toString();

export function buildLine(
  values: (number | null)[],
  x: (index: number) => number,
  y: (value: number) => number,
): LineGeometry {
  const runs: LineGeometry['runs'] = [];
  const gaps: LineGeometry['gaps'] = [];
  let d = '';
  let runStart = -1;
  let gapStart = -1;

  values.forEach((v, i) => {
    if (v === null) {
      if (runStart >= 0) {
        runs.push({ from: runStart, to: i - 1 });
        runStart = -1;
      }
      if (gapStart < 0) gapStart = i;
      return;
    }
    if (gapStart >= 0) {
      gaps.push({ from: gapStart, to: i - 1 });
      gapStart = -1;
    }
    d += `${runStart < 0 ? (d ? ' M' : 'M') : ' L'}${fmt(x(i))} ${fmt(y(v))}`;
    if (runStart < 0) runStart = i;
  });

  if (runStart >= 0) runs.push({ from: runStart, to: values.length - 1 });
  if (gapStart >= 0) gaps.push({ from: gapStart, to: values.length - 1 });
  return { d, runs, gaps };
}
