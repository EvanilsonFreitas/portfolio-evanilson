// Gera docs/PROJETOS.md a partir do catálogo: inventário, agrupamentos, pendências e imagens.
//   node tools/inventory.mjs
// Este documento é o lugar das incertezas e das decisões pendentes. Nada daqui aparece no site.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog, cases } from '../src/content/catalog.ts';
import { projectImages } from '../src/content/project-images.ts';
import { categories, categoryLabel, solutionTypeLabel, techLabel } from '../src/content/taxonomy.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const formatLabel = { completo: 'Completo', compacto: 'Compacto', estudo: 'Estudo técnico' };
const kindLabel = { project: 'Existente (preservado)', study: 'Existente (preservado)', case: 'Novo' };
const caseBySlug = new Map(cases.map((c) => [c.slug, c]));
const titleOf = (slug) => catalog.find((e) => e.slug === slug)?.title ?? slug;

const rows = catalog.map((e) => {
  const c = caseBySlug.get(e.slug);
  const images = c?.images?.map((i) => `\`${i.id}\``).join(', ') ?? '—';
  const tech = e.tech.length ? e.tech.map(techLabel).join(', ') : '—';
  return `| ${e.title} | ${categoryLabel(e.category)} | ${tech} | ${kindLabel[e.kind]} | \`${e.slug}\` | ${formatLabel[e.format]} | ${images} |`;
});

const basis = cases.map((c) => `- **${c.title}**: ${c.techNote}${c.facts?.length ? ` Fonte exibida no painel: ${c.facts.map(([, v]) => v).join('; ')}.` : ''}`);

const all = cases.flatMap((c) => (c.pending ?? []).map((p) => ({ ...p, slug: c.slug, title: c.title })));
const byKind = (k) => all.filter((p) => p.kind === k);
const section = (k, items) => (items.length ? items.map((p) => `- **${p.title}**: ${p.text}`).join('\n') : '- Nenhuma.');

const total = catalog.length;
const count = (f) => catalog.filter(f).length;
const withImages = cases.filter((c) => c.images).length;
const perCategory = categories.map((c) => `| ${c.label} | ${count((e) => e.category === c.id)} |`);

const md = `# Inventário de projetos (V3.3)

Gerado por \`node tools/inventory.mjs\` a partir de \`src/content/catalog.ts\`. A fonte única do catálogo é esse arquivo; a home, a página de projetos, o sitemap e os testes leem dele. Este documento concentra as decisões do proprietário, as incertezas e as pendências não bloqueantes; nada disso é exibido no site. Baseline homologado da V3.3.

## Quantitativos

- Total: ${total} (existentes preservados: ${count((e) => e.kind !== 'case')}; novos: ${count((e) => e.kind === 'case')}).
- Cases completos: ${count((e) => e.format === 'completo')} (inclui os 3 projetos anteriores). Compactos: ${count((e) => e.format === 'compacto')}. Estudos técnicos: ${count((e) => e.format === 'estudo')}.
- Com imagem de evidência: ${withImages}. Sem imagem: ${total - withImages}.

| Categoria | Itens |
|---|---|
${perCategory.join('\n')}

## Itens

| Projeto | Categoria | Tecnologias exibidas | Situação | Slug | Tipo de case | Imagens |
|---|---|---|---|---|---|---|
${rows.join('\n')}

## Tipos de solução

${catalog.map((e) => `- ${e.title}: ${e.types.map(solutionTypeLabel).join(', ')}`).join('\n')}

## Base da classificação tecnológica (novos cases)

Tecnologia só é exibida quando confirmada. Quando não está, o campo é omitido da página.

${basis.join('\n')}

## Decisões do proprietário

Registradas em 25/10/2026, após a análise das capturas.

### Agrupamentos confirmados

O proprietário confirmou os três agrupamentos: cada um é **uma única solução**, apresentada em diferentes visualizações, recortes ou apresentações. Não se criam projetos duplicados apenas porque há capturas diferentes. O critério de projeto individual é ter finalidade, regras e implementação próprias, não a quantidade de imagens.

1. **Consolidado Operacional e Ranking de Filiais** (\`consolidado-ranking-filiais-brasil\`). Une as capturas "Controle de Extravio" (data de referência 01/01/2025) e "Extravio / Ranking de Filiais" (09/10/2024).
   - Evidências: título, subtítulo, navegação lateral e ranking regional idênticos. A captura de 2025 divide o consolidado em análise operacional e ranking corporativo e traz status de busca e envio; a de 2024 traz o top 5 de faltas e os casos como "pendentes".
   - Apresentação no site: "duas apresentações do painel", sem afirmar histórico de versões, pois as datas são de referência do painel, não de lançamento.
2. **Gestão de Coletas e Logística Reversa** (\`gestao-coletas-logistica-reversa\`). Une "Gestão de Coletas" (filtro de logística reversa em "Não") e "Logística Reversa" (filtro em "Sim").
   - Evidências: layout, textos, filtros e regra de apuração idênticos; a diferença é o recorte por filtro. A logística reversa é apresentada como recorte do painel.
3. **Desvio Operacional · Operação GRU** (\`desvio-operacional-operacao-gru\`). Captura listada como "Ocorrências Ofensoras", que permanece como termo alternativo de busca.
   - Evidências: o painel se chama "Performance - Desvio | Operação GRU"; o fluxo descrito (prevenção e perdas, coordenação de turno, causa e ação corretiva) e os indicadores por turno sustentam o nome. É um case separado do Relatório de Desvios Operacionais (Excel/VBA).

### Tecnologia dos projetos comerciais

Power BI está confirmado pelo proprietário para os **sete projetos de BI comercial** (Tracker Comercial, Solution Price, Hit Rate Comercial, Alçadas de Aprovação Comercial, Painel Frete/Kg, Painel de Análise de Mercado e Painel de Produtividade Comercial). DAX, Power Query, SQL Server e outras tecnologias **não** são atribuídos sem confirmação específica. Nas Alçadas, o Power BI é a camada analítica; as automações de aprovação são de sistemas integrados.

### Tecnologia dos painéis em Excel de coleta e extravio (V3.3.1)

O proprietário corrigiu a arquitetura: **Gestão de Coletas e Logística Reversa não foi desenvolvida em Power BI**. É uma solução em Excel (interface analítica), com VBA (automação), Power Query (M) (tratamento e transformação dos dados) e Power Pivot (modelagem analítica), com atualização automatizada. A inscrição "Power BI · Operacional (Coletas)" exibida na captura é a **fonte de dados** consumida, não a plataforma do painel.

| Case | Tecnologias atribuídas |
|---|---|
| Gestão de Coletas e Logística Reversa | Excel, VBA, Power Query (M), Power Pivot |
| Consolidado Operacional e Ranking de Filiais (inclui o Controle de Extravio) | Excel, VBA, Power Query (M) |
| Índice de Retorno | Excel, VBA, Power Pivot |

- **Tabelas Dinâmicas** (PivotTable) foram retiradas das tecnologias por decisão do proprietário: não constam em nenhum case, na taxonomia nem nos filtros. Power Pivot só consta onde foi confirmado (Gestão de Coletas e Índice de Retorno); no Consolidado não é atribuído. No Índice de Retorno, o proprietário confirmou VBA e Power Pivot; o Excel é o ambiente que ambos implicam, e Power Query (M) não é atribuído.
- Os cases separam a **fonte de dados** das **tecnologias de implementação** em uma seção própria. Power BI e DAX não são atribuídos a esses dois cases.
- "Inteligência operacional" continua sendo a classificação analítica (tipo de solução e categoria "BI Operacional"); não indica a ferramenta Microsoft Power BI.
- **Não atribuídas** aos demais painéis (Comprovantes Retidos, Ocorrências na Origem, Desvio Operacional · GRU, Pendências de Digitalização) nem aos sete projetos em Excel/VBA, que seguem com as tecnologias já confirmadas. Prazo de Coleta mantém Power BI (identificação do arquivo de evidência, confirmação formal pendente). Qualquer ampliação depende de confirmação individual.

### CRM e Salesforce (V3.3.1)

O proprietário informou que participou da construção do **Salesforce**, feita em conjunto com uma **consultoria externa**, e que **implementou as regras de negócio** no CRM. O relato entra no estudo "Inteligência comercial e CRM" (\`inteligencia-comercial-crm\`), que passa a exibir Salesforce nas tecnologias e a constar nos destaques da home; o catálogo segue com 42 itens. O texto público não nomeia empresa nem consultoria e não descreve objetos, fluxos ou configurações. A integração com Salesforce do estudo "Integrações e automações" continua **planejada, não implantada**, e é distinta desta implementação.

- Pendência de detalhamento (não publicada): período, empresa, objetos, regras e automações implementados, e a relação do CRM com os painéis comerciais.
- Hit Rate Comercial também passou a constar nos destaques da home.

### Entregas independentes confirmadas

- **Ocorrências na Origem**: o painel de Business Intelligence (\`ocorrencias-origem\`) e a solução automatizada em Excel/VBA (\`relatorio-ocorrencias-origem\`) são entregas distintas, embora tratem do mesmo contexto operacional. Permanecem como dois cases, com referência cruzada.
- **Controles em SharePoint e Automação com Power Automate**: projetos independentes (\`controles-operacionais-sharepoint\` e \`automacao-relatorios-fluxos-power-automate\`), com referências cruzadas. O primeiro concentra a estrutura de controles operacionais; o segundo, os fluxos de automação e relatórios.
- Os sete projetos em Excel com VBA e atualização automatizada seguem como cases individuais, assim como os demais projetos independentes do catálogo.

### Homologação

A V3.3 está **concluída, publicada e homologada em produção em 25/10/2026**. O proprietário validou pessoalmente os dois ambientes (catálogo, páginas, imagens ampliadas, busca, filtros, claro e escuro) e confirmou: "VALIDADO! TUDO OK!". Os quantitativos acima são o baseline da V3.3. Não há homologação pendente.

## Pendências

Total: ${all.length}. Bloqueantes: ${byKind('bloqueante').length}. Não bloqueantes: ${byKind('nao-bloqueante').length}. Dependentes de decisão editorial: ${byKind('decisao').length}.

Critério de **bloqueante**: risco efetivo de publicar informação falsa, atribuir tecnologia incorreta, atribuir o projeto a uma experiência errada, descrever como entregue algo não concluído, divulgar além da autorização ou comprometer o catálogo. Nenhuma pendência atual atinge esse critério: as tecnologias exibidas vêm de declaração do proprietário (ver acima), as descrições se limitam ao que foi informado ou está visível nas capturas, e as imagens estão autorizadas. O ponto de maior atenção entre os não bloqueantes é a confirmação formal de Power BI no Prazo de Coleta, hoje apoiada apenas no nome do arquivo de evidência informado pelo proprietário.

### Bloqueantes

${section('bloqueante', byKind('bloqueante'))}

### Dependentes de decisão editorial do proprietário

${section('decisao', byKind('decisao'))}

Não há decisões editoriais em aberto: os agrupamentos, as duas separações acima e a curadoria da home foram confirmados na homologação.

### Não bloqueantes

${section('nao-bloqueante', byKind('nao-bloqueante'))}

## Imagens

As ${projectImages.length} capturas foram autorizadas pelo proprietário como estão (confirmado em 25/10/2026, ciente de que valores em R$, nomes de clientes e logotipos continuam legíveis em seis delas). Usam-se como ele as forneceu (desfoque nativo), sem tarjas nem camadas adicionais, apenas convertidas para WebP e, nas 4K, reduzidas em largura. Os PNGs originais ficam fora do repositório (\`../portfolio_Evan_privado/projetos-originais\`) e nunca entram em \`public\`; \`tools/build-project-images.mjs\` regenera as versões web. Os valores das capturas não são reproduzidos em texto, tabela ou metadado. A autorização cobre especificamente estas dez capturas e foi aprovada em produção: não é pendência e não se estende a novas imagens. Preservar o desfoque original, e não adicionar tarjas, caixas, overlays, pixelização ou novas ocultações.

## Como estender o catálogo

1. Crie o case em um dos arquivos \`src/content/cases-*.ts\` (ou um novo, importado em \`catalog.ts\`) com \`id\`, \`slug\` (kebab-case estável), \`category\`, \`types\`, \`tech\`, \`techNote\` (interno), \`caseType\`, \`summary\`, \`sections\` e, se houver, \`related\` e \`pending\`. Os atalhos de \`cases-shared.ts\` (\`sec\`, \`p\`, \`list\`, \`table\`, \`limits\`, \`open\`, \`decide\`) mantêm o padrão.
2. Só preencha \`tech\` com tecnologia confirmada pelo proprietário. Sem confirmação, deixe \`[]\`: a página omite o campo e a pendência fica em \`pending\`.
3. Imagem: coloque o PNG original em \`../portfolio_Evan_privado/projetos-originais\`, acrescente a entrada em \`tools/project-images.config.mjs\` e rode \`node tools/build-project-images.mjs\`. Nada de camadas adicionais sobre a captura. Associe o \`id\` no case (\`images\`).
4. Para destacar na home, inclua o slug em \`homeFeatured\` (\`catalog.ts\`); a curadoria (hoje 11 itens) mantém todas as categorias e no máximo 2 itens de software.
5. Rode \`node tools/inventory.mjs\` para regenerar este documento e \`npm run check\` para validar. Os testes barram duplicações, tecnologias fora do vocabulário, mensagens internas no texto público e a presença de PNGs originais nos artefatos.
`;

writeFileSync(join(root, 'docs', 'PROJETOS.md'), md);
console.log(`docs/PROJETOS.md: ${total} itens, ${all.length} pendências (${byKind('bloqueante').length} bloqueantes, ${byKind('nao-bloqueante').length} não bloqueantes, ${byKind('decisao').length} decisões)`);
