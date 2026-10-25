import type { Project } from './types.ts';

export const projects: Project[] = [
  {
    slug: 'simulador-preco-rodoviario',
    crumb: 'EasyPrice',
    domain: 'Precificação e Rentabilidade',
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
    deepDive: [
      {
        title: 'Como o motor de precificação se organiza',
        blocks: [
          { kind: 'p', text: 'Uma simulação atravessa quatro responsabilidades separadas: validar a cotação, resolver a rota, aplicar as regras de preço e registrar o resultado. Separá-las permite testar cada uma sem as outras.' },
          { kind: 'diagram', id: 'pricing-engine', caption: 'Visão conceitual do motor de precificação. Não reproduz estrutura, regras ou parâmetros reais.' },
          {
            kind: 'table',
            title: 'Responsabilidades',
            head: ['Responsabilidade', 'O que garante'],
            rows: [
              ['Validação de entrada', 'Dados da cotação completos e coerentes antes de qualquer cálculo.'],
              ['Resolução de cidades', 'Nomes digitados de forma livre viram identificadores únicos de origem e destino.'],
              ['Regras de preço', 'Parâmetros lidos como dados, aplicados de forma determinística e reproduzível.'],
              ['Acesso e governança', 'Cada perfil consulta ou altera apenas o que lhe cabe.'],
              ['Registro', 'Cada simulação guarda os parâmetros usados, para revisão posterior.'],
            ],
          },
        ],
      },
      {
        title: 'Arquitetura e implantação',
        blocks: [
          { kind: 'p', text: 'A plataforma separa interface, API e banco. A documentação do projeto registra a entrada por IIS como proxy reverso HTTPS, na mesma origem do frontend, com a API escutando apenas em endereço local. O ambiente foi definido com a área de infraestrutura como uma VM dedicada, com SQL Server e ambientes de homologação e produção separados.' },
          { kind: 'diagram', id: 'infra-app', caption: 'Arquitetura de referência da plataforma. Cache e identidade aparecem tracejados por serem componentes opcionais ou externos.' },
          {
            kind: 'table',
            title: 'Implantado, planejado e futuro',
            head: ['Tema', 'Situação', 'Observação'],
            rows: [
              ['IIS como proxy reverso HTTPS', 'Documentado como decisão de arquitetura', 'Aplicação local atrás do IIS, na mesma origem.'],
              ['VM dedicada com SQL Server, homologação e produção', 'Ambiente definido com a infraestrutura', 'Dimensões, nomes e endereços não são publicados.'],
              ['Autenticação', 'Login com credenciais corporativas validadas por um serviço de identidade', 'Windows Authentication foi avaliada e substituída. Sessão segura, bloqueio progressivo e autorização por perfil no servidor.'],
              ['Cache com Redis', 'Adaptador opcional no código', 'A aplicação funciona sem Redis. Não afirmo implantação.'],
              ['Migração do repositório para Azure DevOps', 'Planejada', 'Prevista após a migração do banco; não concluída.'],
              ['Balanceamento de carga e Azure Cloud', 'Não aplicável', 'Não fazem parte do que está documentado.'],
            ],
          },
          { kind: 'p', text: 'Com o SQL Server como fonte de verdade, uma simulação nasce no banco, recebe um identificador único e acompanha todo o fluxo: parâmetros, resultado, usuário, data e versão. Isso dá histórico e permite recuperar qualquer simulação.' },
        ],
      },
      {
        title: 'O que não é publicado',
        blocks: [
          { kind: 'p', text: 'Fórmulas, tabelas de custo, parâmetros comerciais, endpoints, nomes de servidores e dados de clientes são confidenciais. As demonstrações do portfólio usam modelos didáticos com dados sintéticos.' },
          {
            kind: 'status',
            items: [
              { label: 'Aplicação em Python, FastAPI, Next.js e SQL Server', status: 'codigo', note: 'Repositório privado; histórico de código desde maio de 2026.' },
              { label: 'Conciliação de nomes de cidades', status: 'codigo', note: 'Estudo público separado: normalização de cidades.' },
              { label: 'Regras e parâmetros comerciais', status: 'declarado', note: 'Não divulgados.' },
              { label: 'Demonstração de precificação desta página', status: 'sintetico' },
            ],
          },
        ],
      },
    ],
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
  },
  {
    slug: 'gestao-financeira',
    crumb: 'Gestão financeira (Tracker finance)',
    domain: 'Engenharia de Software',
    title: 'Gestão financeira (Tracker finance)',
    category: 'Aplicação web · gestão financeira',
    summary:
      'Aplicação web de gestão financeira pessoal e familiar, construída como monólito modular: receitas, despesas recorrentes e parceladas, categorias, rateios e indicadores.',
    nature: 'personal',
    natureLabel: 'Projeto autoral',
    role: 'Concepção e desenvolvimento da aplicação, incluindo a migração de arquitetura.',
    status: 'Segundo a documentação do próprio projeto, em produção. Endereço e dados não são divulgados.',
    access: 'Repositório privado. Nenhum dado financeiro é exibido.',
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'React', 'TypeScript', 'Vite', 'Vercel'],
    context: {
      problem:
        'Planejar o orçamento e acompanhar despesas exige categorizar gastos, dividir custos e lidar com lançamentos recorrentes e parcelados. Essas tarefas costumam ficar espalhadas entre planilhas.',
      environment: 'Aplicação web de uso pessoal e familiar, com custo operacional mínimo como requisito.',
      objective:
        'Reunir receitas, despesas, categorias, rateios e indicadores em uma única aplicação, com regras financeiras explícitas e testadas.',
      constraints: [
        'O repositório é privado.',
        'Nenhuma informação financeira real é apresentada neste portfólio.',
      ],
    },
    strategy: {
      approach:
        'Monólito modular: um único serviço, dividido em módulos com dependências verificadas por ferramenta, antes de qualquer separação em serviços.',
      decisions: [
        {
          decision: 'Monólito modular',
          reason: 'Mantém o custo e a operação baixos e preserva fronteiras claras entre módulos.',
        },
        {
          decision: 'Migração de arquitetura registrada em decisão',
          reason: 'A fundação inicial em .NET, SQL Server e IIS foi substituída por Python, PostgreSQL e hospedagem serverless, com o histórico preservado no Git.',
        },
        {
          decision: 'Autenticação com segundo fator opcional',
          reason: 'Reduz o risco de acesso indevido a dados financeiros.',
        },
        {
          decision: 'Integração contínua no repositório',
          reason: 'Lint, tipos e testes rodam a cada alteração.',
        },
      ],
    },
    architecture: {
      caption: 'Visão em camadas da arquitetura atual.',
      layers: [
        { title: 'Interface', nodes: [{ name: 'React · TypeScript · Vite', note: 'Aplicação de página única' }] },
        { title: 'API', nodes: [{ name: 'Python · FastAPI', note: 'Regras de negócio e contratos' }] },
        { title: 'Persistência', nodes: [{ name: 'SQLAlchemy · Alembic', note: 'Mapeamento e migrations' }, { name: 'PostgreSQL', note: 'Armazenamento' }] },
      ],
      crosscutting: 'Autenticação, papéis e auditoria em toda a aplicação',
    },
    implementation: {
      intro: 'O escopo funcional organiza a vida financeira em áreas, todas sobre o mesmo modelo de dados.',
      flowTitle: 'Áreas funcionais',
      flow: [
        'Receitas e despesas',
        'Lançamentos recorrentes e parcelados',
        'Categorias',
        'Rateios',
        'Rotina diária de geração de lançamentos',
        'Indicadores financeiros',
      ],
    },
    deepDive: [
      {
        title: 'Evolução da arquitetura',
        blocks: [
          { kind: 'p', text: 'A primeira fundação do projeto usou ASP.NET Core, SQL Server e hospedagem em IIS, com publicação por runner próprio. Essa etapa gerou prática concreta de hospedagem Windows. Depois, uma decisão de arquitetura registrada trocou a stack por Python, PostgreSQL e hospedagem serverless, pelo menor custo operacional. A versão anterior continua acessível por tag e branch de histórico.' },
          {
            kind: 'status',
            items: [
              { label: 'Arquitetura atual: Python, FastAPI, PostgreSQL, React e Vercel', status: 'codigo', note: 'Repositório privado.' },
              { label: 'Fundação inicial em .NET, SQL Server e IIS', status: 'declarado', note: 'Etapa histórica, superada por decisão registrada.' },
              { label: 'Pipeline de integração contínua do projeto', status: 'codigo', note: 'Aplica-se a este projeto; o portfólio não possui pipeline.' },
            ],
          },
        ],
      },
    ],
    challenges: [
      {
        title: 'Rateios exatos',
        text: 'Dividir um valor entre categorias ou pessoas exige uma regra explícita para arredondamento, de modo que as partes somem sempre o total.',
      },
      {
        title: 'Migração sem perder a rastreabilidade',
        text: 'Trocar a base tecnológica exigiu preservar o histórico e registrar a decisão, para que o motivo continue legível.',
      },
    ],
    outcomes: [
      'Demonstra desenvolvimento de ponta a ponta, da regra financeira à interface, e a capacidade de rever uma arquitetura.',
      'Não há métricas de uso divulgadas.',
    ],
    learning: 'Regras financeiras pedem precisão: tipos decimais, testes de arredondamento e totais conferíveis.',
  },
  {
    slug: 'bi-operacional-logistica',
    crumb: 'BI Operacional',
    domain: 'Business Intelligence Operacional',
    title: 'BI operacional em logística',
    category: 'Business Intelligence · análise operacional',
    summary:
      'Inteligência operacional de coleta, entrega, SLA, extravio e avaria. Os painéis corporativos não são públicos; esta página apresenta o método, os módulos e uma demonstração com dados simulados.',
    nature: 'demonstration',
    natureLabel: 'Atuação em BI e demonstração',
    role: 'Modelagem e construção de soluções de BI operacional; implementação da demonstração desta página.',
    status: 'Atuação profissional declarada. A demonstração desta página usa dados simulados.',
    access: 'Painéis, dados e números reais não são públicos. Os números da demonstração são sintéticos.',
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
    deepDive: [
      {
        title: 'Módulos da solução operacional',
        blocks: [
          { kind: 'p', text: 'A inteligência operacional foi organizada em módulos que partilham um único modelo de dados. Cada módulo responde a uma pergunta de gestão e termina em uma decisão, e a visão executiva reúne os desvios mais relevantes.' },
          { kind: 'diagram', id: 'modulos-bi-operacional', caption: 'Módulos de BI operacional sobre um modelo dimensional comum (conceitual)' },
          {
            kind: 'table',
            head: ['Módulo', 'Indicadores', 'Decisão apoiada'],
            rows: [
              ['Produtividade', 'Coletas e entregas por equipe, filial e período; capacidade versus realizado.', 'Dimensionar equipe e redistribuir carga.'],
              ['Coleta e entrega', 'Volume, cumprimento de janela, tentativas.', 'Corrigir rotas e janelas problemáticas.'],
              ['SLA e prazo', 'Entregas no prazo ÷ entregas, por região e período.', 'Priorizar regiões com desvio.'],
              ['Extravio e avaria', 'Ocorrências por mil entregas, por filial e tipo.', 'Atacar a causa: embalagem, manuseio ou rota.'],
              ['Ocorrências e qualidade', 'Motivos, reincidência e tempo de resolução.', 'Priorizar planos de ação.'],
              ['Análise por filial e metas', 'Realizado ÷ meta, ranking e tendência.', 'Cobrar e apoiar com dados comparáveis.'],
              ['Visão executiva', 'Poucos indicadores, com desvio destacado e comparação com o período anterior.', 'Decidir onde olhar primeiro.'],
            ],
          },
          {
            kind: 'table',
            title: 'Evidências técnicas',
            head: ['Tema', 'Prática'],
            rows: [
              ['SQL e Power Query', 'Preparação e tratamento dos dados na origem, com tipos e chaves consistentes.'],
              ['Modelagem e modelo semântico', 'Fatos aditivos, dimensões de tempo, filial e região, e medidas centralizadas em DAX.'],
              ['Visualização e UX/UI', 'Uma pergunta por página, hierarquia visual e storytelling com dados, em vez de excesso de indicadores.'],
              ['Governança e desempenho', 'Definição única de cada indicador, controle de acesso e modelos enxutos para consulta rápida.'],
            ],
          },
        ],
      },
      {
        title: 'Como cada painel é apresentado',
        blocks: [
          { kind: 'p', text: 'Um painel operacional só é útil se quem o lê sabe a pergunta que ele responde e a decisão que ele apoia. Cada apresentação de BI deste portfólio segue a mesma estrutura.' },
          {
            kind: 'table',
            head: ['Elemento', 'Aplicação no BI operacional'],
            rows: [
              ['Pergunta de negócio', 'A operação está cumprindo o prazo combinado e onde está o desvio?'],
              ['Indicadores', 'SLA, volume de entregas, ocorrências por mil entregas.'],
              ['Modelo de dados', 'Fato de entregas no grão região e mês, com dimensões de tempo e região.'],
              ['Regras de cálculo', 'SLA como razão de somas; períodos de mesma duração; lacunas tratadas como ausência.'],
              ['Visual', 'Série temporal com comparação de períodos e destaque de cobertura de dados.'],
              ['Interpretação', 'Queda de SLA em uma região com volume estável aponta problema de processo, não de demanda.'],
              ['Decisão', 'Priorizar a região desviada e revisar a causa antes de agir no total.'],
            ],
          },
        ],
      },
      {
        title: 'Modelo e fluxo de dados',
        blocks: [
          { kind: 'diagram', id: 'star-schema', caption: 'Modelo estrela da demonstração (conceitual)' },
          { kind: 'diagram', id: 'pipeline-bi', caption: 'Fluxo das fontes ao painel (conceitual)' },
          {
            kind: 'status',
            items: [
              { label: 'Demonstração interativa com dados simulados', status: 'sintetico' },
              { label: 'Modelo dimensional e medidas em DAX', status: 'conceitual', note: 'Exemplo didático, sem relação com dados reais.' },
              { label: 'Painéis operacionais usados em empresa', status: 'declarado', note: 'Detalhes, dados e capturas não são divulgados.' },
            ],
          },
        ],
      },
    ],
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
