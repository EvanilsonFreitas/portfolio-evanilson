'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

/** Tema claro por padrão; a escolha do visitante é persistida pelo next-themes. */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem={false} storageKey="portfolio-theme">
      {children}
    </NextThemesProvider>
  );
}
