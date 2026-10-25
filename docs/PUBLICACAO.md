# Publicação manual

O projeto é um site estático (`output: "export"`). **Não há CI/CD, GitHub Actions nem deploy automático**, e a publicação é sempre manual. Comandos em PowerShell (ou Git Bash), a partir da raiz do repositório.

## 1. Ambientes (V3.2.2)

| Ambiente | URL | Como é publicado | Origem canônica (`SITE_ORIGIN`) |
|---|---|---|---|
| GitHub Pages | https://evanilsonfreitas.github.io/portfolio-evanilson/ | branch `gh-pages` (raiz), com o artefato de `dist/github-pages`; Pages em *Deploy from a branch* | `https://evanilsonfreitas.github.io` (padrão), basePath `/portfolio-evanilson` |
| Vercel | https://portfolio-evanilson.vercel.app/ | `vercel deploy --prebuilt --prod` com o artefato de `dist/vercel/.vercel/output` | `https://portfolio-evanilson.vercel.app`, sem basePath |

- O mesmo código gera os dois destinos; muda apenas `DEPLOY_TARGET` (basePath e URL pública).
- Cada ambiente é canônico de si mesmo (canonical, Open Graph, sitemap e robots usam a própria origem). Não há redirecionamento entre eles.
- Projeto Vercel: `portfolio-evanilson`, scope `evan-b357` (conta pessoal, plano Hobby). O projeto **não está ligado ao GitHub**, então nada é publicado por push. Outros projetos do scope (por exemplo `marivan-finance`) não fazem parte deste.
- A vinculação (`.vercel/project.json`) fica só em `dist/vercel/.vercel/` e em uma pasta temporária; não é versionada.

## 2. Validar e gerar os artefatos

```powershell
npm run check
```

Executa typecheck, lint, testes, os dois builds e a verificação de links e metadados. Individualmente:

| Comando | Resultado |
|---|---|
| `npm run build:pages` | `dist/github-pages` (com `.nojekyll`, prefixo `/portfolio-evanilson`) |
| `npm run check:pages` | confere links, assets, canonical, sitemap e downloads |
| `npm run preview:pages` | serve o artefato em `http://localhost:4173/portfolio-evanilson/` |
| `npm run build:vercel` | `dist/vercel/.vercel/output` (Build Output API v3, sem prefixo) |
| `npm run check:vercel` | idem, para o destino Vercel |
| `npm run preview:vercel` | serve o artefato em `http://localhost:4173/` |

`dist/` não é versionado. O build remove dos artefatos os insumos que não devem ser públicos: `assets/curriculo`, `resume/Foto_Curriculo.jpg` e `resume/Logo_Animeted.svg`. A verificação falha se algum aparecer.

## 3. GitHub Pages

Nunca use `--force`. A `master` é a fonte do projeto; a `gh-pages` contém só o artefato.

```powershell
npm run check
git worktree add ..\portfolio_Evan_pages gh-pages
Set-Location ..\portfolio_Evan_pages
git rm -r -q .
robocopy ..\portfolio_Evan\dist\github-pages . /E /XD .git
git -c core.autocrlf=false add --all
git commit -m "chore(pages): publica <versão>"
git push origin gh-pages
Set-Location ..\portfolio_Evan
git worktree remove ..\portfolio_Evan_pages
```

- `robocopy` retorna códigos de 0 a 7 em caso de sucesso.
- Confira com `git ls-files` que só existem arquivos do build (sem `src`, `package.json` ou `docs`) antes do commit.
- A fonte do Pages (**gh-pages**, `/`) já está configurada. Para refazer: `gh api -X PUT repos/EvanilsonFreitas/portfolio-evanilson/pages -f "source[branch]=gh-pages" -f "source[path]=/"`.
- Estado: `gh api repos/EvanilsonFreitas/portfolio-evanilson/pages/builds/latest` deve retornar `built` no commit publicado.
- Reverter: `git revert <commit>` na `gh-pages` e push normal.

## 4. Vercel (publicação manual por artefato pré-compilado)

O build usa `DEPLOY_TARGET=vercel` e formato **Build Output API v3** (`.vercel/output/static` e `config.json` com `"version": 3`). Enviar a pasta `out` crua com `--prebuilt` não funciona.

```powershell
$env:SITE_ORIGIN = "https://portfolio-evanilson.vercel.app"
npm run build:vercel
npm run check:vercel
```

Publicação (a CLI precisa estar autenticada: `npx vercel whoami`). O vínculo é copiado para dentro do artefato, pois o `build` recria `dist/vercel`:

```powershell
# vínculo temporário (uma vez por máquina): cria/reaproveita o projeto
New-Item -ItemType Directory -Force $env:TEMP\vercel-link | Out-Null
Set-Location $env:TEMP\vercel-link
npx vercel@latest link --yes --project portfolio-evanilson --scope evan-b357

# depois do build
Copy-Item $env:TEMP\vercel-link\.vercel\project.json C:\Desenvolvimento\portfolio_Evan\dist\vercel\.vercel\project.json
Set-Location C:\Desenvolvimento\portfolio_Evan\dist\vercel
npx vercel@latest deploy --prebuilt --prod --yes --scope evan-b357
```

- Não conecte o repositório Git ao projeto (evita deploys automáticos).
- Não use `--force` sem motivo técnico.
- Reverter: `npx vercel@latest rollback` (ou promover um deployment anterior no painel).
- O `.env.local` criado pelo `link` fica na pasta temporária e não deve ser copiado nem versionado.

## 5. Validar uma publicação

1. `npm run check` sem falhas; artefato gerado a partir do commit publicado (`git status` limpo).
2. Status: Pages `built` no commit da `gh-pages`; Vercel `Ready` (`npx vercel inspect <url>`).
3. HTTP e integridade: páginas, `sitemap.xml`, `robots.txt`, `favicon.ico`, `manifest.webmanifest`, `assets/brand/*`, diploma e currículos. Compare o hash dos três currículos com `public/resume/`.
4. Confirme que `Foto_Curriculo.jpg`, `Logo_Animeted.svg` e `assets/curriculo/*` retornam 404.
5. No navegador: console sem erros, Experiência com os cargos corretos, navegação (menu, breadcrumbs, Back/Forward) e favicon.

## 6. Currículos

Os três arquivos em `public/resume` são gerados a partir de `src/content` (`site.ts`, `career.ts`, `education.ts`, `projects` do gerador):

```powershell
Set-Location tools\resume; npm install; Set-Location ..\..   # uma vez
npm run resume                                              # requer Chrome ou Edge para o PDF
```

A fotografia vem de `public/resume/Foto_Curriculo.jpg` (retrato, ao menos 900 × 1200 px; usa-se o recorte quadrado a partir do topo). Ela não é publicada. Para o texto do perfil, edite `resumeSummary` em `src/content/site.ts`.

## 7. Histórico profissional

O histórico formal está em `src/content/career.ts` (`employment`: empresas, cargos, períodos, modalidade, competências). Datas em `AAAA-MM`; cargo atual não tem `end`. Durações são calculadas (`src/lib/career.ts`, contagem inclusiva e união de períodos). Depois de editar, rode `npm test` e `npm run resume`.

## 8. Ícones e marca

`npm run brand` deriva os ícones do monograma original (`public/assets/perfil/Monograma EP Preto em Fundo Transparente.png`) e a miniatura do retrato do emblema (`public/resume/Logo_Animeted.svg`) para `public/assets/brand` e `public/favicon.ico`.

## 9. Versionamento

Commits e PRs descrevem apenas a mudança técnica, sem trailers de coautoria. Confira antes de cada commit:

```powershell
git config user.name; git config user.email
```
