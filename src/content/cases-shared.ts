import type { Block, Pending, PendingKind, Section } from './types.ts';

export const CORPORATE = 'Projeto corporativo';

export function p(text: string): Block {
  return { kind: 'p', text };
}

export function list(items: string[], title?: string): Block {
  return { kind: 'list', title, items };
}

export function table(head: string[], rows: string[][], title?: string): Block {
  return { kind: 'table', title, head, rows };
}

export function sec(title: string, ...blocks: Block[]): Section {
  return { title, blocks };
}

/**
 * Limites reais da solução (o que ela não é ou não afirma). Só entra na página quando há um limite técnico
 * a informar; incertezas de documentação ficam em `pending` e vão para docs/PROJETOS.md.
 */
export function limits(...items: string[]): Section {
  return { title: 'Escopo e limites', blocks: [list(items)] };
}

/** Atalhos para as pendências internas, classificadas por impacto na publicação. */
export const pend = (kind: PendingKind, text: string): Pending => ({ kind, text });
export const open = (text: string): Pending => pend('nao-bloqueante', text);
export const decide = (text: string): Pending => pend('decisao', text);
