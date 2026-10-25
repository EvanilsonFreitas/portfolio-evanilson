const int = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const dec1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const brlCompact = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 });

export const fmtInt = (n: number) => int.format(n);
export const fmtDec1 = (n: number) => dec1.format(n);
export const fmtBRL = (n: number) => brl.format(n);
/** Valor abreviado (ex.: R$ 6,2 mi) para indicadores em cartões estreitos. */
export const fmtBRLCompact = (n: number) => brlCompact.format(n);
/** Fração (0–1) como percentual com uma casa decimal. */
export const fmtPct = (fraction: number) => `${dec1.format(fraction * 100)}%`;
