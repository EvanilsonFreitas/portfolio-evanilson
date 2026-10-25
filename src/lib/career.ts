import type { CareerPeriod, Employment, EmploymentRole } from '../content/career.ts';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function parse(ym: string): { y: number; m: number } {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(ym);
  if (!match) throw new RangeError(`mês inválido: ${ym}`);
  return { y: Number(match[1]), m: Number(match[2]) };
}

function label(ym: string): string {
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1]} de ${y}`;
}

/** Total de meses, contando o mês inicial e o final. `now` é AAAA-MM (período em andamento). */
export function monthsBetween(period: CareerPeriod, now: string): number {
  const a = parse(period.start);
  const b = parse(period.end ?? now);
  const total = (b.y - a.y) * 12 + (b.m - a.m) + 1;
  if (total < 1) throw new RangeError('o término antecede o início');
  return total;
}

/** "2 anos e 3 meses", "8 meses", "1 ano". */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (rest) parts.push(`${rest} ${rest === 1 ? 'mês' : 'meses'}`);
  return parts.join(' e ');
}

/** "mar de 2021 – out de 2023" ou "mar de 2021 – o momento". */
export function formatPeriod(period: CareerPeriod): string {
  return `${label(period.start)} – ${period.end ? label(period.end) : 'o momento'}`;
}

/**
 * Marco em foco: o que contém a linha de leitura; entre marcos, o mais próximo. Sem marcos, 0.
 */
export function focusIndex(rects: { top: number; bottom: number }[], line: number): number {
  let best = 0;
  let bestDistance = Infinity;
  rects.forEach((r, i) => {
    const distance = line < r.top ? r.top - line : line > r.bottom ? line - r.bottom : 0;
    if (distance < bestDistance) {
      best = i;
      bestDistance = distance;
    }
  });
  return best;
}

const startOf = (r: EmploymentRole) => r.period.start;

/** Cargos do mais recente para o mais antigo (início decrescente; cargos atuais antes dos encerrados em empate). */
export function sortRoles(roles: EmploymentRole[]): EmploymentRole[] {
  return [...roles].sort((a, b) => startOf(b).localeCompare(startOf(a)) || Number(!b.period.end) - Number(!a.period.end));
}

/** Chave de recência de um vínculo: o fim mais recente entre os cargos (cargo atual vale "para sempre"); desempate pelo início mais recente. */
function recency(e: Employment): string {
  const end = e.roles.map((r) => r.period.end ?? '9999-12').sort().at(-1) ?? '';
  const start = e.roles.map(startOf).sort().at(-1) ?? '';
  return `${end}|${start}`;
}

/** Vínculos em ordem cronológica inversa: atuais primeiro; depois pelo término mais recente. */
export function sortEmployment(list: Employment[]): Employment[] {
  return [...list].sort((a, b) => recency(b).localeCompare(recency(a)));
}

/**
 * Meses cobertos por um conjunto de cargos: a união dos períodos. Convenção: contagem inclusiva (o mês
 * inicial e o final contam) e nenhum mês é contado duas vezes, seja por cargos simultâneos, seja por
 * vínculos concomitantes. Lacunas entre períodos não entram na conta.
 */
export function rolesMonths(roles: EmploymentRole[], now: string): number {
  const toIndex = (ym: string) => {
    const { y, m } = parse(ym);
    return y * 12 + (m - 1);
  };
  const spans = roles
    .map((r) => [toIndex(r.period.start), toIndex(r.period.end ?? now)] as const)
    .sort((x, y) => x[0] - y[0]);
  let total = 0;
  let curStart = -1;
  let curEnd = -2;
  for (const [s, f] of spans) {
    if (f < s) throw new RangeError('o término antecede o início');
    if (s > curEnd + 1) {
      if (curEnd >= curStart && curStart >= 0) total += curEnd - curStart + 1;
      curStart = s;
      curEnd = f;
    } else curEnd = Math.max(curEnd, f);
  }
  if (curStart >= 0) total += curEnd - curStart + 1;
  return total;
}

/** Meses de um vínculo (união dos seus cargos). */
export function employmentMonths(e: Employment, now: string): number {
  return rolesMonths(e.roles, now);
}

/** Tempo total de experiência formal: união de todos os períodos de todos os vínculos. */
export function totalMonths(list: Employment[], now: string): number {
  return rolesMonths(list.flatMap((e) => e.roles), now);
}

const idx = (ym: string) => {
  const { y, m } = parse(ym);
  return y * 12 + (m - 1);
};

/**
 * Estrutura temporal de um vínculo: `parallel` se há cargos que coincidem por mais de um mês;
 * `separate` se há lacuna entre períodos (vínculos não contínuos).
 */
export function roleStructure(e: Employment, now: string): { parallel: boolean; separate: boolean } {
  const spans = e.roles.map((r) => [idx(r.period.start), idx(r.period.end ?? now)] as const).sort((x, y) => x[0] - y[0]);
  let parallel = false;
  let separate = false;
  for (let i = 0; i < spans.length; i++) {
    for (let j = i + 1; j < spans.length; j++) {
      const overlap = Math.min(spans[i][1], spans[j][1]) - Math.max(spans[i][0], spans[j][0]) + 1;
      if (overlap > 1) parallel = true;
    }
  }
  let reach = spans[0]?.[1] ?? 0;
  for (const [s, f] of spans.slice(1)) {
    if (s > reach + 1) separate = true;
    reach = Math.max(reach, f);
  }
  return { parallel, separate };
}
