export const site = {
  name: 'Evanilson Freitas',
  fullName: 'Evanilson Pereira de Freitas',
  location: 'São Paulo — SP, Brasil',
  /** Idade informada pelo proprietário. Valor estático (sem data de nascimento): atualizar aqui, em um único lugar. */
  age: 26,
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
    'Profissional de Business Intelligence com trajetória que integra operação logística, inteligência comercial, engenharia de dados e desenvolvimento de software. Atua na construção de soluções analíticas corporativas: modelagem dimensional, transformação e integração de dados, governança de indicadores e análises de produtividade, rentabilidade, precificação e desempenho, com Power BI, DAX, Power Query, SQL Server e Python. Participa do desenvolvimento de plataformas de precificação, automações e soluções orientadas a regras de negócio, com APIs em FastAPI e interfaces em React, Next.js e TypeScript. Conhece hospedagem em IIS e Windows Server e a arquitetura do ecossistema Microsoft Azure e Azure DevOps. Traduz problemas operacionais e comerciais complexos em soluções tecnológicas orientadas à decisão. MBA em Data Science pela USP/ESALQ.',
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
export const diplomaFile = { path: '/documents/diploma-ads-uninove.pdf', label: 'Diploma — Tecnologia em Análise e Desenvolvimento de Sistemas (Uninove)' } as const;

/** URL pública do destino do build (definida em next.config.ts; padrão: GitHub Pages). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://evanilsonfreitas.github.io/portfolio-evanilson').replace(/\/$/, '');
