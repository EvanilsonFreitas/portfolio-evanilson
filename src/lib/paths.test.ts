import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withBasePath } from './paths.ts';
import { diplomaFile, resumeFiles, site } from '../content/site.ts';
import { studies } from '../content/studies.ts';
import { existsSync } from 'node:fs';
import { projects, legacySlugs } from '../content/projects.ts';
import { expertise } from '../content/expertise.ts';

test('withBasePath prefixa caminhos estáticos e preserva URLs externas', () => {
  assert.equal(withBasePath('/resume/a.pdf', '/portfolio-evanilson'), '/portfolio-evanilson/resume/a.pdf');
  assert.equal(withBasePath('resume/a.pdf', ''), '/resume/a.pdf');
  assert.equal(withBasePath('https://github.com/x', '/b'), 'https://github.com/x');
  assert.equal(withBasePath('#topo', '/b'), '#topo');
});

test('os currículos configurados existem em /public', () => {
  for (const f of Object.values(resumeFiles)) {
    assert.ok(existsSync(new URL(`../../public${f.path}`, import.meta.url)), `${f.path} não encontrado`);
  }
});

test('o GitHub configurado é o oficial', () => {
  assert.equal(site.github, 'https://github.com/EvanilsonFreitas');
});

test('o diploma configurado existe em /public', () => {
  assert.ok(existsSync(new URL(`../../public${diplomaFile.path}`, import.meta.url)));
});

test('a foto do perfil existe em /public', () => {
  assert.ok(existsSync(new URL(`../../public${site.photo}`, import.meta.url)));
});

test('links internos de especialidades apontam para rotas existentes', () => {
  const slugs = new Set([...projects.map((p) => p.slug), ...studies.map((s) => s.slug)]);
  for (const pillar of expertise) {
    for (const ev of pillar.evidence) {
      const m = ev.href?.match(/^\/projetos\/([^/]+)\/$/);
      if (m) assert.ok(slugs.has(m[1]), `${ev.href} sem projeto`);
    }
  }
  for (const target of Object.values(legacySlugs)) assert.ok(slugs.has(target));
});

test('cada projeto aponta para um próximo projeto existente e é identificado como demonstração quando sintético', () => {
  const slugs = new Set(projects.map((p) => p.slug));
  for (const p of projects) {
    assert.ok(slugs.has(p.next));
    if (p.slug === 'bi-operacional-logistica') assert.equal(p.nature, 'demonstration');
  }
});
