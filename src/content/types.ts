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
  domain: DomainName;
  /** Aprofundamento técnico em blocos, exibido entre Implementação e Demonstração. */
  deepDive?: Section[];
  number: string;
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
  next: string;
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
  | 'Inteligência Artificial Aplicada';

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
  title: string;
  domain: DomainName;
  summary: string;
  natureLabel: string;
  scope: string;
  access: string;
  sections: Section[];
  next: string;
}
