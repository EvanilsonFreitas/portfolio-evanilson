import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';

/** Display editorial: títulos grandes e citações. */
export const display = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

/** Interface e texto corrido. */
export const sans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

/** Dados, datas, rótulos técnicos e código. */
export const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
