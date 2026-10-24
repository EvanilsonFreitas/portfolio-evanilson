import type { Education } from './types.ts';

export const education: Education[] = [
  {
    id: 'mba',
    kind: 'mba',
    title: 'MBA em Data Science',
    institution: 'USP/ESALQ',
    status: 'Concluído',
    dates: [],
    summary:
      'Pós-graduação lato sensu em Data Science, voltada à aplicação de dados a decisões de negócio.',
    appliedIn: [
      'As demonstrações analíticas do portfólio aplicam raciocínio quantitativo: SLA como razão de somas, comparação de períodos e análise de sensibilidade.',
      'A base estatística apoia a análise e a modelagem dos projetos.',
    ],
    note: 'A instituição é citada como local de formação. Não implica endosso deste portfólio.',
  },
  {
    id: 'ads',
    kind: 'graduation',
    title: 'Análise e Desenvolvimento de Sistemas',
    institution: 'Universidade Nove de Julho (Uninove)',
    status: 'Concluído',
    dates: ['Conclusão do curso: 30/06/2024', 'Colação de grau: 30/07/2024'],
    summary:
      'Graduação tecnológica voltada ao desenvolvimento de sistemas.',
    appliedIn: [
      'Fundamento dos projetos de software: EasyPrice e Marivan Finance.',
      'Este portfólio, desenvolvido em TypeScript, React e Next.js.',
    ],
  },
  {
    id: 'masters',
    kind: 'masters',
    title: 'Mestrado em Engenharia de Software',
    status: 'Matriculado',
    dates: [],
    summary:
      'Formação stricto sensu em andamento. Instituição, tema e previsão de conclusão não são divulgados neste momento.',
    appliedIn: [],
  },
];
