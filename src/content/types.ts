import type { CategoryId, SolutionTypeId, TechId } from './taxonomy.ts';

/** Natureza da evidência: separa projeto corporativo, projeto autoral, formação e demonstração. */
export type EvidenceKind = 'applied' | 'personal' | 'academic' | 'demonstration' | 'article' | 'study';

export const evidenceLabels: Record<EvidenceKind, string> = {
  applied: 'Projeto corporativo',
  personal: 'Projeto autoral',
  academic: 'Formação',
  demonstration: 'Demonstração',
  article: 'Artigo',
  study: 'Estudo técnico',
};

export interface Education {
  id: string;
  title: string;
  institution?: string;
  kind: 'mba' | 'graduation';
  status: string;
  dates: string[];
  summary: string;
  appliedIn: string[];
  note?: string;
}

export interface ExpertiseEvidence {
  label: string;
  kind: EvidenceKind;
  href?: string;
}

export interface ExpertisePillar {
  number: string;
  title: string;
  solves: string;
  tech: string[];
  evidence: ExpertiseEvidence[];
}

export interface DiagramLayer {
  title: string;
  nodes: { name: string; note?: string }[];
}

export type ProjectNature = 'corporate' | 'personal' | 'demonstration';

export interface Project {
  slug: string;
  /** Rótulo curto para trilhas de navegação. */
  crumb: string;
  domain: DomainName;
  /** Aprofundamento técnico em blocos, exibido entre Implementação e Demonstração. */
  deepDive?: Section[];
  title: string;
  category: string;
  summary: string;
  nature: ProjectNature;
  natureLabel: string;
  role: string;
  status: string;
  access: string;
  stack: string[];
  stackNote?: string;
  context: { problem: string; environment: string; objective: string; constraints: string[] };
  strategy: { approach: string; decisions: { decision: string; reason: string }[] };
  architecture: { caption: string; layers: DiagramLayer[]; crosscutting?: string };
  implementation: { intro: string; flowTitle: string; flow: string[]; code?: { label: string; source: string } };
  demo?: 'pricing' | 'operations';
  challenges: { title: string; text: string }[];
  outcomes: string[];
  learning: string;
}

/** Estado de cada afirmação técnica: o que é código, o que é declaração e o que é estudo. */
export type EvidenceStatus = 'codigo' | 'declarado' | 'sintetico' | 'academico' | 'conceitual' | 'planejado';

export const statusLabels: Record<EvidenceStatus, string> = {
  codigo: 'Comprovado em código',
  declarado: 'Declarado pelo autor',
  sintetico: 'Demonstração sintética',
  academico: 'Protótipo acadêmico',
  conceitual: 'Conhecimento conceitual',
  planejado: 'Planejado, não implantado',
};

export type DomainName =
  | 'Precificação e Rentabilidade'
  | 'Inteligência Comercial e CRM'
  | 'Business Intelligence Operacional'
  | 'Engenharia de Dados'
  | 'Engenharia de Software'
  | 'Integrações e Automações'
  | 'Inteligência Artificial Aplicada'
  | 'Business Intelligence Comercial'
  | 'Cloud e Infraestrutura';

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'list'; title?: string; items: string[] }
  | { kind: 'table'; title?: string; head: string[]; rows: string[][] }
  | { kind: 'code'; label: string; lang: string; source: string; note?: string }
  | { kind: 'diagram'; id: string; caption: string }
  | { kind: 'status'; title?: string; items: { label: string; status: EvidenceStatus; note?: string }[] }
  | { kind: 'demo'; id: 'pricing' | 'operations' | 'commercial' | 'cities' };

export interface Section {
  title: string;
  blocks: Block[];
}

export interface Study {
  slug: string;
  crumb: string;
  title: string;
  domain: DomainName;
  summary: string;
  natureLabel: string;
  scope: string;
  access: string;
  sections: Section[];
}

/** Classificação de uma pendência interna: bloqueia a publicação, não bloqueia, ou depende de decisão do proprietário. */
export type PendingKind = 'bloqueante' | 'nao-bloqueante' | 'decisao';

export interface Pending {
  kind: PendingKind;
  text: string;
}

/** Imagem de evidência de um case: `id` aponta para `project-images.ts`. */
export interface CaseImageRef {
  id: string;
  /** Legenda própria quando o case tem mais de uma imagem. */
  caption?: string;
}

/**
 * Case independente do catálogo (projeto corporativo documentado por declaração do autor e, quando
 * houver, por captura de tela). Projetos e estudos anteriores mantêm seus próprios formatos.
 */
export interface Case {
  id: string;
  slug: string;
  /** Rótulo curto para trilhas de navegação. */
  crumb: string;
  title: string;
  /** Outros nomes pelos quais a solução é conhecida; entram na busca. */
  aliases?: string[];
  summary: string;
  category: CategoryId;
  types: SolutionTypeId[];
  /** Somente tecnologias confirmadas para este case. */
  tech: TechId[];
  /**
   * Interno: como a classificação tecnológica foi estabelecida. Alimenta docs/PROJETOS.md e os testes,
   * mas não é exibido no site.
   */
  techNote: string;
  caseType: 'completo' | 'compacto';
  natureLabel: string;
  images?: CaseImageRef[];
  /** Dados de identificação adicionais, exibidos junto da tecnologia. */
  facts?: [string, string][];
  sections: Section[];
  /** Slugs de cases ou estudos relacionados (referência cruzada, não sequência). */
  related?: string[];
  /** Interno: pendências de confirmação. Não são exibidas no site; vão para docs/PROJETOS.md. */
  pending?: Pending[];
}
