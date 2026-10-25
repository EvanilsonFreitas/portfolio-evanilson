import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOME_SECTIONS, NAV, activeNavId, clickAction, currentSection, hashOf } from './navigation.ts';

test('todos os itens têm id único e destino iniciado em "/"', () => {
  assert.equal(new Set(NAV.map((n) => n.id)).size, NAV.length);
  for (const n of NAV) assert.ok(n.href.startsWith('/'), n.href);
});

test('o menu tem exatamente cinco itens, na ordem combinada', () => {
  assert.deepEqual(NAV.map((n) => n.label), ['Início', 'Sobre', 'Atuação', 'Projetos', 'Artigos']);
});

test('as seções da home seguem a ordem da página e pertencem a um único item', () => {
  assert.deepEqual(HOME_SECTIONS, ['inicio', 'sobre', 'trajetoria', 'experiencia', 'formacao', 'atuacao', 'especialidades', 'projetos', 'artigos', 'contato']);
  assert.equal(new Set(HOME_SECTIONS).size, HOME_SECTIONS.length);
});

test('agrupamento: cada seção ativa o item correto', () => {
  const esperado: Record<string, string> = {
    inicio: 'inicio', sobre: 'sobre', trajetoria: 'sobre', experiencia: 'sobre', formacao: 'sobre',
    atuacao: 'atuacao', especialidades: 'atuacao', projetos: 'projetos', artigos: 'artigos', contato: 'artigos',
  };
  for (const [sec, item] of Object.entries(esperado)) assert.equal(activeNavId('/', sec), item, sec);
});

test('hashOf extrai o fragmento', () => {
  assert.equal(hashOf('/#projetos'), 'projetos');
  assert.equal(hashOf('/'), '');
});

test('na home, "Início" volta ao topo e as âncoras rolam sem recarregar', () => {
  assert.deepEqual(clickAction('/', '/'), { kind: 'top' });
  assert.deepEqual(clickAction('/', '/#atuacao'), { kind: 'section', id: 'atuacao' });
});

test('fora da home, o roteador navega (inclusive "Início" a partir de Artigos)', () => {
  assert.deepEqual(clickAction('/blog/', '/'), { kind: 'navigate' });
  assert.deepEqual(clickAction('/blog/x/', '/#atuacao'), { kind: 'navigate' });
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
  assert.equal(activeNavId('/', 'especialidades'), 'atuacao');
  assert.equal(activeNavId('/', 'inicio'), 'inicio');
  assert.equal(activeNavId('/projetos/', 'inicio'), 'projetos');
  assert.equal(activeNavId('/projetos/simulador-preco-rodoviario/', ''), 'projetos');
  assert.equal(activeNavId('/educacao/', ''), 'sobre');
  assert.equal(activeNavId('/blog/algum-post/', ''), 'artigos');
  assert.equal(activeNavId('/nao-existe/', ''), undefined);
});
