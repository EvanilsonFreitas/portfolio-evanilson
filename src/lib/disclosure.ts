/**
 * Estado de um controle expansível. `chosen` é a escolha explícita da pessoa (indefinida até o primeiro
 * clique); `wide` é a tela larga, que define o padrão: aberto em telas largas e recolhido nas estreitas.
 */
export function isOpen(chosen: boolean | undefined, wide: boolean): boolean {
  return chosen ?? wide;
}

/** Texto do botão para cada estado. */
export const disclosureLabels = { closed: 'Ver responsabilidades', open: 'Ocultar responsabilidades' } as const;
