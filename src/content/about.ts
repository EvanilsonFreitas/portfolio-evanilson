/** Textos de apresentação. Redação em primeira pessoa, apenas com escopo declarado ou comprovado. */
export const about = {
  paragraphs: [
    'Meu ponto de partida é o problema de negócio. Antes de modelar dados ou escrever código, procuro entender como a operação funciona: quem decide, com que informação e o que muda quando um número muda.',
    'Uso dados para enxergar a operação com precisão. Defino cada indicador com fórmula e granularidade explícitas, modelo o dado de forma dimensional e construo análises de BI comerciais e operacionais.',
    'Quando a necessidade vai além do relatório, transformo requisitos em sistemas e automações: APIs, regras de negócio, integrações entre sistemas e aplicações web. O EasyPrice, motor de precificação em cujo desenvolvimento atuo, é o exemplo mais completo.',
    'O que une essas frentes é a decisão. O trabalho só termina quando alguém consegue agir melhor com o que foi entregue.',
  ],
};

export interface Milestone {
  label: string;
  title: string;
  text: string;
  /** Apenas quando há data comprovada. */
  when?: string;
  href?: string;
}

/** Marcos de evolução. Sem cargos e sem cronologia inventada: só há datas onde existem registros. */
export const trajectory: Milestone[] = [
  {
    label: 'Fundação',
    title: 'Sistemas de informação',
    text: 'Graduação em Análise e Desenvolvimento de Sistemas, base de programação, banco de dados e engenharia de software.',
    when: 'Concluída em 2024',
    href: '/educacao/',
  },
  {
    label: 'Dados',
    title: 'Indicadores, análises e BI',
    text: 'Construção de análises e soluções de Business Intelligence com modelagem dimensional, Power Query e DAX, voltadas à gestão comercial e operacional.',
    href: '/projetos/bi-operacional-logistica/',
  },
  {
    label: 'Integração',
    title: 'Automação e integração de sistemas',
    text: 'Automação de processos e integração entre sistemas por APIs, com atenção a validação, rastreabilidade e tratamento de erros.',
    href: '/projetos/integracoes-automacoes/',
  },
  {
    label: 'Produto',
    title: 'Aplicações e motor de precificação',
    text: 'Desenvolvimento do EasyPrice (Python, FastAPI, Next.js, SQL Server) e de outras aplicações, da regra de negócio à interface.',
    when: 'EasyPrice: histórico de código desde maio de 2026',
    href: '/projetos/simulador-preco-rodoviario/',
  },
  {
    label: 'Ciência de dados',
    title: 'MBA em Data Science',
    text: 'Pós-graduação lato sensu pela USP/ESALQ, concluída, que reforça a base quantitativa dos projetos.',
    href: '/educacao/',
  },
];

export interface BusinessDomain {
  number: string;
  title: string;
  question: string;
  text: string;
  topics: string[];
  href: string;
  linkLabel: string;
}

/** Conhecimento de negócio: o que cada área precisa enxergar e decidir. */
export const businessDomains: BusinessDomain[] = [
  {
    number: 'A',
    title: 'Comercial',
    question: 'Quais oportunidades merecem atenção e quanto se espera fechar?',
    text: 'Funil, pipeline e forecast só ajudam quando cada estágio e cada indicador têm definição única. O foco é transformar o CRM em leitura gerencial.',
    topics: ['Gestão de oportunidades', 'Funil e conversão por estágio', 'Forecast ponderado', 'Propostas e carteira', 'Precificação e rentabilidade'],
    href: '/projetos/inteligencia-comercial-crm/',
    linkLabel: 'Inteligência comercial e CRM',
  },
  {
    number: 'B',
    title: 'Operacional',
    question: 'A operação está cumprindo o combinado, e onde está o desvio?',
    text: 'SLA, volumes e ocorrências precisam ser comparáveis por unidade, região e período, com tratamento explícito de dados ausentes.',
    topics: ['SLA e cumprimento de metas', 'Coletas e entregas', 'Ocorrências e qualidade', 'Produtividade e capacidade', 'Comparação entre períodos'],
    href: '/projetos/bi-operacional-logistica/',
    linkLabel: 'BI operacional',
  },
  {
    number: 'C',
    title: 'Financeira e precificação',
    question: 'Quanto cobrar, com qual margem, e o que muda se o custo mudar?',
    text: 'Custo, preço, margem e markup são coisas diferentes. A precificação precisa de regras explícitas, parâmetros revisáveis e comparação de cenários.',
    topics: ['Custos e formação de preço', 'Margem e markup', 'Análise de sensibilidade', 'Comparação de cenários', 'Rentabilidade da proposta'],
    href: '/projetos/simulador-preco-rodoviario/',
    linkLabel: 'EasyPrice',
  },
  {
    number: 'D',
    title: 'Sistemas e integração',
    question: 'Como CRM, precificação, ERP, TMS e BI conversam sem divergir?',
    text: 'Cada sistema tem uma responsabilidade. A integração define identificadores, validações, sincronização, tratamento de erros e auditoria.',
    topics: ['CRM, ERP e TMS', 'APIs e contratos', 'Identificadores de integração', 'Consistência e auditoria', 'Automação de processos'],
    href: '/projetos/integracoes-automacoes/',
    linkLabel: 'Integrações e automações',
  },
];
