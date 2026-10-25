'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import ThemeToggle from './ThemeToggle';
import { resumeFiles, site } from '../../content/site';
import { withBasePath } from '../../lib/paths';
import { HOME_SECTIONS, NAV, activeNavId, clickAction, currentSection } from '../../lib/navigation';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
/** Linha de leitura (px a partir do topo) que define a seção atual: logo abaixo do cabeçalho. */
const READING_LINE = 120;

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
    // Leitura barata (9 retângulos): roda direto no evento, sem depender de quadros de animação.
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) return setSection(HOME_SECTIONS[HOME_SECTIONS.length - 1]);
      const tops = HOME_SECTIONS.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      setSection(currentSection(tops, READING_LINE));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
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

  const activeId = activeNavId(pathname, section);
  const activeIndex = NAV.findIndex((n) => n.id === activeId);

  /** Estratégia única: na home, topo e âncoras rolam sem recarregar; nas demais páginas, o roteador navega. */
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const action = clickAction(pathname, href);
    setOpen(false);
    if (action.kind === 'navigate') return;
    e.preventDefault();
    const run = () => {
      if (action.kind === 'top') {
        window.scrollTo({ top: 0, behavior: 'instant' });
        window.history.pushState(null, '', `${BASE}/`);
        setSection('inicio');
      } else {
        document.getElementById(action.id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
        window.history.pushState(null, '', `${BASE}/#${action.id}`);
      }
    };
    // A rolagem programática funciona mesmo com o menu móvel aberto (corpo travado): sem adiar.
    run();
  };

  return (
    <>
    <header
      className="sticky top-0 z-40 border-b border-line backdrop-blur"
      style={{ background: 'var(--header-bg)' }}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" onClick={(e) => go(e, '/')} className="flex items-baseline gap-2" aria-label={`${site.name} — início`}>
          <span className="display text-2xl">Evanilson Freitas</span>
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ol className="flex items-start">
            {NAV.map((item, i) => {
              const current = activeId === item.id;
              const reached = i <= activeIndex;
              const last = i === NAV.length - 1;
              return (
                <li key={item.id} className={`flex flex-col ${last ? '' : 'pr-4'}`}>
                  <Link
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    aria-current={current ? (pathname === '/' ? 'location' : 'page') : undefined}
                    className={`text-sm leading-5 transition-colors ${current ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}
                  >
                    {item.label}
                  </Link>
                  <span className="mt-1.5 flex items-center" aria-hidden="true">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${reached ? 'bg-muted' : 'bg-line'} ${current ? '!bg-ink' : ''}`} />
                    {!last && <span className={`ml-2 h-px flex-1 ${i < activeIndex ? 'bg-muted' : 'bg-line'} ${i === activeIndex ? 'nav-next' : ''}`} />}
                  </span>
                </li>
              );
            })}
          </ol>
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
          <ol>
            {NAV.map((item, i) => {
              const current = activeId === item.id;
              const reached = i <= activeIndex;
              const last = i === NAV.length - 1;
              return (
                <li key={item.id} className="relative flex gap-5">
                  <span className="relative flex w-2 shrink-0 flex-col items-center pt-[1.15rem]" aria-hidden="true">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${current ? 'bg-ink' : reached ? 'bg-muted' : 'bg-line'}`} />
                    {!last && <span className={`mt-1 w-px flex-1 ${i < activeIndex ? 'bg-muted' : 'bg-line'} ${i === activeIndex ? 'nav-next nav-next-v' : ''}`} />}
                  </span>
                  <Link
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    aria-current={current ? (pathname === '/' ? 'location' : 'page') : undefined}
                    className={`display py-2.5 text-3xl ${current ? 'text-ink' : 'text-muted'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ol>
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
