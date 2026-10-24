/** Natureza da evidência: separa projeto corporativo, projeto autoral, formação e demonstração. */
export type EvidenceKind = 'applied' | 'personal' | 'academic' | 'demonstration' | 'article';

export const evidenceLabels: Record<EvidenceKind, string> = {
  applied: 'Projeto corporativo',
  personal: 'Projeto autoral',
  academic: 'Formação',
  demonstration: 'Demonstração',
  article: 'Artigo',
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
