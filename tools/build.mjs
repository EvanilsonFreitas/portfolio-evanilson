// Gera o build estático para um destino e organiza o artefato em dist/<destino>.
// Uso: node tools/build.mjs github-pages | vercel
//   github-pages -> dist/github-pages          (com .nojekyll; basePath /portfolio-evanilson)
//   vercel       -> dist/vercel/.vercel/output (Build Output API v3; basePath vazio)
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
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
rmSync(join(out, 'resume', 'Foto_Curriculo.jpg'), { force: true });
// O SVG do retrato (3,5 MB) é insumo: o cabeçalho usa a miniatura raster em assets/brand.
rmSync(join(out, 'resume', 'Logo_Animeted.svg'), { force: true });

// Capturas originais de projetos são confidenciais e vivem fora do repositório. Se alguma pasta com esse
// nome voltar a existir em public, ela não pode chegar ao artefato (a verificação também falha).
// A comparação é exata: no Windows o sistema de arquivos ignora maiúsculas e apagaria `assets/projetos`.
if (readdirSync(join(out, 'assets')).includes('Projetos')) rmSync(join(out, 'assets', 'Projetos'), { recursive: true, force: true });

// No Windows o export grava os payloads de prefetch em pastas (`__next.blog/__PAGE__.txt`),
// mas o cliente os solicita como arquivos planos (`__next.blog.__PAGE__.txt`). Normaliza.
function flattenPrefetch(dir) {
  for (const name of readdirSync(dir)) {
    if (name === '_next') continue;
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith('__next.')) {
      const walk = (d, prefix) => {
        for (const n of readdirSync(d)) {
          const q = join(d, n);
          if (statSync(q).isDirectory()) walk(q, `${prefix}.${n}`);
          else renameSync(q, join(dir, `${prefix}.${n}`));
        }
      };
      walk(p, name);
      rmSync(p, { recursive: true, force: true });
    } else flattenPrefetch(p);
  }
}
flattenPrefetch(out);

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
