import type { Case } from './types.ts';
import { CORPORATE, list, open, p, sec, table } from './cases-shared.ts';

/**
 * Painéis operacionais com captura de tela, usada como o proprietário a forneceu. A plataforma de cada painel
 * só é atribuída quando confirmada; nos demais casos a classificação é funcional (BI operacional).
 */
const UNCONFIRMED =
  'Plataforma de construção não confirmada; nenhuma tecnologia atribuída. Os elementos visíveis na captura (fonte de dados, botões, filtros) não bastam para inferir a ferramenta.';

const IMPLEMENTATION = 'Tecnologias de implementação';

/**
 * Gestão de Coletas e Logística Reversa é uma solução em Excel (não Power BI). "Power BI · Operacional (Coletas)",
 * exibido na captura, é a fonte de dados consumida.
 */
const COLETAS_NOTE =
  'Construído em Excel (interface analítica), confirmado pelo proprietário, com VBA (automação), Power Query (M) (tratamento e transformação), Power Pivot (modelagem analítica). "Power BI · Operacional (Coletas)" é a fonte de dados consumida; Power BI não é a plataforma do painel e não é atribuído.';

const coletasImplementation = sec(
  IMPLEMENTATION,
  p('A solução foi construída em Excel, com atualização automatizada dos dados e recursos de análise. A fonte de dados exibida no painel, Power BI · Operacional (Coletas), é a origem da informação consumida pela solução, não a plataforma em que o painel foi desenvolvido.'),
  table(
    ['Camada', 'Tecnologia'],
    [
      ['Interface analítica', 'Excel'],
      ['Automação', 'VBA'],
      ['Tratamento e transformação dos dados', 'Power Query (M)'],
      ['Modelagem analítica', 'Power Pivot'],
      ['Fonte de dados', 'Power BI · Operacional (Coletas)'],
    ],
  ),
);

/** Índice de Retorno: solução em Excel com VBA e Power Pivot; Power Query (M) não está confirmado. */
const INDICE_NOTE =
  'VBA (automação) e Power Pivot (modelagem analítica), confirmados pelo proprietário, o que implica Excel como ambiente. Power Query (M) não está confirmado para este case e não são atribuídos. Power BI não é atribuído como plataforma.';

const indiceImplementation = sec(
  IMPLEMENTATION,
  p('A solução foi construída em Excel, com automação em VBA e modelagem analítica em Power Pivot. A fonte de dados exibida no cabeçalho do painel é a origem da informação consumida, distinta das tecnologias de implementação.'),
  table(
    ['Camada', 'Tecnologia'],
    [
      ['Ambiente', 'Excel'],
      ['Automação', 'VBA'],
      ['Modelagem analítica', 'Power Pivot'],
      ['Fonte de dados', 'TMS · Relatório operacional de entregas e coletas não efetuadas'],
    ],
  ),
);

/** Consolidado (inclui o Controle de Extravio): solução em Excel; Power Pivot não está confirmado para ela. */
const CONSOLIDADO_NOTE =
  'Solução em Excel com VBA (automação), e Power Query (M) (tratamento e transformação), confirmados pelo proprietário para as soluções de extravio. Power Pivot não está confirmado para este case e não é atribuído. Power BI não é atribuído como plataforma.';

const consolidadoImplementation = sec(
  IMPLEMENTATION,
  p('A solução foi construída em Excel, com tratamento, transformação, consolidação e automação dos dados. Os indicadores e as visões do painel estão descritos nas demais seções.'),
  table(
    ['Camada', 'Tecnologia'],
    [
      ['Ambiente', 'Excel'],
      ['Automação', 'VBA'],
      ['Tratamento e transformação dos dados', 'Power Query (M)'],
    ],
  ),
);

export const casesOperacional: Case[] = [
  {
    id: 'comprovantes-retidos',
    slug: 'comprovantes-retidos',
    crumb: 'Comprovantes Retidos',
    title: 'Comprovantes Retidos',
    summary:
      'Conhecimentos com comprovante retido, distribuídos por faixa de tempo, com valor de mercadoria por filial e por cliente e comparação entre reports, para identificar as filiais ofensoras.',
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: [],
    techNote: UNCONFIRMED,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    images: [{ id: 'comprovantes-retidos' }],
    sections: [
      sec(
        'Contexto e problema',
        p('Um comprovante retido mantém o conhecimento em aberto, e o tempo dessa retenção define a gravidade do problema. O painel organiza os conhecimentos em faixas de tempo, com o valor de mercadoria envolvido, para identificar as filiais ofensoras.'),
      ),
      sec(
        'Indicadores e análises',
        table(
          ['Elemento', 'O que mostra'],
          [
            ['Total de conhecimentos', 'Quantidade total em duas datas de report, com o decremento entre elas.'],
            ['Faixas de dias', 'Conhecimentos de 0 a 3 dias, de 4 a 10 dias e acima de 10 dias, cada um com a variação sobre o último report.'],
            ['Distribuição por faixa', 'Participação percentual do valor de mercadoria em cada faixa.'],
            ['Comparativo entre reports', 'Valor por faixa em duas datas e a diferença entre elas.'],
            ['Principais filiais', 'Valor de mercadoria por faixa nas filiais que mais concentram retenção acima de 10 dias.'],
            ['Principais clientes', 'Distribuição por faixa nos clientes de maior valor.'],
            ['Filtros', 'Data do report, regional, filial da ocorrência e faixa de dias.'],
          ],
        ),
      ),
      sec('Aplicação', p('Permite localizar onde os comprovantes ficam retidos por mais tempo, em quais filiais e clientes o problema se concentra e como a situação mudou entre dois reports.')),
    ],
    related: ['pendencias-digitalizacao', 'ocorrencias-origem'],
    pending: [open('Confirmar a plataforma (Excel/VBA, Power BI ou outra) e a fonte de dados.')],
  },
  {
    id: 'indice-retorno',
    slug: 'indice-retorno',
    crumb: 'Índice de Retorno',
    title: 'Índice de Retorno',
    summary:
      'Percentual de entregas não realizadas sobre as planejadas, frente a uma meta, com comparação por região e filial, evolução anual e tendência diária do mês.',
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: ['excel', 'vba', 'power-pivot'],
    techNote: INDICE_NOTE,
    caseType: 'completo',
    natureLabel: CORPORATE,
    images: [{ id: 'indice-retorno' }],
    facts: [['Fonte de dados', 'TMS · Relatório operacional de entregas e coletas não efetuadas']],
    sections: [
      sec(
        'Apresentação',
        p('Painel de análise das entregas não realizadas. O indicador central é o índice de retorno, o percentual de entregas não realizadas sobre as planejadas, comparado a uma meta única.'),
      ),
      sec(
        'Contexto e problema',
        p('Cada entrega ou coleta não efetuada retorna à operação e precisa ser medida frente ao planejado. O índice de retorno transforma esse volume em um indicador comparável entre regiões, filiais e períodos.'),
      ),
      sec(
        'Fonte e estrutura dos dados',
        p('A fonte é declarada no cabeçalho do painel: o relatório operacional de entregas e coletas não efetuadas do TMS, organizado por data de emissão, manifesto e código de retorno.'),
        list(['Total de viagens.', 'Entregas planejadas.', 'Entregas realizadas.', 'Entregas não realizadas.', 'Plano versus executado.'], 'Indicadores de base'),
      ),
      sec(
        'Indicadores e análises',
        table(
          ['Visão', 'Leitura'],
          [
            ['Índice de retorno', 'Percentual de entregas não realizadas, com a meta de 3,0% destacada no medidor e a comparação com o mês anterior e com o ano anterior.'],
            ['Por região', 'Comparativo entre as regiões do Brasil, em barras ordenadas.'],
            ['Por filial', 'Comparativo entre filiais, com a linha de meta; filiais acima da meta em vermelho e dentro dela em verde.'],
            ['Comparativo anual', 'Evolução mensal de dois anos, com a diferença em pontos percentuais.'],
            ['Tendência diária', 'Acompanhamento ao longo dos dias do mês, com o volume de entregas e o índice.'],
          ],
        ),
      ),
      sec(
        'Regras de leitura',
        list([
          'O índice é entregas não realizadas sobre entregas planejadas: os totais exibidos no cabeçalho reproduzem o valor do medidor.',
          'Nas visões por filial, as barras acima da meta aparecem em vermelho e as dentro da meta, em verde.',
        ]),
      ),
      indiceImplementation,
      sec('Aplicação', p('Mostra onde o retorno de entregas está acima da meta, por região, filial e dia, e como o resultado do ano corrente se compara ao do ano anterior.')),
    ],
    related: ['gestao-coletas-logistica-reversa', 'prazo-coleta'],
    pending: [open('Confirmar a forma de atualização e se Power Query (M) participa da solução.')],
  },
  {
    id: 'ocorrencias-origem',
    slug: 'ocorrencias-origem',
    crumb: 'Ocorrências na Origem',
    title: 'Ocorrências na Origem',
    summary:
      'Mercadoria retida por ocorrências na origem, com composição por faixa de dias, valor por filial e evolução diária, a partir do relatório operacional de ocorrências.',
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: [],
    techNote: UNCONFIRMED,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    images: [{ id: 'ocorrencias-origem' }],
    facts: [['Fonte de dados', 'TMS · Relatório operacional de ocorrências']],
    sections: [
      sec(
        'Contexto e problema',
        p('Ocorrências registradas na origem retêm mercadoria. O painel mede o envelhecimento dessas ocorrências por faixa de dias e por filial, com o valor de mercadoria envolvido.'),
      ),
      sec(
        'Indicadores e análises',
        table(
          ['Elemento', 'O que mostra'],
          [
            ['Mercadoria retida', 'Valor total retido por falta, separado por faixa de dias.'],
            ['Resumo', 'Total de conhecimentos, de notas fiscais e volumetria, com comparação ao report anterior.'],
            ['Composição por faixa', 'Participação das faixas de 0 a 3, 4 a 10, 11 a 30 e acima de 30 dias.'],
            ['Seleção do valor exibido', 'Alternância entre total de CT-es, de notas, volumetria e valor de mercadoria.'],
            ['Por filial', 'Distribuição das faixas de dias em cada filial.'],
            ['Evolução diária', 'Composição das faixas ao longo dos dias.'],
          ],
        ),
        p('O painel diferencia o valor total de mercadoria retida por falta do valor real das ocorrências, detalhado com suas classificações e análises.'),
      ),
      sec('Aplicação', p('Dá visibilidade ao envelhecimento das ocorrências na origem e permite priorizar as filiais e as faixas de maior exposição.')),
    ],
    related: ['relatorio-ocorrencias-origem', 'comprovantes-retidos'],
    pending: [
      open('Confirmar a plataforma de construção do painel.'),
    ],
  },
  {
    id: 'consolidado-ranking-filiais-brasil',
    slug: 'consolidado-ranking-filiais-brasil',
    crumb: 'Consolidado e Ranking de Filiais',
    title: 'Consolidado Operacional e Ranking de Filiais',
    aliases: ['Controle de Extravio', 'Extravio: Ranking de Filiais', 'Performance Consolidado', 'Ranking Filiais Brasil'],
    summary:
      'Consolidado de ocorrências ativas com ranking de filiais e ranking regional no Brasil, evolução diária e acompanhamento dos casos, em duas apresentações do painel.',
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: ['excel', 'vba', 'power-query'],
    techNote: CONSOLIDADO_NOTE,
    caseType: 'completo',
    natureLabel: CORPORATE,
    images: [
      { id: 'consolidado-2025', caption: 'Apresentação de 2025' },
      { id: 'consolidado-2024', caption: 'Apresentação de 2024' },
    ],
    sections: [
      sec(
        'Apresentação',
        p('Solução analítica que consolida as ocorrências ativas em relatório e ordena as filiais por impacto. O próprio painel descreve o ranking como forma de comparar as unidades e identificar as áreas que precisam de melhoria operacional. Também é referida como Controle de Extravio e Ranking de Filiais.'),
      ),
      sec(
        'Contexto e problema',
        p('Comparar filiais e regiões em uma só visão, com os casos em aberto e o tempo de cada um, mostra em que unidades as ocorrências se concentram e onde agir.'),
      ),
      sec(
        'Duas apresentações do painel',
        p('As capturas mostram o mesmo painel, com o mesmo título, a mesma navegação lateral e o mesmo ranking regional no mapa do Brasil, em duas apresentações. As datas de referência exibidas são 09/10/2024 e 01/01/2025.'),
        table(
          ['Apresentação', 'O que a captura mostra'],
          [
            ['2024', 'Consolidado total de ocorrências ativas, ranking de filiais, ranking por região, as cinco filiais com maior total de faltas, tabela dos principais casos e valor total por dia de inclusão.'],
            ['2025', 'Consolidado dividido em análise operacional e ranking corporativo, cada um com notas, volumetria e valor e a variação correspondente; ranking regional; tabela de casos com status de busca e envio; total diário de ocorrências.'],
          ],
        ),
      ),
      sec(
        'Indicadores e análises',
        list([
          'Ocorrências ativas em relatório, com notas, volumetria e valor.',
          'Ranking de filiais e posição da filial de referência no cenário geral.',
          'Ranking das regiões do Brasil por valor.',
          'Principais casos, com dias em aberto, status e envio.',
          'Evolução diária do total de ocorrências.',
        ]),
      ),
      sec('Navegação', p('O painel é organizado por seções de navegação lateral: atendimento, desvio operacional, pendência, consolidado e status. As capturas exibem o consolidado.')),
      consolidadoImplementation,
      sec('Aplicação', p('Compara unidades, identifica as áreas com mais ocorrências e acompanha os casos em aberto, do consolidado nacional ao caso individual.')),
    ],
    related: ['desvio-operacional-operacao-gru', 'automacao-avarias-extravios'],
    pending: [
      open('Confirmar se Power Pivot participa da solução e detalhar o fluxo de atualização.'),
    ],
  },
  {
    id: 'gestao-coletas-logistica-reversa',
    slug: 'gestao-coletas-logistica-reversa',
    crumb: 'Gestão de Coletas e Logística Reversa',
    title: 'Gestão de Coletas e Logística Reversa',
    aliases: ['Gestão de Coletas', 'Logística Reversa', 'Performance de coleta'],
    summary:
      'Desempenho das coletas dentro do prazo frente à meta de 96%, por filial, região e semana, com o recorte de logística reversa e a regra de apuração declarada no próprio painel.',
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: ['excel', 'vba', 'power-query', 'power-pivot'],
    techNote: COLETAS_NOTE,
    caseType: 'completo',
    natureLabel: CORPORATE,
    images: [
      { id: 'gestao-coletas', caption: 'Coletas, com o filtro de logística reversa em "Não"' },
      { id: 'logistica-reversa', caption: 'Logística reversa, com o filtro em "Sim"' },
    ],
    facts: [['Fonte de dados', 'Power BI · Operacional (Coletas)']],
    sections: [
      sec(
        'Apresentação',
        p('Painel de desempenho das operações de coleta. Mede o percentual de coletas dentro do prazo frente a uma meta de 96% e detalha o resultado por filial, região e semana. O objetivo declarado é facilitar a visão do desempenho de coleta e de logística reversa.'),
      ),
      sec(
        'Contexto e problema',
        p('Cumprir o prazo de coleta envolve muitas filiais e status diferentes. Um critério único de apuração permite comparar o resultado entre filiais, regiões e anos.'),
      ),
      sec(
        'Duas visões do mesmo painel',
        p('A logística reversa é um recorte do painel, selecionado por filtro. As duas visões compartilham layout, indicadores e regra de apuração; o filtro muda o conjunto de coletas analisado.'),
        table(
          ['Visão', 'Filtro', 'Leitura'],
          [
            ['Coletas', 'Logística reversa em "Não"', 'Desempenho das coletas regulares frente à meta, por filial, região e semana.'],
            ['Logística reversa', 'Logística reversa em "Sim"', 'Os mesmos indicadores restritos às coletas de logística reversa; a tabela por região e filial acrescenta sinalização por cor da eficiência.'],
          ],
        ),
      ),
      sec(
        'Regra de apuração',
        p('O texto do painel declara a regra: o desempenho final considera apenas as coletas com status de efetuada, e as de logística reversa baixadas sem atribuição de datas ou sem vínculo a CT-e são desconsideradas.'),
      ),
      sec(
        'Indicadores e análises',
        table(
          ['Elemento', 'O que mostra'],
          [
            ['Desempenho', 'Percentual de coletas dentro do prazo, com a meta de 96%, as quantidades no prazo e fora, e a variação mês a mês e ano a ano.'],
            ['Status de coleta', 'Efetuada, aguardando programação, coletando, nova tentativa, solucionada, retirado no emitente e em ocorrência.'],
            ['Desempenho anual', 'Comparação com o ano retroativo, mês a mês, em pontos percentuais.'],
            ['Principais filiais', 'Filiais por menor resultado, com coletas no prazo e fora do prazo.'],
            ['Tabela hierárquica', 'Região e filial, com o resultado das cinco semanas, a eficiência, a variação MoM e YoY e o total de coletas.'],
            ['Filtros e controles', 'Filtro por filial, filtro de logística reversa, remoção de filtros, edição, tela cheia e atualização.'],
          ],
        ),
      ),
      coletasImplementation,
      sec('Aplicação', p('Permite acompanhar o cumprimento de prazo das coletas por filial e região, comparar com o ano anterior e isolar a logística reversa quando for o foco da análise.')),
    ],
    related: ['prazo-coleta', 'indice-retorno'],
    pending: [
      open('Confirmar a origem e a frequência de atualização da fonte "Power BI · Operacional (Coletas)" consumida pela solução.'),
    ],
  },
  {
    id: 'desvio-operacional-operacao-gru',
    slug: 'desvio-operacional-operacao-gru',
    crumb: 'Desvio Operacional · Operação GRU',
    title: 'Desvio Operacional · Operação GRU',
    aliases: ['Ocorrências Ofensoras', 'Desvios operacionais', 'Erros de embarque'],
    summary:
      'Divergências de embarque da operação GRU por turno, com sobras, faltas e avarias, retorno de cada caso pela coordenação e comparação do ano corrente com o anterior.',
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: [],
    techNote: UNCONFIRMED,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    images: [{ id: 'desvio-operacional-gru' }],
    sections: [
      sec(
        'Contexto e problema',
        p('Cada desvio registrado é analisado pelo setor de prevenção e perdas e enviado à coordenação de cada turno, que revisa os dados, explica a causa do desvio e implementa ações corretivas com o time. O painel acompanha esse processo contínuo e mede o retorno de cada etapa.'),
      ),
      sec(
        'Indicadores e análises',
        table(
          ['Elemento', 'O que mostra'],
          [
            ['Por turno', 'Primeiro, segundo e terceiro turnos, com a participação de cada um no total e a quantidade de sobras, faltas e avarias.'],
            ['Retorno dos casos', 'Total de retorno acumulado dos casos por turno, com o resultado de finalização informado pela coordenação.'],
            ['Mês selecionado', 'Eventos, volumetria e valor do mês, com a variação sobre o ano anterior.'],
            ['Registros', 'Lista de casos com o retorno validado junto à liderança operacional e a data de inclusão.'],
            ['Comparativo anual', 'Total de ocorrências e volumetria ao longo do ano, comparados ao ano anterior.'],
          ],
        ),
      ),
      sec('Aplicação', p('Mostra em que turno e em que tipo de desvio as divergências se concentram, quais casos já tiveram retorno da liderança e como o mês se compara ao ano anterior.')),
    ],
    related: ['relatorio-desvios-operacionais', 'consolidado-ranking-filiais-brasil'],
    pending: [
      open('Confirmar a plataforma de construção.'),
    ],
  },
  {
    id: 'pendencias-digitalizacao',
    slug: 'pendencias-digitalizacao',
    crumb: 'Pendências de Digitalização',
    title: 'Pendências de Digitalização',
    summary:
      'Pendências de digitalização por faixa de dias, região, filial, cliente e destinatário, com comparação entre reports e a regra de leitura dos comprovantes feitos por celular.',
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: [],
    techNote: UNCONFIRMED,
    caseType: 'compacto',
    natureLabel: CORPORATE,
    images: [{ id: 'pendencias-digitalizacao' }],
    sections: [
      sec(
        'Contexto e problema',
        p('Comprovantes sem digitalização oficial mantêm o conhecimento pendente. O painel mostra quanto está pendente, há quanto tempo e onde, para que a operação concentre o esforço nas faixas e nas unidades mais críticas.'),
      ),
      sec(
        'Indicadores e análises',
        table(
          ['Elemento', 'O que mostra'],
          [
            ['Distribuição por faixa', 'Participação do valor de mercadoria nas faixas de 0 a 3, 4 a 10 e acima de 10 dias, com referência de meta.'],
            ['Total de conhecimentos', 'Quantidade e variação sobre o último report, por faixa.'],
            ['Total por região', 'Quantidade de CT-es e valor de mercadoria em cada região.'],
            ['Comparativo com o último report', 'Valor por faixa em duas datas e a diferença entre elas.'],
            ['Total pendente por filial', 'Valor de mercadoria e total de CT-es, por faixa, em cada filial.'],
            ['Total por cliente e por destinatário', 'Distribuição por faixa de dias.'],
          ],
        ),
        p('O painel registra uma regra de leitura: digitalizações realizadas por celular permanecem pendentes no relatório quando não atendem aos critérios exigidos para a comprovação oficial.'),
      ),
      sec('Aplicação', p('Permite priorizar a regularização das pendências por faixa de tempo e por região, filial, cliente e destinatário, e verificar a variação desde o último report.')),
    ],
    related: ['comprovantes-retidos'],
    pending: [open('Confirmar a plataforma e a fonte de dados.')],
  },
  {
    id: 'prazo-coleta',
    slug: 'prazo-coleta',
    crumb: 'Prazo de Coleta',
    title: 'Prazo de Coleta',
    summary:
      'Cumprimento dos prazos de coleta por status, região e filial, com comparações mensais e anuais e filtros por cliente solicitante, tipo de coleta e categoria de cliente.',
    category: 'bi-operacional',
    types: ['dashboard', 'inteligencia-operacional'],
    tech: ['power-bi'],
    techNote: 'Power BI, conforme a identificação do arquivo de evidência feita pelo proprietário. Confirmação formal pendente.',
    caseType: 'compacto',
    natureLabel: CORPORATE,
    images: [{ id: 'prazo-coleta' }],
    sections: [
      sec(
        'Contexto e problema',
        p('O painel mede o cumprimento do prazo de coleta e o compara com a meta, mês a mês e ano a ano, para mostrar em que filiais, regiões e status a operação está dentro ou fora do prazo.'),
      ),
      sec(
        'Indicadores e análises',
        table(
          ['Elemento', 'O que mostra'],
          [
            ['Status de coleta', 'Efetuada, coletando, solucionada, em ocorrências, aguardando programação, nova tentativa e retirado no emitente, com a variação.'],
            ['Resultado consolidado', 'Coletas no prazo e fora do prazo frente à meta de 96%, com variação mensal, anual e acumulada no ano.'],
            ['Resultado ao longo dos meses', 'Total de coletas e eficiência, mês a mês, em dois anos.'],
            ['Percentual por região', 'Participação de cada região nas coletas fora do prazo.'],
            ['Principais filiais', 'Total de coletas no prazo e fora do prazo, e resultado de eficiência com variação.'],
            ['Distribuição percentual', 'Status atual das coletas.'],
            ['Filtros', 'Previsão de coleta, região, filial, cliente solicitante, cliente, status, logística reversa, tipo de coleta e categoria de cliente.'],
          ],
        ),
      ),
      sec('Aplicação', p('Permite acompanhar o cumprimento do prazo de coleta por dimensão e período e identificar as filiais e regiões que mais se afastam da meta. É uma solução própria, distinta do painel de gestão de coletas.')),
    ],
    related: ['gestao-coletas-logistica-reversa', 'indice-retorno'],
    pending: [open('Confirmar Power BI como ferramenta e a relação com a fonte "Power BI · Operacional (Coletas)" exibida no painel de gestão de coletas.')],
  },
];

/** Materiais analíticos e executivos: inteligência operacional e suporte à decisão, não software. */
export const casesComunicacao: Case[] = [
  {
    id: 'apresentacoes-resultados-operacionais',
    slug: 'apresentacoes-resultados-operacionais',
    crumb: 'Apresentações de Resultados',
    title: 'Apresentações de Resultados Operacionais',
    summary:
      'Materiais analíticos e executivos que levam o desempenho operacional à gestão, com resultados, desvios e pontos de atenção.',
    category: 'bi-operacional',
    types: ['relatorio-gerencial', 'inteligencia-operacional'],
    tech: [],
    techNote: 'Entrega analítica e de comunicação; não é aplicação de software, nenhuma tecnologia atribuída.',
    caseType: 'compacto',
    natureLabel: 'Material analítico e executivo',
    sections: [
      sec(
        'Contexto e problema',
        p('Um indicador só apoia uma decisão quando chega a quem decide de forma clara. O acompanhamento do desempenho operacional exige transformar números de várias fontes em uma leitura que a gestão consiga discutir.'),
      ),
      sec(
        'Entrega',
        p('Construção de materiais analíticos e executivos para o acompanhamento do desempenho operacional. Fazem parte da experiência de inteligência operacional e de suporte à decisão.'),
      ),
      sec('Aplicação', p('Sustenta a discussão de resultados com a gestão, ao reunir desempenho, desvios e pontos de atenção em um material de leitura executiva.')),
    ],
    related: ['briefings-reunioes-resultados', 'central-buscas-avarias'],
    pending: [open('Complementar com exemplos de estrutura dos materiais, sem dados confidenciais.')],
  },
  {
    id: 'central-buscas-avarias',
    slug: 'central-buscas-avarias',
    crumb: 'Central de Buscas e Avarias',
    title: 'Central de Buscas e Avarias',
    summary:
      'Apresentações e análises para a gestão das ocorrências, das buscas e das avarias, em apoio ao acompanhamento e à decisão.',
    category: 'bi-operacional',
    types: ['relatorio-gerencial', 'inteligencia-operacional'],
    tech: [],
    techNote: 'Entrega analítica e de comunicação; não é aplicação de software, nenhuma tecnologia atribuída.',
    caseType: 'compacto',
    natureLabel: 'Material analítico e executivo',
    sections: [
      sec(
        'Contexto e problema',
        p('Ocorrências, buscas e avarias geram informações que precisam ser acompanhadas em conjunto. A gestão precisa de uma leitura que relacione o que foi perdido ou danificado ao andamento da busca.'),
      ),
      sec(
        'Entrega',
        p('Apresentações e análises voltadas à gestão das ocorrências, das buscas e das avarias. Fazem parte da experiência de inteligência operacional e de suporte à decisão.'),
      ),
      sec('Aplicação', p('Reúne em análises que a gestão consegue acompanhar e discutir o que envolve ocorrências, buscas e avarias.')),
    ],
    related: ['automacao-avarias-extravios', 'apresentacoes-resultados-operacionais'],
    pending: [open('Complementar com a estrutura das análises, sem dados confidenciais.')],
  },
  {
    id: 'briefings-reunioes-resultados',
    slug: 'briefings-reunioes-resultados',
    crumb: 'Briefings e Reuniões de Resultados',
    title: 'Briefings e Reuniões de Resultados',
    summary:
      'Briefings, consolidações analíticas e apresentações de indicadores para as reuniões de acompanhamento gerencial.',
    category: 'bi-operacional',
    types: ['relatorio-gerencial', 'inteligencia-operacional'],
    tech: [],
    techNote: 'Entrega analítica e de comunicação; não é aplicação de software, nenhuma tecnologia atribuída.',
    caseType: 'compacto',
    natureLabel: 'Material analítico e executivo',
    sections: [
      sec(
        'Contexto e problema',
        p('Uma reunião de resultados é útil quando chega preparada: indicadores consolidados, o que mudou em relação ao período anterior e os pontos que exigem decisão.'),
      ),
      sec(
        'Entrega',
        p('Construção de briefings, consolidações analíticas e apresentações de indicadores para o acompanhamento gerencial. Fazem parte da experiência de inteligência operacional e de suporte à decisão.'),
      ),
      sec('Aplicação', p('Dá à gestão o material para discutir resultados com base em indicadores consolidados e comparáveis.')),
    ],
    related: ['apresentacoes-resultados-operacionais'],
    pending: [open('Complementar com a estrutura dos briefings, sem dados confidenciais.')],
  },
];
