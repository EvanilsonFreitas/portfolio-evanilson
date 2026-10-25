export const site = {
  name: 'Evanilson Freitas',
  fullName: 'Evanilson Pereira de Freitas',
  location: 'São Paulo — SP, Brasil',
  areas: 'Business Intelligence · Inteligência de Negócios · Engenharia de Software',
  email: 'Evanilson.2631@outlook.com',
  /** Telefone e WhatsApp confirmados pelo titular. Site e currículos leem estes campos. */
  phone: '+55 11 96463-9228',
  whatsapp: 'https://wa.me/5511964639228',
  linkedin: 'https://www.linkedin.com/in/evanilson-p-freitas-303889350/',
  github: 'https://github.com/EvanilsonFreitas',
  headline: 'Transformo desafios de negócio em soluções de dados e software.',
  summary:
    'Compreendo os processos de negócio, identifico oportunidades e desenvolvo soluções de dados, automação e software que as transformam em aplicações e em inteligência para decisão.',
  resumeSummary:
    'Profissional de Business Intelligence e Engenharia de Software, com formação em Análise e Desenvolvimento de Sistemas (Uninove) e MBA em Data Science (USP/ESALQ). Conecta processos de negócio a soluções de dados, automação e software: BI comercial e operacional, precificação, integrações entre sistemas e aplicações web, com projetos em Python, FastAPI, SQL Server, TypeScript e React, e noções de hospedagem em Windows Server e IIS.',
  title: 'Business Intelligence',
  titleComplement: 'Data Science · Engenharia de Software · Inteligência de Negócios',
  photo: '/assets/perfil/evanilson-freitas.jpg',
} as const;

/** Caminhos dos currículos (relativos a /public). Única fonte para o site e para o gerador. */
export const resumeFiles = {
  pdf: { path: '/resume/Evanilson_Freitas_Curriculo.pdf', label: 'PDF' },
  docx: { path: '/resume/Evanilson_Freitas_Curriculo.docx', label: 'Word' },
  ats: { path: '/resume/Evanilson_Freitas_Curriculo_ATS.docx', label: 'Word (ATS)' },
} as const;

/** Diploma da graduação (publicação autorizada pelo titular). */
export const diplomaFile = { path: '/documents/diploma-ads-uninove.pdf', label: 'Diploma — Análise e Desenvolvimento de Sistemas (Uninove)' } as const;

/** URL pública do destino do build (definida em next.config.ts; padrão: GitHub Pages). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://evanilsonfreitas.github.io/portfolio-evanilson').replace(/\/$/, '');
