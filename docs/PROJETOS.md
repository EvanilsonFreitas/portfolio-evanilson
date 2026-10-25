# Inventário de projetos (V3.3)

Gerado por `node tools/inventory.mjs` a partir de `src/content/catalog.ts`. A fonte única do catálogo é esse arquivo; a home, a página de projetos, o sitemap e os testes leem dele. Este documento concentra as decisões do proprietário, as incertezas e as pendências não bloqueantes; nada disso é exibido no site. Baseline homologado da V3.3.

## Quantitativos

- Total: 42 (existentes preservados: 13; novos: 29).
- Cases completos: 10 (inclui os 3 projetos anteriores). Compactos: 22. Estudos técnicos: 10.
- Com imagem de evidência: 8. Sem imagem: 34.

| Categoria | Itens |
|---|---|
| BI Comercial | 7 |
| BI Operacional | 13 |
| Excel e Automação | 7 |
| SQL / Engenharia de Dados | 4 |
| Software / Aplicações | 7 |
| Integrações e Processos | 4 |

## Itens

| Projeto | Categoria | Tecnologias exibidas | Situação | Slug | Tipo de case | Imagens |
|---|---|---|---|---|---|---|
| EasyPrice | Software / Aplicações | Python, FastAPI, React, Next.js, TypeScript, SQL Server | Existente (preservado) | `simulador-preco-rodoviario` | Completo | — |
| Gestão financeira (Tracker finance) | Software / Aplicações | Python, FastAPI, PostgreSQL, React, TypeScript | Existente (preservado) | `gestao-financeira` | Completo | — |
| BI operacional em logística | BI Operacional | Power BI, DAX | Existente (preservado) | `bi-operacional-logistica` | Completo | — |
| Tracker Comercial | BI Comercial | Power BI | Novo | `tracker-comercial` | Compacto | — |
| Solution Price | BI Comercial | Power BI | Novo | `solution-price` | Compacto | — |
| Hit Rate Comercial | BI Comercial | Power BI | Novo | `hit-rate-comercial` | Compacto | — |
| Alçadas de Aprovação Comercial | Integrações e Processos | Power BI | Novo | `alcadas-aprovacao-comercial` | Completo | — |
| Painel Frete/Kg | BI Comercial | Power BI | Novo | `painel-frete-kg` | Compacto | — |
| Painel de Análise de Mercado | BI Comercial | Power BI | Novo | `painel-analise-mercado` | Completo | — |
| Painel de Produtividade Comercial | BI Comercial | Power BI | Novo | `painel-produtividade-comercial` | Compacto | — |
| Automação da Tabela de Custos | SQL / Engenharia de Dados | SQL Server | Novo | `automacao-tabela-custos-sql-server` | Completo | — |
| Arquitetura de Dados do EasyPrice | SQL / Engenharia de Dados | SQL Server | Novo | `arquitetura-banco-easyprice` | Completo | — |
| Automação de Avarias e Extravios | Excel e Automação | Excel, VBA, Python | Novo | `automacao-avarias-extravios` | Compacto | — |
| Painel de Melhoria Contínua | Excel e Automação | Excel, VBA | Novo | `painel-melhoria-continua` | Compacto | — |
| Relatório de Ocorrências na Origem | Excel e Automação | Excel, VBA | Novo | `relatorio-ocorrencias-origem` | Compacto | — |
| Relatório de Desvios Operacionais | Excel e Automação | Excel, VBA | Novo | `relatorio-desvios-operacionais` | Compacto | — |
| Gestão de Sinistros | Excel e Automação | Excel, VBA | Novo | `gestao-sinistros` | Compacto | — |
| Gestão de Seguros | Excel e Automação | Excel, VBA | Novo | `gestao-seguros` | Compacto | — |
| Gestão de Postos Avançados | Excel e Automação | Excel, VBA | Novo | `gestao-postos-avancados` | Compacto | — |
| Comprovantes Retidos | BI Operacional | — | Novo | `comprovantes-retidos` | Compacto | `comprovantes-retidos` |
| Índice de Retorno | BI Operacional | — | Novo | `indice-retorno` | Completo | `indice-retorno` |
| Ocorrências na Origem | BI Operacional | — | Novo | `ocorrencias-origem` | Compacto | `ocorrencias-origem` |
| Consolidado Operacional e Ranking de Filiais | BI Operacional | Excel, VBA, Power Query (M), Tabelas Dinâmicas | Novo | `consolidado-ranking-filiais-brasil` | Completo | `consolidado-2025`, `consolidado-2024` |
| Gestão de Coletas e Logística Reversa | BI Operacional | Excel, VBA, Power Query (M), Power Pivot, Tabelas Dinâmicas | Novo | `gestao-coletas-logistica-reversa` | Completo | `gestao-coletas`, `logistica-reversa` |
| Desvio Operacional · Operação GRU | BI Operacional | — | Novo | `desvio-operacional-operacao-gru` | Compacto | `desvio-operacional-gru` |
| Pendências de Digitalização | BI Operacional | — | Novo | `pendencias-digitalizacao` | Compacto | `pendencias-digitalizacao` |
| Prazo de Coleta | BI Operacional | Power BI | Novo | `prazo-coleta` | Compacto | `prazo-coleta` |
| Controles Operacionais em SharePoint | Integrações e Processos | SharePoint | Novo | `controles-operacionais-sharepoint` | Compacto | — |
| Automação de Relatórios e Fluxos com Power Automate | Integrações e Processos | Power Automate, SharePoint | Novo | `automacao-relatorios-fluxos-power-automate` | Compacto | — |
| Apresentações de Resultados Operacionais | BI Operacional | — | Novo | `apresentacoes-resultados-operacionais` | Compacto | — |
| Central de Buscas e Avarias | BI Operacional | — | Novo | `central-buscas-avarias` | Compacto | — |
| Briefings e Reuniões de Resultados | BI Operacional | — | Novo | `briefings-reunioes-resultados` | Compacto | — |
| Inteligência comercial e CRM | BI Comercial | Power BI | Existente (preservado) | `inteligencia-comercial-crm` | Estudo técnico | — |
| Integrações e automações | Integrações e Processos | Power Automate, SQL Server | Existente (preservado) | `integracoes-automacoes` | Estudo técnico | — |
| SQL Server em profundidade | SQL / Engenharia de Dados | SQL Server | Existente (preservado) | `sql-server-avancado` | Estudo técnico | — |
| Engenharia de sistemas e infraestrutura | Software / Aplicações | — | Existente (preservado) | `engenharia-sistemas-infraestrutura` | Estudo técnico | — |
| Normalização de cidades com referência do IBGE | SQL / Engenharia de Dados | Python | Existente (preservado) | `normalizacao-cidades-ibge` | Estudo técnico | — |
| IA aplicada: RAG e agentes | Software / Aplicações | — | Existente (preservado) | `ia-rag-agentes` | Estudo técnico | — |
| IIS e Windows Server: hospedagem de aplicações corporativas | Software / Aplicações | IIS | Existente (preservado) | `iis-windows-server` | Estudo técnico | — |
| Microsoft Azure: decisões de arquitetura | Software / Aplicações | — | Existente (preservado) | `arquitetura-azure` | Estudo técnico | — |
| Azure DevOps e CI/CD: do código à produção | Software / Aplicações | — | Existente (preservado) | `azure-devops-cicd` | Estudo técnico | — |
| Análise preditiva em operações logísticas | BI Operacional | — | Existente (preservado) | `analise-preditiva-operacional` | Estudo técnico | — |

## Tipos de solução

- EasyPrice: Sistema, Aplicação corporativa
- Gestão financeira (Tracker finance): Sistema
- BI operacional em logística: Dashboard, Inteligência operacional
- Tracker Comercial: Dashboard, Inteligência comercial
- Solution Price: Dashboard, Inteligência comercial
- Hit Rate Comercial: Dashboard, Inteligência comercial
- Alçadas de Aprovação Comercial: Dashboard, Automação, Inteligência comercial
- Painel Frete/Kg: Dashboard, Inteligência comercial
- Painel de Análise de Mercado: Dashboard, Inteligência comercial, Engenharia de dados
- Painel de Produtividade Comercial: Dashboard, Inteligência comercial
- Automação da Tabela de Custos: Engenharia de dados, Automação
- Arquitetura de Dados do EasyPrice: Engenharia de dados, Sistema
- Automação de Avarias e Extravios: Automação, Relatório gerencial, Inteligência operacional
- Painel de Melhoria Contínua: Dashboard, Automação, Inteligência operacional
- Relatório de Ocorrências na Origem: Relatório gerencial, Automação, Inteligência operacional
- Relatório de Desvios Operacionais: Relatório gerencial, Automação, Inteligência operacional
- Gestão de Sinistros: Relatório gerencial, Automação
- Gestão de Seguros: Relatório gerencial, Automação
- Gestão de Postos Avançados: Dashboard, Automação, Inteligência operacional
- Comprovantes Retidos: Dashboard, Inteligência operacional
- Índice de Retorno: Dashboard, Inteligência operacional
- Ocorrências na Origem: Dashboard, Inteligência operacional
- Consolidado Operacional e Ranking de Filiais: Dashboard, Inteligência operacional
- Gestão de Coletas e Logística Reversa: Dashboard, Inteligência operacional
- Desvio Operacional · Operação GRU: Dashboard, Inteligência operacional
- Pendências de Digitalização: Dashboard, Inteligência operacional
- Prazo de Coleta: Dashboard, Inteligência operacional
- Controles Operacionais em SharePoint: Aplicação corporativa
- Automação de Relatórios e Fluxos com Power Automate: Automação
- Apresentações de Resultados Operacionais: Relatório gerencial, Inteligência operacional
- Central de Buscas e Avarias: Relatório gerencial, Inteligência operacional
- Briefings e Reuniões de Resultados: Relatório gerencial, Inteligência operacional
- Inteligência comercial e CRM: Estudo técnico, Inteligência comercial
- Integrações e automações: Estudo técnico, Automação
- SQL Server em profundidade: Estudo técnico, Engenharia de dados
- Engenharia de sistemas e infraestrutura: Estudo técnico
- Normalização de cidades com referência do IBGE: Estudo técnico, Engenharia de dados
- IA aplicada: RAG e agentes: Estudo técnico
- IIS e Windows Server: hospedagem de aplicações corporativas: Estudo técnico
- Microsoft Azure: decisões de arquitetura: Estudo técnico
- Azure DevOps e CI/CD: do código à produção: Estudo técnico
- Análise preditiva em operações logísticas: Estudo técnico, Inteligência operacional

## Base da classificação tecnológica (novos cases)

Tecnologia só é exibida quando confirmada. Quando não está, o campo é omitido da página.

- **Tracker Comercial**: Power BI confirmado pelo proprietário para os sete projetos de BI comercial. DAX, Power Query, SQL Server e demais tecnologias não são atribuídos sem confirmação específica. Fontes de dados e integrações não detalhadas.
- **Solution Price**: Power BI confirmado pelo proprietário para os sete projetos de BI comercial. DAX, Power Query, SQL Server e demais tecnologias não são atribuídos sem confirmação específica. Fontes de dados e integrações não detalhadas.
- **Hit Rate Comercial**: Power BI confirmado pelo proprietário para os sete projetos de BI comercial. DAX, Power Query, SQL Server e demais tecnologias não são atribuídos sem confirmação específica. Fontes de dados e integrações não detalhadas.
- **Alçadas de Aprovação Comercial**: Power BI confirmado pelo proprietário. As automações de aprovação são executadas por sistemas integrados, cuja tecnologia não está atribuída.
- **Painel Frete/Kg**: Power BI confirmado pelo proprietário para os sete projetos de BI comercial. DAX, Power Query, SQL Server e demais tecnologias não são atribuídos sem confirmação específica. Fontes de dados e integrações não detalhadas.
- **Painel de Análise de Mercado**: Power BI confirmado pelo proprietário. APIs integradas e frequência de atualização de cada fonte não detalhadas; DAX, Power Query e SQL Server não atribuídos.
- **Painel de Produtividade Comercial**: Power BI confirmado pelo proprietário para os sete projetos de BI comercial. DAX, Power Query, SQL Server e demais tecnologias não são atribuídos sem confirmação específica. Fontes de dados e integrações não detalhadas.
- **Automação da Tabela de Custos**: SQL Server, confirmado pelo proprietário. O Excel aparece apenas como o processo anterior que a solução substitui.
- **Arquitetura de Dados do EasyPrice**: SQL Server, conforme o histórico documentado do projeto e declarado pelo proprietário.
- **Automação de Avarias e Extravios**: Excel, VBA e Python, confirmados pelo proprietário.
- **Painel de Melhoria Contínua**: Excel com VBA e fluxo automatizado de atualização, confirmados pelo proprietário para todos os painéis em Excel. Python, Access, SharePoint Lists, Power Automate e outras integrações variam por projeto e só são atribuídos com confirmação individual.
- **Relatório de Ocorrências na Origem**: Excel com VBA e fluxo automatizado de atualização, confirmados pelo proprietário para todos os painéis em Excel. Python, Access, SharePoint Lists, Power Automate e outras integrações variam por projeto e só são atribuídos com confirmação individual.
- **Relatório de Desvios Operacionais**: Excel com VBA e fluxo automatizado de atualização, confirmados pelo proprietário para todos os painéis em Excel. Python, Access, SharePoint Lists, Power Automate e outras integrações variam por projeto e só são atribuídos com confirmação individual.
- **Gestão de Sinistros**: Excel com VBA e fluxo automatizado de atualização, confirmados pelo proprietário para todos os painéis em Excel. Python, Access, SharePoint Lists, Power Automate e outras integrações variam por projeto e só são atribuídos com confirmação individual.
- **Gestão de Seguros**: Excel com VBA e fluxo automatizado de atualização, confirmados pelo proprietário para todos os painéis em Excel. Python, Access, SharePoint Lists, Power Automate e outras integrações variam por projeto e só são atribuídos com confirmação individual.
- **Gestão de Postos Avançados**: Excel com VBA e fluxo automatizado de atualização, confirmados pelo proprietário para todos os painéis em Excel. Python, Access, SharePoint Lists, Power Automate e outras integrações variam por projeto e só são atribuídos com confirmação individual.
- **Comprovantes Retidos**: Plataforma de construção não confirmada; nenhuma tecnologia atribuída. Os elementos visíveis na captura (fonte de dados, botões, filtros) não bastam para inferir a ferramenta.
- **Índice de Retorno**: Plataforma de construção não confirmada; nenhuma tecnologia atribuída. Os elementos visíveis na captura (fonte de dados, botões, filtros) não bastam para inferir a ferramenta. Fonte exibida no painel: TMS · Relatório operacional de entregas e coletas não efetuadas.
- **Ocorrências na Origem**: Plataforma de construção não confirmada; nenhuma tecnologia atribuída. Os elementos visíveis na captura (fonte de dados, botões, filtros) não bastam para inferir a ferramenta. Fonte exibida no painel: TMS · Relatório operacional de ocorrências.
- **Consolidado Operacional e Ranking de Filiais**: Solução em Excel com VBA (automação), Power Query (M) (tratamento e transformação) e Tabelas Dinâmicas, confirmados pelo proprietário para as soluções de extravio. Power Pivot não está confirmado para este case e não é atribuído. Power BI não é atribuído como plataforma.
- **Gestão de Coletas e Logística Reversa**: Construído em Excel (interface analítica), confirmado pelo proprietário, com VBA (automação), Power Query (M) (tratamento e transformação), Power Pivot (modelagem analítica) e Tabelas Dinâmicas. "Power BI · Operacional (Coletas)" é a fonte de dados consumida; Power BI não é a plataforma do painel e não é atribuído. Fonte exibida no painel: Power BI · Operacional (Coletas).
- **Desvio Operacional · Operação GRU**: Plataforma de construção não confirmada; nenhuma tecnologia atribuída. Os elementos visíveis na captura (fonte de dados, botões, filtros) não bastam para inferir a ferramenta.
- **Pendências de Digitalização**: Plataforma de construção não confirmada; nenhuma tecnologia atribuída. Os elementos visíveis na captura (fonte de dados, botões, filtros) não bastam para inferir a ferramenta.
- **Prazo de Coleta**: Power BI, conforme a identificação do arquivo de evidência feita pelo proprietário. Confirmação formal pendente.
- **Controles Operacionais em SharePoint**: SharePoint, confirmado pelo proprietário.
- **Automação de Relatórios e Fluxos com Power Automate**: Power Automate e SharePoint Lists, confirmados pelo proprietário.
- **Apresentações de Resultados Operacionais**: Entrega analítica e de comunicação; não é aplicação de software, nenhuma tecnologia atribuída.
- **Central de Buscas e Avarias**: Entrega analítica e de comunicação; não é aplicação de software, nenhuma tecnologia atribuída.
- **Briefings e Reuniões de Resultados**: Entrega analítica e de comunicação; não é aplicação de software, nenhuma tecnologia atribuída.

## Decisões do proprietário

Registradas em 25/10/2026, após a análise das capturas.

### Agrupamentos confirmados

O proprietário confirmou os três agrupamentos: cada um é **uma única solução**, apresentada em diferentes visualizações, recortes ou apresentações. Não se criam projetos duplicados apenas porque há capturas diferentes. O critério de projeto individual é ter finalidade, regras e implementação próprias, não a quantidade de imagens.

1. **Consolidado Operacional e Ranking de Filiais** (`consolidado-ranking-filiais-brasil`). Une as capturas "Controle de Extravio" (data de referência 01/01/2025) e "Extravio / Ranking de Filiais" (09/10/2024).
   - Evidências: título, subtítulo, navegação lateral e ranking regional idênticos. A captura de 2025 divide o consolidado em análise operacional e ranking corporativo e traz status de busca e envio; a de 2024 traz o top 5 de faltas e os casos como "pendentes".
   - Apresentação no site: "duas apresentações do painel", sem afirmar histórico de versões, pois as datas são de referência do painel, não de lançamento.
2. **Gestão de Coletas e Logística Reversa** (`gestao-coletas-logistica-reversa`). Une "Gestão de Coletas" (filtro de logística reversa em "Não") e "Logística Reversa" (filtro em "Sim").
   - Evidências: layout, textos, filtros e regra de apuração idênticos; a diferença é o recorte por filtro. A logística reversa é apresentada como recorte do painel.
3. **Desvio Operacional · Operação GRU** (`desvio-operacional-operacao-gru`). Captura listada como "Ocorrências Ofensoras", que permanece como termo alternativo de busca.
   - Evidências: o painel se chama "Performance - Desvio | Operação GRU"; o fluxo descrito (prevenção e perdas, coordenação de turno, causa e ação corretiva) e os indicadores por turno sustentam o nome. É um case separado do Relatório de Desvios Operacionais (Excel/VBA).

### Tecnologia dos projetos comerciais

Power BI está confirmado pelo proprietário para os **sete projetos de BI comercial** (Tracker Comercial, Solution Price, Hit Rate Comercial, Alçadas de Aprovação Comercial, Painel Frete/Kg, Painel de Análise de Mercado e Painel de Produtividade Comercial). DAX, Power Query, SQL Server e outras tecnologias **não** são atribuídos sem confirmação específica. Nas Alçadas, o Power BI é a camada analítica; as automações de aprovação são de sistemas integrados.

### Tecnologia dos painéis em Excel de coleta e extravio (V3.3.1)

O proprietário corrigiu a arquitetura: **Gestão de Coletas e Logística Reversa não foi desenvolvida em Power BI**. É uma solução em Excel (interface analítica), com VBA (automação), Power Query (M) (tratamento e transformação dos dados), Power Pivot (modelagem analítica) e Tabelas Dinâmicas, com atualização automatizada. A inscrição "Power BI · Operacional (Coletas)" exibida na captura é a **fonte de dados** consumida, não a plataforma do painel.

| Case | Tecnologias atribuídas |
|---|---|
| Gestão de Coletas e Logística Reversa | Excel, VBA, Power Query (M), Power Pivot, Tabelas Dinâmicas |
| Consolidado Operacional e Ranking de Filiais (inclui o Controle de Extravio) | Excel, VBA, Power Query (M), Tabelas Dinâmicas |

- **Power Pivot não é Tabelas Dinâmicas (PivotTable).** Power Pivot só consta onde foi confirmado (Gestão de Coletas); no Consolidado não é atribuído.
- Os cases separam a **fonte de dados** das **tecnologias de implementação** em uma seção própria. Power BI e DAX não são atribuídos a esses dois cases.
- "Inteligência operacional" continua sendo a classificação analítica (tipo de solução e categoria "BI Operacional"); não indica a ferramenta Microsoft Power BI.
- **Não atribuídas** aos demais painéis (Comprovantes Retidos, Índice de Retorno, Ocorrências na Origem, Desvio Operacional · GRU, Pendências de Digitalização) nem aos sete projetos em Excel/VBA, que seguem com as tecnologias já confirmadas. Prazo de Coleta mantém Power BI (identificação do arquivo de evidência, confirmação formal pendente). Qualquer ampliação depende de confirmação individual.

### Entregas independentes confirmadas

- **Ocorrências na Origem**: o painel de Business Intelligence (`ocorrencias-origem`) e a solução automatizada em Excel/VBA (`relatorio-ocorrencias-origem`) são entregas distintas, embora tratem do mesmo contexto operacional. Permanecem como dois cases, com referência cruzada.
- **Controles em SharePoint e Automação com Power Automate**: projetos independentes (`controles-operacionais-sharepoint` e `automacao-relatorios-fluxos-power-automate`), com referências cruzadas. O primeiro concentra a estrutura de controles operacionais; o segundo, os fluxos de automação e relatórios.
- Os sete projetos em Excel com VBA e atualização automatizada seguem como cases individuais, assim como os demais projetos independentes do catálogo.

### Homologação

A V3.3 está **concluída, publicada e homologada em produção em 25/10/2026**. O proprietário validou pessoalmente os dois ambientes (catálogo, páginas, imagens ampliadas, busca, filtros, claro e escuro) e confirmou: "VALIDADO! TUDO OK!". Os quantitativos acima são o baseline da V3.3. Não há homologação pendente.

## Pendências

Total: 30. Bloqueantes: 0. Não bloqueantes: 30. Dependentes de decisão editorial: 0.

Critério de **bloqueante**: risco efetivo de publicar informação falsa, atribuir tecnologia incorreta, atribuir o projeto a uma experiência errada, descrever como entregue algo não concluído, divulgar além da autorização ou comprometer o catálogo. Nenhuma pendência atual atinge esse critério: as tecnologias exibidas vêm de declaração do proprietário (ver acima), as descrições se limitam ao que foi informado ou está visível nas capturas, e as imagens estão autorizadas. O ponto de maior atenção entre os não bloqueantes é a confirmação formal de Power BI no Prazo de Coleta, hoje apoiada apenas no nome do arquivo de evidência informado pelo proprietário.

### Bloqueantes

- Nenhuma.

### Dependentes de decisão editorial do proprietário

- Nenhuma.

Não há decisões editoriais em aberto: os agrupamentos, as duas separações acima e a curadoria da home foram confirmados na homologação.

### Não bloqueantes

- **Tracker Comercial**: Confirmar fontes de dados e frequência de atualização.
- **Solution Price**: Confirmar fontes de dados.
- **Hit Rate Comercial**: Confirmar dimensões de análise e fontes de dados.
- **Alçadas de Aprovação Comercial**: Confirmar quais sistemas executam notificações e bloqueios, e se Power Automate participa.
- **Painel Frete/Kg**: Confirmar a origem das referências comerciais e de mercado.
- **Painel de Análise de Mercado**: Confirmar as APIs utilizadas e a periodicidade de cada fonte.
- **Painel de Análise de Mercado**: Confirmar onde o dado é tratado antes de chegar ao Power BI.
- **Painel de Produtividade Comercial**: Confirmar fontes de dados e se as simulações de cenário pertencem ao próprio painel.
- **Automação da Tabela de Custos**: Confirmar o papel específico de cada recurso (procedures, functions, triggers) e as fontes integradas, para detalhar a arquitetura.
- **Automação da Tabela de Custos**: Sem volumetria, tempo economizado ou percentual de ganho documentados; não atribuir.
- **Arquitetura de Dados do EasyPrice**: Confirmar quais procedures e funções existem no banco e a política de logs e auditoria.
- **Arquitetura de Dados do EasyPrice**: Confirmar o detalhamento de segurança e controle de acesso a exibir.
- **Automação de Avarias e Extravios**: Confirmar o papel de Python no fluxo e as fontes de extração.
- **Relatório de Ocorrências na Origem**: Complementar com indicadores e fluxo de processamento.
- **Gestão de Sinistros**: Complementar com as funcionalidades, indicadores e fluxo comprovados (nenhum fluxo financeiro ou jurídico é afirmado).
- **Gestão de Seguros**: Complementar com as funcionalidades e indicadores comprovados.
- **Gestão de Postos Avançados**: Complementar com os indicadores comprovados.
- **Comprovantes Retidos**: Confirmar a plataforma (Excel/VBA, Power BI ou outra) e a fonte de dados.
- **Índice de Retorno**: Confirmar a plataforma e a forma de atualização.
- **Ocorrências na Origem**: Confirmar a plataforma de construção do painel.
- **Consolidado Operacional e Ranking de Filiais**: Confirmar se Power Pivot participa da solução e detalhar o fluxo de atualização.
- **Gestão de Coletas e Logística Reversa**: Confirmar a origem e a frequência de atualização da fonte "Power BI · Operacional (Coletas)" consumida pela solução.
- **Desvio Operacional · Operação GRU**: Confirmar a plataforma de construção.
- **Pendências de Digitalização**: Confirmar a plataforma e a fonte de dados.
- **Prazo de Coleta**: Confirmar Power BI como ferramenta e a relação com a fonte "Power BI · Operacional (Coletas)" exibida no painel de gestão de coletas.
- **Controles Operacionais em SharePoint**: Complementar com os controles construídos (listas, bibliotecas, processos), sem dados confidenciais.
- **Automação de Relatórios e Fluxos com Power Automate**: Complementar com os fluxos e relatórios específicos, sem dados confidenciais.
- **Apresentações de Resultados Operacionais**: Complementar com exemplos de estrutura dos materiais, sem dados confidenciais.
- **Central de Buscas e Avarias**: Complementar com a estrutura das análises, sem dados confidenciais.
- **Briefings e Reuniões de Resultados**: Complementar com a estrutura dos briefings, sem dados confidenciais.

## Imagens

As 10 capturas foram autorizadas pelo proprietário como estão (confirmado em 25/10/2026, ciente de que valores em R$, nomes de clientes e logotipos continuam legíveis em seis delas). Usam-se como ele as forneceu (desfoque nativo), sem tarjas nem camadas adicionais, apenas convertidas para WebP e, nas 4K, reduzidas em largura. Os PNGs originais ficam fora do repositório (`../portfolio_Evan_privado/projetos-originais`) e nunca entram em `public`; `tools/build-project-images.mjs` regenera as versões web. Os valores das capturas não são reproduzidos em texto, tabela ou metadado. A autorização cobre especificamente estas dez capturas e foi aprovada em produção: não é pendência e não se estende a novas imagens. Preservar o desfoque original, e não adicionar tarjas, caixas, overlays, pixelização ou novas ocultações.

## Como estender o catálogo

1. Crie o case em um dos arquivos `src/content/cases-*.ts` (ou um novo, importado em `catalog.ts`) com `id`, `slug` (kebab-case estável), `category`, `types`, `tech`, `techNote` (interno), `caseType`, `summary`, `sections` e, se houver, `related` e `pending`. Os atalhos de `cases-shared.ts` (`sec`, `p`, `list`, `table`, `limits`, `open`, `decide`) mantêm o padrão.
2. Só preencha `tech` com tecnologia confirmada pelo proprietário. Sem confirmação, deixe `[]`: a página omite o campo e a pendência fica em `pending`.
3. Imagem: coloque o PNG original em `../portfolio_Evan_privado/projetos-originais`, acrescente a entrada em `tools/project-images.config.mjs` e rode `node tools/build-project-images.mjs`. Nada de camadas adicionais sobre a captura. Associe o `id` no case (`images`).
4. Para destacar na home, inclua o slug em `homeFeatured` (`catalog.ts`); a curadoria mantém todas as categorias e no máximo 2 itens de software.
5. Rode `node tools/inventory.mjs` para regenerar este documento e `npm run check` para validar. Os testes barram duplicações, tecnologias fora do vocabulário, mensagens internas no texto público e a presença de PNGs originais nos artefatos.
