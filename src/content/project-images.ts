// Gerado por tools/build-project-images.mjs. Não editar à mão.
// As imagens públicas são as capturas fornecidas pelo autor, apenas convertidas para WebP e, quando
// 4K, reduzidas em largura. O tratamento de confidencialidade (desfoque) é o já presente nelas;
// nenhuma camada é adicionada. `originalSha256` identifica o PNG original, mantido fora do repositório.
export interface ProjectImage {
  id: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  originalSha256: string;
}

export const projectImages: ProjectImage[] = [
  {
    "id": "comprovantes-retidos",
    "alt": "Painel de comprovantes retidos: distribuição do valor de mercadoria por faixas de dias, principais filiais e principais clientes, com comparação ao último report.",
    "caption": "Comprovantes retidos por faixa de tempo",
    "width": 1919,
    "height": 988,
    "thumbWidth": 720,
    "thumbHeight": 371,
    "originalSha256": "72b13c1c6b1f995167c27d175d527316055470e85bdbd90074bed795a55ff0f1"
  },
  {
    "id": "indice-retorno",
    "alt": "Painel do índice de retorno: percentual de entregas não realizadas, meta, comparação por região e por filial, evolução anual e tendência diária.",
    "caption": "Índice de retorno de entregas",
    "width": 1919,
    "height": 1006,
    "thumbWidth": 720,
    "thumbHeight": 377,
    "originalSha256": "e0e1ed7255024bddfa9f5238c0881d4f1023acc6c666b54c3183fe25b3cccd42"
  },
  {
    "id": "ocorrencias-origem",
    "alt": "Painel de ocorrências na origem: valor de mercadoria retida, composição por faixas de dias, valor de ocorrência por filial e evolução diária.",
    "caption": "Ocorrências na origem",
    "width": 1919,
    "height": 983,
    "thumbWidth": 720,
    "thumbHeight": 369,
    "originalSha256": "6a0825ba5a3548c8c79946fd329b44c38a4293b7e3e5e2256a580168094e93cf"
  },
  {
    "id": "consolidado-2025",
    "alt": "Painel consolidado de ocorrências e ranking de filiais no Brasil, versão de 2025: notas, volumetria, mapa regional e total diário de ocorrências.",
    "caption": "Consolidado e ranking de filiais, versão 2025",
    "width": 2400,
    "height": 1350,
    "thumbWidth": 720,
    "thumbHeight": 405,
    "originalSha256": "42ec1f8b4bb12d2829625f34b8a1fb64718891c60091ee54be28ddb22d407fac"
  },
  {
    "id": "consolidado-2024",
    "alt": "Painel consolidado de ocorrências e ranking de filiais no Brasil, versão de 2024: eventos, volumetria, ranking de filiais, mapa regional e valor total por dia de inclusão.",
    "caption": "Consolidado e ranking de filiais, versão 2024",
    "width": 1920,
    "height": 1080,
    "thumbWidth": 720,
    "thumbHeight": 405,
    "originalSha256": "f24c09f9abb216edeacd9bdb6b4ad5405d869f711ef6fecebc6ae0b1759bbd6d"
  },
  {
    "id": "gestao-coletas",
    "alt": "Painel de gestão de coletas com filtro de logística reversa em \"Não\": desempenho dentro do prazo, status de coleta, desempenho anual, principais filiais e tabela por região e filial.",
    "caption": "Gestão de coletas, visão sem logística reversa",
    "width": 1920,
    "height": 979,
    "thumbWidth": 720,
    "thumbHeight": 367,
    "originalSha256": "d22f2e24e7233d77632fe0fd978c0c7e08cb2a6a507cfbfd67d78aadd0f5dfb3"
  },
  {
    "id": "logistica-reversa",
    "alt": "Painel de gestão de coletas com filtro de logística reversa em \"Sim\": desempenho dentro do prazo, status, desempenho anual, principais filiais e tabela por região e filial.",
    "caption": "Gestão de coletas, visão de logística reversa",
    "width": 1920,
    "height": 997,
    "thumbWidth": 720,
    "thumbHeight": 374,
    "originalSha256": "a3d62ceed258e21ed92eb1c6fd847050f82a04a5f3e154fe902466b8eaa9926d"
  },
  {
    "id": "desvio-operacional-gru",
    "alt": "Painel de desvios operacionais da operação de GRU: desvios por turno, status do retorno, total de desvios do mês, e comparativos de ocorrências e volumetria com o ano anterior.",
    "caption": "Desvios operacionais, operação GRU",
    "width": 1920,
    "height": 1080,
    "thumbWidth": 720,
    "thumbHeight": 405,
    "originalSha256": "c6620da8da2788a994c89d2e25d1803f975bed53d067b2bf8989616edb8aff56"
  },
  {
    "id": "pendencias-digitalizacao",
    "alt": "Painel de pendências de digitalização: distribuição por faixas de dias, total por região, total pendente por filial, por cliente e por destinatário.",
    "caption": "Pendências de digitalização",
    "width": 2400,
    "height": 2154,
    "thumbWidth": 720,
    "thumbHeight": 646,
    "originalSha256": "d2aee2a9d25546e9317003152e5493869bcae27d7929c8ad7a8322097af9a6dc"
  },
  {
    "id": "prazo-coleta",
    "alt": "Painel de prazo de coleta: coletas por status, resultado consolidado frente à meta, resultado por mês, percentual por região, principais filiais e filtros relacionados.",
    "caption": "Prazo de coleta",
    "width": 2400,
    "height": 1350,
    "thumbWidth": 720,
    "thumbHeight": 405,
    "originalSha256": "f604e979889320f87af9dc5562a3c054343232956bff94f2cf2479e4eb1bdeee"
  }
];

export function getProjectImage(id: string): ProjectImage | undefined {
  return projectImages.find((i) => i.id === id);
}
