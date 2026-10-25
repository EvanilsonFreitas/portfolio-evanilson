import type { Metadata, Viewport } from 'next';
import { display, sans, mono } from '../lib/fonts';
import ThemeProvider from '../components/layout/ThemeProvider';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollManager from '../components/layout/ScrollManager';
import { OG_IMAGE } from '../lib/seo';
import { site, siteUrl } from '../content/site';
import './globals.css';

const description =
  'Portfólio de Evanilson Freitas: Business Intelligence, Inteligência de Negócios e Engenharia de Software. Soluções de dados, automação e software para decisão, com projetos, estudos técnicos e artigos.';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: { default: `${site.name} • Portfólio`, template: `%s • ${site.name}` },
  description,
  authors: [{ name: site.fullName, url: site.github }],
  creator: site.fullName,
  keywords: ['Business Intelligence', 'Inteligência de Negócios', 'Engenharia de Software', 'Data Science', 'SQL Server', 'Integração de sistemas', 'Python', 'TypeScript'],
  alternates: { canonical: `${siteUrl}/` },
  // Monograma EP derivado do arquivo original (npm run brand). O favicon acompanha o tema do navegador/sistema:
  // variante escura em abas claras e variante clara em abas escuras. O .ico é o fallback.
  icons: {
    icon: [
      { url: `${base}/favicon.ico`, sizes: 'any' },
      { url: `${base}/assets/brand/ep-light-32.png`, type: 'image/png', sizes: '32x32', media: '(prefers-color-scheme: light)' },
      { url: `${base}/assets/brand/ep-dark-32.png`, type: 'image/png', sizes: '32x32', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [{ url: `${base}/assets/brand/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' }],
  },
  manifest: `${base}/manifest.webmanifest`,
  openGraph: {
    title: `${site.name} • Portfólio`,
    description,
    url: `${siteUrl}/`,
    siteName: site.name,
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${site.name} — ${site.areas}` }],
  },
  twitter: { card: 'summary_large_image', title: `${site.name} • Portfólio`, description, images: [OG_IMAGE] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf8' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <a href="#conteudo" className="skip-link">Ir para o conteúdo</a>
          <ScrollManager />
          <Header />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
