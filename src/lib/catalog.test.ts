import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../content/catalog.ts';
import type { CatalogEntry } from '../content/catalog.ts';
import {
  countByCategory,
  emptyFilters,
  filterCatalog,
  isFiltering,
  matchesQuery,
  normalizeText,
  parseFilters,
  relatedEntries,
  serializeFilters,
} from './catalog.ts';

const bySlug = (slug: string): CatalogEntry => catalog.find((e) => e.slug === slug)!;
const slugsOf = (list: CatalogEntry[]): string[] => list.map((e) => e.slug);

test('a normalização ignora acentos, caixa e pontuação', () => {
  assert.equal(normalizeText('  Gestão   de Coletas — LR! '), 'gestao de coletas lr');
  assert.equal(normalizeText('SQL / Engenharia'), 'sql engenharia');
});

test('a busca encontra por nome, apelido, tecnologia e categoria, sem depender de acentos', () => {
  assert.ok(matchesQuery(bySlug('simulador-preco-rodoviario'), 'easyprice'));
  assert.ok(matchesQuery(bySlug('consolidado-ranking-filiais-brasil'), 'controle de extravio'));
  assert.ok(matchesQuery(bySlug('gestao-coletas-logistica-reversa'), 'logistica reversa'));
  assert.ok(matchesQuery(bySlug('automacao-avarias-extravios'), 'vba python'));
  assert.ok(matchesQuery(bySlug('tracker-comercial'), 'BI COMERCIAL'));
  assert.ok(!matchesQuery(bySlug('tracker-comercial'), 'sharepoint'));
});

test('a busca combina todos os termos e uma busca vazia não restringe', () => {
  assert.equal(filterCatalog(catalog, emptyFilters).length, catalog.length);
  assert.equal(filterCatalog(catalog, { ...emptyFilters, query: '   ' }).length, catalog.length);
  const a = filterCatalog(catalog, { ...emptyFilters, query: 'excel' });
  const b = filterCatalog(catalog, { ...emptyFilters, query: 'excel vba python' });
  assert.ok(b.length > 0 && b.length < a.length);
  assert.deepEqual(slugsOf(b), ['automacao-avarias-extravios']);
});

test('os filtros de categoria, tecnologia e tipo restringem em conjunto', () => {
  const sql = filterCatalog(catalog, { ...emptyFilters, tech: 'sql-server' });
  assert.ok(sql.length >= 4 && sql.every((e) => e.tech.includes('sql-server')));
  const sqlDados = filterCatalog(catalog, { ...emptyFilters, tech: 'sql-server', category: 'sql-dados' });
  assert.ok(sqlDados.length > 0 && sqlDados.length < sql.length);
  assert.ok(sqlDados.every((e) => e.category === 'sql-dados'));
  const dashboards = filterCatalog(catalog, { ...emptyFilters, type: 'dashboard', category: 'bi-comercial' });
  assert.ok(dashboards.length >= 5 && dashboards.every((e) => e.types.includes('dashboard')));
});

test('uma combinação sem resultados devolve lista vazia', () => {
  assert.deepEqual(filterCatalog(catalog, { ...emptyFilters, category: 'sql-dados', tech: 'power-bi' }), []);
  assert.deepEqual(filterCatalog(catalog, { ...emptyFilters, query: 'xyzinexistente' }), []);
});

test('o estado de filtragem é detectado e a contagem por categoria ignora a própria categoria', () => {
  assert.equal(isFiltering(emptyFilters), false);
  assert.equal(isFiltering({ ...emptyFilters, query: 'a' }), true);
  const counts = countByCategory(catalog, { ...emptyFilters, category: 'sql-dados', tech: 'power-bi' });
  assert.ok((counts.get('bi-comercial') ?? 0) > 0, 'outras categorias continuam contadas');
  assert.equal(counts.get('sql-dados') ?? 0, 0);
});

test('os filtros fazem ida e volta pela URL e valores inválidos são ignorados', () => {
  const f = { query: 'preço', category: 'bi-comercial', tech: 'power-bi', type: 'dashboard' } as const;
  assert.deepEqual(parseFilters(`?${serializeFilters(f)}`), f);
  assert.equal(serializeFilters(emptyFilters), '');
  assert.deepEqual(parseFilters('?categoria=invalida&tecnologia=nada&tipo=x'), emptyFilters);
  assert.equal(parseFilters(`?q=${'a'.repeat(500)}`).query.length, 80);
});

test('"ver também" prioriza as referências explícitas, completa pela categoria e nunca inclui o próprio item', () => {
  const rel = relatedEntries(catalog, 'solution-price', ['simulador-preco-rodoviario', 'solution-price', 'inexistente']);
  assert.equal(rel[0].slug, 'simulador-preco-rodoviario');
  assert.ok(!slugsOf(rel).includes('solution-price'));
  assert.ok(rel.length >= 2 && rel.length <= 4);
  assert.equal(new Set(slugsOf(rel)).size, rel.length);
});
