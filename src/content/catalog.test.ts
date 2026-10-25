import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cases, catalog, getCase, homeFeatured } from './catalog.ts';
import { legacySlugs, projects } from './projects.ts';
import { studies } from './studies.ts';
import { categories, solutionTypes, technologies } from './taxonomy.ts';
import type { TechId } from './taxonomy.ts';
import { getProjectImage, projectImages } from './project-images.ts';
import type { Block } from './types.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const cat = new Set<string>(categories.map((c) => c.id));
const typ = new Set<string>(solutionTypes.map((t) => t.id));
const tec = new Set<string>(technologies.map((t) => t.id));

function blocksText(blocks: Block[]): string[] {
  return blocks.flatMap((b) => {
    switch (b.kind) {
      case 'p':
        return [b.text];
      case 'list':
        return [...(b.title ? [b.title] : []), ...b.items];
      case 'table':
        return [...b.head, ...b.rows.flat()];
      case 'status':
        return b.items.flatMap((i) => (i.note ? [i.label, i.note] : [i.label]));
      default:
        return [];
    }
  });
}

function caseText(slug: string): string {
  const c = getCase(slug)!;
  return [c.title, c.summary, ...(c.aliases ?? []), ...(c.facts ?? []).flat(), ...c.sections.flatMap((s) => [s.title, ...blocksText(s.blocks)])].join('\n');
}

test('IDs e slugs do catálogo são únicos e estáveis (kebab-case)', () => {
  assert.equal(new Set(catalog.map((e) => e.id)).size, catalog.length);
  assert.equal(new Set(catalog.map((e) => e.slug)).size, catalog.length);
  for (const e of catalog) assert.match(e.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, e.slug);
  for (const legacy of Object.keys(legacySlugs)) assert.ok(!catalog.some((e) => e.slug === legacy), `slug antigo reutilizado: ${legacy}`);
});

test('categorias, tipos de solução e tecnologias pertencem ao vocabulário controlado', () => {
  for (const e of catalog) {
    assert.ok(cat.has(e.category), `${e.slug}: categoria`);
    assert.ok(e.types.length > 0, `${e.slug}: sem tipo de solução`);
    for (const t of e.types) assert.ok(typ.has(t), `${e.slug}: tipo ${t}`);
    for (const t of e.tech) assert.ok(tec.has(t), `${e.slug}: tecnologia ${t}`);
    assert.equal(new Set(e.tech).size, e.tech.length);
  }
});

test('toda tecnologia do vocabulário é usada por ao menos um item e toda categoria tem itens', () => {
  for (const t of technologies) assert.ok(catalog.some((e) => e.tech.includes(t.id)), `tecnologia sem item: ${t.id}`);
  for (const c of categories) assert.ok(catalog.some((e) => e.category === c.id), `categoria vazia: ${c.id}`);
});

test('todo item do catálogo tem uma página individual e conteúdo próprio', () => {
  const projectSlugs = new Set(projects.map((p) => p.slug));
  const studySlugs = new Set(studies.map((s) => s.slug));
  for (const e of catalog) {
    const owners = [projectSlugs.has(e.slug), studySlugs.has(e.slug), !!getCase(e.slug)].filter(Boolean).length;
    assert.equal(owners, 1, `${e.slug} deve pertencer a exatamente uma fonte de conteúdo`);
    assert.ok(e.summary.length > 40, `${e.slug}: resumo curto`);
  }
  assert.equal(catalog.length, projects.length + studies.length + cases.length);
});

test('os projetos e estudos já publicados na V3.2.2 foram preservados', () => {
  const preserved = [
    'simulador-preco-rodoviario',
    'gestao-financeira',
    'bi-operacional-logistica',
    'inteligencia-comercial-crm',
    'integracoes-automacoes',
    'sql-server-avancado',
    'engenharia-sistemas-infraestrutura',
    'normalizacao-cidades-ibge',
    'ia-rag-agentes',
    'iis-windows-server',
    'arquitetura-azure',
    'azure-devops-cicd',
    'analise-preditiva-operacional',
  ];
  for (const slug of preserved) assert.ok(catalog.some((e) => e.slug === slug), `ausente: ${slug}`);
  const easy = projects.find((p) => p.slug === 'simulador-preco-rodoviario')!;
  assert.ok(easy.deepDive && easy.deepDive.length >= 3, 'EasyPrice manteve o aprofundamento técnico');
  assert.ok(studies.every((s) => s.sections.length >= 4), 'estudos mantiveram suas seções');
});

test('todos os projetos descritos na V3.3 têm representação no catálogo', () => {
  const required = [
    'tracker-comercial', 'solution-price', 'hit-rate-comercial', 'alcadas-aprovacao-comercial', 'painel-frete-kg', 'painel-analise-mercado', 'painel-produtividade-comercial',
    'automacao-tabela-custos-sql-server', 'arquitetura-banco-easyprice',
    'automacao-avarias-extravios', 'painel-melhoria-continua', 'relatorio-ocorrencias-origem', 'relatorio-desvios-operacionais', 'gestao-sinistros', 'gestao-seguros', 'gestao-postos-avancados',
    'comprovantes-retidos', 'indice-retorno', 'ocorrencias-origem', 'consolidado-ranking-filiais-brasil', 'gestao-coletas-logistica-reversa', 'desvio-operacional-operacao-gru', 'pendencias-digitalizacao', 'prazo-coleta',
    'controles-operacionais-sharepoint', 'automacao-relatorios-fluxos-power-automate',
    'apresentacoes-resultados-operacionais', 'central-buscas-avarias', 'briefings-reunioes-resultados',
  ];
  for (const slug of required) assert.ok(getCase(slug), `case ausente: ${slug}`);
  assert.equal(cases.length, required.length);
});

test('não há duplicações: títulos, resumos e apelidos não colidem entre itens', () => {
  const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const titles = catalog.map((e) => norm(e.title));
  assert.equal(new Set(titles).size, titles.length, 'títulos repetidos');
  assert.equal(new Set(catalog.map((e) => norm(e.summary))).size, catalog.length, 'resumos repetidos');
  const names = new Map<string, string>();
  for (const e of catalog) {
    for (const n of [e.title, e.crumb, ...e.aliases].map(norm)) {
      const owner = names.get(n);
      assert.ok(!owner || owner === e.slug, `"${n}" usado por ${owner} e ${e.slug}`);
      names.set(n, e.slug);
    }
  }
});

test('soluções sem identidade comprovada permanecem separadas, com referência cruzada', () => {
  const pairs: [string, string][] = [
    ['relatorio-ocorrencias-origem', 'ocorrencias-origem'],
    ['relatorio-desvios-operacionais', 'desvio-operacional-operacao-gru'],
    ['gestao-coletas-logistica-reversa', 'prazo-coleta'],
    ['gestao-sinistros', 'gestao-seguros'],
    ['arquitetura-banco-easyprice', 'simulador-preco-rodoviario'],
    ['solution-price', 'simulador-preco-rodoviario'],
    ['painel-produtividade-comercial', 'simulador-preco-rodoviario'],
  ];
  for (const [a, b] of pairs) {
    assert.ok(catalog.some((e) => e.slug === a) && catalog.some((e) => e.slug === b), `${a} / ${b}`);
    const linked = (getCase(a)?.related ?? []).includes(b) || (getCase(b)?.related ?? []).includes(a);
    assert.ok(linked, `${a} e ${b} deveriam se referenciar`);
  }
});

test('as capturas de um mesmo painel formam um só case, com todas as imagens associadas', () => {
  assert.deepEqual(getCase('consolidado-ranking-filiais-brasil')!.images!.map((i) => i.id), ['consolidado-2025', 'consolidado-2024']);
  assert.deepEqual(getCase('gestao-coletas-logistica-reversa')!.images!.map((i) => i.id), ['gestao-coletas', 'logistica-reversa']);
  assert.equal(getCase('desvio-operacional-operacao-gru')!.images![0].id, 'desvio-operacional-gru');
});

test('as referências cruzadas apontam para itens existentes e nunca para o próprio item', () => {
  for (const c of cases) {
    for (const r of c.related ?? []) {
      assert.ok(catalog.some((e) => e.slug === r), `${c.slug} → ${r}`);
      assert.notEqual(r, c.slug);
    }
  }
});

test('cada captura está associada a exatamente um case e os arquivos públicos existem', () => {
  const used = cases.flatMap((c) => c.images ?? []).map((i) => i.id);
  assert.equal(new Set(used).size, used.length, 'imagem associada a mais de um case ou repetida');
  assert.deepEqual([...used].sort(), projectImages.map((i) => i.id).sort(), 'toda imagem gerada deve estar em um case');
  assert.equal(projectImages.length, 10);
  for (const id of used) {
    const img = getProjectImage(id)!;
    assert.ok(img, id);
    assert.ok(img.alt.length >= 80, `${id}: texto alternativo curto`);
    assert.ok(img.width >= 1200 && img.height > 500 && img.thumbWidth === 720, `${id}: dimensões`);
    for (const f of [`${id}.webp`, `${id}-thumb.webp`]) assert.ok(existsSync(join(root, 'public', 'assets', 'projetos', f)), f);
  }
  assert.equal(readdirSync(join(root, 'public', 'assets', 'projetos')).length, projectImages.length * 2, 'há arquivo público sem associação');
});

test('há cases sem imagem e o catálogo funciona sem elas', () => {
  assert.ok(cases.filter((c) => !c.images).length > 15);
  for (const e of catalog.filter((x) => x.kind !== 'case')) assert.equal(e.image, undefined);
});

test('as tecnologias atribuídas correspondem às confirmadas pelo autor', () => {
  const confirmed: Record<string, TechId[]> = {
    'automacao-avarias-extravios': ['excel', 'vba', 'python'],
    'painel-melhoria-continua': ['excel', 'vba'],
    'relatorio-ocorrencias-origem': ['excel', 'vba'],
    'relatorio-desvios-operacionais': ['excel', 'vba'],
    'gestao-sinistros': ['excel', 'vba'],
    'gestao-seguros': ['excel', 'vba'],
    'gestao-postos-avancados': ['excel', 'vba'],
    'automacao-tabela-custos-sql-server': ['sql-server'],
    'arquitetura-banco-easyprice': ['sql-server'],
    'controles-operacionais-sharepoint': ['sharepoint'],
    'automacao-relatorios-fluxos-power-automate': ['power-automate', 'sharepoint'],
    'prazo-coleta': ['power-bi'],
    'tracker-comercial': ['power-bi'],
    'solution-price': ['power-bi'],
    'hit-rate-comercial': ['power-bi'],
    'alcadas-aprovacao-comercial': ['power-bi'],
    'painel-frete-kg': ['power-bi'],
    'painel-analise-mercado': ['power-bi'],
    'painel-produtividade-comercial': ['power-bi'],
  };
  for (const c of cases) assert.deepEqual([...c.tech].sort(), [...(confirmed[c.slug] ?? [])].sort(), `${c.slug}: tecnologias`);
  // Painéis com captura e sem confirmação não recebem ferramenta por parecerem dashboards.
  for (const slug of ['comprovantes-retidos', 'indice-retorno', 'ocorrencias-origem', 'consolidado-ranking-filiais-brasil', 'gestao-coletas-logistica-reversa', 'desvio-operacional-operacao-gru', 'pendencias-digitalizacao']) {
    assert.deepEqual(getCase(slug)!.tech, [], slug);
  }
  // Materiais de comunicação não são software.
  for (const slug of ['apresentacoes-resultados-operacionais', 'central-buscas-avarias', 'briefings-reunioes-resultados']) {
    assert.deepEqual(getCase(slug)!.tech, [], slug);
    assert.ok(!getCase(slug)!.types.some((t) => t === 'sistema' || t === 'aplicacao-corporativa'), slug);
  }
});

test('os painéis em Excel são descritos como automatizados, nunca como manuais', () => {
  const excel = cases.filter((c) => c.category === 'excel-automacao');
  assert.equal(excel.length, 7);
  for (const c of excel) {
    assert.ok(c.tech.includes('excel') && c.tech.includes('vba'), c.slug);
    const text = caseText(c.slug);
    assert.match(text, /atualização automatizada|fluxo automatizado de atualização|processamento automatizado/i, c.slug);
    assert.match(text, /Excel/, c.slug);
    assert.match(text, /VBA/, c.slug);
    assert.doesNotMatch(text, /relatório manual|planilha manual|atualização manual de/i, c.slug);
  }
});

test('Python, SharePoint e Power Automate não são atribuídos a todos os projetos', () => {
  for (const t of ['python', 'sharepoint', 'power-automate'] as const) {
    const n = cases.filter((c) => c.tech.includes(t)).length;
    assert.ok(n >= 1 && n <= 2, `${t}: ${n}`);
  }
  assert.ok(!technologies.some((t) => (t.label as string) === 'Microsoft Access'), 'Access sem projeto confirmado não deve constar no vocabulário');
});

test('cada case tem estrutura mínima e comunica a aplicação prática', () => {
  for (const c of cases) {
    assert.ok(c.sections.length >= 3, `${c.slug}: seções`);
    assert.ok(c.sections.some((s) => s.title === 'Aplicação' || s.title === 'Resultado'), `${c.slug}: sem a aplicação prática`);
    assert.ok(c.techNote.length > 20, c.slug);
    if (c.caseType === 'completo') assert.ok(c.sections.length >= 6, `${c.slug}: case completo com poucas seções`);
    for (const s of c.sections) assert.ok(s.blocks.length > 0 && blocksText(s.blocks).every((t) => t.trim().length > 0), `${c.slug}: ${s.title}`);
  }
  assert.ok(cases.filter((c) => c.caseType === 'completo').length >= 6);
  assert.ok(cases.filter((c) => c.caseType === 'compacto').length >= 15);
});

test('o texto dos cases é objetivo: sem jargão promocional, valores nem métricas inventadas', () => {
  const banned = /revolucion|inovador|última geração|ultima geracao|transformação digital|extraordin|altamente escal|disruptiv/i;
  const allowedPercents = new Set(['96%', '3,0%']);
  for (const c of cases) {
    const text = caseText(c.slug);
    assert.doesNotMatch(text, banned, c.slug);
    assert.doesNotMatch(text, /R\$/, `${c.slug}: valor monetário`);
    for (const m of text.match(/\d+(?:,\d+)?\s?%/g) ?? []) assert.ok(allowedPercents.has(m.replace(/\s/g, '')), `${c.slug}: percentual não documentado ${m}`);
    assert.doesNotMatch(text, /\b\d+\s?(mil|milhões|usuários|registros|horas|minutos)\b/i, `${c.slug}: número não documentado`);
    assert.doesNotMatch(text, /(utiliza|usa|aplica|com) (machine learning|aprendizado de máquina)/i, c.slug);
  }
});

test('os cases não inventam datas de implantação nem títulos de senioridade', () => {
  for (const c of cases) {
    const text = caseText(c.slug);
    assert.doesNotMatch(text, /implantad[oa] em|desde (19|20)\d{2}/i, c.slug);
    assert.doesNotMatch(text, /\b(sênior|senior|especialista|líder técnico|arquiteto)\b/i, c.slug);
  }
});

test('as limitações de Tracker, Análise de Mercado e Melhoria Contínua estão declaradas', () => {
  assert.match(caseText('tracker-comercial'), /Não há modelo estatístico treinado/);
  assert.match(caseText('painel-analise-mercado'), /não é descrito como atualizado em tempo real/i);
  assert.match(caseText('painel-analise-mercado'), /Não há machine learning documentado/);
  assert.match(caseText('painel-melhoria-continua'), /Não há geração autônoma de planos de ação por inteligência artificial/);
});

test('as Alçadas separam a camada analítica da automação de aprovação', () => {
  const c = getCase('alcadas-aprovacao-comercial')!;
  assert.deepEqual(c.tech, ['power-bi']);
  const layers = c.sections.find((x) => x.title.startsWith('Duas camadas'))!;
  const table = layers.blocks.find((b) => b.kind === 'table');
  assert.ok(table && table.kind === 'table');
  assert.deepEqual(table.rows.map((r) => r[2]), ['Power BI', 'Sistemas integrados']);
});

test('Solution Price e Painel de Produtividade não são apresentados como parte do EasyPrice', () => {
  assert.match(caseText('solution-price'), /independente do EasyPrice/);
  assert.match(caseText('painel-produtividade-comercial'), /não é apresentado como funcionalidade interna dele/);
});

test('o case do banco de dados do EasyPrice é independente do case da aplicação', () => {
  const db = getCase('arquitetura-banco-easyprice')!;
  assert.ok(!projects.some((p) => p.slug === db.slug));
  assert.match(caseText(db.slug), /Esquemas, tabelas e entidades não são publicados/);
  assert.ok(db.related!.includes('simulador-preco-rodoviario'));
});

test('a curadoria da home é equilibrada e vem do mesmo catálogo', () => {
  assert.ok(homeFeatured.length >= 6 && homeFeatured.length <= 12);
  assert.equal(new Set(homeFeatured).size, homeFeatured.length);
  const entries = homeFeatured.map((s) => catalog.find((e) => e.slug === s));
  assert.ok(entries.every(Boolean), 'destaque inexistente');
  const shown = new Set(entries.map((e) => e!.category));
  for (const c of categories) assert.ok(shown.has(c.id), `home sem a categoria ${c.id}`);
  assert.ok(entries.filter((e) => e!.category === 'software').length <= 2, 'a home não deve concentrar aplicações web');
  assert.ok(entries.filter((e) => e!.image).length >= 2, 'a curadoria deve exibir evidência visual');
});

test('o projeto financeiro usa o novo nome público e preserva a stack registrada', () => {
  const p = projects.find((x) => x.slug === 'gestao-financeira')!;
  assert.equal(p.title, 'Gestão financeira (Tracker finance)');
  assert.equal(p.crumb, 'Gestão financeira (Tracker finance)');
  assert.ok(p.stack.includes('FastAPI') && p.stack.includes('PostgreSQL'), 'stack registrada preservada');
  assert.ok(!catalog.some((e) => e.slug === 'marivan-finance'));
  assert.ok(!('marivan-finance' in legacySlugs));
  assert.doesNotMatch(JSON.stringify([projects, studies, cases]), /marivan/i);
});

test('a identidade profissional da Tragetta, da Solistica e da Transface permanece como homologada', async () => {
  const { employment } = await import('./career.ts');
  const t = employment.find((e) => e.id === 'tragetta')!;
  const roles = t.roles.map((r) => `${r.title}|${r.period.start}|${r.period.end ?? 'atual'}`);
  assert.deepEqual(roles, ['Business Intelligence|2026-06|atual', 'Analista de Pricing|2026-01|2026-06', 'Analista de Dados|2025-03|2026-01']);
  assert.equal(t.roles.filter((r) => !r.period.end).length, 1, 'somente BI é o cargo atual');
  const sol = employment.find((e) => e.id === 'solistica')!;
  assert.deepEqual(sol.roles.map((r) => `${r.period.start}|${r.period.end}`), ['2021-10|2025-03', '2018-12|2020-08']);
  assert.equal(employment.find((e) => e.id === 'transface')!.roles[0].period.start, '2021-11');
});

// ---- Proteção contra a publicação de capturas originais -----------------------------------

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walkFiles(p) : [p];
  });
}

const originals = new Set(projectImages.map((i) => i.originalSha256));

test('os PNGs originais não estão em public nem em nenhum artefato (só as versões web convertidas)', () => {
  assert.equal(originals.size, 10);
  // Comparação exata de nomes: no Windows existsSync ignora maiúsculas, mas o GitHub Pages não.
  assert.ok(!readdirSync(join(root, 'public', 'assets')).includes('Projetos'), 'pasta com os originais ainda em public');
  const dirs = [join(root, 'public'), join(root, 'dist', 'github-pages'), join(root, 'dist', 'vercel', '.vercel', 'output', 'static')];
  let scanned = 0;
  for (const d of dirs) {
    for (const f of walkFiles(d).filter((x) => /\.(png|jpe?g|webp|gif|svg|pdf)$/i.test(x))) {
      scanned += 1;
      assert.ok(!originals.has(createHash('sha256').update(readFileSync(f)).digest('hex')), `original confidencial em ${f}`);
    }
  }
  assert.ok(scanned > 10);
});

test('apenas as versões web existem em assets/projetos, na árvore pública e nos artefatos', () => {
  const expected = new Set(projectImages.flatMap((i) => [`${i.id}.webp`, `${i.id}-thumb.webp`]));
  const dirs = [
    join(root, 'public', 'assets', 'projetos'),
    join(root, 'dist', 'github-pages', 'assets', 'projetos'),
    join(root, 'dist', 'vercel', '.vercel', 'output', 'static', 'assets', 'projetos'),
  ];
  for (const d of dirs.filter(existsSync)) assert.deepEqual(new Set(readdirSync(d)), expected, d);
});

test('as capturas são usadas como fornecidas: sem sobreposições e com proveniência registrada', () => {
  assert.ok(projectImages.every((i) => /^[0-9a-f]{64}$/.test(i.originalSha256)));
  assert.ok(projectImages.every((i) => !('redactions' in i)), 'o gerador não adiciona ocultações');
  const generator = readFileSync(join(root, 'tools', 'build-project-images.mjs'), 'utf8');
  const config = readFileSync(join(root, 'tools', 'project-images.config.mjs'), 'utf8');
  assert.doesNotMatch(generator + config, /composite|<rect|\.blur\(|rects/, 'nenhuma camada visual pode ser adicionada às capturas');
});

// ---- Separação entre documentação interna e narrativa pública ---------------------------------

const INTERNAL = /pendente de confirma|tecnologia (não )?(confirmada|atribu)|nenhuma (tecnologia )?atribu|fonte não confirmada|classificação funcional|necessita valida|segundo o prompt|conforme a captura enviada|não foi possível comprovar|ainda não confirma|não confirmad[ao]|proprietário|a confirmar/i;

test('o texto público dos cases não contém mensagens internas de auditoria', () => {
  for (const c of cases) {
    assert.doesNotMatch(caseText(c.slug), INTERNAL, c.slug);
    for (const im of c.images ?? []) assert.doesNotMatch(im.caption ?? '', INTERNAL, im.id);
  }
  for (const i of projectImages) assert.doesNotMatch(i.caption + ' ' + i.alt, INTERNAL, i.id);
  for (const e of catalog) assert.doesNotMatch(e.summary + ' ' + e.natureLabel, INTERNAL, e.slug);
});

test('as notas internas existem, mas ficam fora do texto público', () => {
  for (const c of cases) {
    assert.ok(c.techNote.length > 20, c.slug);
    assert.ok(!caseText(c.slug).includes(c.techNote), `${c.slug}: nota interna no texto público`);
    for (const p of c.pending ?? []) {
      assert.ok(['bloqueante', 'nao-bloqueante', 'decisao'].includes(p.kind), c.slug);
      assert.ok(p.text.length > 15, c.slug);
      assert.ok(!caseText(c.slug).includes(p.text), `${c.slug}: pendência no texto público`);
    }
  }
  assert.ok(cases.flatMap((c) => c.pending ?? []).length >= 25);
});

test('os três agrupamentos confirmados são um case cada, com as capturas e os nomes alternativos', () => {
  const consolidado = getCase('consolidado-ranking-filiais-brasil')!;
  assert.equal(consolidado.images!.length, 2);
  assert.ok(consolidado.aliases!.some((a) => /controle de extravio/i.test(a)) && consolidado.aliases!.some((a) => /ranking de filiais/i.test(a)));
  const coletas = getCase('gestao-coletas-logistica-reversa')!;
  assert.equal(coletas.images!.length, 2);
  assert.ok(coletas.aliases!.includes('Logística Reversa'));
  const gru = getCase('desvio-operacional-operacao-gru')!;
  assert.equal(gru.images!.length, 1);
  assert.ok(gru.aliases!.includes('Ocorrências Ofensoras'));
  for (const c of [consolidado, coletas, gru]) assert.ok(!(c.pending ?? []).some((p) => p.kind === 'decisao'), `${c.slug}: decisão já tomada ainda pendente`);
  // Capturas de um mesmo painel não viram projetos à parte.
  assert.ok(!catalog.some((e) => /controle de extravio|ocorrências ofensoras/i.test(e.title)));
});

test('Power BI está confirmado para os sete projetos comerciais, sem presumir DAX, Power Query nem SQL Server', () => {
  const comerciais = ['tracker-comercial', 'solution-price', 'hit-rate-comercial', 'alcadas-aprovacao-comercial', 'painel-frete-kg', 'painel-analise-mercado', 'painel-produtividade-comercial'];
  for (const slug of comerciais) {
    const c = getCase(slug)!;
    assert.deepEqual(c.tech, ['power-bi'], slug);
    assert.ok(!(c.pending ?? []).some((p) => /Confirmar Power BI/.test(p.text)), `${slug}: pendência de Power BI já esclarecida`);
    assert.doesNotMatch(caseText(slug), /\bDAX\b|Power Query|SQL Server/, slug);
  }
});

test('os cases completos demonstram problema, solução, capacidades e aplicação prática', () => {
  const completos = cases.filter((c) => c.caseType === 'completo');
  assert.equal(completos.length, 7);
  for (const c of completos) {
    const titles = c.sections.map((s) => s.title);
    assert.ok(titles.some((t) => /Contexto|problema/i.test(t)), `${c.slug}: sem o problema de negócio`);
    assert.ok(titles.some((t) => /Solução|Duas camadas|Duas apresentações|Duas visões|Fonte|Persistência|Arquitetura|Indicadores/i.test(t)), `${c.slug}: sem a solução`);
    assert.ok(titles.some((t) => /Indicadores|Regras|Funcionalidades|Conteúdo|Arquitetura|Temas|Persistência|Integridade|Tratamento|Fonte|Duas camadas/i.test(t)), `${c.slug}: sem as capacidades`);
    assert.ok(titles.some((t) => /Aplicação|Resultado/.test(t)), `${c.slug}: sem a aplicação prática`);
    const words = c.sections.flatMap((s) => blocksText(s.blocks)).join(' ').split(/\s+/).length;
    assert.ok(words >= 180, `${c.slug}: conteúdo curto (${words} palavras)`);
  }
});

function pageHtml(slug: string): string | undefined {
  const p = join(root, 'dist', 'github-pages', 'projetos', slug, 'index.html');
  return existsSync(p) ? readFileSync(p, 'utf8') : undefined;
}

test('as páginas geradas não exibem mensagens internas nem campos vazios com rótulo', () => {
  let checked = 0;
  for (const c of cases) {
    const html = pageHtml(c.slug);
    if (!html) continue;
    checked += 1;
    const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    assert.doesNotMatch(visible, INTERNAL, c.slug);
    assert.doesNotMatch(html, /<dd[^>]*>\s*<\/dd>/, `${c.slug}: valor vazio`);
    const hasTechLabel = /<dt[^>]*>Tecnologias<\/dt>/.test(html);
    assert.equal(hasTechLabel, c.tech.length > 0, `${c.slug}: rótulo de tecnologias`);
    if (c.images) assert.equal((visible.match(/Captura de painel corporativo/g) ?? []).length, 1, `${c.slug}: aviso repetido`);
  }
  if (existsSync(join(root, 'dist', 'github-pages'))) assert.ok(checked === cases.length, 'páginas dos cases ausentes no artefato');
});
