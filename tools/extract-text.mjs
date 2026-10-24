// Extração de texto de PDF e DOCX (para verificações de conteúdo). Usa as dependências de tools/resume.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'tools', 'resume', 'node_modules');
const require = createRequire(join(nm, 'x.js'));

export async function docxText(file) {
  const JSZip = require('jszip');
  const zip = await JSZip.loadAsync(readFileSync(file));
  const parts = Object.keys(zip.files).filter((n) => /^word\/(document|header\d*|footer\d*|footnotes)\.xml$/.test(n));
  let out = '';
  for (const n of parts) {
    const xml = await zip.file(n).async('string');
    out += xml.replace(/<\/w:p>/g, '\n').replace(/<w:tab\/>/g, ' ').replace(/<[^>]+>/g, '') + '\n';
  }
  // Também os alvos de hiperlink.
  const rels = zip.file('word/_rels/document.xml.rels');
  if (rels) out += (await rels.async('string')).replace(/<[^>]+Target="([^"]+)"[^>]*>/g, '$1\n').replace(/<[^>]+>/g, '');
  return out.replace(/&amp;/g, '&');
}

export async function pdfText(file) {
  const pdfjs = await import(pathToFileURL(join(nm, 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs')).href);
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), useSystemFonts: true, verbosity: 0 }).promise;
  let out = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it) => it.str + (it.hasEOL ? '\n' : ' ')).join('') + '\n';
    for (const a of await page.getAnnotations()) if (a.url) out += a.url + '\n';
  }
  return { text: out, pages: doc.numPages };
}
