import { projects } from './projects.ts';
import { studies } from './studies.ts';
import { casesComercial } from './cases-comercial.ts';
import { casesDados, casesExcel } from './cases-dados-excel.ts';
import { casesOperacional, casesComunicacao } from './cases-operacional.ts';
import { casesProcessos } from './cases-processos.ts';
import type { Case } from './types.ts';
import type { CategoryId, SolutionTypeId, TechId } from './taxonomy.ts';

/**
 * Fonte única do catálogo de projetos. Cada entrada é independente: não há ordem, dependência ou
 * sequência entre elas. A página de projetos, a curadoria da home, o sitemap e os testes leem daqui.
 */
export type EntryKind = 'project' | 'study' | 'case';
export type CaseFormat = 'completo' | 'compacto' | 'estudo';

export interface CatalogEntry {
  id: string;
  slug: string;
  kind: EntryKind;
  title: string;
  crumb: string;
  summary: string;
  aliases: string[];
  category: CategoryId;
  types: SolutionTypeId[];
  tech: TechId[];
  format: CaseFormat;
  natureLabel: string;
  /** Imagem de evidência principal (id em `project-images.ts`), quando houver. */
  image?: string;
}

interface Taxonomy {
  category: CategoryId;
  types: SolutionTypeId[];
  tech: TechId[];
  aliases?: string[];
}

/** Classificação dos projetos e estudos anteriores, que mantêm suas páginas e conteúdo próprios. */
const existing: Record<string, Taxonomy> = {
  'simulador-preco-rodoviario': {
    category: 'software',
    types: ['sistema', 'aplicacao-corporativa'],
    tech: ['python', 'fastapi', 'react', 'nextjs', 'typescript', 'sql-server'],
    aliases: ['EasyPrice', 'precificação', 'frete rodoviário'],
  },
  'gestao-financeira': {
    category: 'software',
    types: ['sistema'],
    tech: ['python', 'fastapi', 'postgresql', 'react', 'typescript'],
    aliases: ['Tracker finance', 'finanças pessoais'],
  },
  'bi-operacional-logistica': {
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: ['power-bi', 'dax'],
    aliases: ['SLA', 'logística'],
  },
  'inteligencia-comercial-crm': { category: 'bi-comercial', types: ['estudo', 'inteligencia-comercial'], tech: ['power-bi', 'salesforce'] },
  'integracoes-automacoes': { category: 'integracoes-processos', types: ['estudo', 'automacao'], tech: ['power-automate', 'sql-server'] },
  'sql-server-avancado': { category: 'sql-dados', types: ['estudo', 'engenharia-dados'], tech: ['sql-server'] },
  'engenharia-sistemas-infraestrutura': { category: 'software', types: ['estudo'], tech: [] },
  'normalizacao-cidades-ibge': { category: 'sql-dados', types: ['estudo', 'engenharia-dados'], tech: ['python'], aliases: ['Normalização de Municípios', 'IBGE'] },
  'ia-rag-agentes': { category: 'software', types: ['estudo'], tech: [] },
  'iis-windows-server': { category: 'software', types: ['estudo'], tech: ['iis'] },
  'arquitetura-azure': { category: 'software', types: ['estudo'], tech: [] },
  'azure-devops-cicd': { category: 'software', types: ['estudo'], tech: [] },
  'analise-preditiva-operacional': { category: 'bi-operacional', types: ['estudo', 'inteligencia-operacional'], tech: [] },
};

export const cases: Case[] = [
  ...casesComercial,
  ...casesDados,
  ...casesExcel,
  ...casesOperacional,
  ...casesProcessos,
  ...casesComunicacao,
];

function fromExisting(slug: string): Taxonomy {
  const t = existing[slug];
  if (!t) throw new Error(`Sem classificação no catálogo: ${slug}`);
  return t;
}

export const catalog: CatalogEntry[] = [
  ...projects.map<CatalogEntry>((p) => {
    const t = fromExisting(p.slug);
    return {
      id: p.slug,
      slug: p.slug,
      kind: 'project',
      title: p.title,
      crumb: p.crumb,
      summary: p.summary,
      aliases: t.aliases ?? [],
      category: t.category,
      types: t.types,
      tech: t.tech,
      format: 'completo',
      natureLabel: p.natureLabel,
    };
  }),
  ...cases.map<CatalogEntry>((c) => ({
    id: c.id,
    slug: c.slug,
    kind: 'case',
    title: c.title,
    crumb: c.crumb,
    summary: c.summary,
    aliases: c.aliases ?? [],
    category: c.category,
    types: c.types,
    tech: c.tech,
    format: c.caseType,
    natureLabel: c.natureLabel,
    image: c.images?.[0]?.id,
  })),
  ...studies.map<CatalogEntry>((s) => {
    const t = fromExisting(s.slug);
    return {
      id: s.slug,
      slug: s.slug,
      kind: 'study',
      title: s.title,
      crumb: s.crumb,
      summary: s.summary,
      aliases: t.aliases ?? [],
      category: t.category,
      types: t.types,
      tech: t.tech,
      format: 'estudo',
      natureLabel: s.natureLabel,
    };
  }),
];

/**
 * Curadoria da página inicial, equilibrada entre BI comercial, BI operacional, Excel e VBA,
 * SQL, software e automações. A ordem é editorial.
 */
export const homeFeatured: string[] = [
  'solution-price',
  'tracker-comercial',
  'hit-rate-comercial',
  'inteligencia-comercial-crm',
  'indice-retorno',
  'gestao-coletas-logistica-reversa',
  'automacao-avarias-extravios',
  'painel-melhoria-continua',
  'automacao-tabela-custos-sql-server',
  'simulador-preco-rodoviario',
  'alcadas-aprovacao-comercial',
];

export function getCatalogEntry(slug: string): CatalogEntry | undefined {
  return catalog.find((e) => e.slug === slug);
}

export function getCase(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}
