import type { Case } from './types.ts';
import { CORPORATE, limits, list, open, p, sec, table } from './cases-shared.ts';

const EXCEL_NOTE =
  'Excel com VBA e fluxo automatizado de atualização, confirmados pelo proprietário para todos os painéis em Excel. Python, Access, SharePoint Lists, Power Automate e outras integrações variam por projeto e só são atribuídos com confirmação individual.';

/** SQL Server e engenharia de dados. */
export const casesDados: Case[] = [
  {
    id: 'automacao-tabela-custos-sql-server',
    slug: 'automacao-tabela-custos-sql-server',
    crumb: 'Tabela de Custos',
    title: 'Automação da Tabela de Custos',
    summary:
      'Engenharia de dados no SQL Server que substitui a montagem mensal e manual da base de custos por um fluxo automatizado de integração, validação, consolidação e atualização.',
    category: 'sql-dados',
    types: ['engenharia-dados', 'automacao'],
    tech: ['sql-server'],
    techNote: 'SQL Server, confirmado pelo proprietário. O Excel aparece apenas como o processo anterior que a solução substitui.',
    caseType: 'completo',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Apresentação',
        p('Projeto de engenharia e automação dos dados de custos. O processamento que antes era montado a cada mês passou a ser centralizado e executado diretamente no SQL Server.'),
      ),
      sec(
        'Contexto e problema',
        p('A base mensal de custos dependia de várias etapas manuais: consolidações em Excel, extrações de sistemas, recebimento de informações de outros setores e tratamento de múltiplas fontes. Cada ciclo repetia o trabalho e dependia de quem o executava.'),
      ),
      sec(
        'Solução desenvolvida',
        p('A centralização levou o tratamento das fontes para o banco de dados. Integração, validação e consolidação passaram a ser regras do SQL Server, e a atualização das informações de custos tornou-se um fluxo recorrente automatizado.'),
        table(
          ['Antes', 'Depois'],
          [
            ['Consolidações manuais em Excel a cada mês', 'Processamento centralizado no SQL Server'],
            ['Extrações de sistemas tratadas à mão', 'Integração das fontes no banco'],
            ['Informações de outros setores recebidas e ajustadas manualmente', 'Validação e consolidação por regras no banco'],
            ['Montagem recorrente da base', 'Fluxo automatizado de atualização'],
          ],
        ),
      ),
      sec(
        'Arquitetura técnica',
        list(['Stored Procedures', 'Functions', 'Triggers', 'Índices', 'Constraints', 'Regras de integridade'], 'Recursos do SQL Server empregados'),
        list(['Processamento de dados.', 'Integração de fontes.', 'Atualizações recorrentes.', 'Validação e consolidação das informações.'], 'Responsabilidades da solução'),
      ),
      sec(
        'Integridade e governança dos dados',
        p('Constraints e regras de integridade mantêm a consistência da base dentro do próprio banco, e os índices sustentam o desempenho do processamento recorrente.'),
      ),
      sec(
        'Resultado',
        p('A montagem manual recorrente foi substituída por um fluxo automatizado de atualização da base de custos. O caso mostra a passagem de um processo fragmentado entre planilhas, sistemas e setores para uma estrutura de engenharia de dados rastreável.'),
      ),
    ],
    related: ['arquitetura-banco-easyprice', 'sql-server-avancado'],
    pending: [
      open('Confirmar o papel específico de cada recurso (procedures, functions, triggers) e as fontes integradas, para detalhar a arquitetura.'),
      open('Sem volumetria, tempo economizado ou percentual de ganho documentados; não atribuir.'),
    ],
  },
  {
    id: 'arquitetura-banco-easyprice',
    slug: 'arquitetura-banco-easyprice',
    crumb: 'Banco de Dados do EasyPrice',
    title: 'Arquitetura de Dados do EasyPrice',
    summary:
      'Camada de persistência da plataforma EasyPrice em SQL Server: tabelas transacionais e históricas, simulações, integridade, segurança, fluxos de gravação e rastreabilidade.',
    category: 'sql-dados',
    types: ['engenharia-dados', 'sistema'],
    tech: ['sql-server'],
    techNote: 'SQL Server, conforme o histórico documentado do projeto e declarado pelo proprietário.',
    caseType: 'completo',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Apresentação',
        p('Case técnico sobre a camada de dados da plataforma EasyPrice. Trata da arquitetura de persistência e da infraestrutura de dados, e não do desenvolvimento da aplicação, que tem case próprio.'),
      ),
      sec(
        'Contexto e problema',
        p('Em uma plataforma de precificação, rever um preço exige saber quais parâmetros foram usados na simulação que o gerou. A camada de dados precisa, portanto, guardar cada simulação com seus parâmetros, resultado, usuário, data e versão, e manter a integridade dessas relações.'),
      ),
      sec(
        'Papel do banco na plataforma',
        p('O SQL Server é a fonte de verdade da plataforma. Uma simulação nasce no banco, recebe um identificador único e acompanha todo o fluxo, com parâmetros, resultado, usuário, data e versão. Isso dá histórico e permite recuperar qualquer simulação.'),
        p('O ambiente foi definido com a infraestrutura como uma VM dedicada, com SQL Server e ambientes de homologação e produção separados. Dimensões, nomes e endereços não são publicados.'),
      ),
      sec(
        'Persistência e modelagem',
        list(
          [
            'Modelagem relacional das entidades da plataforma.',
            'Tabelas permanentes, transitórias e históricas, separando dado de referência, dado em elaboração e registro.',
            'Persistência das simulações e recuperação de rascunhos.',
            'Finalização transacional das simulações.',
            'Operações de criação, consulta, alteração e remoção (CRUD) sobre as entidades.',
          ],
          'Temas cobertos',
        ),
      ),
      sec(
        'Integridade, segurança e rastreabilidade',
        list(
          [
            'Integridade referencial e regras de negócio na estrutura do banco.',
            'Índices e constraints.',
            'Controle de acesso.',
            'Logs e auditoria, conforme a implementação.',
            'Fluxos de gravação e desempenho.',
          ],
          'Temas cobertos',
        ),
      ),
      sec(
        'Integração com o backend',
        p('O banco atende a API da plataforma, escrita em Python com FastAPI. O contrato entre as camadas é tipado, e os parâmetros comerciais são tratados como dados, não como constantes no código.'),
      ),
      sec('Resultado', p('Uma camada de persistência com histórico, rastreabilidade e integridade para uma plataforma de precificação em que cada preço precisa ser reconstituível.')),
      limits('Esquemas, tabelas e entidades não são publicados. Procedures e funções são citadas apenas quando efetivamente implementadas.'),
    ],
    related: ['simulador-preco-rodoviario', 'automacao-tabela-custos-sql-server', 'sql-server-avancado'],
    pending: [open('Confirmar quais procedures e funções existem no banco e a política de logs e auditoria.'), open('Confirmar o detalhamento de segurança e controle de acesso a exibir.')],
  },
];

/** Soluções em Excel com VBA e fluxo automatizado de atualização. */
export const casesExcel: Case[] = [
  {
    id: 'automacao-avarias-extravios',
    slug: 'automacao-avarias-extravios',
    crumb: 'Avarias e Extravios',
    title: 'Automação de Avarias e Extravios',
    summary:
      'Extração, tratamento e análise automatizados dos relatórios de avarias e extravios, com classificação de ocorrências, identificação de ofensores e comparação por filial e por cliente.',
    category: 'excel-automacao',
    types: ['automacao', 'relatorio-gerencial', 'inteligencia-operacional'],
    tech: ['excel', 'vba', 'python'],
    techNote: 'Excel, VBA e Python, confirmados pelo proprietário.',
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('O acompanhamento de avarias e extravios depende de relatórios recorrentes, que precisam ser extraídos, tratados e analisados a cada ciclo. Feito à mão, esse trabalho consome tempo e limita a profundidade da análise.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Solução de automação e inteligência operacional no ecossistema Excel, VBA e Python: a extração e o tratamento dos relatórios são automatizados, e a análise é entregue pronta para a gestão.'),
        list(
          [
            'Atualização automatizada a partir dos relatórios.',
            'Tratamento dos registros e classificação das ocorrências.',
            'Identificação de ofensores.',
            'Comparação entre filiais e análise por cliente.',
            'Análise de processos.',
            'Geração de relatórios gerenciais.',
          ],
          'Capacidades',
        ),
      ),
      sec('Aplicação', p('Reduz o trabalho operacional repetitivo e amplia a capacidade de acompanhar os indicadores de avarias e extravios, com foco nos ofensores e nas diferenças entre filiais e clientes.')),
    ],
    related: ['consolidado-ranking-filiais-brasil', 'painel-melhoria-continua'],
    pending: [open('Confirmar o papel de Python no fluxo e as fontes de extração.')],
  },
  {
    id: 'painel-melhoria-continua',
    slug: 'painel-melhoria-continua',
    crumb: 'Melhoria Contínua',
    title: 'Painel de Melhoria Contínua',
    summary:
      'Identificação de gargalos e recorrências, priorização de problemas e acompanhamento de melhorias, a partir de indicadores operacionais atualizados por VBA.',
    category: 'excel-automacao',
    types: ['dashboard', 'automacao', 'inteligencia-operacional'],
    tech: ['excel', 'vba'],
    techNote: EXCEL_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Indicadores operacionais mostram o que aconteceu, mas não dizem por onde começar. Um programa de melhoria precisa saber onde estão os gargalos, quais problemas se repetem e o que deve ser priorizado.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Solução em Excel e VBA, com atualização automatizada, que transforma informações operacionais em direcionamento gerencial.'),
        list(
          [
            'Identificação de gargalos e da recorrência de problemas.',
            'Indicadores operacionais e análises comparativas.',
            'Identificação de ofensores.',
            'Priorização de problemas.',
            'Apoio à construção de planos de ação.',
            'Acompanhamento de melhorias.',
          ],
          'Capacidades',
        ),
      ),
      sec('Aplicação', p('Dá à gestão um critério de prioridade e um registro do andamento das melhorias, em vez de uma lista de indicadores sem hierarquia.')),
      limits('O apoio aos planos de ação é analítico: o painel organiza e prioriza a informação. Não há geração autônoma de planos de ação por inteligência artificial.'),
    ],
    related: ['automacao-avarias-extravios', 'relatorio-desvios-operacionais'],
  },
  {
    id: 'relatorio-ocorrencias-origem',
    slug: 'relatorio-ocorrencias-origem',
    crumb: 'Ocorrências na Origem (relatório)',
    title: 'Relatório de Ocorrências na Origem',
    summary:
      'Análise e acompanhamento das ocorrências identificadas na origem das operações, com processamento automatizado e apoio à identificação de causas e responsabilidades.',
    category: 'excel-automacao',
    types: ['relatorio-gerencial', 'automacao', 'inteligencia-operacional'],
    tech: ['excel', 'vba'],
    techNote: EXCEL_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Ocorrências registradas na origem da operação precisam ser consolidadas e atribuídas a uma causa e a um responsável. Sem esse tratamento, o problema é visto, mas não corrigido na fonte.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Relatório em Excel e VBA, com processamento automatizado das informações, que sustenta a análise e o acompanhamento das ocorrências na origem e apoia a identificação de causas e responsabilidades.'),
      ),
      sec('Aplicação', p('Permite acompanhar as ocorrências na origem de forma contínua e direcionar a correção para onde o problema nasce.')),
    ],
    related: ['ocorrencias-origem'],
    pending: [
      open('Complementar com indicadores e fluxo de processamento.'),
    ],
  },
  {
    id: 'relatorio-desvios-operacionais',
    slug: 'relatorio-desvios-operacionais',
    crumb: 'Desvios Operacionais (relatório)',
    title: 'Relatório de Desvios Operacionais',
    summary:
      'Controle e análise de desvios operacionais, com classificação, consolidação das informações, indicadores de acompanhamento e identificação de recorrências por dimensão operacional.',
    category: 'excel-automacao',
    types: ['relatorio-gerencial', 'automacao', 'inteligencia-operacional'],
    tech: ['excel', 'vba'],
    techNote: EXCEL_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Desvios operacionais só geram melhoria quando são classificados de forma consistente e acompanhados ao longo do tempo. Isoladamente, cada registro não mostra se o problema se repete.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Relatório em Excel e VBA, com atualização automatizada, que consolida os desvios e os organiza para acompanhamento.'),
        list(['Classificação de desvios.', 'Consolidação das informações.', 'Indicadores de acompanhamento.', 'Identificação de recorrências.', 'Visão por dimensões operacionais.'], 'Capacidades'),
      ),
      sec('Aplicação', p('Dá à gestão uma visão consolidada dos desvios e das recorrências, mantendo a atualização automatizada.')),
    ],
    related: ['desvio-operacional-operacao-gru', 'painel-melhoria-continua'],
  },
  {
    id: 'gestao-sinistros',
    slug: 'gestao-sinistros',
    crumb: 'Gestão de Sinistros',
    title: 'Gestão de Sinistros',
    summary:
      'Sistema analítico automatizado, em Excel e VBA, para o controle e o acompanhamento das informações de sinistros.',
    category: 'excel-automacao',
    types: ['relatorio-gerencial', 'automacao'],
    tech: ['excel', 'vba'],
    techNote: EXCEL_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Sinistros geram informações que precisam ser controladas e acompanhadas.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Sistema analítico em Excel e VBA que reúne o controle e o acompanhamento das informações de sinistros, com atualização automatizada.'),
      ),
      sec('Aplicação', p('Centraliza o controle e o acompanhamento dos sinistros, mantendo as informações atualizadas sem carga manual a cada ciclo.')),
    ],
    related: ['gestao-seguros'],
    pending: [open('Complementar com as funcionalidades, indicadores e fluxo comprovados (nenhum fluxo financeiro ou jurídico é afirmado).')],
  },
  {
    id: 'gestao-seguros',
    slug: 'gestao-seguros',
    crumb: 'Gestão de Seguros',
    title: 'Gestão de Seguros',
    summary:
      'Solução em Excel e VBA para o controle e a análise das informações de seguros, independente da gestão de sinistros.',
    category: 'excel-automacao',
    types: ['relatorio-gerencial', 'automacao'],
    tech: ['excel', 'vba'],
    techNote: EXCEL_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Controlar seguros exige manter e analisar as informações relacionadas a eles.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Solução em Excel e VBA que organiza esse controle e a análise, com atualização automatizada. É um projeto separado da gestão de sinistros, embora o assunto seja próximo.'),
      ),
      sec('Aplicação', p('Dá à gestão uma base única e atualizada para o controle e a análise das informações de seguros.')),
    ],
    related: ['gestao-sinistros'],
    pending: [open('Complementar com as funcionalidades e indicadores comprovados.')],
  },
  {
    id: 'gestao-postos-avancados',
    slug: 'gestao-postos-avancados',
    crumb: 'Postos Avançados',
    title: 'Gestão de Postos Avançados',
    summary:
      'Análise da produtividade das equipes posicionadas nas instalações de clientes, com acompanhamento de execução e indicadores gerenciais das atividades internas.',
    category: 'excel-automacao',
    types: ['dashboard', 'automacao', 'inteligencia-operacional'],
    tech: ['excel', 'vba'],
    techNote: EXCEL_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Medir a produtividade de equipes posicionadas nas instalações de clientes exige acompanhar o que é executado em cada atividade e quanto é entregue.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Solução em Excel e VBA, com atualização automatizada, voltada à gestão operacional e ao desempenho das equipes.'),
        list(['Processamento de cargas.', 'Carregamento.', 'Etiquetagem.', 'Atividades internas.'], 'Atividades acompanhadas'),
        list(['Produtividade das equipes.', 'Controle de execução.', 'Indicadores gerenciais.'], 'Análises'),
      ),
      sec('Aplicação', p('Apoia a gestão do desempenho das equipes nos postos e o acompanhamento da execução das atividades.')),
    ],
    pending: [open('Complementar com os indicadores comprovados.')],
  },
];
