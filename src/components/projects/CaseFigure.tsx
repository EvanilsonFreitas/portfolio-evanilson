'use client';

import { useRef } from 'react';
import { getProjectImage } from '../../content/project-images';
import { withBasePath } from '../../lib/paths';

/**
 * Evidência visual de um case: captura fornecida pelo autor, na proporção original, com visualização ampliada
 * em um diálogo nativo (foco preso, Esc e botão para fechar).
 */
export default function CaseFigure({ id, caption, priority = false }: { id: string; caption?: string; priority?: boolean }) {
  const img = getProjectImage(id);
  const dialog = useRef<HTMLDialogElement>(null);
  if (!img) return null;
  const src = withBasePath(`/assets/projetos/${img.id}.webp`);
  const label = caption ?? img.caption;
  return (
    <figure>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="group relative block w-full cursor-zoom-in border border-line bg-surface"
        aria-label={`Ampliar imagem: ${label}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={img.width} height={img.height} alt={img.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" className="block h-auto w-full" />
        <span className="eyebrow absolute bottom-3 right-3 border border-line bg-paper px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          Ampliar
        </span>
      </button>
      <figcaption className="eyebrow mt-3">{label}</figcaption>

      <dialog
        ref={dialog}
        aria-label={`Imagem ampliada: ${label}`}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
        className="m-auto w-[min(96vw,1500px)] border border-line bg-paper p-3 text-ink backdrop:bg-black/75"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="eyebrow">{label}</p>
          <button type="button" autoFocus onClick={() => dialog.current?.close()} className="btn btn-ghost">
            Fechar
          </button>
        </div>
        <div className="max-h-[78vh] overflow-auto" tabIndex={0} role="region" aria-label="Imagem em tamanho real, rolável">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={img.width} height={img.height} alt={img.alt} loading="lazy" decoding="async" className="block h-auto w-full min-w-[56rem] max-w-none" />
        </div>
      </dialog>
    </figure>
  );
}
