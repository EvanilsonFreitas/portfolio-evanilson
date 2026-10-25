import type { Diagram } from '../lib/diagram.ts';

export type DiagramId =
  | 'crm-erp-tms-bi'
  | 'integracao-api'
  | 'system-design'
  | 'rag-ingestao'
  | 'rag-consulta'
  | 'agente-ia'
  | 'star-schema'
  | 'pipeline-bi'
  | 'pricing-engine'
  | 'cidades-pipeline'
  | 'infra-app';

/** Todos os diagramas são conceituais; o estado real de cada tecnologia está nas tabelas de cada página. */
export const diagrams: Record<DiagramId, Diagram> = {
  'crm-erp-tms-bi': {
    id: 'crm-erp-tms-bi',
    title: 'Fluxo conceitual: CRM, oportunidade, precificação, aprovação, ERP ou TMS, dados analíticos e BI',
    nodes: [
      { id: 'crm', label: 'CRM', sub: 'oportunidade', col: 0, row: 0 },
      { id: 'preco', label: 'Processo de\nprecificação', col: 1, row: 0 },
      { id: 'aprov', label: 'Aprovação', col: 2, row: 0 },
      { id: 'erp', label: 'ERP / TMS', sub: 'execução', col: 3, row: 0 },
      { id: 'dados', label: 'Dados\nanalíticos', sub: 'modelo dimensional', col: 3, row: 1 },
      { id: 'bi', label: 'BI', sub: 'decisão', col: 2, row: 1, tone: 'strong' },
    ],
    edges: [
      { from: 'crm', to: 'preco' },
      { from: 'preco', to: 'aprov' },
      { from: 'aprov', to: 'erp' },
      { from: 'erp', to: 'dados' },
      { from: 'dados', to: 'bi' },
      { from: 'preco', to: 'crm', route: 'u', fromSide: 'bottom', toSide: 'bottom', dashed: true, label: 'retorno dos indicadores' },
    ],
  },
  'integracao-api': {
    id: 'integracao-api',
    title: 'Integração por API REST: origem, validação, API, destino, resposta, retry e log',
    nodes: [
      { id: 'origem', label: 'Sistema\nde origem', col: 0, row: 0 },
      { id: 'payload', label: 'Montar\npayload', sub: 'JSON', col: 1, row: 0 },
      { id: 'valid', label: 'Validar', sub: 'schema', col: 2, row: 0 },
      { id: 'api', label: 'API REST', sub: 'HTTPS · OAuth 2.0', col: 3, row: 0, tone: 'strong' },
      { id: 'destino', label: 'Sistema\nde destino', col: 4, row: 0 },
      { id: 'resp', label: 'Resposta', sub: 'status + corpo', col: 4, row: 1 },
      { id: 'retry', label: 'Retry com\nbackoff', sub: 'idempotente', col: 3, row: 1, tone: 'dashed' },
      { id: 'log', label: 'Log e\nrastreio', sub: 'correlation id', col: 2, row: 1 },
    ],
    edges: [
      { from: 'origem', to: 'payload' },
      { from: 'payload', to: 'valid' },
      { from: 'valid', to: 'api' },
      { from: 'api', to: 'destino', label: 'POST' },
      { from: 'destino', to: 'resp' },
      { from: 'resp', to: 'retry', label: 'falha' },
      { from: 'retry', to: 'api', dashed: true, label: 'nova tentativa' },
      { from: 'retry', to: 'log' },
    ],
  },
  'system-design': {
    id: 'system-design',
    title: 'Design de sistema: cliente, camada web, API, serviços e banco, com identidade e cache opcionais',
    nodes: [
      { id: 'cli', label: 'Cliente', sub: 'navegador', col: 0, row: 0 },
      { id: 'web', label: 'Camada web', sub: 'proxy reverso · TLS', col: 1, row: 0 },
      { id: 'api', label: 'API', sub: 'contratos e validação', col: 2, row: 0, tone: 'strong' },
      { id: 'svc', label: 'Serviços', sub: 'regras de negócio', col: 3, row: 0 },
      { id: 'db', label: 'Banco\nde dados', sub: 'fonte de verdade', col: 4, row: 0 },
      { id: 'auth', label: 'Identidade', sub: 'autenticação', col: 2, row: 1, tone: 'dashed' },
      { id: 'cache', label: 'Cache', sub: 'opcional', col: 3, row: 1, tone: 'dashed' },
    ],
    edges: [
      { from: 'cli', to: 'web' },
      { from: 'web', to: 'api' },
      { from: 'api', to: 'svc' },
      { from: 'svc', to: 'db' },
      { from: 'api', to: 'auth', dashed: true, label: 'valida' },
      { from: 'svc', to: 'cache', dashed: true, label: 'leituras' },
    ],
  },
  'rag-ingestao': {
    id: 'rag-ingestao',
    title: 'RAG, preparação do conhecimento: documentos, ingestão, chunking, embeddings e índice vetorial',
    nodes: [
      { id: 'docs', label: 'Documentos', sub: 'fontes autorizadas', col: 0, row: 0 },
      { id: 'ing', label: 'Ingestão', sub: 'limpeza · metadados', col: 1, row: 0 },
      { id: 'chunk', label: 'Chunking', sub: 'trechos com contexto', col: 2, row: 0 },
      { id: 'emb', label: 'Embeddings', sub: 'vetores', col: 3, row: 0 },
      { id: 'idx', label: 'Índice\nvetorial', col: 4, row: 0, tone: 'strong' },
    ],
    edges: [
      { from: 'docs', to: 'ing' },
      { from: 'ing', to: 'chunk' },
      { from: 'chunk', to: 'emb' },
      { from: 'emb', to: 'idx' },
    ],
  },
  'rag-consulta': {
    id: 'rag-consulta',
    title: 'RAG, fluxo de consulta: pergunta, embedding, recuperação, LLM e resposta fundamentada',
    nodes: [
      { id: 'q', label: 'Pergunta', col: 0, row: 0 },
      { id: 'qe', label: 'Embedding\nda pergunta', col: 1, row: 0 },
      { id: 'rec', label: 'Recuperação', sub: 'top-k + filtros', col: 2, row: 0 },
      { id: 'llm', label: 'LLM', sub: 'contexto + pergunta', col: 3, row: 0, tone: 'strong' },
      { id: 'ans', label: 'Resposta\ncom fontes', col: 4, row: 0 },
      { id: 'idx', label: 'Índice\nvetorial', col: 2, row: 1 },
      { id: 'eval', label: 'Avaliação', sub: 'fidelidade às fontes', col: 4, row: 1, tone: 'dashed' },
    ],
    edges: [
      { from: 'q', to: 'qe' },
      { from: 'qe', to: 'rec' },
      { from: 'rec', to: 'llm', label: 'trechos' },
      { from: 'llm', to: 'ans' },
      { from: 'idx', to: 'rec' },
      { from: 'ans', to: 'eval', dashed: true },
    ],
  },
  'agente-ia': {
    id: 'agente-ia',
    title: 'Agente de IA: solicitação, planejamento, chamada de ferramenta, observação e ciclo, com aprovação humana',
    nodes: [
      { id: 'sol', label: 'Solicitação', col: 0, row: 0 },
      { id: 'plano', label: 'Planejamento', sub: 'LLM', col: 1, row: 0, tone: 'strong' },
      { id: 'tool', label: 'Ferramenta', sub: 'API · consulta', col: 2, row: 0 },
      { id: 'obs', label: 'Observação', sub: 'resultado', col: 3, row: 0 },
      { id: 'human', label: 'Aprovação\nhumana', sub: 'ações sensíveis', col: 2, row: 1, tone: 'dashed' },
      { id: 'lim', label: 'Permissões\ne limites', col: 1, row: 1, tone: 'dashed' },
    ],
    edges: [
      { from: 'sol', to: 'plano' },
      { from: 'plano', to: 'tool' },
      { from: 'tool', to: 'obs' },
      { from: 'obs', to: 'plano', route: 'ut', fromSide: 'top', toSide: 'top', label: 'novo ciclo' },
      { from: 'tool', to: 'human', dashed: true },
      { from: 'lim', to: 'plano', dashed: true },
    ],
  },
  'star-schema': {
    id: 'star-schema',
    title: 'Esquema estrela: tabela fato de entregas cercada por dimensões de tempo, região, unidade e tipo de ocorrência',
    nodes: [
      { id: 'tempo', label: 'Dim Tempo', sub: 'dia · mês · ano', col: 1, row: 0 },
      { id: 'regiao', label: 'Dim Região', sub: 'UF · região', col: 0, row: 1 },
      { id: 'fato', label: 'Fato Entregas', sub: 'grão: região × mês', col: 1, row: 1, tone: 'strong' },
      { id: 'unidade', label: 'Dim Unidade', sub: 'filial · cliente', col: 2, row: 1 },
      { id: 'ocor', label: 'Dim Ocorrência', sub: 'tipo', col: 1, row: 2 },
    ],
    edges: [
      { from: 'tempo', to: 'fato', label: '1 : N' },
      { from: 'regiao', to: 'fato', label: '1 : N' },
      { from: 'unidade', to: 'fato', label: '1 : N' },
      { from: 'ocor', to: 'fato', label: '1 : N' },
    ],
  },
  'pipeline-bi': {
    id: 'pipeline-bi',
    title: 'Pipeline de BI: fontes, Power Query, modelo dimensional, medidas DAX e relatórios, com qualidade e governança',
    nodes: [
      { id: 'src', label: 'Fontes', sub: 'SQL · planilhas · APIs', col: 0, row: 0 },
      { id: 'pq', label: 'Power Query', sub: 'tratamento', col: 1, row: 0 },
      { id: 'model', label: 'Modelo\ndimensional', col: 2, row: 0, tone: 'strong' },
      { id: 'dax', label: 'Medidas DAX', sub: 'contexto de filtro', col: 3, row: 0 },
      { id: 'rep', label: 'Relatórios\ne painéis', col: 4, row: 0 },
      { id: 'dq', label: 'Qualidade\nde dados', col: 1, row: 1, tone: 'dashed' },
      { id: 'gov', label: 'Governança', sub: 'acesso · atualização', col: 2, row: 1, tone: 'dashed' },
    ],
    edges: [
      { from: 'src', to: 'pq' },
      { from: 'pq', to: 'model' },
      { from: 'model', to: 'dax' },
      { from: 'dax', to: 'rep' },
      { from: 'pq', to: 'dq', dashed: true },
      { from: 'model', to: 'gov', dashed: true },
    ],
  },
  'pricing-engine': {
    id: 'pricing-engine',
    title: 'Motor de precificação (visão conceitual): parâmetros, validação, regras, cálculo, resultado e persistência',
    nodes: [
      { id: 'par', label: 'Parâmetros\nda cotação', col: 0, row: 0 },
      { id: 'val', label: 'Validação', col: 1, row: 0 },
      { id: 'reg', label: 'Regras\nde pricing', col: 2, row: 0 },
      { id: 'calc', label: 'Cálculo\ncost-plus', col: 3, row: 0, tone: 'strong' },
      { id: 'res', label: 'Preço\ne margem', col: 4, row: 0 },
      { id: 'cfg', label: 'Parâmetros\ncomo dados', sub: 'revisáveis', col: 2, row: 1, tone: 'dashed' },
      { id: 'cmp', label: 'Comparação\nde cenários', col: 3, row: 1, tone: 'dashed' },
      { id: 'per', label: 'Persistência', sub: 'simulação registrada', col: 4, row: 1 },
    ],
    edges: [
      { from: 'par', to: 'val' },
      { from: 'val', to: 'reg' },
      { from: 'reg', to: 'calc' },
      { from: 'calc', to: 'res' },
      { from: 'cfg', to: 'reg', dashed: true },
      { from: 'calc', to: 'cmp', dashed: true },
      { from: 'res', to: 'per' },
    ],
  },
  'cidades-pipeline': {
    id: 'cidades-pipeline',
    title: 'Normalização de localidades: entrada, normalização textual, match exato, alias, distrito, similaridade, confirmação e saída padronizada',
    nodes: [
      { id: 'in', label: 'Entrada\nbruta', col: 0, row: 0 },
      { id: 'norm', label: 'Normalização', sub: 'texto e UF', col: 1, row: 0 },
      { id: 'exato', label: 'Match exato', sub: 'base de municípios', col: 2, row: 0 },
      { id: 'alias', label: 'Alias\nconhecido', col: 3, row: 0 },
      { id: 'dist', label: 'Distrito →\nmunicípio', sub: 'referência IBGE', col: 4, row: 0 },
      { id: 'fuzzy', label: 'Similaridade', sub: 'mesma UF', col: 4, row: 1 },
      { id: 'cand', label: 'Candidatos', sub: 'e confiança', col: 3, row: 1 },
      { id: 'conf', label: 'Confirmação', sub: 'se houver dúvida', col: 2, row: 1, tone: 'dashed' },
      { id: 'out', label: 'Localidade\npadronizada', col: 1, row: 1, tone: 'strong' },
    ],
    edges: [
      { from: 'in', to: 'norm' },
      { from: 'norm', to: 'exato' },
      { from: 'exato', to: 'alias', label: 'sem acerto' },
      { from: 'alias', to: 'dist', label: 'sem acerto' },
      { from: 'dist', to: 'fuzzy', label: 'sem acerto' },
      { from: 'fuzzy', to: 'cand' },
      { from: 'cand', to: 'conf' },
      { from: 'conf', to: 'out' },
    ],
  },
  'infra-app': {
    id: 'infra-app',
    title: 'Infraestrutura de uma aplicação interna: usuário, proxy reverso, frontend, API, banco, autenticação e cache opcional',
    nodes: [
      { id: 'user', label: 'Usuário', col: 0, row: 0 },
      { id: 'proxy', label: 'Proxy reverso', sub: 'IIS (deploy alvo)', col: 1, row: 0 },
      { id: 'front', label: 'Frontend', sub: 'Next.js', col: 2, row: 0 },
      { id: 'api', label: 'API', sub: 'FastAPI', col: 3, row: 0, tone: 'strong' },
      { id: 'sql', label: 'SQL Server', col: 4, row: 0 },
      { id: 'auth', label: 'Autenticação', sub: 'API corporativa', col: 3, row: 1, tone: 'dashed' },
      { id: 'cache', label: 'Cache', sub: 'Redis opcional', col: 2, row: 1, tone: 'dashed' },
    ],
    edges: [
      { from: 'user', to: 'proxy' },
      { from: 'proxy', to: 'front' },
      { from: 'front', to: 'api', label: 'HTTP' },
      { from: 'api', to: 'sql' },
      { from: 'api', to: 'auth', dashed: true, fromOffset: 30 },
      { from: 'api', to: 'cache', dashed: true, fromOffset: -30 },
    ],
  },
};
