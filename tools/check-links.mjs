// Verifica links internos, assets, prefixo e metadados do artefato exportado.
// Uso: node tools/check-links.mjs github-pages | vercel
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2];
const cfg = {
  'github-pages': {
    dir: join(root, 'dist', 'github-pages'),
    base: '/portfolio-evanilson',
    canonical: 'https://evanilsonfreitas.github.io/portfolio-evanilson/',
  },
  vercel: {
    dir: join(root, 'dist', 'vercel', '.vercel', 'output', 'static'),
    base: '',
    canonical: 'https://portfolio-evanilson.vercel.app/',
  },
}[target];
if (!cfg || !existsSync(cfg.dir)) {
  console.error('Uso: node tools/check-links.mjs github-pages | vercel (gere o build antes).');
  process.exit(1);
}
const out = cfg.dir;
const BASE = cfg.base;

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(out).filter((f) => f.endsWith('.html'));
const missing = new Map();
let checked = 0;

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const u of urls) {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(u)) continue;
    const clean = u.split('#')[0].split('?')[0];
    if (!clean) continue;
    checked += 1;
    if (BASE && !clean.startsWith(`${BASE}/`) && clean !== BASE) {
      missing.set(`${clean} (sem prefixo ${BASE})`, f.replace(out, ''));
      continue;
    }
    const rel = clean.slice(BASE.length) || '/';
    const file = join(out, rel);
    const ok = existsSync(file) && (statSync(file).isFile() || existsSync(join(file, 'index.html')));
    if (!ok) missing.set(clean, f.replace(out, ''));
  }
}

const problems = [];
// Payloads de prefetch devem ser arquivos planos (o cliente os requisita assim).
const nestedPrefetch = (d) => readdirSync(d).some((n) => {
  if (n === '_next') return false;
  const p = join(d, n);
  return statSync(p).isDirectory() && (n.startsWith('__next.') || nestedPrefetch(p));
});
if (nestedPrefetch(out)) problems.push('payloads de prefetch em pastas (esperado: arquivos planos)');
const home = readFileSync(join(out, 'index.html'), 'utf8');
if (!home.includes(`<link rel="canonical" href="${cfg.canonical}"`)) problems.push('canonical da home inesperado');
if (existsSync(join(out, 'assets', 'curriculo')) || existsSync(join(out, 'resume', 'Foto_Curriculo.jpg')) || existsSync(join(out, 'resume', 'Logo_Animeted.svg'))) problems.push('fotografia do currículo exposta no artefato');
if (target === 'github-pages' && !existsSync(join(out, '.nojekyll'))) problems.push('.nojekyll ausente');
if (target === 'vercel' && !existsSync(join(out, '..', 'config.json'))) problems.push('config.json ausente');
if (target === 'vercel' && home.includes('/portfolio-evanilson/')) problems.push('prefixo do GitHub Pages presente no build da Vercel');
for (const f of [
  'resume/Evanilson_Freitas_Curriculo.pdf',
  'resume/Evanilson_Freitas_Curriculo.docx',
  'resume/Evanilson_Freitas_Curriculo_ATS.docx',
  'robots.txt',
  'sitemap.xml',
  'og/portfolio.png',
]) {
  if (!existsSync(join(out, f))) problems.push(`arquivo ausente: ${f}`);
}
for (const f of ['Evanilson_Freitas_Curriculo.pdf', 'Evanilson_Freitas_Curriculo.docx', 'Evanilson_Freitas_Curriculo_ATS.docx']) {
  const pub = join(root, 'public', 'resume', f);
  const art = join(out, 'resume', f);
  if (existsSync(pub) && existsSync(art) && !readFileSync(pub).equals(readFileSync(art))) problems.push();
}
if (!readFileSync(join(out, 'sitemap.xml'), 'utf8').includes(cfg.canonical)) problems.push('sitemap com origem inesperada');

// Catálogo: cada item precisa ter página, canonical e entrada no sitemap; o nome público anterior do
// projeto financeiro e as capturas originais confidenciais não podem estar no artefato.
const { catalog } = await import(pathToFileURL(join(root, 'src', 'content', 'catalog.ts')).href);
const { projectImages } = await import(pathToFileURL(join(root, 'src', 'content', 'project-images.ts')).href);
const sitemap = readFileSync(join(out, 'sitemap.xml'), 'utf8');
for (const e of catalog) {
  const page = join(out, 'projetos', e.slug, 'index.html');
  if (!existsSync(page)) {
    problems.push(`página ausente: /projetos/${e.slug}/`);
    continue;
  }
  if (!readFileSync(page, 'utf8').includes(`<link rel="canonical" href="${cfg.canonical}projetos/${e.slug}/"`)) problems.push(`canonical inesperado: ${e.slug}`);
  if (!sitemap.includes(`${cfg.canonical}projetos/${e.slug}/`)) problems.push(`fora do sitemap: ${e.slug}`);
}
const imgDir = join(out, 'assets', 'projetos');
const expectedImages = new Set(projectImages.flatMap((i) => [`${i.id}.webp`, `${i.id}-thumb.webp`]));
const publishedImages = existsSync(imgDir) ? readdirSync(imgDir) : [];
if (publishedImages.length !== expectedImages.size || publishedImages.some((n) => !expectedImages.has(n))) problems.push('assets/projetos difere das imagens públicas esperadas');
if (readdirSync(join(out, 'assets')).includes('Projetos')) problems.push('pasta de originais (assets/Projetos) no artefato');
const originalHashes = new Set(projectImages.map((i) => i.originalSha256));
const { findIncorrectClaims } = await import(pathToFileURL(join(root, 'src', 'content', 'identity-guard.ts')).href);
for (const f of walk(out)) {
  if (/\.(png|jpe?g|webp|gif|pdf)$/i.test(f) && originalHashes.has(createHash('sha256').update(readFileSync(f)).digest('hex'))) problems.push(`captura original confidencial no artefato: ${f.replace(out, '')}`);
  if (/\.(html|txt|xml|json|js|css|webmanifest)$/i.test(f) && findIncorrectClaims(readFileSync(f, 'utf8')).length > 0) problems.push(`atribuição incorreta ou nome público anterior em ${f.replace(out, '')}`);
}

console.log(`Destino: ${target} · ${out}`);
console.log(`Páginas: ${files.length} · referências internas verificadas: ${checked}`);
for (const p of problems) console.log(`Problema: ${p}`);
if (missing.size) {
  console.log('Referências quebradas:');
  for (const [u, from] of missing) console.log(`  ${u}  ← ${from}`);
}
if (missing.size || problems.length) process.exit(1);
console.log('Nenhuma referência quebrada e metadados coerentes com o destino.');
