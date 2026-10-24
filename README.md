# Portfólio — Evanilson Freitas

Portfólio profissional em Next.js (App Router), React e TypeScript, com exportação estática.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `src/content` | Fonte única dos dados profissionais: perfil, formação, especialidades, projetos |
| `src/lib/demos` | Dados sintéticos determinísticos e cálculos das duas demonstrações analíticas (com testes) |
| `src/lib/charts.ts`, `src/lib/figure.ts` | Geometria de gráficos de linha e da figura do hero (com testes) |
| `src/components` | Layout, seções da home, gráficos SVG, demonstrações e diagramas |
| `src/app` | Rotas: `/`, `/projetos`, `/projetos/[slug]`, `/educacao`, `/blog`, `/blog/[slug]`, `sitemap.xml`, `robots.txt` |
| `content/blog` | Artigos em MDX |
| `public/resume` | Currículo em PDF e DOCX (duas colunas) e DOCX ATS (uma coluna), gerados |
| `public/assets/curriculo` | Fotografia opcional do currículo (`foto-profissional.jpg`) |
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

Se existir `public/assets/curriculo/foto-profissional.jpg`, a fotografia entra automaticamente no PDF e no DOCX de duas colunas. Os caminhos dos arquivos ficam em `src/content/site.ts` (`resumeFiles`).

## Publicação

O site é exportado como HTML estático. O destino do build define o `basePath`: `/portfolio-evanilson` no GitHub Pages e vazio na Vercel. Não há pipeline automatizado. O procedimento manual (branch `gh-pages`, Vercel, reversão) está em [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

Links para arquivos estáticos (PDF, DOCX) devem usar `withBasePath` (`src/lib/paths.ts`).

## Conteúdo e dados

- Projetos corporativos são descritos apenas em nível conceitual. Não há dados, regras ou telas internas.
- As demonstrações analíticas usam dados sintéticos e estão identificadas como tal na interface.
- Documentos acadêmicos com dados pessoais não são versionados nem publicados.
