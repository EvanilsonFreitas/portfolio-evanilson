// Monta o conteúdo do currículo a partir das mesmas fontes do site (src/content).
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, resumeFiles } from '../../src/content/site.ts';
import { education } from '../../src/content/education.ts';
import { expertise } from '../../src/content/expertise.ts';
import { projects } from '../../src/content/projects.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const display = (url) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
const PORTFOLIO = 'https://evanilsonfreitas.github.io/portfolio-evanilson/';

const projectNote = {
  corporate: 'Código e dados não públicos.',
  personal: 'Repositório privado.',
  demonstration: '',
};

/** Fotografia profissional opcional. Quando o arquivo existe, entra automaticamente nos documentos. */
export const photoPath = join(root, 'public', 'assets', 'curriculo', 'foto-profissional.jpg');
export const photo = existsSync(photoPath) ? readFileSync(photoPath) : null;

export const resume = {
  files: resumeFiles,
  name: site.fullName,
  title: site.title,
  areas: site.areas,
  location: site.location,
  contact: [
    { label: 'E-mail', text: site.email, href: `mailto:${site.email}` },
    { label: 'LinkedIn', text: display(site.linkedin), href: site.linkedin },
    { label: 'GitHub', text: display(site.github), href: site.github },
    { label: 'Portfólio', text: display(PORTFOLIO), href: PORTFOLIO },
  ],
  summary: site.resumeSummary,
  projects: projects.map((p) => ({
    title: p.title,
    kind: p.natureLabel,
    text: [p.summary, projectNote[p.nature], p.stackNote ? 'Demonstração implementada em TypeScript, React e SVG.' : ''].filter(Boolean).join(' '),
    stackLabel: p.stackNote ? 'Conceitos e ferramentas' : 'Tecnologias',
    stack: p.stack.join(', '),
  })),
  skills: expertise.map((p) => ({ group: p.title, items: p.tech })),
  education: education.map((e) => ({
    title: e.title,
    institution: e.institution,
    status: e.status,
    dates: e.dates,
    featured: e.kind === 'mba',
  })),
  languages: [], // Idiomas: sem comprovante, não publicados
};
