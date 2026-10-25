import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOME_SECTIONS, NAV, activeNavId, clickAction, currentSection, hashOf } from './navigation.ts';

test('todos os itens têm id único e destino iniciado em "/"', () => {
  assert.equal(new Set(NAV.map((n) => n.id)).size, NAV.length);
  for (const n of NAV) assert.ok(n.href.startsWith('/'), n.href);
});

test('a ordem do menu segue a ordem das seções da home', () => {
  assert.deepEqual(HOME_SECTIONS, ['inicio', 'sobre', 'trajetoria', 'formacao', 'atuacao', 'especialidades', 'projetos', 'artigos', 'contato']);
});

test('hashOf extrai o fragmento', () => {
  assert.equal(hashOf('/#projetos'), 'projetos');
  assert.equal(hashOf('/'), '');
});

test('na home, "Início" volta ao topo e as âncoras rolam sem recarregar', () => {
  assert.deepEqual(clickAction('/', '/'), { kind: 'top' });
  assert.deepEqual(clickAction('/', '/#especialidades'), { kind: 'section', id: 'especialidades' });
});

test('fora da home, o roteador navega (inclusive "Início" a partir de Artigos)', () => {
  assert.deepEqual(clickAction('/blog/', '/'), { kind: 'navigate' });
  assert.deepEqual(clickAction('/blog/x/', '/#especialidades'), { kind: 'navigate' });
  assert.deepEqual(clickAction('/projetos/', '/#contato'), { kind: 'navigate' });
});

test('a seção atual é a última acima da linha de leitura', () => {
  const tops = [
    { id: 'inicio', top: -900 },
    { id: 'sobre', top: -300 },
    { id: 'trajetoria', top: 120 },
  ];
  assert.equal(currentSection(tops, 160), 'trajetoria');
  assert.equal(currentSection(tops, 100), 'sobre');
  assert.equal(currentSection([{ id: 'inicio', top: 400 }, { id: 'sobre', top: 900 }], 160), 'inicio');
});

test('item ativo na home vem da seção; fora dela, do caminho', () => {
  assert.equal(activeNavId('/', 'especialidades'), 'especialidades');
  assert.equal(activeNavId('/', 'inicio'), 'inicio');
  assert.equal(activeNavId('/projetos/', 'inicio'), 'projetos');
  assert.equal(activeNavId('/projetos/simulador-preco-rodoviario/', ''), 'projetos');
  assert.equal(activeNavId('/educacao/', ''), 'formacao');
  assert.equal(activeNavId('/blog/algum-post/', ''), 'artigos');
  assert.equal(activeNavId('/nao-existe/', ''), undefined);
});
