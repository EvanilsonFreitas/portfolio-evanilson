# Publicação manual

O projeto é um site estático (`output: "export"`). **Não há CI/CD nem deploy automático.** Os comandos abaixo são executados manualmente, em PowerShell, a partir da raiz do repositório. O procedimento de criação da branch foi testado em um clone descartável com remoto local; a publicação real não foi executada.

## 1. Situação do GitHub Pages (diagnóstico)

- Fonte configurada no repositório: branch `master`, pasta `/` (modo legado, com Jekyll).
- Por isso a URL pública exibe o `README` do repositório: o Pages publica os arquivos do código-fonte, não o build do Next.js.
- A branch `gh-pages` não existe no remoto.

Correção: publicar o build estático em uma branch `gh-pages` e apontar o Pages para ela.

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
| `npm run build:vercel` | `dist/vercel/.vercel/output` (sem prefixo) |
| `npm run check:vercel` | idem, para o destino Vercel |
| `npm run preview:vercel` | serve o artefato em `http://localhost:4173/` |

`dist/` não é versionado. O build remove `assets/curriculo` do artefato: a fotografia só existe dentro do PDF e do DOCX, não como arquivo avulso no site. A verificação (`check:*`) falha se ela aparecer.

## 3. GitHub Pages (branch `gh-pages`)

Nunca use `--force`. A branch `master` continua sendo a fonte do projeto.

### 3.1 Conferir o remoto

```powershell
git fetch origin
git ls-remote --heads origin gh-pages
```

Sem saída: a branch não existe (caso A). Com saída: existe (caso B). No caso B, inspecione o conteúdo antes de qualquer substituição:

```powershell
git ls-tree -r --name-only origin/gh-pages
```

### 3.2 Caso A: criar a branch (primeira publicação)

Usa um worktree separado, para não tocar no working tree do projeto.

```powershell
git worktree add --no-checkout --detach ..\portfolio_Evan_pages
Set-Location ..\portfolio_Evan_pages
git checkout --orphan gh-pages
git rm -r -q --cached .   # a branch órfã herda o índice do código-fonte; limpe antes de copiar
robocopy ..\portfolio_Evan\dist\github-pages . /E /XD .git
git -c core.autocrlf=false add --all
git status
git commit -m "chore(pages): publica build estático"
git push -u origin gh-pages
Set-Location ..\portfolio_Evan
git worktree remove ..\portfolio_Evan_pages
```

Confira com `git ls-files` que só existem arquivos do build (sem `src`, `public` ou `package.json`) antes de fazer o commit.

`robocopy` retorna códigos de 0 a 7 em caso de sucesso (não é erro).

### 3.3 Caso B: atualizar uma branch existente

```powershell
git worktree add ..\portfolio_Evan_pages gh-pages
Set-Location ..\portfolio_Evan_pages
git rm -r -q .
robocopy ..\portfolio_Evan\dist\github-pages . /E /XD .git
git -c core.autocrlf=false add --all
git status
git commit -m "chore(pages): atualiza build estático"
git push origin gh-pages
Set-Location ..\portfolio_Evan
git worktree remove ..\portfolio_Evan_pages
```

### 3.4 Configurar o Pages (ação remota, requer autorização)

Interface: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch `gh-pages`, pasta `/ (root)`**.

Ou pela API (`gh` autenticado):

```powershell
gh api -X PUT repos/EvanilsonFreitas/portfolio-evanilson/pages -f "source[branch]=gh-pages" -f "source[path]=/"
```

Depois da publicação, confirme:

```powershell
gh api repos/EvanilsonFreitas/portfolio-evanilson/pages/builds/latest
curl.exe -s https://evanilsonfreitas.github.io/portfolio-evanilson/ | Select-String "<title>"
```

O título deve ser o do portfólio, não o do README. Teste também os downloads em `/resume/`.

### 3.5 Reverter

Volte a fonte do Pages para `master` (3.4) ou reverta o commit na `gh-pages` (`git revert <commit>` e push normal).

## 4. Vercel

O build para a Vercel usa a raiz do domínio (sem `/portfolio-evanilson`) e segue o formato **Build Output API v3** (`.vercel/output/static` + `config.json` com `"version": 3`), documentado em vercel.com/docs/build-output-api. O comando `vercel deploy --prebuilt` publica exatamente o conteúdo de `.vercel/output`. Enviar a pasta `out` crua com `--prebuilt` não funciona; por isso o script monta a estrutura.

Antes do build, defina o domínio real (afeta canonical, sitemap e Open Graph). O padrão `https://portfolio-evanilson.vercel.app` é apenas uma suposição:

```powershell
$env:SITE_ORIGIN = "https://SEU-DOMINIO"
npm run build:vercel
npm run check:vercel
```

Publicação (ações com conta Vercel, requerem autorização):

```powershell
npx vercel@latest login
Set-Location dist\vercel
npx vercel link
npx vercel deploy --prebuilt          # prévia
npx vercel deploy --prebuilt --prod   # produção
```

Não conecte o repositório Git à Vercel se a intenção é manter a publicação manual.

## 5. Currículo

```powershell
Set-Location tools\resume; npm install; Set-Location ..\..   # uma vez
npm run resume
```

Coloque a fotografia profissional em `public/resume/Foto_Curriculo.jpg` (retrato, ao menos 900 × 1200 px; o gerador usa o recorte quadrado a partir do topo). Ela não é publicada: o build a remove do artefato. e rode `npm run resume` de novo. Sem o arquivo, o PDF e o DOCX são gerados sem foto.

## 6. Versionamento

Commits e PRs descrevem apenas a mudança técnica, sem trailers de coautoria. Confira antes de cada commit:

```powershell
git config user.name; git config user.email
```
