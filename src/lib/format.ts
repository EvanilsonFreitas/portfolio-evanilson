const int = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const dec1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const fmtInt = (n: number) => int.format(n);
export const fmtDec1 = (n: number) => dec1.format(n);
export const fmtBRL = (n: number) => brl.format(n);
/** Fração (0–1) como percentual com uma casa decimal. */
export const fmtPct = (fraction: number) => `${dec1.format(fraction * 100)}%`;
