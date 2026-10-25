/**
 * Vocabulário controlado do catálogo de projetos. Categorias, tipos de solução e tecnologias são
 * normalizados aqui; os testes impedem que um projeto use um valor fora desta lista.
 */

export const categories = [
  { id: 'bi-comercial', label: 'BI Comercial' },
  { id: 'bi-operacional', label: 'BI Operacional' },
  { id: 'excel-automacao', label: 'Excel e Automação' },
  { id: 'sql-dados', label: 'SQL / Engenharia de Dados' },
  { id: 'software', label: 'Software / Aplicações' },
  { id: 'integracoes-processos', label: 'Integrações e Processos' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export const solutionTypes = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'automacao', label: 'Automação' },
  { id: 'sistema', label: 'Sistema' },
  { id: 'engenharia-dados', label: 'Engenharia de dados' },
  { id: 'aplicacao-corporativa', label: 'Aplicação corporativa' },
  { id: 'relatorio-gerencial', label: 'Relatório gerencial' },
  { id: 'inteligencia-comercial', label: 'Inteligência comercial' },
  { id: 'inteligencia-operacional', label: 'Inteligência operacional' },
  { id: 'estudo', label: 'Estudo técnico' },
] as const;

export type SolutionTypeId = (typeof solutionTypes)[number]['id'];

/** Somente tecnologias confirmadas para pelo menos um item do catálogo. */
export const technologies = [
  { id: 'power-bi', label: 'Power BI' },
  { id: 'dax', label: 'DAX' },
  { id: 'excel', label: 'Excel' },
  { id: 'vba', label: 'VBA' },
  { id: 'power-query', label: 'Power Query (M)' },
  { id: 'power-pivot', label: 'Power Pivot' },
  { id: 'tabelas-dinamicas', label: 'Tabelas Dinâmicas' },
  { id: 'python', label: 'Python' },
  { id: 'sql-server', label: 'SQL Server' },
  { id: 'sharepoint', label: 'SharePoint' },
  { id: 'power-automate', label: 'Power Automate' },
  { id: 'fastapi', label: 'FastAPI' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'iis', label: 'IIS' },
] as const;

export type TechId = (typeof technologies)[number]['id'];

export const categoryLabel = (id: CategoryId): string => categories.find((c) => c.id === id)!.label;
export const solutionTypeLabel = (id: SolutionTypeId): string => solutionTypes.find((t) => t.id === id)!.label;
export const techLabel = (id: TechId): string => technologies.find((t) => t.id === id)!.label;
