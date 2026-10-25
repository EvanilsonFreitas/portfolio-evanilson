/**
 * Demonstração de normalização de nomes de cidades. Determinística: regras de texto e
 * similaridade por distância de edição, sem aprendizado de máquina. A lista é uma amostra
 * pequena de exemplo e não reproduz a base do IBGE nem seus códigos.
 */

export interface City {
  name: string;
  uf: string;
}

export const SAMPLE_CITIES: City[] = [
  { name: 'São Paulo', uf: 'SP' },
  { name: 'Santos', uf: 'SP' },
  { name: 'Campinas', uf: 'SP' },
  { name: 'São José dos Campos', uf: 'SP' },
  { name: 'Rio de Janeiro', uf: 'RJ' },
  { name: 'Niterói', uf: 'RJ' },
  { name: 'Belo Horizonte', uf: 'MG' },
  { name: 'Uberlândia', uf: 'MG' },
  { name: 'Curitiba', uf: 'PR' },
  { name: 'Londrina', uf: 'PR' },
  { name: 'Porto Alegre', uf: 'RS' },
  { name: 'Salvador', uf: 'BA' },
  { name: 'Recife', uf: 'PE' },
  { name: 'Fortaleza', uf: 'CE' },
  { name: 'Goiânia', uf: 'GO' },
];

export const UF_LIST = [...new Set(SAMPLE_CITIES.map((c) => c.uf))].sort();

/** Limite de aceitação automática; abaixo dele o caso vai para revisão. */
export const ACCEPT_THRESHOLD = 0.85;
/** Diferença mínima entre o melhor e o segundo candidato para não haver empate. */
export const TIE_MARGIN = 0.05;

const ABBREVIATIONS: [RegExp, string][] = [
  [/\bs\b/g, 'sao'],
  [/\bsta\b/g, 'santa'],
  [/\bsto\b/g, 'santo'],
  [/\bdo\b|\bda\b|\bde\b|\bdos\b|\bdas\b/g, ''],
];

export function normalizeText(text: string): string {
  const plain = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ');
  let out = plain;
  for (const [re, to] of ABBREVIATIONS) out = out.replace(re, to);
  return out.replace(/\s+/g, ' ').trim();
}

/** Separa uma UF no fim do texto ("Santos - SP", "Santos/SP", "Santos SP"). */
export function splitUf(text: string): { name: string; uf?: string } {
  const m = text.trim().match(/^(.*?)[\s\-/,]+([A-Za-z]{2})$/);
  if (m && UF_LIST.includes(m[2].toUpperCase())) return { name: m[1], uf: m[2].toUpperCase() };
  return { name: text };
}

export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** Similaridade entre 0 e 1 (1 = idêntico). */
export function similarity(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest === 0 ? 1 : 1 - editDistance(a, b) / longest;
}

export type MatchStatus = 'exata' | 'aproximada' | 'revisao' | 'sem-correspondencia' | 'vazio';

export interface Candidate {
  city: City;
  score: number;
}

export interface MatchResult {
  input: string;
  normalized: string;
  uf?: string;
  status: MatchStatus;
  match?: City;
  score?: number;
  candidates: Candidate[];
  reason: string;
}

export function matchCity(input: string, list: City[] = SAMPLE_CITIES): MatchResult {
  const raw = input.trim();
  if (!raw) return { input, normalized: '', status: 'vazio', candidates: [], reason: 'Digite um nome de cidade.' };

  const { name, uf } = splitUf(raw);
  const normalized = normalizeText(name);
  const pool = uf ? list.filter((c) => c.uf === uf) : list;
  const scored: Candidate[] = pool
    .map((city) => ({ city, score: similarity(normalized, normalizeText(city.name)) }))
    .sort((x, y) => y.score - x.score || x.city.name.localeCompare(y.city.name));
  const candidates = scored.slice(0, 3);
  const best = scored[0];

  if (!best) return { input, normalized, uf, status: 'sem-correspondencia', candidates, reason: 'Nenhuma cidade na UF informada.' };

  if (best.score === 1) {
    const equals = scored.filter((c) => c.score === 1);
    if (equals.length > 1) {
      return { input, normalized, uf, status: 'revisao', candidates, score: 1, reason: 'Mais de uma cidade com o mesmo nome. Informe a UF.' };
    }
    return { input, normalized, uf, status: 'exata', match: best.city, score: 1, candidates, reason: 'Correspondência exata após normalização.' };
  }

  const second = scored[1];
  const tied = second !== undefined && best.score - second.score < TIE_MARGIN;
  if (best.score >= ACCEPT_THRESHOLD && !tied) {
    return { input, normalized, uf, status: 'aproximada', match: best.city, score: best.score, candidates, reason: 'Similaridade acima do limite, sem empate.' };
  }
  if (best.score >= 0.6) {
    return {
      input,
      normalized,
      uf,
      status: 'revisao',
      score: best.score,
      candidates,
      reason: tied ? 'Candidatos muito próximos: exige revisão.' : 'Similaridade abaixo do limite: exige revisão.',
    };
  }
  return { input, normalized, uf, status: 'sem-correspondencia', score: best.score, candidates, reason: 'Nenhum candidato com similaridade suficiente.' };
}

export const statusText: Record<MatchStatus, string> = {
  exata: 'Correspondência exata',
  aproximada: 'Correspondência aproximada aceita',
  revisao: 'Revisão manual',
  'sem-correspondencia': 'Sem correspondência',
  vazio: 'Aguardando entrada',
};

export const EXAMPLES = ['S. Paulo', 'sao jose dos campos', 'Niteroi - RJ', 'Curitba', 'Santos SP', 'Atlântida'];
