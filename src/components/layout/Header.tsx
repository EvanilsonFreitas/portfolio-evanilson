'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import ThemeToggle from './ThemeToggle';
import { resumeFiles, site } from '../../content/site';
import { withBasePath } from '../../lib/paths';

const nav = [
  { label: 'Início', href: '/', match: '/' },
  { label: 'Projetos', href: '/projetos/', match: '/projetos' },
  { label: 'Especialidades', href: '/#especialidades', match: '#especialidades' },
  { label: 'Formação', href: '/educacao/', match: '/educacao' },
  { label: 'Artigos', href: '/blog/', match: '/blog' },
];

/** Seção da home → item de navegação destacado ('none' = nenhum). */
const sectionToNav: Record<string, string> = {
  projetos: '/projetos',
  especialidades: '#especialidades',
  formacao: '/educacao',
  artigos: '/blog',
  contato: 'none',
};

function ResumeMenu() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        className="btn !min-h-10 !py-1.5"
        aria-expanded={open}
        aria-controls="menu-curriculo"
        onClick={() => setOpen((o) => !o)}
      >
        Currículo <Icon name="chevron" size={14} />
      </button>
      {open && (
        <ul
          id="menu-curriculo"
          className="absolute right-0 top-full z-50 mt-2 w-44 border border-line bg-surface p-1 shadow-sm"
        >
          {Object.values(resumeFiles).map((f) => (
            <li key={f.path}>
              <a
                href={withBasePath(f.path)}
                download
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-surface2"
                onClick={() => setOpen(false)}
              >
                Baixar {f.label}
                <Icon name="download" size={14} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState('');

  useEffect(() => {
    if (pathname !== '/') return;
    const ids = Object.keys(sectionToNav);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(sectionToNav[e.target.id]);
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => window.scrollY < 300 && setSection('');
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (match: string) => {
    if (match === '/') return pathname === '/' && section === '';
    if (pathname === '/') return section === match;
    return !match.startsWith('#') && pathname.startsWith(match);
  };

  return (
    <>
    <header
      className="sticky top-0 z-40 border-b border-line backdrop-blur"
      style={{ background: 'var(--header-bg)' }}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-2" aria-label={`${site.name} — início`}>
          <span className="display text-2xl">Evanilson Freitas</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-5 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item.match) ? (pathname === '/' ? 'location' : 'page') : undefined}
              className={`border-b pb-0.5 text-sm transition-colors ${
                isActive(item.match) ? 'border-ink font-medium text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ResumeMenu />
          </div>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] border border-line xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

    </header>
    {open && (
      <div id="menu-mobile" className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto bg-paper xl:hidden">
        <nav aria-label="Principal (móvel)" className="wrap flex flex-col py-6">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.match) ? (pathname === '/' ? 'location' : 'page') : undefined}
              className="display border-b border-line py-4 text-4xl"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            {[resumeFiles.pdf, resumeFiles.docx].map((f) => (
              <a key={f.path} href={withBasePath(f.path)} download className="btn btn-ghost">
                <Icon name="download" size={14} /> Currículo {f.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    )}
    </>
  );
}
