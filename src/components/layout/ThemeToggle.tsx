'use client';

import { useTheme } from 'next-themes';
import Icon from '../ui/Icon';

/** Ambos os ícones são renderizados; o CSS mostra o correto, sem depender de estado montado. */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] border border-line text-ink transition-colors hover:border-ink"
      aria-label="Alternar entre tema claro e escuro"
    >
      <Icon name="moon" className="dark:hidden" />
      <Icon name="sun" className="hidden dark:block" />
    </button>
  );
}
