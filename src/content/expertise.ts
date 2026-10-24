import type { ExpertisePillar } from './types.ts';

export const expertise: ExpertisePillar[] = [
  {
    number: '01',
    title: 'Business Intelligence & Analytics',
    solves: 'Transformar dados operacionais em indicadores bem definidos, comparáveis e fáceis de ler.',
    tech: ['Power BI', 'DAX', 'Power Query', 'Modelagem dimensional', 'Indicadores'],
    evidence: [
      { label: 'BI operacional com dados simulados', kind: 'demonstration', href: '/projetos/bi-operacional-logistica/' },
      { label: 'Artigos sobre DAX e Star Schema', kind: 'article', href: '/blog/' },
    ],
  },
  {
    number: '02',
    title: 'Data Science & Engenharia de Dados',
    solves: 'Preparar, modelar e analisar dados com método estatístico e rastreabilidade.',
    tech: ['Python', 'SQL', 'Estatística', 'ETL', 'Machine Learning'],
    evidence: [
      { label: 'MBA em Data Science', kind: 'academic', href: '/educacao/' },
      { label: 'EasyPrice: Python e SQL Server', kind: 'applied', href: '/projetos/simulador-preco-rodoviario/' },
    ],
  },
  {
    number: '03',
    title: 'Engenharia de Software',
    solves: 'Construir aplicações web com regras de negócio testáveis, acesso a dados e interface clara.',
    tech: ['TypeScript', 'React', 'Next.js', 'Python', 'FastAPI', 'C#', 'ASP.NET Core', 'Entity Framework Core', 'SQL Server', 'Git'],
    evidence: [
      { label: 'EasyPrice', kind: 'applied', href: '/projetos/simulador-preco-rodoviario/' },
      { label: 'Marivan Finance', kind: 'personal', href: '/projetos/marivan-finance/' },
    ],
  },
  {
    number: '04',
    title: 'Análise de Negócios & Precificação',
    solves: 'Traduzir regras de negócio em modelos e cálculos explícitos, com parâmetros revisáveis e acesso controlado.',
    tech: ['Metodologia cost-plus', 'Regras de pricing', 'Análise de sensibilidade', 'Indicadores', 'Governança de acesso'],
    evidence: [
      { label: 'EasyPrice: precificação cost-plus', kind: 'applied', href: '/projetos/simulador-preco-rodoviario/' },
      { label: 'Modelo didático de precificação', kind: 'demonstration', href: '/projetos/simulador-preco-rodoviario/' },
    ],
  },
];
