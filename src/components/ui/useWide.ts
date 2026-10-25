import { useSyncExternalStore } from 'react';

const WIDE = '(min-width: 768px)';
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/**
 * Tela larga (a partir de 768 px). Servidor e hidratação assumem `true` (conteúdo todo aberto);
 * o cliente passa a `false` em telas estreitas, sem divergência na hidratação.
 */
export function useWide(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(WIDE).matches, () => true);
}
