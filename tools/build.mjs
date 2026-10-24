// Gera o build estático para um destino e organiza o artefato em dist/<destino>.
// Uso: node tools/build.mjs github-pages | vercel
//   github-pages -> dist/github-pages          (com .nojekyll; basePath /portfolio-evanilson)
//   vercel       -> dist/vercel/.vercel/output (Build Output API v3; basePath vazio)
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2];
if (!['github-pages', 'vercel'].includes(target)) {
  console.error('Uso: node tools/build.mjs github-pages | vercel');
  process.exit(1);
}

// O destino é embutido no build: limpa o cache para não reaproveitar saída de outro destino.
rmSync(join(root, '.next'), { recursive: true, force: true });
rmSync(join(root, 'out'), { recursive: true, force: true });

const next = join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const r = spawnSync(process.execPath, [next, 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, DEPLOY_TARGET: target, NODE_ENV: 'production' },
});
if (r.status !== 0) process.exit(r.status ?? 1);

const out = join(root, 'out');
if (!existsSync(join(out, 'index.html'))) {
  console.error('Build sem out/index.html.');
  process.exit(1);
}

// A fotografia é insumo do gerador de currículo (já embutida nos documentos): não vai para o site.
rmSync(join(out, 'assets', 'curriculo'), { recursive: true, force: true });

const dist = join(root, 'dist', target);
rmSync(dist, { recursive: true, force: true });

if (target === 'github-pages') {
  mkdirSync(dist, { recursive: true });
  cpSync(out, dist, { recursive: true });
  writeFileSync(join(dist, '.nojekyll'), '');
  console.log(`\nArtefato: ${dist}`);
} else {
  const output = join(dist, '.vercel', 'output');
  mkdirSync(join(output, 'static'), { recursive: true });
  cpSync(out, join(output, 'static'), { recursive: true });
  writeFileSync(join(output, 'config.json'), JSON.stringify({ version: 3 }, null, 2) + '\n');
  console.log(`\nArtefato: ${output}`);
}
