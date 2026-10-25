import type { Study } from './types.ts';

/**
 * Estudos técnicos. Cada afirmação carrega seu estado de evidência: o que é código real,
 * o que é declaração, o que é demonstração sintética e o que é apenas conhecimento conceitual.
 * Nada aqui descreve estrutura interna, regras, endpoints ou dados de uma empresa.
 */
export const studies: Study[] = [
  {
    slug: 'inteligencia-comercial-crm',
    title: 'Inteligência comercial e CRM',
    domain: 'Inteligência Comercial e CRM',
    summary:
      'Como transformar oportunidades, propostas e estágios de um CRM em indicadores comerciais com definição única, do funil ao forecast.',
    natureLabel: 'Estudo · BI comercial',
    scope: 'Modelo analítico e demonstração com dados sintéticos. Nenhum dado, número ou marca de empresa real.',
    access: 'Dados gerados de forma determinística para a demonstração.',
    sections: [
      {
        title: 'A pergunta de negócio',
        blocks: [
          { kind: 'p', text: 'A gestão comercial precisa responder, toda semana: quais oportunidades merecem atenção, quanto se espera fechar no período e onde o funil perde força. Sem definição única de estágio e de valor, cada área responde com um número diferente.' },
          {
            kind: 'list',
            title: 'Indicadores',
            items: [
              'Pipeline aberto: soma do valor das oportunidades em andamento.',
              'Conversão por estágio: oportunidades que avançam dividido pelas que entraram no estágio.',
              'Forecast ponderado: valor da oportunidade multiplicado pela probabilidade do estágio.',
              'Ciclo de venda: dias entre a criação e o fechamento.',
              'Taxa de ganho: ganhas dividido por ganhas mais perdidas.',
            ],
          },
        ],
      },
      {
        title: 'Modelo de dados',
        blocks: [
          { kind: 'p', text: 'A tabela fato registra uma linha por oportunidade e por estágio atingido. As dimensões de tempo, estágio, responsável e cliente permitem cortar qualquer indicador sem recalcular regras.' },
          { kind: 'diagram', id: 'star-schema', caption: 'Modelo estrela (conceitual) para análise comercial' },
          { kind: 'diagram', id: 'crm-erp-tms-bi', caption: 'Onde o BI se encontra com CRM, precificação, ERP e TMS (conceitual)' },
        ],
      },
      {
        title: 'Regras que evitam leitura errada',
        blocks: [
          {
            kind: 'table',
            head: ['Regra', 'Motivo'],
            rows: [
              ['Conversão calculada sobre contagens', 'Percentuais não se promediam; a razão de somas preserva o peso de cada grupo.'],
              ['Estágios com definição escrita', 'O mesmo nome precisa significar a mesma coisa para todos.'],
              ['Forecast separado do pipeline', 'Pipeline é o que existe; forecast é uma expectativa ponderada.'],
              ['Comparar períodos de mesma duração', 'Evita atribuir a diferença de calendário ao desempenho.'],
            ],
          },
          {
            kind: 'code',
            label: 'Forecast ponderado em DAX',
            lang: 'dax',
            source: 'Forecast ponderado =\nSUMX(\n    FILTER(fato_oportunidade, fato_oportunidade[status] = "Aberta"),\n    fato_oportunidade[valor] * RELATED(dim_estagio[probabilidade])\n)',
          },
        ],
      },
      {
        title: 'Demonstração',
        blocks: [
          { kind: 'p', text: 'A demonstração abaixo usa dados sintéticos para mostrar funil, conversão e forecast ponderado. Os números ilustram o método e não representam resultado de nenhuma empresa.' },
          { kind: 'demo', id: 'commercial' },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'Modelo analítico e definições de indicadores', status: 'conceitual' },
              { label: 'Demonstração interativa com dados simulados', status: 'sintetico', note: 'Implementada em TypeScript e SVG neste site.' },
              { label: 'Painéis comerciais publicados em empresa', status: 'declarado', note: 'Detalhes, dados e capturas não são divulgados.' },
            ],
          },
        ],
      },
    ],
    next: 'integracoes-automacoes',
  },
  {
    slug: 'integracoes-automacoes',
    title: 'Integrações e automações',
    domain: 'Integrações e Automações',
    summary:
      'Padrões para ligar sistemas com segurança e previsibilidade: APIs REST, autenticação, webhooks, tentativas repetidas e idempotência.',
    natureLabel: 'Estudo · integração',
    scope: 'Conhecimento conceitual e padrões de projeto. Não descreve integrações internas de nenhuma empresa.',
    access: 'Sem endpoints, credenciais ou estruturas reais.',
    sections: [
      {
        title: 'O problema',
        blocks: [
          { kind: 'p', text: 'Quando CRM, precificação, ERP, TMS e BI trocam informação, três coisas precisam estar definidas: quem é a fonte de cada dado, qual identificador liga os registros e o que acontece quando uma chamada falha.' },
          { kind: 'diagram', id: 'integracao-api', caption: 'Chamada autenticada entre sistemas, com validação e retentativa (conceitual)' },
        ],
      },
      {
        title: 'Padrões',
        blocks: [
          {
            kind: 'table',
            head: ['Padrão', 'Para que serve'],
            rows: [
              ['REST com contrato tipado', 'Entrada validada e respostas previsíveis entre cliente e servidor.'],
              ['OAuth 2.0 e JWT', 'Identidade e permissão por token, com expiração curta.'],
              ['Webhooks', 'Notificar eventos sem consulta repetida (polling).'],
              ['Retentativa com espera crescente', 'Tolerar falhas transitórias sem sobrecarregar o destino.'],
              ['Idempotência', 'Repetir uma chamada sem duplicar o efeito.'],
              ['Identificador de correlação', 'Rastrear uma operação por todos os sistemas.'],
            ],
          },
          {
            kind: 'code',
            label: 'Chave de idempotência (exemplo ilustrativo)',
            lang: 'python',
            source: 'def registrar(db, chave: str, payload: dict) -> dict:\n    """Repetir a chamada com a mesma chave devolve o resultado original."""\n    existente = db.buscar_por_chave(chave)\n    if existente is not None:\n        return existente.resultado\n    resultado = processar(payload)\n    db.salvar(chave, resultado)\n    return resultado',
            note: 'Código didático escrito para o estudo; não pertence a nenhum sistema corporativo.',
          },
        ],
      },
      {
        title: 'Automação de processos',
        blocks: [
          { kind: 'p', text: 'Automações de baixo código, como as do Power Automate, servem a tarefas bem delimitadas: aprovar, notificar, copiar dados entre serviços. Quando a regra de negócio cresce, ela passa a viver em código versionado e testado, e o fluxo apenas a chama.' },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'Padrões de API, autenticação e resiliência', status: 'conceitual' },
              { label: 'APIs construídas com FastAPI e validação tipada', status: 'codigo', note: 'Parte do EasyPrice, cujo código não é público.' },
              { label: 'Integração com Salesforce', status: 'planejado', note: 'Escopo documentado; não implantado.' },
              { label: 'Fluxos de Power Automate em produção', status: 'declarado', note: 'Detalhes não divulgados.' },
            ],
          },
        ],
      },
    ],
    next: 'sql-server-avancado',
  },
  {
    slug: 'sql-server-avancado',
    title: 'SQL Server em profundidade',
    domain: 'Engenharia de Dados',
    summary:
      'Consultas analíticas, janelas, CTEs, índices e plano de execução em T-SQL, com exemplos didáticos em dados fictícios.',
    natureLabel: 'Estudo · banco de dados',
    scope: 'Exemplos didáticos em tabelas fictícias. Não é administração de banco de dados.',
    access: 'Sem nomes de servidores, bancos ou estruturas reais.',
    sections: [
      {
        title: 'Consulta analítica com janela',
        blocks: [
          { kind: 'p', text: 'Funções de janela calculam acumulados e comparações entre linhas sem colapsar o resultado, o que evita junções repetidas.' },
          {
            kind: 'code',
            label: 'Variação mensal e acumulado no ano',
            lang: 'sql',
            source: "WITH mensal AS (\n    SELECT\n        DATEFROMPARTS(YEAR(data_emissao), MONTH(data_emissao), 1) AS mes,\n        SUM(valor) AS valor\n    FROM dbo.proposta\n    WHERE status = 'Fechada'\n    GROUP BY DATEFROMPARTS(YEAR(data_emissao), MONTH(data_emissao), 1)\n)\nSELECT\n    mes,\n    valor,\n    LAG(valor) OVER (ORDER BY mes) AS valor_mes_anterior,\n    SUM(valor) OVER (PARTITION BY YEAR(mes) ORDER BY mes ROWS UNBOUNDED PRECEDING) AS acumulado_ano\nFROM mensal\nORDER BY mes;",
          },
        ],
      },
      {
        title: 'Deduplicar com ROW_NUMBER',
        blocks: [
          {
            kind: 'code',
            label: 'Manter o registro mais recente por chave',
            lang: 'sql',
            source: 'WITH ranqueado AS (\n    SELECT *,\n           ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY atualizado_em DESC) AS rn\n    FROM dbo.cliente_stage\n)\nSELECT *\nFROM ranqueado\nWHERE rn = 1;',
          },
        ],
      },
      {
        title: 'Índices e plano de execução',
        blocks: [
          { kind: 'p', text: 'Um índice ajuda quando a consulta filtra e ordena pelas colunas da chave. Colunas de retorno entram em INCLUDE para evitar a leitura da tabela inteira.' },
          {
            kind: 'code',
            label: 'Índice cobrindo a consulta de propostas por cliente',
            lang: 'sql',
            source: 'CREATE NONCLUSTERED INDEX ix_proposta_cliente_data\n    ON dbo.proposta (cliente_id, data_emissao)\n    INCLUDE (valor, status);',
          },
          {
            kind: 'list',
            title: 'Como investigar uma consulta lenta',
            items: [
              'Ler o plano de execução real e procurar leituras de tabela inteira (scan).',
              'Conferir estimativas de linhas contra as reais: grande diferença indica estatísticas defasadas.',
              'Evitar funções sobre a coluna filtrada, que impedem o uso do índice.',
              'Medir com SET STATISTICS IO ON antes e depois de cada mudança.',
            ],
          },
        ],
      },
      {
        title: 'Transações e atomicidade',
        blocks: [
          {
            kind: 'code',
            label: 'Operação atômica com tratamento de erro',
            lang: 'sql',
            source: 'BEGIN TRY\n    BEGIN TRANSACTION;\n    UPDATE dbo.conta SET saldo = saldo - @valor WHERE id = @origem;\n    UPDATE dbo.conta SET saldo = saldo + @valor WHERE id = @destino;\n    COMMIT TRANSACTION;\nEND TRY\nBEGIN CATCH\n    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;\n    THROW;\nEND CATCH;',
          },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'SQL Server como banco do EasyPrice e do Marivan Finance', status: 'codigo', note: 'Código privado; uso comprovado no histórico dos repositórios.' },
              { label: 'Exemplos desta página', status: 'conceitual', note: 'Escritos para o estudo, com tabelas fictícias.' },
              { label: 'Administração de servidores de banco de dados', status: 'conceitual', note: 'Não é uma atribuição declarada.' },
            ],
          },
        ],
      },
    ],
    next: 'engenharia-sistemas-infraestrutura',
  },
  {
    slug: 'engenharia-sistemas-infraestrutura',
    title: 'Engenharia de sistemas e infraestrutura',
    domain: 'Engenharia de Software',
    summary:
      'Decomposição de uma aplicação em camadas, decisões de escala e implantação, com a separação entre o que está em uso e o que é desenho de referência.',
    natureLabel: 'Estudo · arquitetura',
    scope: 'Desenho de referência. Nada aqui afirma que a arquitetura esteja implantada.',
    access: 'Sem topologia real, nomes de servidores ou configurações.',
    sections: [
      {
        title: 'Desenho de referência',
        blocks: [
          { kind: 'p', text: 'Pensar em sistema é decidir onde cada responsabilidade mora: interface, API, regras, persistência, cache e filas. Cada divisão custa complexidade, por isso só se justifica quando resolve um problema concreto.' },
          { kind: 'diagram', id: 'system-design', caption: 'Aplicação web em camadas (desenho de referência)' },
          { kind: 'diagram', id: 'infra-app', caption: 'Implantação de referência com proxy reverso e banco (conceitual)' },
        ],
      },
      {
        title: 'Decisões e custos',
        blocks: [
          {
            kind: 'table',
            head: ['Decisão', 'Ganho', 'Custo'],
            rows: [
              ['Separar API e interface', 'Evolução independente e testes do cálculo sem tela.', 'Contrato entre as partes a manter.'],
              ['Cache de leitura', 'Menos consultas repetidas.', 'Invalidação e dados desatualizados.'],
              ['Fila para tarefas longas', 'Resposta rápida ao usuário.', 'Estado assíncrono e reprocessamento.'],
              ['Mais de uma instância', 'Tolerância a falha e capacidade.', 'Sessão e estado compartilhado.'],
            ],
          },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'Aplicação em camadas com FastAPI, Next.js e SQL Server', status: 'codigo', note: 'EasyPrice.' },
              { label: 'Hospedagem em IIS e autenticação do Windows', status: 'codigo', note: 'Marivan Finance.' },
              { label: 'Cache, fila e balanceamento de carga', status: 'conceitual', note: 'Parte do desenho de referência; não afirmo implantação.' },
            ],
          },
        ],
      },
    ],
    next: 'normalizacao-cidades-ibge',
  },
  {
    slug: 'normalizacao-cidades-ibge',
    title: 'Normalização de cidades com referência do IBGE',
    domain: 'Engenharia de Dados',
    summary:
      'Estudo de como reconciliar nomes de cidades digitados de forma livre com uma lista oficial, de modo determinístico e auditável.',
    natureLabel: 'Estudo · qualidade de dados',
    scope: 'Método determinístico (regras e similaridade de texto). Não usa aprendizado de máquina.',
    access: 'A demonstração usa uma amostra pequena de exemplo; não reproduz a base do IBGE nem seus códigos.',
    sections: [
      {
        title: 'O problema',
        blocks: [
          { kind: 'p', text: 'Cidades chegam como "S. Paulo", "sao paulo" ou "São Paulo - SP". Para cruzar bases, o nome precisa virar uma chave única da lista oficial, e a dúvida precisa ser tratada com revisão, não com palpite.' },
          { kind: 'diagram', id: 'cidades-pipeline', caption: 'Etapas de normalização e conciliação (conceitual)' },
        ],
      },
      {
        title: 'Método',
        blocks: [
          {
            kind: 'list',
            items: [
              'Normalizar o texto: minúsculas, remoção de acentos, pontuação e abreviações comuns.',
              'Separar a UF quando presente e usá-la para reduzir os candidatos.',
              'Busca exata na lista normalizada.',
              'Na falta de correspondência exata, calcular similaridade e aceitar só acima de um limite.',
              'Casos abaixo do limite ou com empate vão para revisão manual.',
            ],
          },
          {
            kind: 'code',
            label: 'Normalização de texto (exemplo)',
            lang: 'python',
            source: 'import re\nimport unicodedata\n\ndef normalizar(texto: str) -> str:\n    sem_acento = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()\n    limpo = re.sub(r"[^a-z0-9 ]+", " ", sem_acento.lower())\n    return re.sub(r"\\s+", " ", limpo).strip()',
          },
        ],
      },
      {
        title: 'Demonstração',
        blocks: [
          { kind: 'p', text: 'Digite um nome de cidade. A lista usada é uma amostra pequena de exemplo, apenas para mostrar as etapas: a decisão é determinística, sem aprendizado de máquina.' },
          { kind: 'demo', id: 'cities' },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'Conciliação de nomes de cidades no EasyPrice', status: 'codigo', note: 'Módulo privado; descrito apenas em linhas gerais.' },
              { label: 'Demonstração interativa', status: 'sintetico', note: 'Amostra pequena de exemplo, sem códigos do IBGE.' },
              { label: 'Uso de aprendizado de máquina', status: 'conceitual', note: 'Não é usado: o método é por regras.' },
            ],
          },
        ],
      },
    ],
    next: 'ia-rag-agentes',
  },
  {
    slug: 'ia-rag-agentes',
    title: 'IA aplicada: RAG e agentes',
    domain: 'Inteligência Artificial Aplicada',
    summary:
      'Estudo conceitual de recuperação aumentada por geração (RAG) e de agentes com ferramentas, com atenção a avaliação, limites e segurança.',
    natureLabel: 'Estudo · não implantado',
    scope: 'Estudo de arquitetura. Nenhum sistema de RAG ou de agentes está implantado em produção.',
    access: 'Sem código de produção, dados ou resultados de avaliação.',
    sections: [
      {
        title: 'RAG em duas fases',
        blocks: [
          { kind: 'p', text: 'RAG separa o conhecimento do modelo: os documentos são preparados e indexados uma vez, e a cada pergunta apenas os trechos relevantes são entregues ao modelo como contexto.' },
          { kind: 'diagram', id: 'rag-ingestao', caption: 'Ingestão: documentos até o índice vetorial (conceitual)' },
          { kind: 'diagram', id: 'rag-consulta', caption: 'Consulta: pergunta, recuperação e resposta com fontes (conceitual)' },
        ],
      },
      {
        title: 'Agentes com ferramentas',
        blocks: [
          { kind: 'p', text: 'Um agente decide qual ferramenta chamar, observa o resultado e repete até concluir. Por isso as ferramentas precisam ter permissões mínimas e as ações com efeito, como gravar ou enviar, pedem confirmação humana.' },
          { kind: 'diagram', id: 'agente-ia', caption: 'Ciclo de um agente com ferramentas (conceitual)' },
        ],
      },
      {
        title: 'Riscos e avaliação',
        blocks: [
          {
            kind: 'table',
            head: ['Risco', 'Mitigação'],
            rows: [
              ['Resposta sem base nos documentos', 'Exigir citação do trecho e recusar quando a recuperação for fraca.'],
              ['Instruções escondidas em documentos', 'Tratar o conteúdo recuperado como dado, nunca como comando.'],
              ['Vazamento de dados sensíveis', 'Filtrar por permissão antes da recuperação.'],
              ['Qualidade que muda sem aviso', 'Conjunto fixo de perguntas de teste, reavaliado a cada mudança.'],
            ],
          },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'Arquitetura de RAG e de agentes', status: 'conceitual' },
              { label: 'Sistema de RAG ou agentes em produção', status: 'planejado', note: 'Não existe implantação; é um estudo.' },
            ],
          },
        ],
      },
    ],
    next: 'inteligencia-comercial-crm',
  },
];

export function getStudy(slug: string): Study | undefined {
  return studies.find((s) => s.slug === slug);
}
