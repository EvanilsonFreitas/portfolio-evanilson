# Estado do projeto

**Versão:** V3.3.1 — PUBLICADA EM PRODUÇÃO EM 25/10/2026 (ajuste pontual sobre a V3.3 homologada).
Implementação concluída, testes aprovados, publicada no GitHub Pages e na Vercel, validada nos dois ambientes e aprovada pelo proprietário em produção ("VALIDADO! TUDO OK!"), incluindo catálogo, projetos independentes, busca e filtros, claro e escuro, imagens e ampliação. Não há homologação pendente. O baseline anterior foi a V3.2.2.

A V3.3.1 corrige apenas as tecnologias dos painéis em Excel de coleta e extravio (ver "Painéis em Excel de coleta e extravio"): sem novos projetos, 42 itens, imagens, layout e currículos inalterados.

Este arquivo é o ponto de retomada de uma nova sessão. Leia, nesta ordem: este arquivo, [PUBLICACAO.md](PUBLICACAO.md) e [PROJETOS.md](PROJETOS.md). Nenhuma implementação é necessária até o proprietário definir a próxima frente.

## Produto
Portfólio profissional de Evanilson Freitas (Business Intelligence, Inteligência de Negócios e Engenharia de Software), em português do Brasil.

| Ambiente | URL |
|---|---|
| GitHub Pages | https://evanilsonfreitas.github.io/portfolio-evanilson/ |
| Vercel | https://portfolio-evanilson.vercel.app/ |
| Repositório | https://github.com/EvanilsonFreitas/portfolio-evanilson (branch `master`; `gh-pages` só com o artefato) |

## Estado da publicação
- `master` sincronizada com `origin/master`. Código da V3.3.1 em `fd59c0c` (`fix(catalog): corrige as tecnologias das soluções de coleta e extravio`); código da V3.3 em `b7c6a3f`; commits da frente: `032cdda`, `9ecd238`, `5e95abd`, `e2b7db3`, `582c851`, `b7c6a3f`, `5d92bf7`.
- GitHub Pages: `gh-pages` em `61a067a` (`chore(pages): publica a V3.3.1`), build `built`. Anterior (V3.3): `24d5e4a`. Baseline V3.2.2: `7a25356`.
- Vercel: deployment de produção `portfolio-evanilson-8ux3gsq5w-evan-b357.vercel.app`, `Ready`, no domínio `portfolio-evanilson.vercel.app`. Projeto `portfolio-evanilson`, scope `evan-b357`, deploy manual `--prebuilt --prod`, sem integração Git. Deployment anterior (V3.3): `portfolio-evanilson-ksppfrzjr-evan-b357.vercel.app`; antes dele, o da V3.2.2: `portfolio-evanilson-c17spjz0l-evan-b357.vercel.app`.
- Commits documentais posteriores à publicação não geram deploy: o artefato não inclui `docs/`.

## Qualidade (V3.3.1)
179 testes aprovados; typecheck, ESLint, build dos dois destinos e verificação de links (61 páginas, 2.646 referências internas) aprovados; integridade dos assets, currículos e metadados verificada; console sem erros na inspeção em produção. Os testes protegem o catálogo, a separação entre texto público e notas internas, as imagens (inclusive por hash dos PNGs originais) e a identidade.

## Stack e arquitetura
Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, exportação estática (`output: "export"`, `trailingSlash`). Sem backend, banco, autenticação ou CMS. MDX para artigos. Gráficos e diagramas em SVG próprio. Testes com `node --test` (TypeScript nativo do Node ≥ 22). Build por destino em `tools/build.mjs` (`DEPLOY_TARGET`: `github-pages` com basePath `/portfolio-evanilson`; `vercel` sem basePath). `AGENTS.md` pede ler `node_modules/next/dist/docs/` antes de escrever código Next.

## Mapa do repositório
- `src/content/`: fonte única de conteúdo. Site, sobre, carreira, formação, especialidades, diagramas; projetos (`projects.ts`), estudos (`studies*.ts`) e cases novos (`cases-*.ts`). `catalog.ts` reúne tudo no catálogo; `taxonomy.ts` define o vocabulário controlado; `project-images.ts` é gerado. O gerador de currículos usa a mesma fonte.
- `src/lib/`: lógica pura e testada (navegação, carreira, catálogo e busca, diagramas, gráficos, demos sintéticas, SEO, paths).
- `src/components/` e `src/app/`: interface e rotas (`/`, `/projetos`, `/projetos/[slug]`, `/educacao`, `/blog`, `/blog/[slug]`).
- `content/blog/*.mdx`: artigos.
- `tools/`: build por destino, `check-links.mjs` (links, catálogo, imagens e privacidade), pré-visualização, currículos (`tools/resume`), ícones (`build-brand.mjs`), imagens dos projetos (`build-project-images.mjs`, `project-images.config.mjs`) e inventário (`inventory.mjs`, gera `docs/PROJETOS.md`).
- `public/assets/projetos`: versões WebP das dez capturas (e miniaturas). `public/resume`: currículos gerados e insumos não publicados (`Foto_Curriculo.jpg`, `Logo_Animeted.svg`). `public/assets/brand`, `favicon.ico`, `manifest.webmanifest`: identidade EP.
- Fora do repositório: `C:\Desenvolvimento\portfolio_Evan_privado\projetos-originais` guarda os PNGs originais das capturas. Nunca vão para `public`.

## Scripts
`npm run check` (typecheck, lint, build dos dois destinos, links e testes), `build:pages`, `build:vercel`, `check:pages`, `check:vercel`, `preview:pages`, `preview:vercel`, `resume`, `brand`, `test`. Auxiliares: `node tools/build-project-images.mjs` e `node tools/inventory.mjs`.

## Decisões de design
Identidade editorial monocromática: Instrument Serif, Geist e Geist Mono; tema claro padrão e escuro inspirado no GitHub; sem cores de destaque (exceções: o emoji 👋 e o ponto verde do retrato). Menu de cinco itens (Início, Sobre, Atuação, Projetos, Artigos) em linha do tempo com pulso até o próximo item; seções da home mapeadas a itens em `src/lib/navigation.ts`. Emblema do cabeçalho alterna a cada 4 s entre o monograma e o retrato (só CSS, respeita movimento reduzido). Breadcrumbs em páginas internas; títulos no padrão `Página • Evanilson Freitas`.
**Projetos não formam sequência nem timeline.** A linha narrativa vale para a trajetória profissional; o catálogo é de itens independentes, sem numeração, setas, conectores ou "próximo projeto". Não reintroduzir conexões visuais de dependência.

## Conteúdo
- Home: Hero, Sobre, Evolução (5 marcos), Experiência, Formação, Atuação, Especialidades, Projetos (curadoria de 11 itens, com Hit Rate Comercial e o estudo de CRM, 2 com imagem, mais acesso ao catálogo e atalhos por categoria), Artigos, Contato.
- Estudos técnicos e artigos separam o que é comprovado, declarado, sintético, conceitual ou planejado (`statusLabels`). Azure é conhecimento arquitetural e a migração para Azure DevOps está planejada; nenhum pipeline existe para o portfólio.

## Catálogo de projetos (V3.3)
- **Baseline: 42 itens** = 13 preservados (3 projetos e 10 estudos) + 29 cases novos. Formato: 10 completos (3 projetos anteriores + 7 novos), 22 compactos, 10 estudos. Categorias: BI Comercial 7, BI Operacional 13, Excel e Automação 7, SQL / Engenharia de Dados 4, Software / Aplicações 7, Integrações e Processos 4. 8 itens com imagem e 34 sem.
- **Recursos**: página `/projetos/` com busca (por nome, apelidos, tecnologia, categoria), filtros de categoria, tecnologia e tipo de solução, estado na URL (`?q=`, `categoria`, `tecnologia`, `tipo`); páginas individuais; imagem ampliável em diálogo nativo; "Ver também" por referência cruzada.
- **Texto público x documentação interna**: incertezas ficam em `docs/PROJETOS.md` e nos campos internos `techNote` e `pending` de cada case; o site não os exibe. A página omite o campo de tecnologias quando não há tecnologia confirmada.
- **Agrupamentos aprovados (uma solução cada, não separar)**: Consolidado Operacional e Ranking de Filiais (duas apresentações); Gestão de Coletas e Logística Reversa (logística reversa como recorte); Desvio Operacional · Operação GRU (com "Ocorrências Ofensoras" como termo de busca). Não criar projetos duplicados por haver capturas diferentes.
- **Independentes (preservar separados)**: painel Ocorrências na Origem e a solução em Excel/VBA; Controles Operacionais em SharePoint e Automação de Relatórios com Power Automate; painel de Desvio Operacional da operação GRU e o Relatório de Desvios em Excel; os demais cases individuais.
- **Painéis em Excel de coleta e extravio (V3.3.1)**: Gestão de Coletas e Logística Reversa foi construída em Excel, **não em Power BI**: Excel, VBA, Power Query (M) e Power Pivot. "Power BI · Operacional (Coletas)" na captura é a fonte de dados, não a plataforma. Consolidado Operacional e Ranking de Filiais (inclui o Controle de Extravio): Excel, VBA e Power Query (M); Power Pivot não é atribuído a ele. Índice de Retorno: Excel, VBA e Power Pivot (VBA e Power Pivot confirmados; Excel é o ambiente que implicam); Power Query (M) não é atribuído. Tabelas Dinâmicas (PivotTable) foram retiradas das tecnologias por decisão do proprietário e não constam na taxonomia nem nos filtros. Os cases separam fonte de dados e tecnologias de implementação. Power Query (M) e Power Pivot não se estendem a outros projetos sem confirmação individual (candidatos: Prazo de Coleta e os demais painéis operacionais). Detalhes em `docs/PROJETOS.md`.
- **CRM e Salesforce (V3.3.1)**: o estudo `inteligencia-comercial-crm` registra, como afirmação declarada, a participação na construção do Salesforce com consultoria externa e a implementação das regras de negócio; tecnologias exibidas: Power BI e Salesforce. Sem empresa, consultoria, objetos ou configurações no texto. A integração com Salesforce do estudo de integrações segue planejada, não implantada. Pendência de detalhamento em `docs/PROJETOS.md`.
- **Tecnologias**: Power BI confirmado para os sete projetos de BI comercial, sem presumir DAX, Power Query ou SQL Server. Os sete projetos em Excel têm VBA e atualização automatizada (nunca "relatório manual"); Python só na Automação de Avarias e Extravios; Access, Power Automate, SharePoint Lists e integrações variam por projeto e só se atribuem com confirmação individual. Painéis com captura e sem confirmação ficam sem tecnologia (hoje: Comprovantes Retidos, Ocorrências na Origem, Desvio Operacional · GRU e Pendências de Digitalização).
- **Capturas**: as dez estão autorizadas pelo proprietário como estão e aprovadas em produção, ciente de que há valores em R$, nomes de clientes e logotipos legíveis em parte delas. Não é pendência. Preservar o desfoque original; não adicionar tarjas, caixas, overlays, pixelização ou ocultações. Só conversão para WebP e redução de largura nas 4K. Os testes e o `check-links` barram os PNGs originais por hash. A autorização não se estende a novas imagens nem a novos dados em texto.
- **Nome público**: o projeto financeiro é "Gestão financeira (Tracker finance)", slug `gestao-financeira`. O nome anterior é barrado por `identity-guard.ts` em código, docs, artefatos e currículos; não há redirecionamento do endereço antigo.

## Histórico profissional (fonte: `src/content/career.ts`)
- Tragetta: Business Intelligence (jun/2026 – atual, híbrido; único cargo atual), Analista de Pricing (jan/2026 – jun/2026), Analista de Dados (mar/2025 – jan/2026).
- Solistica: Assistente Administrativo (out/2021 – mar/2025), Aprendiz (dez/2018 – ago/2020); períodos separados ("Tempo acumulado").
- Transface Transportes Ltda.: Assistente Administrativo (nov/2021 – ago/2022); sobrepõe-se à Solistica.
- Durações são calculadas; o total usa a união dos períodos. Evolução (`career`) e vínculos (`employment`) são dados distintos.
- Datas dos projetos não são inventadas nem derivadas dos cargos.

## Formação
Tecnologia em Análise e Desenvolvimento de Sistemas (Uninove; título de Tecnólogo; conclusão 30/06/2024, colação 30/07/2024, conforme o diploma publicado) e MBA em Data Science (USP/ESALQ, concluído).

## Currículos
PDF (2 páginas, duas colunas, com foto), DOCX (duas colunas, uma seção por página) e ATS (uma coluna, sem foto). Regenerar com `npm run resume`; não foram regenerados na V3.3. Contato: Evanilson.2631@outlook.com, +55 11 96463-9228. O projeto de gestão financeira não entra nos currículos.

## Regras permanentes
- Sem CI/CD nem GitHub Actions; publicação manual, só com autorização expressa do proprietário. Sem force push nem reescrita de histórico.
- Autoria: sem `Co-Authored-By`, trailers, assinaturas ou créditos de ferramentas, em commits, PRs, código e documentação; identidade Git do proprietário (`Evanilson <101538587+EvanilsonFreitas@users.noreply.github.com>`).
- Informações incorretas já removidas (empregadores, cargo e curso que não pertencem ao proprietário) não podem voltar: a lista está em `src/content/identity-guard.ts` e é aplicada por testes. Nunca usar dados de currículos de terceiros. Não inventar empresas, cargos, datas, métricas, tecnologias, códigos do IBGE ou implantações. Projetos sem confirmação de tecnologia não recebem ferramenta por parecerem dashboards.
- Linguagem objetiva, sem jargão promocional e sem títulos de senioridade não comprovados. Dados sintéticos devem estar rotulados.
- Idade (26) é estática em `site.age`; não há data de nascimento.

## Pendências reais
- 30 pendências **não bloqueantes** do catálogo, em `docs/PROJETOS.md` (detalhamento técnico, fontes de dados, plataformas, arquiteturas específicas e confirmação formal de Power BI no Prazo de Coleta). Nenhuma bloqueia; não atribuir tecnologia sem comprovação para encerrá-las.
- Nome do MBA: o LinkedIn diz "Executive MBA, Data Analytics"; o site mantém "MBA em Data Science" até haver certificado.
- A foto do hero (2,4 MB) e o monograma original (270 KB) são publicados sem otimização.
