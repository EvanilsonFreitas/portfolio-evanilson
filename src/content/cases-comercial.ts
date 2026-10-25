import type { Case } from './types.ts';
import { CORPORATE, limits, list, open, p, sec, table } from './cases-shared.ts';

const BI_NOTE =
  'Power BI confirmado pelo proprietário para os sete projetos de BI comercial. DAX, Power Query, SQL Server e demais tecnologias não são atribuídos sem confirmação específica. Fontes de dados e integrações não detalhadas.';

/** BI Comercial e pricing. Cada solução é independente das demais. */
export const casesComercial: Case[] = [
  {
    id: 'tracker-comercial',
    slug: 'tracker-comercial',
    crumb: 'Tracker Comercial',
    title: 'Tracker Comercial',
    summary:
      'Pipeline de oportunidades de novos clientes, com etapas comerciais, situação das negociações, valores e potencial de conversão, para o acompanhamento do funil e da previsão de retorno.',
    category: 'bi-comercial',
    types: ['dashboard', 'inteligencia-comercial'],
    tech: ['power-bi'],
    techNote: BI_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('A entrada de novos clientes envolve várias negociações simultâneas, em etapas diferentes e com valores distintos. Acompanhar esse conjunto exige rastreabilidade: saber em que ponto está cada oportunidade, quanto ela representa e qual retorno se espera dela.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Solução de inteligência comercial que centraliza as oportunidades de novos clientes e organiza a leitura do processo, da abertura à decisão.'),
        list(
          [
            'Pipeline de oportunidades por etapa comercial.',
            'Situação de cada negociação e potencial de conversão.',
            'Valores das oportunidades e previsão de retorno.',
            'Acompanhamento do funil, por período e por estágio.',
            'Visão gerencial para a gestão da carteira.',
          ],
          'Capacidades',
        ),
      ),
      sec('Aplicação', p('Apoia a gestão da carteira, a identificação de oportunidades que merecem atenção e a previsão de resultados comerciais, com histórico do processo.')),
      limits('A previsão de retorno é uma leitura do pipeline, construída sobre etapa, valor e potencial de conversão. Não há modelo estatístico treinado.'),
    ],
    related: ['hit-rate-comercial', 'inteligencia-comercial-crm'],
    pending: [open('Confirmar fontes de dados e frequência de atualização.')],
  },
  {
    id: 'solution-price',
    slug: 'solution-price',
    crumb: 'Solution Price',
    title: 'Solution Price',
    summary:
      'Análise de propostas comerciais personalizadas: premissas de preço, rodadas de negociação, comparação entre versões e desfecho, do preço inicial ao fechamento ou à perda.',
    category: 'bi-comercial',
    types: ['dashboard', 'inteligencia-comercial'],
    tech: ['power-bi'],
    techNote: BI_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Novos clientes e operações com exigências específicas pedem um estudo de preço dedicado, com premissas próprias e proposta construída caso a caso. Essas propostas passam por rodadas de negociação, e o valor final raramente coincide com o inicial.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Solução analítica que acompanha cada proposta da formação do preço ao desfecho da negociação, preservando a relação entre as premissas, as versões e o resultado.'),
        table(
          ['Dimensão', 'O que é analisado'],
          [
            ['Premissas e formação do preço', 'Premissas de precificação dedicadas a cada proposta e a composição do preço resultante.'],
            ['Evolução das propostas', 'Rodadas de negociação e comparação entre versões.'],
            ['Trajetória do preço', 'Preço inicialmente proposto, preço negociado e preço fechado ou perdido.'],
            ['Política interna', 'Aderência da proposta à política de preços.'],
            ['Condições comerciais', 'Condições negociadas e prazos de entrega.'],
          ],
        ),
      ),
      sec('Aplicação', p('Permite analisar o resultado de cada negociação, medir quanto o preço se moveu entre a proposta inicial e o desfecho e verificar a aderência à política interna.')),
      limits('Projeto independente do EasyPrice, com premissas, dados e finalidade próprios.'),
    ],
    related: ['simulador-preco-rodoviario', 'hit-rate-comercial', 'painel-produtividade-comercial'],
    pending: [open('Confirmar fontes de dados.')],
  },
  {
    id: 'hit-rate-comercial',
    slug: 'hit-rate-comercial',
    crumb: 'Hit Rate Comercial',
    title: 'Hit Rate Comercial',
    summary:
      'Conversão de oportunidades comerciais: criadas, convertidas e perdidas, taxa de conversão, valores negociados e convertidos, rentabilidade e comparações entre períodos.',
    category: 'bi-comercial',
    types: ['dashboard', 'inteligencia-comercial'],
    tech: ['power-bi'],
    techNote: BI_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('A eficiência de um processo comercial não se resume a quantas oportunidades foram abertas. Interessa saber quantas viraram negócio, quanto isso representa em valor e com qual rentabilidade.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Painel de análise da conversão que cruza volume, valor e rentabilidade, e compara o desempenho entre períodos e entre as dimensões disponíveis.'),
        list(
          [
            'Oportunidades criadas, convertidas e perdidas.',
            'Taxa de conversão.',
            'Valores negociados e valores efetivamente convertidos.',
            'Rentabilidade e desempenho comercial.',
            'Comparações entre períodos e dimensões.',
          ],
          'Indicadores',
        ),
        p('Taxa de conversão e valor convertido respondem a perguntas diferentes: a primeira mede quantas oportunidades fecham, a segunda quanto elas representam. Reunidas à rentabilidade, evitam que muitos fechamentos de baixo valor sejam lidos, sozinhos, como bom desempenho.'),
      ),
      sec('Aplicação', p('Apoia a avaliação da eficiência do processo comercial e da conversão efetiva dos negócios.')),
    ],
    related: ['tracker-comercial', 'solution-price'],
    pending: [open('Confirmar dimensões de análise e fontes de dados.')],
  },
  {
    id: 'alcadas-aprovacao-comercial',
    slug: 'alcadas-aprovacao-comercial',
    crumb: 'Alçadas de Aprovação',
    title: 'Alçadas de Aprovação Comercial',
    summary:
      'Controle da aderência entre o preço aprovado e o preço negociado ou cadastrado, com monitoramento de divergências, notificações automatizadas e bloqueios conforme as regras de alçada.',
    category: 'integracoes-processos',
    types: ['dashboard', 'automacao', 'inteligencia-comercial'],
    tech: ['power-bi'],
    techNote:
      'Power BI confirmado pelo proprietário. As automações de aprovação são executadas por sistemas integrados, cuja tecnologia não está atribuída.',
    caseType: 'completo',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Apresentação',
        p('Solução para garantir que a aprovação comercial seja efetivamente respeitada. Compara o valor autorizado, conforme a política de preços e as alçadas gerenciais, com o valor negociado ou cadastrado, e age sobre as divergências.'),
      ),
      sec(
        'Contexto e problema',
        p('A política de preços define limites de aprovação por alçada, incluindo a aprovação da diretoria. O risco está na distância entre o que foi autorizado e o que foi praticado: quando ela só é percebida depois de consumada, a política deixa de controlar o preço.'),
      ),
      sec(
        'Duas camadas, com responsabilidades distintas',
        p('A solução separa a leitura analítica das automações de aprovação. A primeira mostra a situação; a segunda age sobre ela. As funções de ação são executadas por sistemas integrados e não são atribuídas ao Power BI.'),
        table(
          ['Camada', 'Responsabilidade', 'Tecnologia'],
          [
            ['Analítica', 'Comparação entre valor autorizado e valor praticado, monitoramento das divergências e rastreabilidade das decisões.', 'Power BI'],
            ['Automação de aprovação', 'Notificações automatizadas, ações rápidas e bloqueios conforme as regras aplicáveis.', 'Sistemas integrados'],
          ],
        ),
      ),
      sec(
        'Regras e funcionalidades',
        list([
          'Política de preços e limites de aprovação por alçada gerencial.',
          'Aprovação da diretoria.',
          'Comparação entre valor autorizado e valor praticado.',
          'Monitoramento de divergências.',
          'Notificações automatizadas e ações rápidas.',
          'Bloqueios, conforme as regras aplicáveis.',
        ]),
      ),
      sec(
        'Governança e rastreabilidade',
        p('Cada decisão fica registrada e consultável, o que permite reconstruir quem aprovou o quê e em que condição. O monitoramento torna a divergência uma exceção visível, não um desvio silencioso.'),
      ),
      sec('Aplicação', p('Mantém o preço praticado dentro do que foi aprovado e dá à gestão um controle contínuo da aderência à política comercial.')),
    ],
    related: ['automacao-relatorios-fluxos-power-automate', 'solution-price', 'integracoes-automacoes'],
    pending: [open('Confirmar quais sistemas executam notificações e bloqueios, e se Power Automate participa.')],
  },
  {
    id: 'painel-frete-kg',
    slug: 'painel-frete-kg',
    crumb: 'Painel Frete/Kg',
    title: 'Painel Frete/Kg',
    summary:
      'Posicionamento de preços de frete por quilo: preço sugerido em negociação frente ao praticado, por segmento, região, perfil de cliente, operação e rota, com referências comerciais e de mercado.',
    category: 'bi-comercial',
    types: ['dashboard', 'inteligencia-comercial'],
    tech: ['power-bi'],
    techNote: BI_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Negociar um frete exige saber onde a proposta se situa. Um preço por quilo só faz sentido quando comparado ao que foi praticado em operações semelhantes, à política de preços e às referências de mercado.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Solução analítica que confronta o preço sugerido durante a negociação com o preço efetivamente praticado e o posiciona frente às referências comerciais e de mercado.'),
        list(['Segmento', 'Região', 'Perfil de cliente', 'Operação', 'Rota', 'Política de preços', 'Referências comerciais', 'Referências de mercado'], 'Dimensões de análise'),
      ),
      sec('Aplicação', p('Dá suporte à negociação por meio da análise de posicionamento de preços, evidenciando quando uma proposta está acima ou abaixo do que a operação costuma praticar.')),
    ],
    related: ['painel-analise-mercado', 'painel-produtividade-comercial'],
    pending: [open('Confirmar a origem das referências comerciais e de mercado.')],
  },
  {
    id: 'painel-analise-mercado',
    slug: 'painel-analise-mercado',
    crumb: 'Análise de Mercado',
    title: 'Painel de Análise de Mercado',
    summary:
      'Inteligência de mercado para custos e preços do transporte: fontes internas e externas, integração com APIs públicas e pagas, combustível, tributos e tendências de variação.',
    category: 'bi-comercial',
    types: ['dashboard', 'inteligencia-comercial', 'engenharia-dados'],
    tech: ['power-bi'],
    techNote:
      'Power BI confirmado pelo proprietário. APIs integradas e frequência de atualização de cada fonte não detalhadas; DAX, Power Query e SQL Server não atribuídos.',
    caseType: 'completo',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Apresentação',
        p('Solução de inteligência de mercado que centraliza informações de custos e preços do transporte provenientes de fontes externas e internas, incluindo integrações com APIs públicas e pagas.'),
      ),
      sec(
        'Contexto e objetivo',
        p('Reajustar preços e planejar custos exige olhar para fora da empresa: combustível, tributos e referências de mercado variam em ritmos diferentes. O painel reúne essas referências em um só lugar, ao lado dos custos internos, para apoiar o planejamento de reajustes.'),
      ),
      sec(
        'Fontes e integração de dados',
        p('Dados internos são combinados com fontes externas obtidas por integrações com APIs públicas e pagas. Cada integração segue a sua própria periodicidade, e a atualização do painel acompanha a de cada fonte.'),
        table(
          ['Origem', 'Natureza'],
          [
            ['Fontes internas', 'Custos e parâmetros da própria operação.'],
            ['APIs públicas', 'Referências disponibilizadas publicamente.'],
            ['APIs pagas', 'Referências obtidas por serviços contratados.'],
          ],
        ),
      ),
      sec(
        'Conteúdo analítico',
        list([
          'Custos de frete e referências de preços do mercado.',
          'Variação de combustível.',
          'Alíquotas e impostos.',
          'Componentes de custo e parâmetros de formação de preço.',
          'Tendências de variação.',
        ]),
      ),
      sec('Aplicação', p('Apoia o planejamento de reajustes e as análises antecipatórias, ao mostrar para onde custos e preços de referência tendem a se mover.')),
      limits(
        'A frequência de atualização depende de cada integração; o painel não é descrito como atualizado em tempo real.',
        'As análises antecipatórias são leituras de tendência sobre os dados. Não há machine learning documentado para este projeto.',
      ),
    ],
    related: ['painel-frete-kg', 'integracoes-automacoes'],
    pending: [open('Confirmar as APIs utilizadas e a periodicidade de cada fonte.'), open('Confirmar onde o dado é tratado antes de chegar ao Power BI.')],
  },
  {
    id: 'painel-produtividade-comercial',
    slug: 'painel-produtividade-comercial',
    crumb: 'Produtividade Comercial',
    title: 'Painel de Produtividade Comercial',
    summary:
      'Desempenho do processo de precificação: preço sugerido e negociado, aderência à política, comparações por rota e operação, simulação de cenários e identificação de desvios.',
    category: 'bi-comercial',
    types: ['dashboard', 'inteligencia-comercial'],
    tech: ['power-bi'],
    techNote: BI_NOTE,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Medir a produtividade da precificação exige comparar o preço sugerido com o negociado, dentro da política interna, e fazê-lo por usuário ou unidade, rota e operação. Sem essa comparação, desvios e padrões de negociação passam despercebidos.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Painel que torna visível a distância entre o sugerido e o negociado e a aderência à política, com recortes por rota e por operação e, quando aplicável, por usuário ou unidade.'),
        list(
          [
            'Preço sugerido, preço negociado e política interna.',
            'Aderência comercial e identificação de desvios.',
            'Comparações por rota e por operação.',
            'Desempenho por usuário ou unidade, quando aplicável.',
            'Simulação de cenários.',
            'Histórico de propostas e análises comparativas.',
          ],
          'Capacidades',
        ),
      ),
      sec('Aplicação', p('Apoia a gestão do processo de precificação com evidência de aderência, desvio e padrão de negociação.')),
      limits('Projeto próprio. O EasyPrice introduziu mecanismos adicionais de controle e restrição de preços, mas este painel não é apresentado como funcionalidade interna dele.'),
    ],
    related: ['simulador-preco-rodoviario', 'solution-price', 'painel-frete-kg'],
    pending: [open('Confirmar fontes de dados e se as simulações de cenário pertencem ao próprio painel.')],
  },
];
