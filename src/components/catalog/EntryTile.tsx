import Link from 'next/link';
import { getProjectImage } from '../../content/project-images';
import type { CatalogEntry } from '../../content/catalog';
import { categoryLabel, techLabel } from '../../content/taxonomy';
import { withBasePath } from '../../lib/paths';

export function entryHref(slug: string): string {
  return `/projetos/${slug}/`;
}

/** Linha de tecnologias confirmadas; sem elas, a natureza do item. */
export function entryMeta(entry: CatalogEntry): string {
  return entry.tech.length > 0 ? entry.tech.map(techLabel).join(' · ') : entry.natureLabel;
}

function Thumb({ id }: { id: string }) {
  const img = getProjectImage(id);
  if (!img) return null;
  return (
    <div className="aspect-video overflow-hidden border border-line bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(`/assets/projetos/${img.id}-thumb.webp`)}
        width={img.thumbWidth}
        height={img.thumbHeight}
        alt={img.alt}
        loading="lazy"
        decoding="async"
        className="block h-full w-full object-cover object-top"
      />
    </div>
  );
}

/**
 * Entrada independente do catálogo. Sem numeração, setas de sequência ou conectores: cada item é
 * lido por si. A imagem, quando existe, é a evidência do trabalho.
 */
export default function EntryTile({ entry, variant = 'grid' }: { entry: CatalogEntry; variant?: 'grid' | 'lead' | 'text' }) {
  const showImage = entry.image && variant !== 'text';
  const lead = variant === 'lead';
  return (
    <Link
      href={entryHref(entry.slug)}
      className={`group flex h-full flex-col gap-4 bg-paper p-5 hover:bg-surface sm:p-6 ${variant === 'text' ? 'border-t border-line bg-transparent px-0 hover:bg-transparent' : ''}`}
    >
      {showImage && <Thumb id={entry.image!} />}
      <p className="eyebrow">{categoryLabel(entry.category)}</p>
      <h3 className={`display group-hover:text-accent-ink ${lead ? 'text-[clamp(2rem,4vw,3rem)]' : 'text-[1.65rem] sm:text-3xl'}`}>{entry.title}</h3>
      <p className={`text-muted ${lead ? '' : 'text-[0.95rem]'}`}>{entry.summary}</p>
      <p className="tag mt-auto pt-1">{entryMeta(entry)}</p>
    </Link>
  );
}
