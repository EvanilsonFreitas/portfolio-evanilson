import Link from 'next/link';
import Icon from '../ui/Icon';
import { entryHref } from '../catalog/EntryTile';
import type { CatalogEntry } from '../../content/catalog';

/** Fim de página: referências cruzadas e retorno ao catálogo. Não indica sequência. */
export default function RelatedEntries({ entries }: { entries: CatalogEntry[] }) {
  return (
    <section className="border-t border-rule pt-12" aria-labelledby="s-related">
      {entries.length > 0 && (
        <>
          <h2 id="s-related" className="eyebrow mb-6">Ver também</h2>
          <ul className="mb-12 grid gap-x-10 md:grid-cols-2">
            {entries.map((e) => (
              <li key={e.slug} className="border-b border-line">
                <Link href={entryHref(e.slug)} className="group flex items-start justify-between gap-4 py-5">
                  <span>
                    <span className="eyebrow block">{e.natureLabel}</span>
                    <span className="display mt-1 block text-2xl group-hover:text-accent-ink">{e.title}</span>
                  </span>
                  <Icon name="arrow" size={18} className="mt-6 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <Link href="/projetos/" className="link-arrow">
        Voltar ao catálogo <Icon name="arrow" />
      </Link>
    </section>
  );
}
