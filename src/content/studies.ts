import type { Study } from './types.ts';
import { infraStudies } from './studies-infra.ts';

/**
 * Estudos técnicos. Cada afirmação carrega seu estado de evidência: o que é código real,
 * o que é declaração, o que é demonstração sintética e o que é apenas conhecimento conceitual.
 * Nada aqui descreve estrutura interna, regras, endpoints ou dados de uma empresa.
 */
const coreStudies: Study[] = [
  {
    slug: 'inteligencia-comercial-crm',
    crumb: 'BI Comercial',
    title: 'Inteligência comercial e CRM',
    domain: 'Business Intelligence Comercial',
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
        title: 'Da oportunidade à rentabilidade',
        blocks: [
          { kind: 'p', text: 'A inteligência comercial conecta o que foi prospectado ao que realmente sobrou depois do custo. Cada etapa tem um indicador próprio, e a leitura só é confiável quando todas partilham o mesmo cadastro de clientes, rotas e propostas.' },
          { kind: 'diagram', id: 'fluxo-comercial', caption: 'Fluxo comercial, da oportunidade à rentabilidade (conceitual)' },
          {
            kind: 'table',
            title: 'Módulos de análise',
            head: ['Módulo', 'Pergunta de negócio', 'Definição'],
            rows: [
              ['Hit rate', 'Qual parcela das propostas vira negócio?', 'Propostas ganhas ÷ propostas decididas, por período, cliente ou rota.'],
              ['Tracker comercial', 'Em que estágio está cada oportunidade e proposta?', 'Visão operacional de acompanhamento com idade, responsável e próximo passo.'],
              ['Funil e oportunidades', 'Onde o volume se perde?', 'Conversão entre estágios, calculada sobre contagens.'],
              ['Price e frete por kg', 'O preço praticado está coerente com o histórico?', 'Valor do frete ÷ peso transportado, comparado por rota, faixa de peso e período.'],
              ['Rentabilidade e margem', 'O que sobra depois do custo?', 'Margem = (preço − custo) ÷ preço, por cliente, rota e proposta.'],
              ['Forecast e carteira', 'Quanto se espera fechar e de quem?', 'Valor ponderado pela probabilidade do estágio, e concentração por cliente.'],
              ['Metas', 'Estamos no ritmo?', 'Realizado ÷ meta, com projeção linear e alerta de desvio.'],
            ],
          },
          {
            kind: 'code',
            label: 'Hit rate e frete por kg em DAX (exemplos didáticos)',
            lang: 'dax',
            source: 'Hit Rate =\nDIVIDE(\n    CALCULATE(COUNTROWS(fato_proposta), fato_proposta[status] = "Ganha"),\n    CALCULATE(COUNTROWS(fato_proposta), fato_proposta[status] IN { "Ganha", "Perdida" })\n)\n\nFrete por kg =\nDIVIDE(SUM(fato_proposta[valor_frete]), SUM(fato_proposta[peso_kg]))',
          },
        ],
      },
      {
        title: 'Power BI: modelo, governança e experiência',
        blocks: [
          {
            kind: 'table',
            head: ['Tema', 'Prática'],
            rows: [
              ['Modelagem', 'Esquema estrela, relações um-para-muitos e medidas em DAX em vez de colunas calculadas quando possível.'],
              ['Power Query', 'Transformações documentadas e reaproveitáveis, com tipos e chaves tratados na origem.'],
              ['Workspaces e distribuição', 'Separação entre desenvolvimento e consumo, com acesso por grupos.'],
              ['Segurança por linha (RLS)', 'Cada gestor vê a própria carteira. Conceito dominado; não afirmo uso em um projeto específico.'],
              ['UX e UI de dashboards', 'Uma pergunta por página, hierarquia visual clara, poucos indicadores e storytelling com dados.'],
            ],
          },
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
              { label: 'Indicadores de hit rate, tracker, funil, price e rentabilidade em uso na gestão comercial', status: 'declarado', note: 'Atuação em BI comercial; números, telas e dados não são publicados.' },
              { label: 'Segurança por linha (RLS)', status: 'conceitual' },
              { label: 'Demonstração interativa com dados simulados', status: 'sintetico', note: 'Implementada em TypeScript e SVG neste site.' },
              { label: 'Painéis comerciais publicados em empresa', status: 'declarado', note: 'Detalhes, dados e capturas não são divulgados.' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'integracoes-automacoes',
    crumb: 'Automações e Integrações',
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
        title: 'Fluxos de aprovação com Power Automate',
        blocks: [
          { kind: 'p', text: 'Um fluxo de aprovação automatiza um caminho que antes dependia de e-mails soltos: a solicitação dispara o fluxo, uma regra decide quem aprova, o sistema de destino é atualizado e as pessoas envolvidas são avisadas. O que diferencia um fluxo confiável é o tratamento de falhas e o registro de cada passo.' },
          { kind: 'diagram', id: 'power-automate-aprovacao', caption: 'Fluxo de aprovação automatizado (conceitual)' },
          {
            kind: 'list',
            title: 'Cuidados de governança',
            items: [
              'Proprietário definido para cada fluxo e para a conta de conexão.',
              'Condições explícitas e testadas, inclusive o caminho de rejeição.',
              'Ação de tratamento de erro com notificação e registro do motivo.',
              'Ambientes separados para desenvolvimento e produção quando houver.',
            ],
          },
        ],
      },
      {
        title: 'Rotinas em SQL Server',
        blocks: [
          { kind: 'p', text: 'No banco, o SQL Server Agent agenda a execução de jobs, e procedures concentram a lógica de uma rotina em uma unidade transacional e auditável. Views expõem uma leitura estável para quem consome, sem revelar a estrutura das tabelas.' },
          {
            kind: 'code',
            label: 'Procedure com transação e registro de execução (exemplo)',
            lang: 'sql',
            source: "CREATE OR ALTER PROCEDURE dbo.processar_lote\n    @lote_id INT\nAS\nBEGIN\n    SET NOCOUNT ON;\n    BEGIN TRY\n        BEGIN TRANSACTION;\n        UPDATE dbo.item SET status = 'Processado' WHERE lote_id = @lote_id AND status = 'Pendente';\n        INSERT INTO dbo.auditoria (lote_id, evento, criado_em) VALUES (@lote_id, 'processado', SYSDATETIME());\n        COMMIT TRANSACTION;\n    END TRY\n    BEGIN CATCH\n        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;\n        THROW;\n    END CATCH;\nEND;",
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
              { label: 'Rotinas, procedures e jobs em SQL Server', status: 'declarado', note: 'Exemplos desta página são didáticos.' },
              { label: 'Integração entre CRM, ERP, TMS e BI como projeto único', status: 'conceitual', note: 'O fluxo é uma visão de referência; não afirmo que foi implantado de ponta a ponta.' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'sql-server-avancado',
    crumb: 'SQL Server',
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
        title: 'Views, procedures e jobs',
        blocks: [
          { kind: 'p', text: 'Views oferecem uma leitura estável sobre tabelas que podem mudar. Procedures reúnem uma rotina com transação e tratamento de erro. O SQL Server Agent agenda a execução dessas rotinas e registra o resultado de cada passo, o que torna cargas e conciliações repetíveis e auditáveis.' },
          {
            kind: 'code',
            label: 'View de leitura para consumo por BI (exemplo)',
            lang: 'sql',
            source: "CREATE OR ALTER VIEW dbo.vw_proposta_mensal AS\nSELECT\n    DATEFROMPARTS(YEAR(data_emissao), MONTH(data_emissao), 1) AS mes,\n    cliente_id,\n    COUNT(*) AS propostas,\n    SUM(CASE WHEN status = 'Ganha' THEN 1 ELSE 0 END) AS ganhas\nFROM dbo.proposta\nGROUP BY DATEFROMPARTS(YEAR(data_emissao), MONTH(data_emissao), 1), cliente_id;",
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
              { label: 'SQL Server como banco do EasyPrice e do projeto Gestão financeira (Tracker finance)', status: 'codigo', note: 'Código privado; uso comprovado no histórico dos repositórios.' },
              { label: 'Exemplos desta página', status: 'conceitual', note: 'Escritos para o estudo, com tabelas fictícias.' },
              { label: 'Administração de servidores de banco de dados', status: 'conceitual', note: 'Não é uma atribuição declarada.' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'engenharia-sistemas-infraestrutura',
    crumb: 'Engenharia e Infraestrutura',
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
        title: 'Camadas de uma aplicação',
        blocks: [
          {
            kind: 'table',
            head: ['Camada', 'Responsabilidade e práticas'],
            rows: [
              ['Backend', 'Python com FastAPI e C# com ASP.NET Core. APIs REST, validação de entrada, serviços com regras de negócio, autenticação e autorização, tratamento de exceções e registro de logs.'],
              ['Frontend', 'React, Next.js e TypeScript. Componentização, estado, integração com a API, responsividade e desempenho de carregamento.'],
              ['Persistência', 'SQL Server com modelagem relacional, transações, índices, views e procedures; migrations versionadas e ORM quando ajuda a manter o modelo.'],
              ['Segurança', 'Negar por padrão, sessão ou token com expiração, separação entre autenticação e permissões, segredos fora do código.'],
            ],
          },
        ],
      },
      {
        title: 'Cache, balanceamento e desempenho',
        blocks: [
          {
            kind: 'table',
            head: ['Conceito', 'Para que serve', 'Cuidado'],
            rows: [
              ['Cache (inclusive Redis)', 'Evitar repetir leituras caras e compartilhar resultados entre processos.', 'Invalidar quando o dado muda; a aplicação deve funcionar sem o cache.'],
              ['Balanceamento de carga', 'Distribuir tráfego entre instâncias e retirar da rotação as que falham (health check).', 'Sessão e estado precisam estar fora da instância.'],
              ['Escala vertical e horizontal', 'Mais recursos por máquina, ou mais máquinas.', 'A horizontal exige aplicação sem estado local.'],
              ['Processamento assíncrono', 'Tirar trabalho longo do caminho da resposta.', 'Reprocessamento e idempotência.'],
              ['Observabilidade', 'Logs estruturados, métricas e rastreio de requisições.', 'Registrar sem expor dados sensíveis.'],
            ],
          },
          { kind: 'p', text: 'Desempenho se discute com medição: latência, vazão, tamanho de resposta e consultas. Sem medição, otimização é palpite. Esta página não apresenta benchmarks.' },
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
              { label: 'Hospedagem em IIS e autenticação do Windows', status: 'codigo', note: 'Gestão financeira (Tracker finance).' },
              { label: 'Adaptador de cache com Redis opcional no EasyPrice', status: 'codigo', note: 'Existe no código, com a aplicação funcionando sem ele. Não afirmo que o Redis esteja implantado.' },
              { label: 'Fila, balanceamento de carga e múltiplas instâncias', status: 'conceitual', note: 'Parte do desenho de referência; não afirmo implantação.' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'normalizacao-cidades-ibge',
    crumb: 'Normalização de Municípios',
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
        title: 'Cascata de decisão no módulo real',
        blocks: [
          { kind: 'p', text: 'O módulo da plataforma de precificação aplica uma sequência em ordem de autoridade: primeiro a correspondência exata com a base oficial de municípios; depois aliases conhecidos e correções já confirmadas por pessoas; em seguida a conversão de distritos para o município-sede, a partir da referência do IBGE; por fim a similaridade textual dentro da mesma UF, com três faixas de confiança (corrige sozinho, pede confirmação ou exige vínculo manual). A sequência existe para evitar erros reais, como municípios e distritos homônimos na mesma UF.' },
          {
            kind: 'table',
            head: ['Pergunta de projeto', 'Resposta'],
            rows: [
              ['É aprendizado de máquina?', 'Não. É um conjunto de regras e similaridade de texto (biblioteca padrão), com memória de correções confirmadas. Não há treinamento nem métrica de acurácia.'],
              ['Por que não ML?', 'A base de municípios é fechada e a regra precisa ser auditável. Uma correção errada de cidade altera preço e rota.'],
              ['Onde ML poderia entrar?', 'Na ordenação de candidatos a partir do histórico de confirmações, como evolução futura, mantendo a revisão humana.'],
              ['E os códigos do IBGE?', 'A referência oficial do IBGE alimenta a base de municípios e distritos. Esta página não reproduz códigos.'],
            ],
          },
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
  },
  {
    slug: 'ia-rag-agentes',
    crumb: 'IA aplicada',
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
  },
];

export const studies: Study[] = [...coreStudies, ...infraStudies];

export function getStudy(slug: string): Study | undefined {
  return studies.find((s) => s.slug === slug);
}
