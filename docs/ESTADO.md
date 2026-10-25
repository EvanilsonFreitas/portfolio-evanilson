# Estado do projeto

**Versão:** V3.3, expansão e reestruturação do catálogo de projetos. Homologada pelo proprietário em 25/10/2026, com os 42 itens do catálogo e os refinamentos editoriais; publicação autorizada. A V3.2.2 foi o baseline publicado anterior.
Este arquivo é o ponto de retomada de uma nova sessão. Procedimentos de publicação: [PUBLICACAO.md](PUBLICACAO.md). Inventário do catálogo: [PROJETOS.md](PROJETOS.md).

## V3.3
- **Catálogo independente**: 42 itens (13 preservados e 29 novos), sem numeração, linha do tempo ou "próximo projeto". A fonte única é `src/content/catalog.ts`, que reúne `projects.ts`, `studies.ts` e os novos `cases-*.ts`; o vocabulário controlado está em `taxonomy.ts` (6 categorias, tipos de solução, tecnologias confirmadas).
- **Páginas**: `/projetos/` com busca e filtros (categoria, tecnologia, tipo; estado na URL), `/projetos/<slug>/` para cada item. A home exibe uma curadoria (`homeFeatured`) com acesso ao catálogo.
- **Texto público x documentação interna**: incertezas (tecnologia não confirmada, fonte, agrupamentos) ficam em `docs/PROJETOS.md` e nos campos internos `techNote` e `pending` de cada case, que o site não exibe. A página omite o campo de tecnologias quando não há tecnologia confirmada. Testes barram expressões de auditoria no texto e nas páginas geradas.
- **Decisões do proprietário (25/10/2026)**: os três agrupamentos (Consolidado e Ranking de Filiais; Gestão de Coletas e Logística Reversa; Desvio Operacional · Operação GRU, com "Ocorrências Ofensoras" como termo de busca) estão confirmados; Power BI está confirmado para os sete projetos de BI comercial, sem presumir DAX, Power Query ou SQL Server. Também confirmado: o painel Ocorrências na Origem (BI) e a solução em Excel/VBA são entregas distintas, e Controles em SharePoint e Automação com Power Automate são projetos independentes, com referências cruzadas. Não há decisão editorial em aberto; as pendências restantes são não bloqueantes e estão em `PROJETOS.md`.
- **Tecnologias**: só as confirmadas pelo autor. Painéis com captura e sem confirmação ficam sem tecnologia atribuída e o campo é omitido na página; a pendência consta em PROJETOS.md.
- **Capturas**: autorizadas pelo proprietário como estão (25/10/2026). Usadas como ele as forneceu (desfoque nativo), sem tarjas nem camadas adicionais; só convertidas para WebP e reduzidas nas 4K (`tools/build-project-images.mjs`). Os PNGs originais ficam fora do repositório (`../portfolio_Evan_privado/projetos-originais`) e nunca em `public`; testes e `check-links` verificam por hash.
- **Nome público**: o projeto financeiro é "Gestão financeira (Tracker finance)", slug `gestao-financeira`. O nome anterior é barrado por `identity-guard.ts` em código, docs, artefatos e currículos. Não há redirecionamento do endereço antigo, para não manter o nome no artefato.

## Produto
Portfólio profissional de Evanilson Freitas (Business Intelligence, Inteligência de Negócios e Engenharia de Software), em português do Brasil.

| Ambiente | URL |
|---|---|
| GitHub Pages | https://evanilsonfreitas.github.io/portfolio-evanilson/ |
| Vercel | https://portfolio-evanilson.vercel.app/ |
| Repositório | https://github.com/EvanilsonFreitas/portfolio-evanilson (branch `master`; `gh-pages` só com o artefato) |

## Stack e arquitetura
Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, exportação estática (`output: "export"`, `trailingSlash`). Sem backend, banco, autenticação ou CMS. MDX para artigos. Gráficos e diagramas em SVG próprio (sem biblioteca). Testes com `node --test` (TypeScript nativo do Node ≥ 22). Build por destino em `tools/build.mjs` (`DEPLOY_TARGET`: `github-pages` com basePath `/portfolio-evanilson`; `vercel` sem basePath).

## Mapa do repositório
- `src/content/`: fonte única de conteúdo (site, sobre, carreira, formação, projetos, estudos, diagramas, especialidades). O gerador de currículos usa a mesma fonte.
- `src/lib/`: lógica pura e testada (navegação, carreira, diagramas, gráficos, demos sintéticas, SEO, paths).
- `src/components/` e `src/app/`: interface e rotas (`/`, `/projetos`, `/projetos/[slug]`, `/educacao`, `/blog`, `/blog/[slug]`).
- `content/blog/*.mdx`: artigos.
- `tools/`: build por destino, verificação de links, pré-visualização, gerador de currículos (`tools/resume`), geração de ícones (`tools/build-brand.mjs`).
- `public/resume`: currículos gerados (PDF, DOCX, ATS) e insumos não publicados (`Foto_Curriculo.jpg`, `Logo_Animeted.svg`).
- `public/assets/brand`, `public/favicon.ico`, `public/manifest.webmanifest`: identidade EP.

## Scripts
`npm run check` (typecheck, lint, build dos dois destinos, links e testes), `build:pages`, `build:vercel`, `check:pages`, `check:vercel`, `preview:pages`, `preview:vercel`, `resume`, `brand`, `test`.

## Decisões de design
Identidade editorial monocromática: Instrument Serif, Geist e Geist Mono; tema claro padrão e escuro inspirado no GitHub; sem cores de destaque (exceções deliberadas: o emoji 👋 e o ponto verde do retrato). Menu de cinco itens (Início, Sobre, Atuação, Projetos, Artigos) em linha do tempo com pulso até o próximo item; seções da home mapeadas a itens em `src/lib/navigation.ts`. Emblema do cabeçalho alterna a cada 4 s entre o monograma e o retrato (só CSS, respeita movimento reduzido). Breadcrumbs em páginas internas; títulos no padrão `Página • Evanilson Freitas`.

## Conteúdo
- Home: Hero (saudação, headline, foto com idade na legenda), Sobre, Evolução (5 marcos), Experiência (empresas e cargos), Formação, Atuação, Especialidades, Projetos e estudos, Artigos, Contato.
- Estudos técnicos e artigos separam o que é comprovado, declarado, sintético, conceitual ou planejado (`statusLabels`). Azure é conhecimento arquitetural e a migração para Azure DevOps está planejada; nenhum pipeline existe para o portfólio.

## Histórico profissional (fonte: `src/content/career.ts`)
- Tragetta: Business Intelligence (jun/2026 – atual, híbrido), Analista de Pricing (jan/2026 – jun/2026), Analista de Dados (mar/2025 – jan/2026).
- Solistica: Assistente Administrativo (out/2021 – mar/2025), Aprendiz (dez/2018 – ago/2020); períodos separados ("Tempo acumulado").
- Transface Transportes Ltda.: Assistente Administrativo (nov/2021 – ago/2022); sobrepõe-se à Solistica.
- Durações são calculadas; o total usa a união dos períodos. Evolução (`career`) e vínculos (`employment`) são dados distintos.

## Formação
Tecnologia em Análise e Desenvolvimento de Sistemas (Uninove; título de Tecnólogo; conclusão 30/06/2024, colação 30/07/2024, conforme o diploma publicado) e MBA em Data Science (USP/ESALQ, concluído).

## Currículos
PDF (2 páginas, duas colunas, com foto), DOCX (duas colunas, uma seção por página) e ATS (uma coluna, sem foto). Regenerar com `npm run resume`. Contato: Evanilson.2631@outlook.com, +55 11 96463-9228.

## Regras permanentes
- Sem CI/CD nem GitHub Actions; publicação manual. Sem force push nem reescrita de histórico.
- Autoria: sem `Co-Authored-By`, trailers ou créditos de ferramentas; identidade Git do proprietário (`Evanilson <101538587+EvanilsonFreitas@users.noreply.github.com>`).
- Informações incorretas já removidas (empregadores, cargo e curso que não pertencem ao proprietário) não podem voltar: a lista está em `src/content/identity-guard.ts` e é aplicada por testes ao código, aos artefatos e aos currículos. Nunca usar dados de currículos de terceiros. Não inventar empresas, cargos, datas, métricas, códigos do IBGE ou implantações.
- O projeto Gestão financeira (Tracker finance) fica no site, não no currículo. Dados sintéticos devem estar rotulados.
- Idade (26) é estática em `site.age`; não há data de nascimento.

## Estado da publicação (V3.3)
V3.3 publicada em 25/10/2026, aguardando a validação final do proprietário diretamente em produção. `master` sincronizada com `origin/master` (código da V3.3 em `b7c6a3f`). `gh-pages` em `24d5e4a` (`chore(pages): publica a V3.3`), com build `built`. Vercel: deployment de produção `Ready` (`portfolio-evanilson-ksppfrzjr-evan-b357.vercel.app`) em `portfolio-evanilson.vercel.app`, sem integração Git. Os dois ambientes foram validados: 42 itens do catálogo, busca e filtros, imagens com hash idêntico ao local, currículos com hash idêntico, favicon, SEO, links, ausência de insumos e do nome anterior, e console sem erros. O baseline anterior (V3.2.2) foi a `gh-pages` em `7a25356`.

## Pendências reais
- Nome do MBA: o LinkedIn diz "Executive MBA, Data Analytics"; o site mantém "MBA em Data Science" até haver certificado.
- A foto do hero (2,4 MB) e o monograma original (270 KB) são publicados sem otimização.
