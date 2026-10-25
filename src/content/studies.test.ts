import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagrams } from './diagrams.ts';
import { projects } from './projects.ts';
import { studies } from './studies.ts';
import { businessDomains } from './about.ts';
import type { Block, Section } from './types.ts';

const allSections: Section[] = [...studies.flatMap((s) => s.sections), ...projects.flatMap((p) => p.deepDive ?? [])];
const allBlocks: Block[] = allSections.flatMap((s) => s.blocks);
const slugs = new Set([...studies.map((s) => s.slug), ...projects.map((p) => p.slug)]);

test('todo diagrama referenciado em blocos existe', () => {
  for (const b of allBlocks) if (b.kind === 'diagram') assert.ok(b.id in diagrams, `diagrama inexistente: ${b.id}`);
});

test('slugs de estudos e projetos são únicos', () => {
  assert.equal(slugs.size, studies.length + projects.length);
});

test('o encadeamento "próximo" aponta para um estudo ou projeto existente', () => {
  for (const s of studies) assert.ok(slugs.has(s.next), `${s.slug} → ${s.next}`);
  for (const p of projects) assert.ok(slugs.has(p.next), `${p.slug} → ${p.next}`);
});

test('links internos de trajetória e domínios apontam para páginas existentes', () => {
  for (const d of businessDomains) {
    const m2 = d.href.match(/^\/projetos\/([^/]+)\/$/);
    if (m2) assert.ok(slugs.has(m2[1]), d.href);
  }
});

test('todo estudo declara o estado de suas afirmações', () => {
  for (const s of studies) assert.ok(s.sections.some((x) => x.blocks.some((b) => b.kind === 'status')), s.slug);
});
