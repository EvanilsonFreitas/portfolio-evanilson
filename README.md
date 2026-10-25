# Portfólio — Evanilson Freitas

Portfólio profissional em Next.js (App Router), React e TypeScript, com exportação estática.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `src/content` | Fonte única dos dados profissionais: perfil (`site.ts`), apresentação e domínios de negócio (`about.ts`), formação, especialidades, projetos, estudos técnicos (`studies.ts`) e diagramas (`diagrams.ts`) |
| `src/lib/demos` | Dados sintéticos determinísticos e cálculos das quatro demonstrações: precificação, BI operacional, funil comercial e normalização de cidades (com testes) |
| `src/lib/diagram.ts`, `src/lib/navigation.ts` | Roteamento ortogonal e validação geométrica dos diagramas; estratégia única de navegação (com testes) |
| `src/lib/charts.ts`, `src/lib/figure.ts` | Geometria de gráficos de linha e da figura do hero (com testes) |
| `src/components` | Layout, seções da home, gráficos SVG, demonstrações e diagramas |
| `src/app` | Rotas: `/`, `/projetos`, `/projetos/[slug]`, `/educacao`, `/blog`, `/blog/[slug]`, `sitemap.xml`, `robots.txt` |
| `content/blog` | Artigos em MDX |
| `public/resume` | Currículo em PDF e DOCX (duas colunas) e DOCX ATS (uma coluna), gerados |
| `public/resume/Logo_Animeted.svg` | Retrato circular (insumo do `npm run brand`, que gera `assets/brand/avatar-96.png`); não é publicado |
| `public/resume/Foto_Curriculo.jpg` | Fotografia do currículo (insumo do gerador); não é publicada no site |
| `public/assets/perfil`, `public/documents` | Foto de perfil da home e diploma da graduação (publicação autorizada pelo titular) |
| `tools` | Scripts locais: build por destino, verificação de links, pré-visualização, gerador do currículo |
| `docs/PUBLICACAO.md` | Procedimento de publicação manual |

## Comandos

```bash
npm install
npm run dev            # desenvolvimento
npm run typecheck      # tipos
npm run lint           # ESLint
npm test               # testes (runner nativo do Node 22.18+)
npm run build:pages    # build para GitHub Pages  -> dist/github-pages
npm run build:vercel   # build para Vercel        -> dist/vercel/.vercel/output
npm run check          # typecheck, lint, testes, os dois builds e verificação de links
```

## Currículo

Os arquivos em `public/resume` são gerados a partir do mesmo conteúdo do site:

```bash
cd tools/resume && npm install   # uma vez (dependência `docx`, isolada do site)
cd ../.. && npm run resume       # requer Chrome ou Edge instalado para o PDF
```

Se existir `public/resume/Foto_Curriculo.jpg` (ou, na falta dela, `public/assets/curriculo/foto-profissional.jpg`), a fotografia entra automaticamente no PDF e no DOCX de duas colunas. Os caminhos dos arquivos ficam em `src/content/site.ts` (`resumeFiles`).

## Telefone e dados de contato

O telefone só aparece quando `site.phone` (em `src/content/site.ts`) for preenchido. Site e currículos leem o mesmo campo; sem valor, nada é exibido.

## Navegação

O cabeçalho usa uma estratégia única (`src/lib/navigation.ts`, `ScrollManager`): na home, "Início" volta ao topo e as âncoras rolam sem animação; nas demais páginas o roteador navega e o `ScrollManager` posiciona o hash. As seções têm `scroll-margin-top` para ficar abaixo do cabeçalho fixo.

## Publicação

O site é exportado como HTML estático. O destino do build define o `basePath`: `/portfolio-evanilson` no GitHub Pages e vazio na Vercel. Não há pipeline automatizado. O procedimento manual (branch `gh-pages`, Vercel, reversão) está em [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

Links para arquivos estáticos (PDF, DOCX) devem usar `withBasePath` (`src/lib/paths.ts`).

## Conteúdo e dados

- Projetos corporativos são descritos apenas em nível conceitual. Não há dados, regras ou telas internas.
- As demonstrações analíticas usam dados sintéticos e estão identificadas como tal na interface.
- Estudos técnicos indicam o estado de cada afirmação (comprovado em código, declarado, demonstração sintética, protótipo acadêmico, conceitual ou planejado). Arquiteturas de referência não são apresentadas como implantadas.
- O diploma da graduação é publicado por autorização do titular; demais documentos com dados pessoais não são versionados nem publicados.
- `src/content/identity-guard.ts` e `src/lib/identity.test.ts` impedem atribuições incorretas, nomes confidenciais e títulos não declarados no código, nos artefatos e nos currículos.
