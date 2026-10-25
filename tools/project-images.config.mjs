// Capturas de projetos: metadados de cada imagem.
// As capturas são usadas exatamente como o autor as forneceu: o desfoque dos trechos confidenciais já
// está nelas, e este projeto NÃO adiciona tarjas, máscaras, blur ou qualquer outra camada.
// Os arquivos originais ficam fora do repositório (PROJECT_ORIGINALS_DIR). Só se converte o formato
// (WebP) e, nas capturas 4K, reduz-se a largura para `maxWidth`, por desempenho.

/** @type {{id:string; original:string; maxWidth:number; alt:string; caption:string}[]} */
export const images = [
  {
    id: 'comprovantes-retidos',
    original: 'Comprovantes_Retidos.png',
    maxWidth: 1920,
    alt: 'Painel de comprovantes retidos: distribuição do valor de mercadoria por faixas de dias, principais filiais e principais clientes, com comparação ao último report.',
    caption: 'Comprovantes retidos por faixa de tempo',
  },
  {
    id: 'indice-retorno',
    original: 'Indice_Retorno.png',
    maxWidth: 1920,
    alt: 'Painel do índice de retorno: percentual de entregas não realizadas, meta, comparação por região e por filial, evolução anual e tendência diária.',
    caption: 'Índice de retorno de entregas',
  },
  {
    id: 'ocorrencias-origem',
    original: 'Ocorrência_Origem.png',
    maxWidth: 1920,
    alt: 'Painel de ocorrências na origem: valor de mercadoria retida, composição por faixas de dias, valor de ocorrência por filial e evolução diária.',
    caption: 'Ocorrências na origem',
  },
  {
    id: 'consolidado-2025',
    original: 'Painel_Controle_Extravio.png',
    maxWidth: 2400,
    alt: 'Painel consolidado de ocorrências e ranking de filiais no Brasil, versão de 2025: notas, volumetria, mapa regional e total diário de ocorrências.',
    caption: 'Consolidado e ranking de filiais, versão 2025',
  },
  {
    id: 'consolidado-2024',
    original: 'Painel_Extravio_Ranking_Dia.png',
    maxWidth: 1920,
    alt: 'Painel consolidado de ocorrências e ranking de filiais no Brasil, versão de 2024: eventos, volumetria, ranking de filiais, mapa regional e valor total por dia de inclusão.',
    caption: 'Consolidado e ranking de filiais, versão 2024',
  },
  {
    id: 'gestao-coletas',
    original: 'Painel_GestãodeColeta.png',
    maxWidth: 1920,
    alt: 'Painel de gestão de coletas com filtro de logística reversa em "Não": desempenho dentro do prazo, status de coleta, desempenho anual, principais filiais e tabela por região e filial.',
    caption: 'Gestão de coletas, visão sem logística reversa',
  },
  {
    id: 'logistica-reversa',
    original: 'Painel_LogisticaReversa.png',
    maxWidth: 1920,
    alt: 'Painel de gestão de coletas com filtro de logística reversa em "Sim": desempenho dentro do prazo, status, desempenho anual, principais filiais e tabela por região e filial.',
    caption: 'Gestão de coletas, visão de logística reversa',
  },
  {
    id: 'desvio-operacional-gru',
    original: 'Painel_Ocorrências_Ofensoras.png',
    maxWidth: 1920,
    alt: 'Painel de desvios operacionais da operação de GRU: desvios por turno, status do retorno, total de desvios do mês, e comparativos de ocorrências e volumetria com o ano anterior.',
    caption: 'Desvios operacionais, operação GRU',
  },
  {
    id: 'pendencias-digitalizacao',
    original: 'Pendencia_Digitalização.png',
    maxWidth: 2400,
    alt: 'Painel de pendências de digitalização: distribuição por faixas de dias, total por região, total pendente por filial, por cliente e por destinatário.',
    caption: 'Pendências de digitalização',
  },
  {
    id: 'prazo-coleta',
    original: 'Power_BI_Prazo_Coleta.png',
    maxWidth: 2400,
    alt: 'Painel de prazo de coleta: coletas por status, resultado consolidado frente à meta, resultado por mês, percentual por região, principais filiais e filtros relacionados.',
    caption: 'Prazo de coleta',
  },
];
