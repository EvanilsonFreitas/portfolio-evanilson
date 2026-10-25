/** Textos de apresentação. Redação em primeira pessoa, apenas com escopo declarado ou comprovado. */
export const about = {
  paragraphs: [
    'Comecei na operação logística, entre controles em Excel e indicadores de produtividade e qualidade. Dali veio meu ponto de partida: o problema de negócio. Antes de modelar dados ou escrever código, procuro entender como o processo funciona, quem decide, com que informação e o que muda quando um número muda.',
    'Uso dados para enxergar a operação com precisão. Defino cada indicador com fórmula e granularidade explícitas, modelo o dado de forma dimensional e construo análises de BI comerciais e operacionais.',
    'Quando a necessidade vai além do relatório, transformo requisitos em sistemas e automações: APIs, regras de negócio, integrações entre sistemas e aplicações web, sempre pensando em como serão hospedadas e operadas. O EasyPrice, motor de precificação em cujo desenvolvimento atuo, é o exemplo mais completo.',
    'O que une essas frentes é a decisão. O trabalho só termina quando alguém consegue agir melhor com o que foi entregue.',
  ],
};

export interface Milestone {
  label: string;
  title: string;
  text: string;
  /** Temas da etapa. */
  topics: string[];
  href?: string;
  linkLabel?: string;
}

/**
 * Evolução profissional, em etapas. Sem datas, empregadores ou cargos: o proprietário descreve
 * a sequência, e o portfólio não acrescenta o que não foi confirmado.
 */
export const trajectory: Milestone[] = [
  {
    label: 'Operação e Excel',
    title: 'Onde tudo começou: a operação logística',
    text: 'O ponto de partida foi a rotina da operação: controles em Excel, acompanhamento de coletas e entregas, e os indicadores que mostravam se o dia tinha ido bem. Dali vieram o hábito de medir produtividade, qualidade e ocorrências, e o primeiro contato com análise de risco e de tendência. Foi nessa fase que o pensamento analítico nasceu, ao lado de quem executa o processo.',
    topics: ['Controles em Excel', 'Produtividade', 'Coletas e entregas', 'Extravio e avaria', 'Qualidade operacional'],
  },
  {
    label: 'Gestão e diretoria',
    title: 'Do controle da operação à leitura gerencial',
    text: 'Com a responsabilidade crescendo, os números deixaram de servir só ao dia a dia e passaram a sustentar conversas com gestão e diretoria. O trabalho passou a ser apontar desvios, propor planos de melhoria, antecipar riscos e apresentar resultados de forma que apoiasse uma decisão.',
    topics: ['Indicadores gerenciais e executivos', 'Análise de desvios', 'Planos de melhoria', 'Análise de risco', 'Apresentação de resultados'],
  },
  {
    label: 'Business Intelligence',
    title: 'Estruturar o dado para durar',
    text: 'Planilhas chegaram ao limite. A etapa seguinte foi organizar o dado: consultas em SQL, tratamento no Power Query, modelagem dimensional e medidas em DAX, publicados em workspaces com definições únicas. Aqui entraram também o cuidado com a experiência de quem lê o painel e com a governança dos indicadores.',
    topics: ['Power BI', 'SQL', 'Power Query', 'DAX', 'Modelagem dimensional', 'Modelo semântico', 'UX/UI e visualização de dados'],
    href: '/projetos/bi-operacional-logistica/',
    linkLabel: 'BI operacional',
  },
  {
    label: 'Inteligência comercial e integrações',
    title: 'Do indicador ao processo comercial',
    text: 'O olhar de dados chegou à área comercial: oportunidades, propostas, conversão, preço e rentabilidade. Para isso foi preciso entender CRM e as ligações com ERP e TMS, e automatizar o que dependia de repetição manual, como aprovações, solicitações e notificações.',
    topics: ['CRM e Salesforce', 'Funil, hit rate e tracker', 'Rentabilidade e price', 'Power Automate', 'Integrações', 'SQL Server'],
    href: '/projetos/inteligencia-comercial-crm/',
    linkLabel: 'BI comercial',
  },
  {
    label: 'Produtos e engenharia',
    title: 'Construir a solução, e não só o relatório',
    text: 'Quando o problema pedia mais do que um painel, a resposta passou a ser software. O EasyPrice reúne regras de negócio, API, interface e banco em uma plataforma de precificação, com decisões de arquitetura, autenticação e hospedagem em ambiente Windows.',
    topics: ['EasyPrice', 'Python e FastAPI', 'Next.js, React e TypeScript', 'SQL Server', 'Arquitetura', 'IIS e Windows Server'],
    href: '/projetos/simulador-preco-rodoviario/',
    linkLabel: 'EasyPrice',
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
