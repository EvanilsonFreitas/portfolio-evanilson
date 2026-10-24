export const site = {
  name: 'Evanilson Freitas',
  fullName: 'Evanilson Pereira de Freitas',
  location: 'São Paulo — SP, Brasil',
  areas: 'Business Intelligence · Data Science · Software Engineering',
  email: 'Evanilson.2631@hotmail.com',
  linkedin: 'https://www.linkedin.com/in/evanilson-p-freitas-303889350/',
  github: 'https://github.com/EvanilsonFreitas',
  headline: 'Transformo desafios de negócio em soluções de dados e software.',
  summary:
    'Desenvolvo soluções de dados e software, da modelagem e da análise à aplicação web. Graduado em Análise e Desenvolvimento de Sistemas.',
  resumeSummary:
    'Profissional de dados e software, com formação em Análise e Desenvolvimento de Sistemas (Uninove) e MBA em Data Science (USP/ESALQ). Desenvolve soluções de Business Intelligence, análise de dados e aplicações web, com projetos em Python, SQL Server, TypeScript, React e ASP.NET Core.',
  title: 'Dados e Software',
} as const;

/** Caminhos dos currículos (relativos a /public). Única fonte para o site e para o gerador. */
export const resumeFiles = {
  pdf: { path: '/resume/Evanilson_Freitas_Curriculo.pdf', label: 'PDF' },
  docx: { path: '/resume/Evanilson_Freitas_Curriculo.docx', label: 'Word' },
  ats: { path: '/resume/Evanilson_Freitas_Curriculo_ATS.docx', label: 'Word (ATS)' },
} as const;

/** URL pública do destino do build (definida em next.config.ts; padrão: GitHub Pages). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://evanilsonfreitas.github.io/portfolio-evanilson').replace(/\/$/, '');
