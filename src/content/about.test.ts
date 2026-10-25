import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { about } from './about.ts';
import { site } from './site.ts';
import { findIncorrectClaims } from './identity-guard.ts';
import { disclosureLabels, isOpen } from '../lib/disclosure.ts';

const read = (p: string) => readFileSync(fileURLToPath(new URL(`../../${p}`, import.meta.url)), 'utf8');
const text = about.paragraphs.join(' ');

test('a apresentação pessoal tem a saudação aprovada, o emoji e o texto autorizado', () => {
  assert.equal(about.greeting, 'Olá, prazer. Sou o Evanilson.');
  assert.equal(about.title, 'Muito além da tecnologia.');
  assert.equal(about.emoji, '👋');
  for (const k of ['operação logística', 'Excel', 'Hoje atuo em Business Intelligence', 'precificação', 'Uninove', 'USP/ESALQ', 'MBA em Data Science', 'entender como o negócio funciona']) assert.ok(text.includes(k), k);
  assert.ok(text.includes(about.highlight), 'o destaque deve existir no texto');
});

test('a apresentação é breve e não inventa idade nem dados pessoais', () => {
  const words = text.split(/\s+/).length;
  assert.ok(words >= 80 && words <= 130, `palavras: ${words}`);
  assert.ok(!/\b\d{1,2} anos de idade\b|nasci|nascido|\bidade\b/i.test(text));
  assert.ok(!/apaixonad|visionári|disruptiv|excel[êe]ncia|altamente qualificado/i.test(text), 'frases genéricas');
  assert.deepEqual(findIncorrectClaims(`${about.greeting} ${text}`), []);
});

test('a ordem narrativa da home e das seções de Sobre é preservada', () => {
  const page = read('src/app/page.tsx');
  const order = ['<Hero', '<About', '<EducationPreview', '<Business', '<Expertise', '<ProjectsPreview', '<Articles', '<Contact'].map((t) => page.indexOf(t));
  assert.ok(order.every((i) => i >= 0), 'componente ausente');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'ordem das seções alterada');
  const sobre = read('src/components/home/About.tsx');
  const ids = ['id="sobre"', 'id="trajetoria"', 'id="experiencia"'].map((t) => sobre.indexOf(t));
  assert.deepEqual([...ids].sort((a, b) => a - b), ids);
});

test('o CTA da apresentação aponta para a âncora real da trajetória', () => {
  const sobre = read('src/components/home/About.tsx');
  assert.ok(sobre.includes('href="#trajetoria"'));
  assert.ok(sobre.includes('id="trajetoria"'));
  assert.equal(about.cta, 'Conheça minha trajetória');
});

test('o emoji é decorativo (oculto de leitores de tela) e nenhum outro emoji foi adicionado', () => {
  const hero = read('src/components/home/Hero.tsx');
  assert.ok(/aria-hidden="true">\{about\.emoji\}/.test(hero));
  const emojis = (read('src/content/about.ts').match(/\p{Extended_Pictographic}/gu) ?? []).length;
  assert.equal(emojis, 1);
});

test('controle de responsabilidades: texto e estado coerentes (aberto em telas largas, recolhido nas estreitas)', () => {
  assert.equal(isOpen(undefined, true), true);
  assert.equal(isOpen(undefined, false), false);
  assert.equal(isOpen(false, true), false); // a escolha explícita prevalece
  assert.equal(isOpen(true, false), true);
  assert.equal(disclosureLabels.closed, 'Ver responsabilidades');
  assert.equal(disclosureLabels.open, 'Ocultar responsabilidades');
});

test('o Disclosure liga seta e rótulo ao estado e informa aria-expanded', () => {
  const src = read('src/components/ui/Disclosure.tsx');
  assert.ok(src.includes('aria-expanded={open}') && src.includes('aria-controls={panel}'));
  assert.ok(src.includes("auto ? 'md:rotate-180' : open ? 'rotate-180' : ''"), 'seta: para cima somente quando aberto');
  assert.ok(src.includes("className={auto ? 'max-md:hidden'"), 'padrão por CSS evita salto na hidratação');
  assert.ok(src.includes('<button') && src.includes('type="button"'));
});

test('a saudação abre o hero, antes das especialidades e da headline, e não se repete em Sobre', () => {
  const hero = read('src/components/home/Hero.tsx');
  const i = ['about.greeting', 'site.areas', '<h1'].map((t) => hero.indexOf(t));
  assert.ok(i.every((x) => x >= 0));
  assert.deepEqual([...i].sort((a, b) => a - b), i, 'ordem: saudação, especialidades, headline');
  assert.ok(hero.includes('Transformo desafios'), 'headline preservada');
  const sobre = read('src/components/home/About.tsx');
  assert.ok(!sobre.includes('about.greeting') && !sobre.includes('about.emoji'), 'saudação duplicada em Sobre');
  assert.ok(sobre.includes('{about.title}'));
});

test('a legenda da fotografia mostra localização e idade vindas da configuração central', () => {
  assert.equal(site.age, 26);
  assert.equal(site.location, 'São Paulo — SP, Brasil');
  const hero = read('src/components/home/Hero.tsx');
  assert.ok(hero.includes('{site.location} · {site.age} anos'));
  // Sem data de nascimento publicada nem cálculo automático de idade.
  assert.ok(!/birth|getFullYear\(\)|Date\.now/i.test(hero));
  assert.equal((hero.match(/\b26\b/g) ?? []).length, 0, 'idade fixa no componente');
});

test('o texto de Sobre não afirma mais a atuação atual em BI e Pricing; Pricing segue como experiência histórica', () => {
  assert.ok(!text.includes('Hoje atuo com BI e Pricing'));
  assert.ok(text.includes('Hoje atuo em Business Intelligence, aplicando minha experiência em análise de dados, inteligência comercial, precificação e desenvolvimento de software para construir soluções que apoiam decisões de negócio.'));
});
