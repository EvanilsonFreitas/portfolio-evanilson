import type { ExpertisePillar } from './types.ts';

/** Especialidades. Cada grupo aponta para a evidência e indica sua natureza. */
export const expertise: ExpertisePillar[] = [
  {
    number: '01',
    title: 'Business Intelligence e Analytics',
    solves: 'Transformar dados em indicadores com definição única, comparáveis e fáceis de ler, para a gestão comercial e operacional.',
    tech: ['Power BI', 'DAX', 'Power Query', 'Modelagem dimensional', 'Indicadores e metas'],
    evidence: [
      { label: 'BI operacional com dados simulados', kind: 'demonstration', href: '/projetos/bi-operacional-logistica/' },
      { label: 'Inteligência comercial e CRM', kind: 'study', href: '/projetos/inteligencia-comercial-crm/' },
      { label: 'Artigos sobre DAX e Star Schema', kind: 'article', href: '/blog/' },
      { label: 'Análise preditiva operacional', kind: 'study', href: '/projetos/analise-preditiva-operacional/' },
    ],
  },
  {
    number: '02',
    title: 'Engenharia de dados e SQL Server',
    solves: 'Preparar, modelar e consultar dados com T-SQL, índices e plano de execução, mantendo rastreabilidade.',
    tech: ['SQL Server', 'T-SQL', 'ETL', 'Python', 'Normalização de dados'],
    evidence: [
      { label: 'SQL Server em profundidade', kind: 'study', href: '/projetos/sql-server-avancado/' },
      { label: 'Normalização de cidades', kind: 'study', href: '/projetos/normalizacao-cidades-ibge/' },
      { label: 'EasyPrice: Python e SQL Server', kind: 'applied', href: '/projetos/simulador-preco-rodoviario/' },
    ],
  },
  {
    number: '03',
    title: 'Engenharia de Software',
    solves: 'Construir aplicações web com regras de negócio testáveis, acesso a dados e interface clara.',
    tech: ['Python', 'FastAPI', 'TypeScript', 'React', 'Next.js', 'C#', 'ASP.NET Core', 'Entity Framework Core', 'Git'],
    evidence: [
      { label: 'EasyPrice', kind: 'applied', href: '/projetos/simulador-preco-rodoviario/' },
      { label: 'Marivan Finance', kind: 'personal', href: '/projetos/marivan-finance/' },
      { label: 'Engenharia de sistemas e infraestrutura', kind: 'study', href: '/projetos/engenharia-sistemas-infraestrutura/' },
    ],
  },
  {
    number: '04',
    title: 'Integrações e automações',
    solves: 'Ligar sistemas por APIs com autenticação, validação, tentativas repetidas e idempotência, e automatizar tarefas de processo.',
    tech: ['REST', 'OAuth 2.0', 'JWT', 'Webhooks', 'Power Automate'],
    evidence: [
      { label: 'Integrações e automações', kind: 'study', href: '/projetos/integracoes-automacoes/' },
      { label: 'APIs do EasyPrice', kind: 'applied', href: '/projetos/simulador-preco-rodoviario/' },
    ],
  },
  {
    number: '05',
    title: 'Precificação e análise de negócios',
    solves: 'Traduzir regras de negócio em modelos explícitos: custo, preço, margem e cenários, com parâmetros revisáveis.',
    tech: ['Cost-plus', 'Margem e markup', 'Análise de sensibilidade', 'Governança de acesso'],
    evidence: [
      { label: 'EasyPrice: motor de precificação', kind: 'applied', href: '/projetos/simulador-preco-rodoviario/' },
      { label: 'Modelo didático de precificação', kind: 'demonstration', href: '/projetos/simulador-preco-rodoviario/' },
    ],
  },
  {
    number: '06',
    title: 'Data Science e IA aplicada',
    solves: 'Aplicar método estatístico e estudar arquiteturas de IA com atenção a avaliação e limites. Os estudos de IA não estão implantados.',
    tech: ['Estatística', 'Python', 'RAG', 'Agentes (estudo)'],
    evidence: [
      { label: 'MBA em Data Science', kind: 'academic', href: '/educacao/' },
      { label: 'IA aplicada: RAG e agentes', kind: 'study', href: '/projetos/ia-rag-agentes/' },
    ],
  },
  {
    number: '07',
    title: 'Infraestrutura, cloud e entrega',
    solves: 'Hospedar, proteger e publicar aplicações com controle: proxy reverso, identidade, ambientes separados e fluxo de entrega revisável.',
    tech: ['IIS', 'Windows Server', 'Proxy reverso', 'Git e pull requests', 'CI/CD (conceitos)', 'Azure e Azure DevOps (estudo)'],
    evidence: [
      { label: 'IIS e Windows Server', kind: 'study', href: '/projetos/iis-windows-server/' },
      { label: 'Microsoft Azure', kind: 'study', href: '/projetos/arquitetura-azure/' },
      { label: 'Azure DevOps e CI/CD', kind: 'study', href: '/projetos/azure-devops-cicd/' },
      { label: 'Arquitetura e implantação do EasyPrice', kind: 'applied', href: '/projetos/simulador-preco-rodoviario/' },
    ],
  },
];
