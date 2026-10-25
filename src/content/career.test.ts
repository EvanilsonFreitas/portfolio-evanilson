import { test } from 'node:test';
import assert from 'node:assert/strict';
import { career, employment, type Employment } from './career.ts';
import { projects } from './projects.ts';
import { studies } from './studies.ts';
import { findIncorrectClaims } from './identity-guard.ts';
import { employmentMonths, formatDuration, formatPeriod, monthsBetween, roleStructure, sortEmployment, sortRoles, totalMonths } from '../lib/career.ts';

const slugs = new Set([...projects.map((p) => p.slug), ...studies.map((s) => s.slug)]);

test('a trajetória segue a progressão declarada, na ordem', () => {
  assert.deepEqual(career.map((c) => c.id), ['operacao', 'gestao', 'bi', 'comercial', 'engenharia']);
  assert.equal(new Set(career.map((c) => c.id)).size, career.length);
});

test('todo projeto relacionado aponta para uma página existente', () => {
  for (const c of career) {
    assert.ok(c.projects.length > 0, `${c.id} sem projeto relacionado`);
    for (const l of c.projects) {
      const m = /^\/projetos\/([^/]+)\/$/.exec(l.href);
      assert.ok(m && slugs.has(m[1]), `${c.id}: ${l.href}`);
    }
  }
});

test('marcos de evolução e vínculos formais são dados separados', () => {
  for (const c of career) {
    for (const k of ['company', 'role', 'period', 'location']) assert.ok(!(k in c), `${c.id} mistura vínculo formal (${k})`);
  }
  for (const e of employment) {
    for (const r of e.roles) for (const m of r.milestones ?? []) assert.ok(career.some((c) => c.id === m), `marco inexistente: ${m}`);
  }
});

const role = (company: string, title: string, start: string) => {
  const e = employment.find((x) => x.company.name === company);
  const r = e?.roles.find((x) => x.title === title && x.period.start === start);
  assert.ok(r, `${company} / ${title} / ${start} ausente`);
  return r;
};

test('somente as três empresas autorizadas, com cinco registros de cargo', () => {
  assert.deepEqual(employment.map((e) => e.company.name).sort(), ['Solistica', 'Tragetta', 'Transface Transportes Ltda.']);
  assert.equal(employment.reduce((n, e) => n + e.roles.length, 0), 6);
  assert.equal(new Set(employment.map((e) => e.id)).size, employment.length);
});

test('Tragetta: três registros em um único vínculo; somente Business Intelligence é o cargo atual', () => {
  const t = employment.filter((e) => e.company.name === 'Tragetta');
  assert.equal(t.length, 1);
  assert.equal(t[0].roles.length, 3);
  const bi = role('Tragetta', 'Business Intelligence', '2026-06');
  const pricing = role('Tragetta', 'Analista de Pricing', '2026-01');
  const dados = role('Tragetta', 'Analista de Dados', '2025-03');
  assert.equal(bi.period.end, undefined);
  assert.equal(pricing.period.end, '2026-06'); // encerrado na transição para BI; sem dia inventado
  assert.equal(dados.period.end, '2026-01');
  assert.deepEqual(t[0].roles.filter((r) => !r.period.end).map((r) => r.title), ['Business Intelligence']);
  assert.equal(bi.mode, 'Híbrido');
  assert.equal(pricing.type, 'Tempo integral');
  assert.deepEqual(bi.technologies, ['SQL', 'Microsoft Power BI']);
  assert.deepEqual(pricing.technologies, ['Estatística', 'Python']);
  assert.equal(dados.mode, 'Presencial');
  assert.equal(t[0].roles.map((r) => r.period.start).sort().at(0), '2025-03', 'entrada na empresa preservada');
});

test('Tragetta: sequência Dados → Pricing → BI, sem cargos exercidos em paralelo, e duração sem contagem dupla', () => {
  const t = employment.find((e) => e.id === 'tragetta')!;
  assert.deepEqual(roleStructure(t, '2026-10'), { parallel: false, separate: false });
  // 2025-03 até 2026-10, contínuo: 20 meses. A soma direta (11 + 6 + 5) contaria 2026-01 e 2026-06 duas vezes.
  assert.equal(employmentMonths(t, '2026-10'), 20);
  const soma = t.roles.reduce((n, r) => n + monthsBetween(r.period, '2026-10'), 0);
  assert.equal(soma, 11 + 6 + 5);
  assert.ok(soma > 20);
  assert.deepEqual(sortRoles(t.roles).map((r) => r.title), ['Business Intelligence', 'Analista de Pricing', 'Analista de Dados']);
});

test('Solistica: dois períodos separados, sem emprego contínuo de 2018 a 2025', () => {
  const s = employment.find((e) => e.company.name === 'Solistica')!;
  assert.equal(s.roles.length, 2);
  const assistente = role('Solistica', 'Assistente Administrativo', '2021-10');
  const aprendiz = role('Solistica', 'Aprendiz', '2018-12');
  assert.equal(assistente.period.end, '2025-03');
  assert.equal(aprendiz.period.end, '2020-08');
  assert.equal(aprendiz.type, 'Meio período');
  assert.equal(aprendiz.responsibilities, undefined); // sem atividades informadas para o contrato de aprendiz
  assert.ok((assistente.responsibilities?.length ?? 0) >= 4 && (assistente.responsibilities?.length ?? 0) <= 6);
  assert.deepEqual(roleStructure(s, '2026-10'), { parallel: false, separate: true });
  // 21 meses (2018-12..2020-08) + 42 meses (2021-10..2025-03); setembro/2020 a setembro/2021 não contam.
  assert.equal(employmentMonths(s, '2026-10'), 63);
});

test('Transface é simultânea ao cargo de Assistente Administrativo na Solistica e foi preservada', () => {
  const tf = role('Transface Transportes Ltda.', 'Assistente Administrativo', '2021-11');
  assert.equal(tf.period.end, '2022-08');
  assert.deepEqual(tf.technologies, ['Expedição']);
  const sol = role('Solistica', 'Assistente Administrativo', '2021-10');
  assert.ok(tf.period.start > sol.period.start && tf.period.end! < sol.period.end!);
});

test('tempo total usa a união dos períodos, sem contar meses duas vezes', () => {
  // Soma direta das durações dos 6 cargos seria bem maior que a união.
  const soma = employment.flatMap((e) => e.roles).reduce((n, r) => n + monthsBetween(r.period, '2026-10'), 0);
  const uniao = totalMonths(employment, '2026-10');
  // 2018-12..2020-08 (21) + 2021-10..2026-10 contínuo (61), pois Transface está dentro da Solistica e a Tragetta começa em 2025-03.
  assert.equal(uniao, 82);
  assert.ok(soma > uniao);
  assert.deepEqual(roleStructure(employment.find((e) => e.id === 'tragetta')!, '2026-10'), { parallel: false, separate: false });
});

test('ordem cronológica inversa: atual primeiro, depois pelo término mais recente', () => {
  assert.deepEqual(sortEmployment(employment).map((e) => e.id), ['tragetta', 'solistica', 'transface']);
  assert.deepEqual(sortRoles(employment[0].roles).map((r) => r.title), ['Business Intelligence', 'Analista de Pricing', 'Analista de Dados']);
});

test('links profissionais das empresas e dos projetos relacionados são válidos', () => {
  for (const e of employment) {
    assert.ok(!e.company.url || /^https:\/\/www\.linkedin\.com\/company\/\d+\/$/.test(e.company.url), e.id);
    for (const r of e.roles) for (const l of r.projects ?? []) {
      const m = /^\/projetos\/([^/]+)\/$/.exec(l.href);
      assert.ok(m && slugs.has(m[1]), `${e.id}: ${l.href}`);
    }
  }
});

test('não há durações armazenadas nem textos de preenchimento nos vínculos', () => {
  const text = JSON.stringify(employment);
  assert.ok(!/\b\d+ (meses|m.s|anos|ano)\b/.test(text), 'duração copiada do LinkedIn');
  assert.ok(!/a confirmar|\bTBD\b|lorem|placeholder/i.test(text));
  assert.deepEqual(findIncorrectClaims(text), []);
});

test('o conteúdo não contém espaços reservados nem atribuições incorretas', () => {
  const text = JSON.stringify(career);
  assert.ok(!/a confirmar|\bTBD\b|lorem|placeholder|xxxx/i.test(text));
  assert.deepEqual(findIncorrectClaims(text), []);
  for (const c of career) {
    for (const v of [c.stage, c.headline, c.context, ...c.responsibilities, ...c.technologies]) assert.ok(v.trim().length > 0);
  }
});

test('período e duração, quando houver, são calculados sem inventar datas', () => {
  assert.equal(monthsBetween({ start: '2021-03', end: '2021-03' }, '2026-10'), 1);
  assert.equal(monthsBetween({ start: '2021-03', end: '2023-05' }, '2026-10'), 27);
  assert.equal(monthsBetween({ start: '2025-10' }, '2026-10'), 13);
  assert.equal(formatDuration(27), '2 anos e 3 meses');
  assert.equal(formatDuration(12), '1 ano');
  assert.equal(formatDuration(8), '8 meses');
  assert.equal(formatPeriod({ start: '2021-03', end: '2023-05' }), 'mar de 2021 – mai de 2023');
  assert.equal(formatPeriod({ start: '2025-01' }), 'jan de 2025 – o momento');
  assert.throws(() => monthsBetween({ start: '2023-05', end: '2021-03' }, '2026-10'), RangeError);
  assert.throws(() => formatPeriod({ start: '2021-13' }), RangeError);
});

test('o marco em foco é o que contém a linha de leitura, ou o mais próximo', async () => {
  const { focusIndex } = await import('../lib/career.ts');
  const rects = [
    { top: 0, bottom: 300 },
    { top: 360, bottom: 700 },
    { top: 760, bottom: 1100 },
  ];
  assert.equal(focusIndex(rects, 100), 0);
  assert.equal(focusIndex(rects, 500), 1);
  assert.equal(focusIndex(rects, 330), 0); // entre marcos: o mais próximo
  assert.equal(focusIndex(rects, 340), 1);
  assert.equal(focusIndex(rects, -50), 0);
  assert.equal(focusIndex(rects, 5000), 2);
  assert.equal(focusIndex([], 100), 0);
});

test('vínculos formais: promoções, simultaneidade e experiência atual (fixtures neutras de teste)', () => {
  const a: Employment = {
    id: 'a',
    company: { name: 'Empresa A' },
    roles: [
      { title: 'Cargo 1', period: { start: '2020-01', end: '2021-12' } },
      { title: 'Cargo 2', period: { start: '2022-01', end: '2023-06' } }, // promoção, sem lacuna
      { title: 'Cargo 3', period: { start: '2023-01' } }, // simultâneo e atual
    ],
  };
  assert.deepEqual(sortRoles(a.roles).map((r) => r.title), ['Cargo 3', 'Cargo 2', 'Cargo 1']);
  // 2020-01 até 2023-06 e 2023-01 até 2026-10: união 2020-01..2026-10 = 82 meses, sem contar sobreposição duas vezes.
  assert.equal(employmentMonths(a, '2026-10'), 82);
  const b: Employment = { id: 'b', company: { name: 'Empresa B' }, roles: [{ title: 'X', period: { start: '2019-01', end: '2019-12' } }] };
  assert.equal(employmentMonths(b, '2026-10'), 12);
  assert.deepEqual(sortEmployment([b, a]).map((e) => e.id), ['a', 'b']);
  // Lacuna entre cargos não é contada.
  const c: Employment = { id: 'c', company: { name: 'Empresa C' }, roles: [{ title: 'P', period: { start: '2020-01', end: '2020-06' } }, { title: 'Q', period: { start: '2021-01', end: '2021-06' } }] };
  assert.equal(employmentMonths(c, '2026-10'), 12);
});
