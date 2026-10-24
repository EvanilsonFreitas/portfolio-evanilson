import Link from 'next/link';
import Icon from '../ui/Icon';
import { site } from '../../content/site';

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="wrap flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="display text-3xl">{site.name}</p>
          <p className="mt-1 text-sm text-muted">{site.areas.replaceAll(' · ', ' / ')}</p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link href="/projetos/" className="hover:underline">Projetos</Link>
          <Link href="/educacao/" className="hover:underline">Formação</Link>
          <Link href="/blog/" className="hover:underline">Artigos</Link>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline">
            <Icon name="github" size={15} /> GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline">
            <Icon name="linkedin" size={15} /> LinkedIn
          </a>
        </nav>
      </div>
      <p className="wrap mt-8 text-[0.8125rem] text-muted">© {new Date().getFullYear()} {site.fullName}. Todos os direitos reservados.</p>
    </footer>
  );
}
