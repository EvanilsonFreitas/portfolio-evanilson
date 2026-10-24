import type { Project } from './types.ts';

export const projects: Project[] = [
  {
    slug: 'simulador-preco-rodoviario',
    number: '01',
    title: 'EasyPrice',
    category: 'Plataforma de precificação',
    summary:
      'Plataforma web para simulação de preços de frete rodoviário (LTL e FTL), baseada em regras de pricing e na metodologia cost-plus.',
    nature: 'corporate',
    natureLabel: 'Corporativo',
    role: 'Participação no desenvolvimento da plataforma.',
    status: 'Aplicação corporativa. Detalhes de implantação não são divulgados.',
    access: 'Código, telas e regras comerciais não são públicos.',
    stack: ['Python', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'SQL Server'],
    context: {
      problem:
        'Uma cotação de frete combina rota, tipo de carga, modalidade e custos operacionais. Quando o cálculo vive em planilhas isoladas, as regras divergem entre usuários e fica difícil auditar como um preço foi formado.',
      environment:
        'Operação de transporte rodoviário de cargas, com cotações nas modalidades LTL (carga fracionada) e FTL (carga fechada).',
      objective:
        'Concentrar a precificação em uma plataforma única: parâmetros explícitos, simulação reproduzível e acesso controlado.',
      constraints: [
        'Regras comerciais, parâmetros e dados são confidenciais e não são publicados.',
        'A demonstração desta página usa um modelo didático com dados sintéticos.',
      ],
    },
    strategy: {
      approach:
        'Metodologia cost-plus: o preço parte do custo e aplica a margem-alvo. As regras ficam separadas da interface e os parâmetros são tratados como dados, não como constantes no código.',
      decisions: [
        {
          decision: 'Separar interface, serviço e persistência',
          reason: 'Cada camada evolui sem quebrar as outras, e o cálculo pode ser testado sem a interface.',
        },
        {
          decision: 'Parâmetros como dados',
          reason: 'Ajustes de margem e custo não exigem alterar o código.',
        },
        {
          decision: 'Contrato de API tipado',
          reason: 'FastAPI valida a entrada e TypeScript reduz divergências entre cliente e servidor.',
        },
        {
          decision: 'Governança de acesso',
          reason: 'Nem todo usuário deve consultar ou alterar os mesmos parâmetros.',
        },
      ],
    },
    architecture: {
      caption: 'Visão conceitual. Não reproduz a estrutura interna real.',
      layers: [
        { title: 'Apresentação', nodes: [{ name: 'React · Next.js · TypeScript', note: 'Formulário de simulação e resultados' }] },
        { title: 'Serviço', nodes: [{ name: 'Python · FastAPI', note: 'Validação, regras cost-plus e API' }] },
        { title: 'Dados', nodes: [{ name: 'SQL Server', note: 'Parâmetros e simulações' }] },
      ],
      crosscutting: 'Governança de acesso em todas as camadas',
    },
    implementation: {
      intro:
        'O centro da solução é o cálculo de preço a partir de parâmetros. A interface coleta os dados da cotação, a API aplica as regras e devolve preço e margem de forma consistente.',
      flowTitle: 'Fluxo conceitual de uma simulação',
      flow: [
        'Entrada dos parâmetros da cotação',
        'Validação dos dados na API',
        'Aplicação das regras de pricing (cost-plus)',
        'Cálculo do preço e da margem',
        'Registro da simulação',
        'Apresentação e comparação de cenários',
      ],
    },
    demo: 'pricing',
    challenges: [
      {
        title: 'Regras que mudam',
        text: 'Parâmetros comerciais mudam com frequência. Tratá-los como dados evita nova publicação a cada ajuste.',
      },
      {
        title: 'Rastreabilidade',
        text: 'Para revisar um preço é preciso saber quais parâmetros foram usados. Isso orienta o registro de cada simulação.',
      },
    ],
    outcomes: [
      'Não há resultados quantitativos autorizados para divulgação.',
      'Benefício esperado: padronizar a formação de preço e facilitar a revisão de cada simulação.',
    ],
    learning:
      'Separar a regra de negócio da interface torna o cálculo testável e reaproveitável por outros canais.',
    next: 'marivan-finance',
  },
  {
    slug: 'marivan-finance',
    number: '02',
    title: 'Marivan Finance',
    category: 'Aplicação web · planejamento financeiro',
    summary:
      'Aplicação web para controle e planejamento financeiro: despesas, categorias, rateios, comprovantes e indicadores.',
    nature: 'personal',
    natureLabel: 'Projeto autoral',
    role: 'Desenvolvimento da aplicação.',
    status: 'Estado de implantação não divulgado.',
    access: 'Repositório privado. Não há link público e nenhum dado financeiro é exibido.',
    stack: ['ASP.NET Core 10', 'C#', 'Entity Framework Core', 'SQL Server', 'Windows Authentication', 'IIS', 'GitHub'],
    context: {
      problem:
        'Planejar o orçamento e acompanhar despesas exige categorizar gastos, dividir custos e guardar comprovantes. Essas tarefas costumam ficar espalhadas entre planilhas e arquivos.',
      environment: 'Aplicação web hospedada em IIS, com identidade integrada ao Windows.',
      objective:
        'Reunir planejamento, despesas, categorias, rateios, comprovantes e indicadores em uma única aplicação.',
      constraints: [
        'O repositório é privado.',
        'Nenhuma informação financeira real é apresentada neste portfólio.',
      ],
    },
    strategy: {
      approach:
        'Aplicação em camadas sobre o ecossistema .NET: interface web, regras de negócio em C# e persistência com Entity Framework Core sobre SQL Server.',
      decisions: [
        {
          decision: 'Arquitetura em camadas',
          reason: 'Mantém regras de planejamento e rateio fora da interface e do acesso a dados.',
        },
        {
          decision: 'Entity Framework Core sobre SQL Server',
          reason: 'Modelo de dados versionável e consultas tipadas.',
        },
        {
          decision: 'Windows Authentication',
          reason: 'A identidade vem do ambiente, sem gerenciar senhas na aplicação.',
        },
        {
          decision: 'Versionamento e CI/CD no GitHub',
          reason: 'Histórico rastreável e entrega repetível da aplicação.',
        },
      ],
    },
    architecture: {
      caption: 'Visão em camadas da aplicação.',
      layers: [
        { title: 'Hospedagem', nodes: [{ name: 'IIS', note: 'Servidor da aplicação' }] },
        { title: 'Aplicação', nodes: [{ name: 'ASP.NET Core 10 · C#', note: 'Interface web e regras de negócio' }] },
        { title: 'Persistência', nodes: [{ name: 'Entity Framework Core', note: 'Mapeamento e consultas' }, { name: 'SQL Server', note: 'Armazenamento' }] },
      ],
      crosscutting: 'Windows Authentication em toda a aplicação',
    },
    implementation: {
      intro: 'O escopo funcional organiza a vida financeira em cinco áreas, todas sobre o mesmo modelo de dados.',
      flowTitle: 'Áreas funcionais',
      flow: [
        'Planejamento financeiro',
        'Organização de despesas',
        'Categorias',
        'Rateios',
        'Comprovantes',
        'Indicadores financeiros',
      ],
    },
    challenges: [
      {
        title: 'Rateios exatos',
        text: 'Dividir um valor entre categorias ou pessoas exige uma regra explícita para arredondamento, de modo que as partes somem sempre o total.',
      },
      {
        title: 'Comprovantes',
        text: 'Arquivos associados a registros financeiros pedem controle de acesso e de tamanho.',
      },
    ],
    outcomes: [
      'Demonstra desenvolvimento de ponta a ponta no ecossistema .NET, do banco à interface.',
      'Não há métricas de uso divulgadas.',
    ],
    learning: 'Regras financeiras pedem precisão: tipos decimais, testes de arredondamento e totais conferíveis.',
    next: 'bi-operacional-logistica',
  },
  {
    slug: 'bi-operacional-logistica',
    number: '03',
    title: 'BI operacional em logística',
    category: 'Business Intelligence · análise operacional',
    summary:
      'Estudo de BI aplicado a operações logísticas, com dados simulados: volume, entregas, ocorrências e SLA por período e região.',
    nature: 'demonstration',
    natureLabel: 'Demonstração',
    role: 'Concepção do modelo analítico e implementação da demonstração.',
    status: 'Demonstração com dados simulados. Não é um projeto corporativo.',
    access: 'Os números não pertencem a nenhuma empresa e não representam resultados reais.',
    stack: ['Modelagem dimensional', 'SQL', 'ETL', 'Power BI', 'DAX'],
    stackNote:
      'Ferramentas descritas como abordagem. A demonstração interativa desta página é implementada em TypeScript, React e SVG.',
    context: {
      problem:
        'Operações logísticas geram eventos em volume: entregas, prazos e ocorrências. Sem um modelo comum, cada área mede o SLA de um jeito e os desvios aparecem tarde.',
      environment: 'Operação logística simulada, com quatro regiões e doze meses de histórico.',
      objective:
        'Mostrar como um modelo dimensional e poucos indicadores bem definidos permitem localizar desvios de SLA por período e região.',
      constraints: [
        'Todos os dados são sintéticos e gerados de forma determinística.',
        'Nenhum dado, marca ou indicador de empresa real é usado.',
      ],
    },
    strategy: {
      approach:
        'Definir primeiro o grão e as medidas, depois visualizar. O grão é uma linha por região e mês; as medidas derivam de somas, não de médias de percentuais.',
      decisions: [
        {
          decision: 'SLA como razão de somas',
          reason: 'Soma de entregas no prazo dividida pela soma de entregas. A média de percentuais distorce regiões de volumes diferentes.',
        },
        {
          decision: 'Comparar períodos de mesma duração',
          reason: 'Evita comparar três meses com seis e atribuir a diferença ao desempenho.',
        },
        {
          decision: 'Dados ausentes explícitos',
          reason: 'Um mês sem dados aparece como lacuna e é excluído das somas, nunca tratado como zero.',
        },
      ],
    },
    architecture: {
      caption: 'Arquitetura de referência (conceitual).',
      layers: [
        { title: 'Fontes', nodes: [{ name: 'Entregas' }, { name: 'Ocorrências' }, { name: 'Cadastros' }] },
        { title: 'ETL', nodes: [{ name: 'Extração, validação e padronização' }] },
        { title: 'Modelo dimensional', nodes: [{ name: 'Fato de entregas' }, { name: 'Dimensões de tempo e região' }] },
        { title: 'Consumo', nodes: [{ name: 'Medidas e painel' }] },
      ],
    },
    implementation: {
      intro:
        'No modelo dimensional, a tabela fato guarda contagens aditivas. O SLA é uma medida calculada sobre elas, o que mantém o resultado correto em qualquer filtro.',
      flowTitle: 'Etapas do raciocínio',
      flow: [
        'Definir o grão: região e mês',
        'Registrar contagens aditivas na fato',
        'Calcular o SLA como medida',
        'Filtrar por período e região',
        'Comparar com o período anterior',
      ],
      code: {
        label: 'Exemplo de medida em DAX',
        source: 'SLA % =\nDIVIDE(\n    SUM(fato_entregas[entregas_no_prazo]),\n    SUM(fato_entregas[entregas])\n)',
      },
    },
    demo: 'operations',
    challenges: [
      {
        title: 'Dados ausentes',
        text: 'Uma região sem registro em um mês não pode contar como zero entregas. A demonstração mostra a lacuna e informa a cobertura do período.',
      },
      {
        title: 'Agregar sem distorcer',
        text: 'Percentuais não se somam nem se promediam diretamente. O cálculo sempre parte das contagens.',
      },
    ],
    outcomes: [
      'Não há resultado de negócio: a demonstração mostra método, não desempenho real.',
      'Benefício esperado do método: um indicador único e auditável de SLA para todas as áreas.',
    ],
    learning: 'Definir grão e medidas antes do visual evita retrabalho e discussões sobre qual número está certo.',
    next: 'simulador-preco-rodoviario',
  },
];

/** Endereços antigos preservados como páginas de redirecionamento. */
export const legacySlugs: Record<string, string> = {
  'analise-bids-logisticos': 'simulador-preco-rodoviario',
  'governanca-fluxo-gbs': 'bi-operacional-logistica',
};

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
