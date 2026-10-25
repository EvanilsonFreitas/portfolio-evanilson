// Monta o conteúdo do currículo a partir das mesmas fontes do site (src/content).
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, resumeFiles } from '../../src/content/site.ts';
import { education } from '../../src/content/education.ts';
import { employment } from '../../src/content/career.ts';
import { sortEmployment, sortRoles } from '../../src/lib/career.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const display = (url) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
const PORTFOLIO = 'https://evanilsonfreitas.github.io/portfolio-evanilson/';

/**
 * Fotografia do currículo. A imagem principal é public/resume/Foto_Curriculo.jpg; sem ela, usa a anterior
 * (public/assets/curriculo/foto-profissional.jpg). Nos dois casos a imagem entra apenas dentro do PDF e do
 * DOCX de duas colunas: o build do site a remove dos artefatos publicados.
 */
export const photoPath = [join(root, 'public', 'resume', 'Foto_Curriculo.jpg'), join(root, 'public', 'assets', 'curriculo', 'foto-profissional.jpg')].find(existsSync);

/** Recorte quadrado a partir do topo (rosto), igual ao enquadramento do PDF; sem esticar nem alterar a imagem. */
async function squareFromTop(file) {
  const sharp = createRequire(join(root, 'package.json'))('sharp');
  const { width, height } = await sharp(file).metadata();
  const side = Math.min(width, height);
  return sharp(file).extract({ left: Math.round((width - side) / 2), top: 0, width: side, height: side }).jpeg({ quality: 92 }).toBuffer();
}
export const photo = photoPath ? await squareFromTop(photoPath) : null;

export const resume = {
  files: resumeFiles,
  name: site.fullName,
  title: site.title,
  areas: site.titleComplement,
  location: site.location,
  contact: [
    { label: 'E-mail', text: site.email, href: `mailto:${site.email}` },
    ...(site.phone ? [{ label: 'Telefone', text: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, '')}` }] : []),
    { label: 'LinkedIn', text: display(site.linkedin), href: site.linkedin },
    { label: 'GitHub', text: display(site.github), href: site.github },
    { label: 'Portfólio', text: display(PORTFOLIO), href: PORTFOLIO },
  ],
  summary: site.resumeSummary,
  experience: resumeExperience(),
  projects: resumeProjects(),
  skills: [
    { group: 'Business Intelligence', items: ['Power BI', 'DAX', 'Power Query', 'Modelagem dimensional', 'Data visualization', 'UX/UI de dashboards'] },
    { group: 'Dados e SQL', items: ['SQL Server', 'T-SQL', 'Procedures e views', 'ETL', 'Python'] },
    { group: 'Engenharia de Software', items: ['Python', 'FastAPI', 'TypeScript', 'React', 'Next.js', 'C#', 'ASP.NET Core', 'APIs REST'] },
    { group: 'Automação e integrações', items: ['Power Automate', 'REST', 'CRM', 'ERP e TMS'] },
    { group: 'Infraestrutura e entrega', items: ['IIS', 'Windows Server', 'Proxy reverso', 'Git', 'CI/CD (conceitos)', 'Azure e Azure DevOps (estudo)'] },
  ],
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
 * Projetos do currículo, em ordem de prioridade. O projeto de gestão financeira não entra nos currículos
 * (permanece no site). Os textos descrevem a atuação em BI com as ferramentas de BI;
 * o demonstrador do portfólio (TypeScript, React e SVG) não é citado aqui.
 */
function resumeProjects() {
  return [
    {
      title: 'BI operacional',
      kind: 'Business Intelligence',
      text: 'Soluções de inteligência operacional: produtividade, coleta e entrega, SLA, extravio e avaria, ocorrências, qualidade e metas por filial, com visão executiva. Dados e telas não públicos.',
      stackLabel: 'Ferramentas',
      stack: 'Power BI, DAX, Power Query, SQL, modelagem dimensional, data visualization, UX/UI',
    },
    {
      title: 'BI comercial',
      kind: 'Business Intelligence',
      text: 'Inteligência comercial: funil e oportunidades, hit rate, tracker comercial, price e frete por kg, margem e rentabilidade. Dados e telas não públicos.',
      stackLabel: 'Ferramentas',
      stack: 'Power BI, DAX, Power Query, SQL Server, CRM, Power Automate, storytelling com dados',
    },
    {
      title: 'EasyPrice',
      kind: 'Corporativo',
      text: 'Plataforma web de simulação de preços de frete rodoviário (LTL e FTL), com regras de pricing, API, banco e hospedagem em ambiente Windows com IIS. Código e dados não públicos.',
      stackLabel: 'Tecnologias',
      stack: 'Python, FastAPI, Next.js, React, TypeScript, SQL Server, IIS',
    },
    {
      title: 'Normalização de municípios',
      kind: 'Módulo do EasyPrice',
      text: 'Conciliação de cidades digitadas com a base oficial de municípios, usando regras, aliases e similaridade de texto, com referência do IBGE e confirmação quando há dúvida.',
      stackLabel: 'Tecnologias',
      stack: 'Python, normalização de texto, similaridade, SQL',
    },
  ];
}

function month(ym) {
  const [y, m] = ym.split('-');
  return `${['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][Number(m) - 1]}/${y}`;
}

/**
 * Experiência profissional, em ordem cronológica inversa, a partir do histórico formal do site.
 * Períodos simultâneos e separados são preservados exatamente como cadastrados.
 */
function resumeExperience() {
  return sortEmployment(employment).map((e) => ({
    company: e.company.name,
    location: e.location,
    areas: e.areas?.join(' · '),
    roles: sortRoles(e.roles).map((r) => ({
      title: r.title,
      period: `${month(r.period.start)} – ${r.period.end ? month(r.period.end) : 'atual'}`,
      meta: [r.type, r.mode, r.location].filter(Boolean).join(' · '),
      bullets: r.responsibilities ?? [],
      skills: r.technologies?.join(', '),
    })),
  }));
}
