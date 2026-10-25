import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { employment } from '../content/career.ts';
import { roleStructure } from './career.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const brand = (f: string) => join(root, 'public', 'assets', 'brand', f);
const sharp = createRequire(join(root, 'package.json'))('sharp');

const pngSize = (file: string) => {
  const b = readFileSync(file);
  assert.equal(b.subarray(1, 4).toString(), 'PNG', `${file} não é PNG`);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

test('o monograma original existe e os derivados têm as dimensões previstas', () => {
  assert.ok(existsSync(join(root, 'public', 'assets', 'perfil', 'Monograma EP Preto em Fundo Transparente.png')));
  const esperado: Record<string, number> = {
    'ep-light-16.png': 16, 'ep-light-32.png': 32, 'ep-light-48.png': 48, 'ep-light-96.png': 96,
    'ep-dark-16.png': 16, 'ep-dark-32.png': 32, 'ep-dark-48.png': 48, 'ep-dark-96.png': 96,
    'avatar-96.png': 96, 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512,
  };
  for (const [f, n] of Object.entries(esperado)) assert.deepEqual(pngSize(brand(f)), { w: n, h: n }, f);
});

test('favicon.ico contém 16, 32 e 48 px, e o ícone padrão do Next.js foi removido', () => {
  const ico = readFileSync(join(root, 'public', 'favicon.ico'));
  assert.equal(ico.readUInt16LE(2), 1, 'tipo ICO');
  const count = ico.readUInt16LE(4);
  const sizes = Array.from({ length: count }, (_, i) => ico.readUInt8(6 + i * 16));
  assert.deepEqual(sizes, [16, 32, 48]);
  assert.ok(!existsSync(join(root, 'src', 'app', 'favicon.ico')), 'favicon padrão ainda presente');
});

test('a variante clara usa exatamente a mesma máscara alpha da variante escura', async () => {
  for (const size of [32, 96]) {
    const a = await sharp(brand(`ep-light-${size}.png`)).ensureAlpha().raw().toBuffer();
    const b = await sharp(brand(`ep-dark-${size}.png`)).ensureAlpha().raw().toBuffer();
    assert.equal(a.length, b.length);
    for (let i = 3; i < a.length; i += 4) assert.equal(a[i], b[i], `alpha difere em ${size}px (pixel ${i >> 2})`);
  }
});

test('os favicons preservam transparência e deixam respiro (sem cortes nas bordas)', async () => {
  for (const f of ['ep-light-32.png', 'ep-dark-32.png', 'ep-light-48.png', 'ep-dark-48.png']) {
    const { data, info } = await sharp(brand(f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(data[3], 0, `${f}: canto deve ser transparente`);
    for (let x = 0; x < info.width; x++) assert.equal(data[x * 4 + 3], 0, `${f}: linha superior com conteúdo`);
    for (let y = 0; y < info.height; y++) assert.equal(data[(y * info.width) * 4 + 3], 0, `${f}: coluna esquerda com conteúdo`);
  }
});

test('o build estático referencia os ícones com o BasePath correto', () => {
  const cfg = [
    { dir: join(root, 'dist', 'github-pages'), base: '/portfolio-evanilson' },
    { dir: join(root, 'dist', 'vercel', '.vercel', 'output', 'static'), base: '' },
  ].filter((c) => existsSync(join(c.dir, 'index.html')));
  for (const { dir, base } of cfg) {
    const html = readFileSync(join(dir, 'index.html'), 'utf8');
    for (const href of [`${base}/favicon.ico`, `${base}/assets/brand/ep-light-32.png`, `${base}/assets/brand/ep-dark-32.png`, `${base}/assets/brand/apple-touch-icon.png`, `${base}/manifest.webmanifest`]) {
      assert.ok(html.includes(`href="${href}"`), `${href} ausente no HTML (${dir})`);
      assert.ok(existsSync(join(dir, href.slice(base.length))), `${href} ausente no artefato`);
    }
    assert.ok(!/favicon\.[a-z0-9]+\.ico/.test(html), 'favicon com hash do ícone padrão');
  }
});

test('rótulo de duração: períodos separados (Solistica) são "acumulados"; os demais, contínuos', () => {
  const by = (id: string) => roleStructure(employment.find((e) => e.id === id)!, '2026-10');
  assert.equal(by('solistica').separate, true);
  assert.equal(by('tragetta').separate, false);
  assert.equal(by('transface').separate, false);
});

test('a rolagem do emblema (monograma e retrato) é só CSS, linear, com ciclo de 8 s e respeita movimento reduzido', () => {
  const css = readFileSync(join(root, 'src', 'app', 'globals.css'), 'utf8');
  assert.ok(/\.logo-roll-a,\s*\.logo-roll-b \{[^}]*animation-duration: 8s;\s*animation-timing-function: linear;\s*animation-iteration-count: infinite/.test(css), 'ciclo linear de 8 s (4 s por emblema)');
  const a = css.slice(css.indexOf('@keyframes logo-roll-a'), css.indexOf('@keyframes logo-roll-b'));
  assert.ok(a.includes('43.75%') && a.includes('50%') && a.includes('translateY(-100%)') && a.includes('translateY(100%)'));
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.ok(/\.logo-roll-b \{\s*display: none;/.test(reduced), 'movimento reduzido: só o monograma');
  const header = readFileSync(join(root, 'src', 'components', 'layout', 'Header.tsx'), 'utf8');
  assert.ok(header.includes('className="logo-roll') && header.includes('aria-hidden="true"') && header.includes('avatar-96.png'));
  assert.equal((header.match(/<Link href="\/"/g) ?? []).length, 1, 'um único link para a home');
});

test('os SVG e fotos de origem não são publicados (somente derivados leves)', () => {
  for (const dir of [join(root, 'dist', 'github-pages'), join(root, 'dist', 'vercel', '.vercel', 'output', 'static')]) {
    if (!existsSync(join(dir, 'index.html'))) continue;
    assert.ok(!existsSync(join(dir, 'resume', 'Logo_Animeted.svg')));
    assert.ok(!existsSync(join(dir, 'resume', 'Foto_Curriculo.jpg')));
    assert.ok(existsSync(join(dir, 'assets', 'brand', 'avatar-96.png')));
  }
});
