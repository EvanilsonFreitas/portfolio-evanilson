/**
 * Atribuições profissionais confirmadas pelo proprietário como INCORRETAS.
 * Nenhum texto publicável (site, metadados, artigos, currículos) pode afirmá-las.
 * Usado por `src/lib/identity.test.ts` e por `tools/check-links.mjs`.
 */
export const incorrectClaims: { id: string; pattern: RegExp }[] = [
  { id: 'empresa-expresso', pattern: /Expresso\s+Rio\s+Vermelho/i },
  { id: 'empresa-red-cargas', pattern: /Red\s+Cargas/i },
  { id: 'cargo-analista-controladoria', pattern: /Analista\s+de\s+Controladoria/i },
];

export function findIncorrectClaims(text: string): string[] {
  return incorrectClaims.filter((c) => c.pattern.test(text)).map((c) => c.id);
}
