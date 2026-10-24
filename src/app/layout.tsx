import type { Metadata, Viewport } from 'next';
import { display, sans, mono } from '../lib/fonts';
import ThemeProvider from '../components/layout/ThemeProvider';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { OG_IMAGE } from '../lib/seo';
import { site, siteUrl } from '../content/site';
import './globals.css';

const description =
  'Portfólio de Evanilson Freitas: Business Intelligence, Data Science e Engenharia de Software aplicados a desafios de negócio. Projetos, formação e artigos técnicos.';

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: { default: `${site.name} — Business Intelligence, Data Science e Software`, template: `%s — ${site.name}` },
  description,
  authors: [{ name: site.fullName, url: site.github }],
  creator: site.fullName,
  keywords: ['Business Intelligence', 'Data Science', 'Engenharia de Software', 'Analytics', 'Python', 'SQL Server', 'TypeScript'],
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    title: `${site.name} — Business Intelligence, Data Science e Software`,
    description,
    url: `${siteUrl}/`,
    siteName: site.name,
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${site.name} — ${site.areas}` }],
  },
  twitter: { card: 'summary_large_image', title: site.name, description, images: [OG_IMAGE] },
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
