'use client';

import { useEffect, useMemo, useState } from 'react';
import EntryTile from './EntryTile';
import type { CatalogEntry } from '../../content/catalog';
import { categories, solutionTypes, technologies } from '../../content/taxonomy';
import { countByCategory, emptyFilters, filterCatalog, isFiltering, parseFilters, serializeFilters } from '../../lib/catalog';
import type { CatalogFilters } from '../../lib/catalog';

const field =
  'min-h-11 w-full border border-line bg-paper px-3 text-[0.9375rem] text-ink placeholder:text-muted';

function chip(active: boolean): string {
  return `min-h-11 border px-3.5 text-[0.875rem] transition-colors ${active ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`;
}

/**
 * Catálogo completo com busca e três filtros simples. O estado fica na URL (?q=, categoria, tecnologia,
 * tipo), o que permite links diretos a partir da home; sem JavaScript, a lista inteira aparece.
 */
export default function CatalogBrowser({ entries }: { entries: CatalogEntry[] }) {
  const [filters, setFilters] = useState<CatalogFilters>(emptyFilters);

  useEffect(() => {
    // Leitura da URL somente no cliente, depois da hidratação, para manter o HTML estático idêntico.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters(parseFilters(window.location.search));
  }, []);

  function update(next: Partial<CatalogFilters>) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    const qs = serializeFilters(merged);
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }

  const results = useMemo(() => filterCatalog(entries, filters), [entries, filters]);
  const counts = useMemo(() => countByCategory(entries, filters), [entries, filters]);
  const totalInCategories = [...counts.values()].reduce((a, b) => a + b, 0);
  const active = isFiltering(filters);

  return (
    <div>
      <div className="mb-10 grid gap-6 border-y border-rule py-8">
        <div role="search">
          <label htmlFor="catalogo-busca" className="eyebrow mb-2 block">Buscar</label>
          <input
            id="catalogo-busca"
            type="search"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Nome, tecnologia ou palavra-chave"
            autoComplete="off"
            className={field}
          />
        </div>

        <div role="group" aria-labelledby="catalogo-categoria">
          <p id="catalogo-categoria" className="eyebrow mb-2">Categoria</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={filters.category === 'all'} onClick={() => update({ category: 'all' })} className={chip(filters.category === 'all')}>
              Todas <span className="mono ml-1 text-[0.75rem] opacity-70">{totalInCategories}</span>
            </button>
            {categories.map((c) => (
              <button key={c.id} type="button" aria-pressed={filters.category === c.id} onClick={() => update({ category: c.id })} className={chip(filters.category === c.id)}>
                {c.label} <span className="mono ml-1 text-[0.75rem] opacity-70">{counts.get(c.id) ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="catalogo-tecnologia" className="eyebrow mb-2 block">Tecnologia</label>
            <select id="catalogo-tecnologia" value={filters.tech} onChange={(e) => update({ tech: e.target.value as CatalogFilters['tech'] })} className={field}>
              <option value="all">Todas as tecnologias</option>
              {technologies.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="catalogo-tipo" className="eyebrow mb-2 block">Tipo de solução</label>
            <select id="catalogo-tipo" value={filters.type} onChange={(e) => update({ type: e.target.value as CatalogFilters['type'] })} className={field}>
              <option value="all">Todos os tipos</option>
              {solutionTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-muted">
            {active ? `${results.length} de ${entries.length} itens` : `${entries.length} itens`}
          </p>
          {active && (
            <button type="button" onClick={() => update({ ...emptyFilters })} className="link-arrow">
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {results.length > 0 ? (
        <ul className="grid border-l border-t border-line sm:grid-cols-2 xl:grid-cols-3">
          {results.map((e) => (
            <li key={e.slug} className="border-b border-r border-line bg-paper">
              <EntryTile entry={e} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border border-line p-8">
          <p className="display text-3xl">Nenhum item para esses filtros.</p>
          <p className="mt-3 text-muted">Remova um filtro ou procure por outra palavra.</p>
          <button type="button" onClick={() => update({ ...emptyFilters })} className="btn mt-6">Limpar filtros</button>
        </div>
      )}
    </div>
  );
}
