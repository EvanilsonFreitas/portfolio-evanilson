'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Rola até o elemento do hash, esperando-o existir (a página pode ainda estar montando). */
function scrollToHash(hash: string, tries = 20) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ block: 'start', behavior: 'instant' });
    return;
  }
  if (tries > 0) setTimeout(() => scrollToHash(hash, tries - 1), 30);
}

/**
 * Regras de rolagem que o roteador não cobre sozinho:
 * - chegada em uma página com hash (inclusive a home) rola até a âncora;
 * - voltar/avançar no histórico respeita o hash da entrada (sem hash, topo da home);
 * - a rolagem é sempre instantânea (sem animação que atrase a leitura ou confunda o destino).
 */
export default function ScrollManager() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => scrollToHash(window.location.hash), 0);
    } else if (!first.current && pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    first.current = false;
  }, [pathname]);

  useEffect(() => {
    // A posição de cada entrada é definida pelo hash (ou topo da home), não pela restauração do navegador.
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const place = () => {
      if (window.location.hash) scrollToHash(window.location.hash);
      else window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const onPop = () => {
      // O roteador aplica o estado da entrada; posicionamos depois dele e confirmamos em seguida.
      setTimeout(place, 60);
      setTimeout(place, 250);
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.history.scrollRestoration = previous;
    };
  }, []);

  return null;
}
