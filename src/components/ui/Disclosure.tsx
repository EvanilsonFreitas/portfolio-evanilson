'use client';

import { useState } from 'react';
import Icon from './Icon';
import { useWide } from './useWide';
import { disclosureLabels, isOpen } from '../../lib/disclosure';

/**
 * Controle expansível das responsabilidades: aberto em telas largas e recolhido nas estreitas.
 *
 * Antes da primeira escolha, o padrão é definido só por CSS (breakpoint `md`): o HTML do servidor já
 * nasce no estado certo para cada largura, sem salto de layout na hidratação. O texto, o ícone e a
 * seta sempre correspondem ao estado: recolhido = "Ver" + seta para baixo; aberto = "Ocultar" + seta para cima.
 */
export default function Disclosure({ id, children, className = 'mt-5' }: { id: string; children: React.ReactNode; className?: string }) {
  const wide = useWide();
  const [chosen, setChosen] = useState<boolean>();
  const auto = chosen === undefined;
  const open = isOpen(chosen, wide);
  const panel = `resp-${id}`;

  return (
    <div className={className}>
      <button
        type="button"
        className="eyebrow inline-flex min-h-9 items-center gap-2 py-1 hover:text-ink"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setChosen(!open)}
      >
        {auto ? (
          <>
            <span className="md:hidden">{disclosureLabels.closed}</span>
            <span className="hidden md:inline">{disclosureLabels.open}</span>
          </>
        ) : open ? (
          disclosureLabels.open
        ) : (
          disclosureLabels.closed
        )}
        <Icon name="chevron" size={12} className={`transition-transform duration-200 ${auto ? 'md:rotate-180' : open ? 'rotate-180' : ''}`} />
      </button>
      <div id={panel} hidden={auto ? undefined : !open} className={auto ? 'max-md:hidden' : undefined}>
        {children}
      </div>
    </div>
  );
}
