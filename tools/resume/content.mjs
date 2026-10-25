// Monta o conteúdo do currículo a partir das mesmas fontes do site (src/content).
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, resumeFiles } from '../../src/content/site.ts';
import { education } from '../../src/content/education.ts';
import { expertise } from '../../src/content/expertise.ts';
import { projects } from '../../src/content/projects.ts';
import { studies } from '../../src/content/studies.ts';

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
  areas: site.titleComplement,
  location: site.location,
  contact: [
    { label: 'E-mail', text: site.email, href: `mailto:${site.email}` },
    ...(site.phone ? [{ label: 'Telefone', text: site.phone, href: `tel:${site.phone.replace(/[^+d]/g, '')}` }] : []),
    { label: 'LinkedIn', text: display(site.linkedin), href: site.linkedin },
    { label: 'GitHub', text: display(site.github), href: site.github },
    { label: 'Portfólio', text: display(PORTFOLIO), href: PORTFOLIO },
  ],
  summary: site.resumeSummary,
  projects: resumeProjects(),
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

/**
 * Projetos do currículo, em ordem de prioridade. Marivan Finance não entra nos currículos
 * (permanece no site). Entradas de estudo usam o resumo e a natureza do próprio estudo.
 */
function resumeProjects() {
  const byProject = (slug) => {
    const p = projects.find((x) => x.slug === slug);
    return {
      title: p.title,
      kind: p.natureLabel,
      text: [p.summary, projectNote[p.nature], p.stackNote ? 'Demonstração implementada em TypeScript, React e SVG.' : ''].filter(Boolean).join(' '),
      stackLabel: p.stackNote ? 'Conceitos e ferramentas' : 'Tecnologias',
      stack: p.stack.join(', '),
    };
  };
  const byStudy = (slug, stack) => {
    const st = studies.find((x) => x.slug === slug);
    return { title: st.title, kind: st.natureLabel, text: st.summary, stackLabel: 'Conceitos e ferramentas', stack };
  };
  return [
    byProject('simulador-preco-rodoviario'),
    byStudy('inteligencia-comercial-crm', 'Modelagem dimensional, DAX, Power BI, indicadores comerciais'),
    byProject('bi-operacional-logistica'),
    byStudy('normalizacao-cidades-ibge', 'Python, normalização de texto, similaridade, SQL'),
  ];
}
