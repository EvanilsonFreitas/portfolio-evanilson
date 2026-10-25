import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { findIncorrectClaims } from '../content/identity-guard.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const SKIP = new Set(['node_modules', '.next', '.git', 'dist', 'out']);
const SELF = new Set(['identity-guard.ts', 'identity.test.ts']);

function walk(dir: string, exts: RegExp): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p, exts);
    return exts.test(name) && !SELF.has(name) ? [p] : [];
  });
}

test('o código-fonte, os artigos e a documentação não afirmam atribuições incorretas', () => {
  const files = [
    ...walk(join(root, 'src'), /\.(ts|tsx|css)$/),
    ...walk(join(root, 'content'), /\.mdx?$/),
    ...walk(join(root, 'docs'), /\.md$/),
    ...walk(join(root, 'tools'), /\.mjs$/),
    join(root, 'README.md'),
  ];
  assert.ok(files.length > 20);
  for (const f of files) {
    assert.deepEqual(findIncorrectClaims(readFileSync(f, 'utf8')), [], f);
  }
});

test('os artefatos de publicação, quando existem, não afirmam atribuições incorretas', () => {
  const dirs = [join(root, 'dist', 'github-pages'), join(root, 'dist', 'vercel', '.vercel', 'output', 'static')].filter(existsSync);
  for (const d of dirs) {
    for (const f of walk(d, /\.(html|txt|xml|json|js|css)$/)) {
      assert.deepEqual(findIncorrectClaims(readFileSync(f, 'utf8')), [], f);
    }
  }
});

test('os currículos (texto extraído de PDF e DOCX) não afirmam atribuições incorretas', async () => {
  const { docxText, pdfText } = await import(pathToFileURL(join(root, 'tools', 'extract-text.mjs')).href);
  const dir = join(root, 'public', 'resume');
  for (const f of ['Evanilson_Freitas_Curriculo.docx', 'Evanilson_Freitas_Curriculo_ATS.docx']) {
    const text: string = await docxText(join(dir, f));
    assert.ok(text.includes('Evanilson Pereira de Freitas'), `${f}: nome ausente`);
    assert.ok(text.includes('MBA em Data Science') && text.includes('Uninove'), `${f}: formação ausente`);
    assert.deepEqual(findIncorrectClaims(text), [], f);
  }
  const pdf: { text: string; pages: number } = await pdfText(join(dir, 'Evanilson_Freitas_Curriculo.pdf'));
  assert.ok(pdf.text.includes('Evanilson'), 'PDF sem texto extraível');
  assert.ok(pdf.text.includes('MBA em Data Science') && pdf.text.includes('Uninove'), 'PDF: formação ausente');
  assert.deepEqual(findIncorrectClaims(pdf.text), []);
  assert.equal(pdf.pages, 1);
  // Marivan Finance permanece no site, mas não entra nos currículos; a foto e o título novo, sim.
  // Contato confirmado: telefone e e-mail Outlook em todos os formatos.
  for (const t of [pdf.text, await docxText(join(dir, 'Evanilson_Freitas_Curriculo.docx')), await docxText(join(dir, 'Evanilson_Freitas_Curriculo_ATS.docx'))]) {
    assert.ok(t.includes('Evanilson.2631@outlook.com'), 'e-mail ausente');
    assert.ok(/\+55\s?11\s?96463-9228/.test(t), 'telefone ausente');
    assert.ok(!t.includes('TypeScript, React e SVG'), 'descrição do demonstrador no currículo');
  }
  for (const t of [pdf.text, await docxText(join(dir, 'Evanilson_Freitas_Curriculo.docx')), await docxText(join(dir, 'Evanilson_Freitas_Curriculo_ATS.docx'))]) {
    assert.ok(!t.includes('Marivan'), 'currículo cita Marivan Finance');
    assert.ok(t.includes('Business Intelligence'), 'título do currículo ausente');
    assert.ok(t.includes('Inteligência de Negócios'), 'complemento do título ausente');
  }
});

test('o guarda reconhece as atribuições incorretas (sanidade do teste)', () => {
  assert.deepEqual(findIncorrectClaims('Trabalhou na Red Cargas Logística').length, 1);
  assert.equal(findIncorrectClaims('Mestrado em  Engenharia de Software').length, 1);
  assert.equal(findIncorrectClaims('Analista de BI e desenvolvedor').length, 0);
  assert.equal(findIncorrectClaims('cliente Tragetta').length, 1);
  assert.equal(findIncorrectClaims('atua como DBA').length, 1);
  assert.equal(findIncorrectClaims('Tech Lead do time').length, 1);
});
