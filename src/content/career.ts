import type { EvidenceStatus } from './types.ts';

/** Período de uma experiência, em meses ISO (AAAA-MM). Sem `end`, a experiência segue em andamento. */
export interface CareerPeriod {
  start: string;
  end?: string;
}

export interface CareerLink {
  label: string;
  href: string;
}

/**
 * Marco de evolução profissional. Descreve a progressão de competências e responsabilidades, não
 * vínculos formais: as cinco etapas não correspondem, necessariamente, a cinco empregos ou cargos.
 * Empresas, cargos e períodos pertencem a `Employment` (abaixo).
 */
export interface CareerEntry {
  id: string;
  /** Nome da etapa de evolução. */
  stage: string;
  /** Título editorial da etapa. */
  headline: string;
  context: string;
  responsibilities: string[];
  /** Áreas de negócio envolvidas. */
  domains: string[];
  technologies: string[];
  projects: CareerLink[];
  evidence: EvidenceStatus;
}

export type EmploymentType = 'Tempo integral' | 'Meio período';
export type WorkMode = 'Presencial' | 'Híbrido' | 'Remoto';

/** Função exercida dentro de um vínculo. Vários cargos na mesma empresa (promoções ou paralelos) são vários `roles`. */
export interface EmploymentRole {
  title: string;
  period: CareerPeriod;
  type?: EmploymentType;
  mode?: WorkMode;
  location?: string;
  responsibilities?: string[];
  technologies?: string[];
  /** Marcos de evolução (`CareerEntry.id`) a que este cargo se relaciona. */
  milestones?: string[];
  /** Projetos ligados à área do cargo (áreas de experiência, não propriedade da empresa). */
  projects?: CareerLink[];
}

/**
 * Vínculo profissional formal. Preenchido somente com dados confirmados pelo proprietário.
 * Admite promoções (vários cargos), cargos simultâneos, períodos encerrados, períodos separados na
 * mesma empresa e experiência atual (sem `end`).
 */
export interface Employment {
  id: string;
  company: { name: string; url?: string; logo?: string };
  location?: string;
  /** Apresentação curta do vínculo, quando houver texto confirmado. */
  summary?: string;
  /** Áreas de atuação informadas para o vínculo como um todo (não atribuídas a um cargo específico). */
  areas?: string[];
  roles: EmploymentRole[];
}

/**
 * Histórico formal, conforme informado pelo proprietário. Datas, cargos, modalidades e competências
 * seguem o registro profissional; nada foi acrescentado por inferência. Durações não são armazenadas:
 * são calculadas a partir das datas.
 */
export const employment: Employment[] = [
  {
    id: 'tragetta',
    company: { name: 'Tragetta', url: 'https://www.linkedin.com/company/106600042/' },
    location: 'Guarulhos, São Paulo, Brasil',
    areas: ['Precificação e rentabilidade', 'Inteligência comercial e análise de oportunidades', 'Motores de cálculo', 'Integrações e automações'],
    roles: [
      {
        title: 'Business Intelligence',
        period: { start: '2026-06' },
        mode: 'Híbrido',
        technologies: ['SQL', 'Microsoft Power BI'],
        projects: [{ label: 'BI comercial', href: '/projetos/inteligencia-comercial-crm/' }],
      },
      {
        title: 'Analista de Pricing',
        period: { start: '2026-01', end: '2026-06' },
        type: 'Tempo integral',
        technologies: ['Estatística', 'Python'],
        projects: [{ label: 'EasyPrice', href: '/projetos/simulador-preco-rodoviario/' }],
      },
      {
        title: 'Analista de Dados',
        period: { start: '2025-03', end: '2026-01' },
        type: 'Tempo integral',
        mode: 'Presencial',
      },
    ],
  },
  {
    id: 'solistica',
    company: { name: 'Solistica', url: 'https://www.linkedin.com/company/28156946/' },
    roles: [
      {
        title: 'Assistente Administrativo',
        period: { start: '2021-10', end: '2025-03' },
        type: 'Tempo integral',
        location: 'São Paulo, Brasil',
        responsibilities: [
          'Suporte à operação logística, com controle e prevenção de extravios e avarias',
          'Gestão e análise de dados operacionais, com cálculos estatísticos e análises preditivas para maior previsibilidade',
          'Criação de indicadores personalizados por cliente e por área',
          'Administração das tecnologias utilizadas pelo setor',
          'Identificação de melhorias e otimização de processos',
          'Preparação de materiais, acompanhamento de resultados e apresentação de indicadores à gestão, em apoio à decisão',
        ],
        technologies: ['SQL', 'MySQL', 'Excel'],
        milestones: ['operacao', 'gestao'],
        projects: [
          { label: 'BI operacional', href: '/projetos/bi-operacional-logistica/' },
          { label: 'Análise preditiva operacional', href: '/projetos/analise-preditiva-operacional/' },
        ],
      },
      {
        title: 'Aprendiz',
        period: { start: '2018-12', end: '2020-08' },
        type: 'Meio período',
        mode: 'Presencial',
        location: 'São Paulo, Brasil',
      },
    ],
  },
  {
    id: 'transface',
    company: { name: 'Transface Transportes Ltda.', url: 'https://www.linkedin.com/company/11483540/' },
    roles: [
      {
        title: 'Assistente Administrativo',
        period: { start: '2021-11', end: '2022-08' },
        type: 'Tempo integral',
        mode: 'Presencial',
        location: 'São Paulo, São Paulo, Brasil',
        technologies: ['Expedição'],
      },
    ],
  },
];

export const career: CareerEntry[] = [
  {
    id: 'operacao',
    stage: 'Operação logística',
    headline: 'Onde tudo começou',
    context:
      'O início foi como assistente na operação logística, entre controles em Excel e os indicadores que mostravam se o dia tinha ido bem. Nessa fase nasceu o hábito de medir e de procurar a causa dos desvios.',
    responsibilities: [
      'Controles operacionais e indicadores em Excel',
      'Acompanhamento de produtividade, coletas e entregas',
      'Controle de extravios e avarias',
      'Análises de risco e primeiras análises preditivas ligadas à operação',
    ],
    domains: ['Operação logística', 'Qualidade operacional'],
    technologies: ['Excel'],
    projects: [
      { label: 'BI operacional', href: '/projetos/bi-operacional-logistica/' },
      { label: 'Análise preditiva operacional', href: '/projetos/analise-preditiva-operacional/' },
    ],
    evidence: 'declarado',
  },
  {
    id: 'gestao',
    stage: 'Gestão e indicadores executivos',
    headline: 'Do controle da operação à leitura gerencial',
    context:
      'Os números passaram a servir também a gestores e à diretoria. O trabalho deixou de ser só acompanhar e passou a ser apontar desvios, propor melhorias e apoiar decisões.',
    responsibilities: [
      'Produção de indicadores e relatórios gerenciais e executivos',
      'Apresentação de resultados à gestão e à diretoria',
      'Análise de desempenho e identificação de desvios',
      'Planos de melhoria e apoio à tomada de decisão',
    ],
    domains: ['Gestão', 'Indicadores executivos'],
    technologies: ['Excel'],
    projects: [{ label: 'Visão executiva do BI operacional', href: '/projetos/bi-operacional-logistica/' }],
    evidence: 'declarado',
  },
  {
    id: 'bi',
    stage: 'Business Intelligence',
    headline: 'Estruturar o dado para durar',
    context:
      'Planilhas chegaram ao limite. A solução foi organizar o dado: consultas, modelo dimensional, medidas e publicação em workspaces com definições únicas, cuidando também da experiência de quem lê o painel.',
    responsibilities: [
      'Construção de dashboards e modelos semânticos',
      'Modelagem dimensional e preparação de dados',
      'Organização de workspaces e governança de indicadores',
      'UX e UI de soluções analíticas',
    ],
    domains: ['Business Intelligence operacional', 'Governança de dados'],
    technologies: ['Power BI', 'DAX', 'Power Query', 'SQL Server'],
    projects: [
      { label: 'BI operacional', href: '/projetos/bi-operacional-logistica/' },
      { label: 'BI comercial', href: '/projetos/inteligencia-comercial-crm/' },
    ],
    evidence: 'declarado',
  },
  {
    id: 'comercial',
    stage: 'Inteligência comercial',
    headline: 'Do indicador ao processo comercial',
    context:
      'O olhar de dados chegou à área comercial: oportunidades, propostas, conversão, preço e rentabilidade. Foi preciso entender o CRM e automatizar o que dependia de repetição manual.',
    responsibilities: [
      'Acompanhamento do pipeline de oportunidades e do funil comercial',
      'Indicadores de hit rate, rentabilidade e pricing',
      'Automações, fluxos de aprovação e integrações entre sistemas',
    ],
    domains: ['Comercial', 'Precificação', 'CRM, ERP e TMS'],
    technologies: ['Salesforce', 'Power Automate', 'Power BI', 'SQL Server'],
    projects: [
      { label: 'BI comercial', href: '/projetos/inteligencia-comercial-crm/' },
      { label: 'Automações e integrações', href: '/projetos/integracoes-automacoes/' },
    ],
    evidence: 'declarado',
  },
  {
    id: 'engenharia',
    stage: 'Engenharia de software e produtos',
    headline: 'Construir a solução, e não só o relatório',
    context:
      'Quando o problema pedia mais que um painel, a resposta passou a ser software. O EasyPrice reúne regras de negócio, API, interface e banco em uma plataforma de precificação, com decisões de arquitetura e de hospedagem em ambiente Windows.',
    responsibilities: [
      'Desenvolvimento do EasyPrice, da regra de negócio à interface',
      'APIs REST, integrações e arquitetura de aplicações',
      'Hospedagem e infraestrutura da aplicação, conforme a documentação do projeto',
    ],
    domains: ['Precificação', 'Engenharia de software', 'Infraestrutura de aplicações'],
    technologies: ['Python', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'SQL Server', 'IIS'],
    projects: [
      { label: 'EasyPrice', href: '/projetos/simulador-preco-rodoviario/' },
      { label: 'Normalização de municípios', href: '/projetos/normalizacao-cidades-ibge/' },
      { label: 'IIS e Windows Server', href: '/projetos/iis-windows-server/' },
    ],
    evidence: 'codigo',
  },
];
