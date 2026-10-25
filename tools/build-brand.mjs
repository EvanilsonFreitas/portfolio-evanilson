// Deriva os ícones do monograma EP a partir do PNG original (somente leitura).
// Origem:  public/assets/perfil/Monograma EP Preto em Fundo Transparente.png
// Destino: public/assets/brand/  e  public/favicon.ico
// A geometria não é redesenhada: o símbolo é recortado pela máscara alpha, centralizado e redimensionado.
// A variante clara reaproveita a mesma máscara alpha, trocando apenas a cor de preenchimento.
// Uso: npm run brand   (usa o `sharp` instalado junto com o Next.js)
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(join(root, 'package.json'))('sharp');

const SOURCE = join(root, 'public', 'assets', 'perfil', 'Monograma EP Preto em Fundo Transparente.png');
const OUT = join(root, 'public', 'assets', 'brand');
mkdirSync(OUT, { recursive: true });

const LIGHT_ON_DARK = { r: 240, g: 246, b: 252 }; // #f0f6fc, texto do tema escuro
const WHITE = { r: 255, g: 255, b: 255 };

/** Retângulo do conteúdo visível (alpha > limiar), lido do arquivo. */
async function contentBox() {
  const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1, source: info };
}

const box = await contentBox();
const crop = await sharp(SOURCE).ensureAlpha().extract({ left: box.left, top: box.top, width: box.width, height: box.height }).png().toBuffer();

/** Mesma máscara alpha, preenchimento em cor única (variante clara). */
async function recolor(png, color) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = color.r;
    data[i + 1] = color.g;
    data[i + 2] = color.b;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

const light = crop; // cor original (grafite/preto)
const dark = await recolor(crop, LIGHT_ON_DARK);

/**
 * Quadro quadrado de lado `size`; o símbolo ocupa `fill` do lado maior, proporção preservada, centralizado.
 * `background` ausente mantém transparência.
 */
async function square(png, size, fill, background) {
  const target = Math.max(1, Math.round(size * fill));
  const glyph = await sharp(png).resize({ width: target, height: target, fit: 'inside', kernel: 'lanczos3' }).toBuffer({ resolveWithObject: true });
  const left = Math.round((size - glyph.info.width) / 2);
  const top = Math.round((size - glyph.info.height) / 2);
  return sharp({ create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: glyph.data, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const write = (name, buf) => writeFileSync(join(OUT, name), buf);
const FAV = 0.9; // símbolo ocupa 90% do quadro: legível em 16 px e sem cortes

for (const size of [16, 32, 48]) {
  write(`ep-light-${size}.png`, await square(light, size, FAV));
  write(`ep-dark-${size}.png`, await square(dark, size, FAV));
}
// Marca do cabeçalho (exibida em ~24 px; 96 px cobre telas de alta densidade).
write('ep-light-96.png', await square(light, 96, 1));
write('ep-dark-96.png', await square(dark, 96, 1));
// Ícones com fundo sólido (Apple e manifesto): fundo branco e símbolo original.
write('apple-touch-icon.png', await square(light, 180, 0.6, { ...WHITE, alpha: 1 }));
write('icon-192.png', await square(light, 192, 0.64, { ...WHITE, alpha: 1 }));
write('icon-512.png', await square(light, 512, 0.64, { ...WHITE, alpha: 1 }));

// Retrato circular (public/resume/Logo_Animeted.svg, 3,5 MB): miniatura raster leve para o cabeçalho.
// O SVG original não é alterado nem publicado; aqui ele é apenas rasterizado em 96 px.
write('avatar-96.png', await sharp(join(root, 'public', 'resume', 'Logo_Animeted.svg'), { density: 72 }).resize(96, 96).png({ compressionLevel: 9 }).toBuffer());

// favicon.ico: PNGs embutidos (16, 32 e 48), símbolo escuro sobre transparência.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => square(light, s, FAV)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0);
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
writeFileSync(join(root, 'public', 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));

console.log(JSON.stringify({ origem: box.source.width + 'x' + box.source.height, bbox: { left: box.left, top: box.top, width: box.width, height: box.height } }));
console.log('Ícones em', OUT, 'e public/favicon.ico');
