import type { CatalogEntry } from '../content/catalog.ts';
import { categories, categoryLabel, solutionTypeLabel, solutionTypes, technologies, techLabel } from '../content/taxonomy.ts';
import type { CategoryId, SolutionTypeId, TechId } from '../content/taxonomy.ts';

/** Filtros do catálogo. `all` não restringe. A busca combina todos os termos digitados. */
export interface CatalogFilters {
  query: string;
  category: CategoryId | 'all';
  tech: TechId | 'all';
  type: SolutionTypeId | 'all';
}

export const emptyFilters: CatalogFilters = { query: '', category: 'all', tech: 'all', type: 'all' };

/** Minúsculas, sem acentos e com espaços normalizados, para comparar texto digitado em pt-BR. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function haystack(e: CatalogEntry): string {
  return normalizeText(
    [
      e.title,
      e.crumb,
      e.summary,
      ...e.aliases,
      categoryLabel(e.category),
      ...e.types.map(solutionTypeLabel),
      ...e.tech.map(techLabel),
      e.natureLabel,
    ].join(' '),
  );
}

export function matchesQuery(entry: CatalogEntry, query: string): boolean {
  const terms = normalizeText(query).split(' ').filter(Boolean);
  if (terms.length === 0) return true;
  const text = haystack(entry);
  return terms.every((t) => text.includes(t));
}

export function filterCatalog(entries: CatalogEntry[], f: CatalogFilters): CatalogEntry[] {
  return entries.filter(
    (e) =>
      (f.category === 'all' || e.category === f.category) &&
      (f.tech === 'all' || e.tech.includes(f.tech)) &&
      (f.type === 'all' || e.types.includes(f.type)) &&
      matchesQuery(e, f.query),
  );
}

export function isFiltering(f: CatalogFilters): boolean {
  return f.query.trim() !== '' || f.category !== 'all' || f.tech !== 'all' || f.type !== 'all';
}

/** Quantidade de resultados por valor de um filtro, considerando os demais filtros já aplicados. */
export function countByCategory(entries: CatalogEntry[], f: CatalogFilters): Map<CategoryId, number> {
  const rest = filterCatalog(entries, { ...f, category: 'all' });
  const out = new Map<CategoryId, number>();
  for (const e of rest) out.set(e.category, (out.get(e.category) ?? 0) + 1);
  return out;
}

/** Itens para "Ver também": as referências explícitas, completadas com a mesma categoria. */
export function relatedEntries(entries: CatalogEntry[], slug: string, explicit: string[] = [], max = 4): CatalogEntry[] {
  const bySlug = new Map(entries.map((e) => [e.slug, e]));
  const self = bySlug.get(slug);
  const out: CatalogEntry[] = [];
  const add = (e?: CatalogEntry) => {
    if (e && e.slug !== slug && !out.includes(e) && out.length < max) out.push(e);
  };
  for (const s of explicit) add(bySlug.get(s));
  if (self) for (const e of entries) if (e.category === self.category) add(e);
  return out;
}

const CATEGORY_IDS = new Set<string>(categories.map((c) => c.id));
const TECH_IDS = new Set<string>(technologies.map((t) => t.id));
const TYPE_IDS = new Set<string>(solutionTypes.map((t) => t.id));

/** Lê filtros de uma query string (`?q=&categoria=&tecnologia=&tipo=`), ignorando valores inválidos. */
export function parseFilters(search: string): CatalogFilters {
  const params = new URLSearchParams(search);
  const pick = <T extends string>(name: string, valid: Set<string>): T | 'all' => {
    const v = params.get(name) ?? '';
    return valid.has(v) ? (v as T) : 'all';
  };
  return {
    query: (params.get('q') ?? '').slice(0, 80),
    category: pick<CategoryId>('categoria', CATEGORY_IDS),
    tech: pick<TechId>('tecnologia', TECH_IDS),
    type: pick<SolutionTypeId>('tipo', TYPE_IDS),
  };
}

/** Inverso de `parseFilters`; vazio quando não há filtros. */
export function serializeFilters(f: CatalogFilters): string {
  const params = new URLSearchParams();
  if (f.query.trim()) params.set('q', f.query.trim());
  if (f.category !== 'all') params.set('categoria', f.category);
  if (f.tech !== 'all') params.set('tecnologia', f.tech);
  if (f.type !== 'all') params.set('tipo', f.type);
  return params.toString();
}
