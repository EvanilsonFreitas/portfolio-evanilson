/**
 * Atribuições profissionais confirmadas pelo proprietário como INCORRETAS.
 * Nenhum texto publicável (site, metadados, artigos, currículos) pode afirmá-las.
 * Usado por `src/lib/identity.test.ts` e por `tools/check-links.mjs`.
 */
export const incorrectClaims: { id: string; pattern: RegExp }[] = [
  { id: 'empresa-expresso', pattern: /Expresso\s+Rio\s+Vermelho/i },
  { id: 'empresa-red-cargas', pattern: /Red\s+Cargas/i },
  { id: 'mestrado-engenharia-software', pattern: /Mestrado\s+em\s+Engenharia\s+de\s+Software/i },
  { id: 'cargo-analista-controladoria', pattern: /Analista\s+de\s+Controladoria/i },
  // Dados confidenciais: nomes de sistemas internos não são publicados. (Tragetta, Solistica e Transface
  // são empregadores informados pelo proprietário e constam do histórico formal.)
  { id: 'confidencial-zeus', pattern: /\bZeus\b/ },
  // Contato: o e-mail validado é o Outlook; o endereço anterior não deve reaparecer.
  { id: 'email-anterior', pattern: /Evanilson.2631@hotmail/i },
  // Títulos formais que o proprietário não declarou.
  { id: 'titulo-dba', pattern: /\bDBA\b/ },
  { id: 'titulo-arquiteto', pattern: /Arquiteto\s+de\s+(Software|Solu[çc][õo]es|Dados)/i },
  { id: 'titulo-tech-lead', pattern: /\bTech\s+Lead\b|\bHead\s+of\s+[A-Z]/ },
];

export function findIncorrectClaims(text: string): string[] {
  return incorrectClaims.filter((c) => c.pattern.test(text)).map((c) => c.id);
}
