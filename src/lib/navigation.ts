/**
 * Estratégia única de navegação. Funções puras (testadas) usadas pelo cabeçalho e pelo
 * ScrollManager: destino de cada link, ação de clique e item ativo.
 *
 * Caminhos aqui são sempre sem o basePath (é o que `usePathname` devolve).
 */

export interface NavItem {
  id: string;
  label: string;
  /** Destino absoluto no site, sem basePath. Âncoras da home usam `/#id`. */
  href: string;
  /** Seção da home que representa o item (ausente em itens que são apenas páginas). */
  section?: string;
  /** Prefixos de caminho que também marcam o item como ativo. */
  paths?: string[];
}

export const NAV: NavItem[] = [
  { id: 'inicio', label: 'Início', href: '/', section: 'inicio' },
  { id: 'sobre', label: 'Sobre', href: '/#sobre', section: 'sobre' },
  { id: 'trajetoria', label: 'Trajetória', href: '/#trajetoria', section: 'trajetoria' },
  { id: 'formacao', label: 'Formação', href: '/#formacao', section: 'formacao', paths: ['/educacao'] },
  { id: 'atuacao', label: 'Atuação', href: '/#atuacao', section: 'atuacao' },
  { id: 'especialidades', label: 'Especialidades', href: '/#especialidades', section: 'especialidades' },
  { id: 'projetos', label: 'Projetos', href: '/#projetos', section: 'projetos', paths: ['/projetos'] },
  { id: 'artigos', label: 'Artigos', href: '/#artigos', section: 'artigos', paths: ['/blog'] },
  { id: 'contato', label: 'Contato', href: '/#contato', section: 'contato' },
];

/** Ordem das seções da home (de cima para baixo). */
export const HOME_SECTIONS = NAV.map((n) => n.section!).filter(Boolean);

export type ClickAction =
  | { kind: 'top' }
  | { kind: 'section'; id: string }
  | { kind: 'navigate' };

function isHome(pathname: string): boolean {
  return pathname === '/' || pathname === '';
}

export function hashOf(href: string): string {
  const i = href.indexOf('#');
  return i === -1 ? '' : href.slice(i + 1);
}

/**
 * O que fazer ao clicar em um link do menu.
 * - Na home, "Início" volta ao topo e âncoras rolam sem recarregar.
 * - Fora da home, deixa o roteador navegar (ele rola até o hash ao chegar).
 */
export function clickAction(pathname: string, href: string): ClickAction {
  const path = href.split('#')[0] || '/';
  const hash = hashOf(href);
  if (!isHome(pathname) || path !== '/') return { kind: 'navigate' };
  return hash ? { kind: 'section', id: hash } : { kind: 'top' };
}

/**
 * Seção atual: a última cujo topo já passou da linha de leitura. Sem seção acima da linha,
 * vale a primeira (topo da página).
 */
export function currentSection(tops: { id: string; top: number }[], line: number): string {
  let current = tops[0]?.id ?? 'inicio';
  for (const t of tops) if (t.top <= line) current = t.id;
  return current;
}

/** Id do item de menu ativo para o caminho e a seção atuais. */
export function activeNavId(pathname: string, section: string): string | undefined {
  if (isHome(pathname)) return NAV.find((n) => n.section === section)?.id;
  const normalized = pathname.replace(/\/$/, '');
  return NAV.find((n) => n.paths?.some((p) => normalized === p || normalized.startsWith(`${p}/`)))?.id;
}
