/** Apresentação pessoal. A saudação abre o hero; o título e o texto pertencem à seção Sobre. Primeira pessoa, apenas com a trajetória informada pelo proprietário. */
export const about = {
  /** Título da seção Sobre. */
  title: 'Muito além da tecnologia.',
  /** Saudação exibida no início do hero. */
  greeting: 'Olá, prazer. Sou o Evanilson.',
  /** Emoji decorativo, exibido ao final da saudação e ocultado de leitores de tela. */
  emoji: '👋',
  /** Trecho em destaque discreto dentro do último parágrafo. */
  highlight: 'MBA em Data Science pela USP/ESALQ',
  paragraphs: [
    'Minha trajetória começou na operação logística, entre Excel, controles e indicadores de produtividade, extravios e avarias. Com o tempo, passei a desenvolver análises para a gestão, soluções de Business Intelligence, inteligência comercial e automações.',
    'Hoje atuo em Business Intelligence, aplicando minha experiência em análise de dados, inteligência comercial, precificação e desenvolvimento de software para construir soluções que apoiam decisões de negócio.',
    'Sou formado em Tecnologia em Análise e Desenvolvimento de Sistemas pela Uninove e concluí o MBA em Data Science pela USP/ESALQ. Gosto de entender como o negócio funciona antes de pensar na tecnologia: é essa combinação entre visão operacional, análise e engenharia que orienta meu trabalho.',
  ],
  cta: 'Conheça minha trajetória',
};

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
  {
    number: 'E',
    title: 'Infraestrutura e entrega',
    question: 'Como a aplicação chega ao ar, com segurança e com controle de versão?',
    text: 'Uma boa solução precisa ser publicada, protegida e observada. Isso envolve hospedagem, identidade, rede, ambientes separados e um caminho de entrega que permita revisar e voltar atrás.',
    topics: ['IIS e proxy reverso', 'Windows Server e VMs', 'Autenticação e permissões', 'Azure e Azure DevOps (estudo)', 'CI/CD'],
    href: '/projetos/iis-windows-server/',
    linkLabel: 'IIS e Windows Server',
  },
];
