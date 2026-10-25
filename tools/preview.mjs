// Servidor estático local para conferir um artefato sob o prefixo correto.
// Uso: node tools/preview.mjs github-pages | vercel   (porta 4173)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2];
const cfg = {
  'github-pages': { dir: join(root, 'dist', 'github-pages'), base: '/portfolio-evanilson' },
  vercel: { dir: join(root, 'dist', 'vercel', '.vercel', 'output', 'static'), base: '' },
}[target];
if (!cfg || !fs.existsSync(cfg.dir)) {
  console.error('Uso: node tools/preview.mjs github-pages | vercel (gere o build antes).');
  process.exit(1);
}

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml',
};
const port = Number(process.argv[3] ?? 4173);

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (cfg.base && !url.startsWith(cfg.base)) {
      res.writeHead(404);
      return res.end('404 (fora do prefixo)');
    }
    let file = path.join(cfg.dir, url.slice(cfg.base.length));
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      return res.end('404');
    }
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`http://localhost:${port}${cfg.base}/`));
