import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EXAMPLES, editDistance, matchCity, normalizeText, similarity, splitUf } from './cities.ts';

test('normaliza acentos, caixa, pontuação e conectivos', () => {
  assert.equal(normalizeText('São José dos Campos'), 'sao jose campos');
  assert.equal(normalizeText('S. Paulo'), 'sao paulo');
  assert.equal(normalizeText('  NITERÓI  '), 'niteroi');
});

test('separa a UF apenas quando é uma UF conhecida', () => {
  assert.deepEqual(splitUf('Santos - SP'), { name: 'Santos', uf: 'SP' });
  assert.deepEqual(splitUf('Santos/sp'), { name: 'Santos', uf: 'SP' });
  assert.deepEqual(splitUf('Rio de Janeiro'), { name: 'Rio de Janeiro' });
});

test('distância de edição e similaridade', () => {
  assert.equal(editDistance('kitten', 'sitting'), 3);
  assert.equal(similarity('abc', 'abc'), 1);
  assert.ok(similarity('abc', 'xyz') < 0.1);
});

test('correspondência exata após normalização', () => {
  const r = matchCity('sao paulo');
  assert.equal(r.status, 'exata');
  assert.equal(r.match?.name, 'São Paulo');
});

test('erro de digitação pequeno é aceito como aproximada', () => {
  const r = matchCity('Curitba');
  assert.equal(r.status, 'aproximada');
  assert.equal(r.match?.name, 'Curitiba');
});

test('a UF informada restringe os candidatos', () => {
  const r = matchCity('Niteroi - RJ');
  assert.equal(r.status, 'exata');
  assert.equal(r.match?.uf, 'RJ');
  assert.equal(matchCity('Santos - RJ').status, 'sem-correspondencia');
});

test('nome sem semelhança não é forçado a uma cidade', () => {
  const r = matchCity('Atlântida');
  assert.equal(r.status, 'sem-correspondencia');
  assert.equal(r.match, undefined);
});

test('entrada vazia é tratada', () => {
  assert.equal(matchCity('   ').status, 'vazio');
});

test('todos os exemplos produzem um estado definido e são determinísticos', () => {
  for (const e of EXAMPLES) {
    assert.deepEqual(matchCity(e), matchCity(e));
    assert.notEqual(matchCity(e).status, 'vazio');
  }
});
