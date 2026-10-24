// Gera o currículo a partir de src/content (fonte única):
//   - PDF em duas colunas (HTML → Chrome/Edge headless)
//   - DOCX em duas colunas
//   - DOCX ATS em uma coluna, sem fotografia
// Fotografia opcional: public/assets/curriculo/foto-profissional.jpg
// Uso: (cd tools/resume && npm install) e depois `npm run resume` na raiz.
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeightRule,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TabStopType,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { resume, photo } from './content.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
mkdirSync(join(root, 'public', 'resume'), { recursive: true });
const out = (p) => join(root, 'public', p);

const FONT = 'Arial';
const SERIF = 'Georgia';
const SIDE = '24292F';
const GREY = '59636E';
const INK = '1F2328';
const RULE = 'D1D9E0';

/* -------------------- utilidades -------------------- */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: 19, color: INK, ...o });
const sp = (before = 0, after = 0) => ({ before, after });

/* -------------------- DOCX: duas colunas -------------------- */
function sideHeading(text) {
  return new Paragraph({
    spacing: sp(260, 90),
    keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '6E7781', space: 3 } },
    children: [run(text.toUpperCase(), { bold: true, size: 17, color: 'FFFFFF', characterSpacing: 24 })],
  });
}
const sideText = (text, o = {}) =>
  new Paragraph({ spacing: sp(0, 50), children: [run(text, { color: 'E6EDF3', size: 18, ...o })] });
const sideLink = (label, text, href) =>
  new Paragraph({
    spacing: sp(0, 70),
    children: [
      run(`${label}\n`, { color: 'AEB7C0', size: 16 }),
      new ExternalHyperlink({ link: href, children: [run(text, { color: 'FFFFFF', size: 18, underline: {} })] }),
    ],
  });

function mainHeading(text) {
  return new Paragraph({
    spacing: sp(280, 100),
    keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 3 } },
    children: [run(text.toUpperCase(), { bold: true, size: 18, characterSpacing: 24 })],
  });
}
const bullet = (t, size = 19) =>
  new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: sp(0, 40), children: [run(t, { size })] });

function sidebarChildren() {
  const c = [];
  if (photo) {
    const dim = jpegSize(photo) ?? { w: 3, h: 4 };
    const box = { w: 196, h: 240 };
    const k = Math.min(box.w / dim.w, box.h / dim.h);
    c.push(
      new Paragraph({
        spacing: sp(0, 200),
        children: [new ImageRun({ type: 'jpg', data: photo, transformation: { width: Math.round(dim.w * k), height: Math.round(dim.h * k) } })],
      }),
    );
  }
  c.push(
    new Paragraph({ spacing: sp(0, 60), children: [run(resume.name, { font: SERIF, size: 42, color: 'FFFFFF' })] }),
    new Paragraph({ spacing: sp(0, 40), children: [run(resume.title, { bold: true, size: 20, color: 'FFFFFF' })] }),
    new Paragraph({ spacing: sp(0, 0), children: [run(resume.areas.replaceAll(' · ', ' / '), { size: 16, color: 'AEB7C0' })] }),
    sideHeading('Contato'),
    sideText(resume.location),
  );
  resume.contact.forEach((x) => c.push(sideLink(x.label, x.text, x.href)));
  c.push(sideHeading('Competências'));
  resume.skills.forEach((s) => {
    c.push(new Paragraph({ spacing: sp(70, 20), keepNext: true, children: [run(s.group, { bold: true, size: 17, color: 'FFFFFF' })] }));
    c.push(sideText(s.items.join(', '), { size: 17 }));
  });
  if (resume.languages.length) {
    c.push(sideHeading('Idiomas'));
    resume.languages.forEach((l) => c.push(sideText(l)));
  }
  return c;
}

function mainChildren() {
  const c = [mainHeading('Perfil profissional'), new Paragraph({ spacing: sp(0, 40), children: [run(resume.summary)] })];
  c.push(mainHeading('Formação acadêmica'));
  for (const e of resume.education) {
    c.push(
      new Paragraph({
        spacing: sp(e.featured ? 80 : 60, 20),
        keepNext: true,
        children: [run(e.title, { bold: true, size: e.featured ? 24 : 19 }), run(`  ${e.status}`, { color: GREY, size: 18 })],
      }),
    );
    if (e.institution) c.push(new Paragraph({ spacing: sp(0, 20), children: [run(e.institution, { bold: e.featured })] }));
    e.dates.forEach((d) => c.push(new Paragraph({ spacing: sp(0, 20), children: [run(d, { color: GREY, size: 18 })] })));
  }
  c.push(mainHeading('Projetos selecionados'));
  for (const p of resume.projects) {
    c.push(
      new Paragraph({ spacing: sp(70, 20), keepNext: true, children: [run(p.title, { bold: true }), run(`  ${p.kind}`, { color: GREY, size: 18 })] }),
      new Paragraph({ spacing: sp(0, 20), children: [run(p.text)] }),
      new Paragraph({ spacing: sp(0, 40), children: [run(`${p.stackLabel}: `, { bold: true, color: GREY, size: 18 }), run(p.stack, { color: GREY, size: 18 })] }),
    );
  }
  return c;
}

const numbering = {
  config: [
    {
      reference: 'bullets',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 340, hanging: 220 } } } }],
    },
  ],
};

const SIDE_W = 3900;
const MAIN_W = 11906 - SIDE_W;
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const twoCol = new Document({
  creator: resume.name,
  title: `${resume.name} — Currículo`,
  styles: { default: { document: { run: { font: FONT, size: 19 } } } },
  numbering,
  sections: [
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: [
        new Table({
          width: { size: 11906, type: WidthType.DXA },
          columnWidths: [SIDE_W, MAIN_W],
          layout: TableLayoutType.FIXED,
          borders: { ...noBorders, insideHorizontal: noBorder, insideVertical: noBorder },
          rows: [
            new TableRow({
              height: { value: 16760, rule: HeightRule.ATLEAST },
              children: [
                new TableCell({
                  width: { size: SIDE_W, type: WidthType.DXA },
                  shading: { type: ShadingType.CLEAR, fill: SIDE, color: 'auto' },
                  margins: { top: 620, bottom: 400, left: 420, right: 320 },
                  borders: noBorders,
                  verticalAlign: VerticalAlign.TOP,
                  children: sidebarChildren(),
                }),
                new TableCell({
                  width: { size: MAIN_W, type: WidthType.DXA },
                  margins: { top: 620, bottom: 400, left: 520, right: 560 },
                  borders: noBorders,
                  verticalAlign: VerticalAlign.TOP,
                  children: mainChildren(),
                }),
              ],
            }),
          ],
        }),
        new Paragraph({ spacing: sp(0, 0), children: [new TextRun({ text: '', size: 2 })] }),
      ],
    },
  ],
});
writeFileSync(out(resume.files.docx.path), await Packer.toBuffer(twoCol));
console.log('DOCX:', out(resume.files.docx.path));

/* -------------------- DOCX ATS: uma coluna, sem fotografia -------------------- */
const atsRun = (t, o = {}) => new TextRun({ text: t, font: FONT, size: 20, ...o });
const atsHeading = (t) =>
  new Paragraph({
    spacing: sp(240, 80),
    keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF', space: 2 } },
    children: [atsRun(t.toUpperCase(), { bold: true, characterSpacing: 20 })],
  });
const atsBullet = (t) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: sp(0, 40), children: [atsRun(t)] });

const ats = [
  new Paragraph({ spacing: sp(0, 40), children: [atsRun(resume.name, { bold: true, size: 36, font: SERIF })] }),
  new Paragraph({ spacing: sp(0, 40), children: [atsRun(resume.areas, { color: GREY })] }),
  new Paragraph({
    spacing: sp(0, 100),
    children: [
      atsRun(`${resume.location}  |  `, { color: GREY }),
      ...resume.contact.flatMap((x, i) => [
        ...(i ? [atsRun('  |  ', { color: GREY })] : []),
        new ExternalHyperlink({ link: x.href, children: [atsRun(x.text, { color: '0B5CAD', underline: {} })] }),
      ]),
    ],
  }),
  atsHeading('Resumo profissional'),
  new Paragraph({ spacing: sp(0, 60), children: [atsRun(resume.summary)] }),
];
ats.push(atsHeading('Formação acadêmica'));
for (const e of resume.education) {
  ats.push(
    new Paragraph({
      spacing: sp(60, 20),
      keepNext: true,
      children: [atsRun(e.title, { bold: true }), ...(e.institution ? [atsRun(` — ${e.institution}`)] : []), atsRun(` — ${e.status}`, { color: GREY })],
    }),
  );
  e.dates.forEach((d) => ats.push(new Paragraph({ spacing: sp(0, 20), children: [atsRun(d, { color: GREY })] })));
}
ats.push(atsHeading('Projetos selecionados'));
for (const p of resume.projects) {
  ats.push(
    new Paragraph({ spacing: sp(80, 20), keepNext: true, children: [atsRun(p.title, { bold: true }), atsRun(` — ${p.kind}`, { color: GREY })] }),
    new Paragraph({ spacing: sp(0, 20), children: [atsRun(p.text)] }),
    new Paragraph({ spacing: sp(0, 40), children: [atsRun(`${p.stackLabel}: `, { bold: true, color: GREY }), atsRun(p.stack, { color: GREY })] }),
  );
}
ats.push(atsHeading('Competências'));
resume.skills.forEach((s) => ats.push(new Paragraph({ spacing: sp(0, 40), children: [atsRun(`${s.group}: `, { bold: true }), atsRun(s.items.join(', '))] })));
if (resume.languages.length) {
  ats.push(atsHeading('Idiomas'));
  resume.languages.forEach((l) => ats.push(new Paragraph({ children: [atsRun(l)] })));
}

const atsDoc = new Document({
  creator: resume.name,
  title: `${resume.name} — Currículo (ATS)`,
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  numbering,
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1134, right: 1134 } } }, children: ats }],
});
writeFileSync(out(resume.files.ats.path), await Packer.toBuffer(atsDoc));
console.log('ATS :', out(resume.files.ats.path));

/* -------------------- PDF: HTML → Chrome/Edge headless -------------------- */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const photoTag = photo ? `<img class="photo" alt="" src="data:image/jpeg;base64,${photo.toString('base64')}">` : '';

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(resume.name)} — Currículo</title>
<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html { background: linear-gradient(90deg, #${SIDE} 0, #${SIDE} 66mm, #ffffff 66mm); }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 9.2pt; line-height: 1.38; color: #${INK}; }
.page { display: grid; grid-template-columns: 66mm 1fr; }
.side { color: #e6edf3; padding: 11mm 7mm 8mm 8mm; font-size: 8.6pt; }
.main { padding: 11mm 11mm 8mm 10mm; }
.photo { display: block; width: 100%; height: auto; aspect-ratio: 1 / 1; object-fit: cover; object-position: center top; margin: 0 0 5mm; }
h1 { font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: 19pt; line-height: 1.08; margin: 0 0 3mm; color: #fff; }
.title { font-weight: 700; color: #fff; font-size: 9.6pt; margin: 0 0 1mm; }
.areas { color: #aeb7c0; font-size: 7.8pt; margin: 0; }
.side h2 { font-size: 7.8pt; letter-spacing: 1.2pt; text-transform: uppercase; color: #fff; margin: 6.5mm 0 2.4mm; padding-bottom: 1.2mm; border-bottom: 0.5pt solid #6e7781; }
.side p { margin: 0 0 1.6mm; }
.side .label { display: block; font-size: 7.4pt; color: #aeb7c0; }
.side a { color: #fff; text-decoration: underline; text-underline-offset: 1pt; }
.side h3 { font-size: 8pt; color: #fff; margin: 2.6mm 0 0.6mm; }
.side .skills { color: #cdd5dd; font-size: 8.2pt; margin: 0; }
.main h2 { font-size: 8.6pt; letter-spacing: 1.2pt; text-transform: uppercase; margin: 6.5mm 0 2.4mm; padding-bottom: 1.2mm; border-bottom: 0.7pt solid #${RULE}; break-after: avoid; }
.main h2:first-child { margin-top: 0; }
.main p { margin: 0 0 1.4mm; }
.row { display: flex; justify-content: space-between; gap: 4mm; break-after: avoid; }
.when, .muted { color: #${GREY}; }
.when { white-space: nowrap; font-size: 8.6pt; }
ul { margin: 1mm 0 0; padding-left: 4.2mm; }
li { margin: 0 0 0.7mm; }
.item { break-inside: avoid; margin-bottom: 2.6mm; }
.edu-main { font-size: 12pt; }
.small { font-size: 8.6pt; }
</style></head><body><div class="page">
<aside class="side">
${photoTag}
<h1>${esc(resume.name)}</h1>
<p class="title">${esc(resume.title)}</p>
<p class="areas">${esc(resume.areas.replaceAll(' · ', ' / '))}</p>
<h2>Contato</h2>
<p>${esc(resume.location)}</p>
${resume.contact.map((c) => `<p><span class="label">${esc(c.label)}</span><a href="${esc(c.href)}">${esc(c.text).replaceAll("/", "/<wbr>")}</a></p>`).join('\n')}
<h2>Competências</h2>
${resume.skills.map((s) => `<h3>${esc(s.group)}</h3><p class="skills">${esc(s.items.join(', '))}</p>`).join('\n')}
${resume.languages.length ? `<h2>Idiomas</h2>${resume.languages.map((l) => `<p>${esc(l)}</p>`).join('')}` : ''}
</aside>
<main class="main">
<h2>Perfil profissional</h2>
<p>${esc(resume.summary)}</p>
<h2>Formação acadêmica</h2>
${resume.education
  .map(
    (e) => `<div class="item"><p>${e.featured ? `<strong class="edu-main">${esc(e.title)}</strong>` : `<strong>${esc(e.title)}</strong>`} <span class="muted small">${esc(e.status)}</span></p>${e.institution ? `<p${e.featured ? ' style="font-weight:700"' : ''}>${esc(e.institution)}</p>` : ''}${e.dates.map((d) => `<p class="muted small">${esc(d)}</p>`).join('')}</div>`,
  )
  .join('\n')}
<h2>Projetos selecionados</h2>
${resume.projects
  .map(
    (p) => `<div class="item"><p><strong>${esc(p.title)}</strong> <span class="muted small">${esc(p.kind)}</span></p><p>${esc(p.text)}</p><p class="muted small"><strong>${esc(p.stackLabel)}:</strong> ${esc(p.stack)}</p></div>`,
  )
  .join('\n')}
</main></div></body></html>`;

const work = join(tmpdir(), 'resume-build');
mkdirSync(work, { recursive: true });
const htmlPath = join(work, 'curriculo.html');
writeFileSync(htmlPath, html, 'utf8');
if (process.env.RESUME_HTML_OUT) writeFileSync(process.env.RESUME_HTML_OUT, html, 'utf8');
const pdfPath = out(resume.files.pdf.path);

const browsers = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error('Chrome/Edge não encontrado para gerar o PDF.');
const r = spawnSync(
  browser,
  ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${join(work, 'profile')}`, `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href],
  { encoding: 'utf8' },
);
if (r.status !== 0 || !existsSync(pdfPath)) throw new Error(`Falha ao gerar PDF: ${r.stderr}`);
rmSync(work, { recursive: true, force: true });
console.log('PDF :', pdfPath, photo ? '(com fotografia)' : '(sem fotografia)');
