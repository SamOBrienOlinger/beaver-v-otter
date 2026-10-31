const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../game-data.js');
const core = require('../game-core.js');
const memoryStore = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};
for (const character of ['beaver', 'otter']) {
  test(`${character}: all 243 decision paths complete, score safely and survive saving`, () => {
    for (let path = 0; path < 243; path++) {
      let remaining = path;
      const session = core.createSession(character, 'River friend');
      let expectedHealth = 60, expectedKnowledge = 0;
      for (let index = 0; index < 5; index++) {
        assert.equal(core.advance(session), false, 'must answer before advancing');
        const pick = remaining % 3; remaining = Math.floor(remaining / 3);
        const choice = data.challenges[character][index].choices[pick];
        assert.equal(core.answer(session, choice.id), true);
        assert.equal(core.answer(session, choice.id), false, 'no double scoring');
        expectedHealth = Math.max(0, Math.min(100, expectedHealth + choice.health)); expectedKnowledge += choice.knowledge;
        assert.deepEqual(core.totals(session), { health: expectedHealth, knowledge: expectedKnowledge });
        assert.deepEqual(core.validateSession(JSON.parse(JSON.stringify(session))), session);
        const storage = memoryStore(); assert.equal(core.writeSave(storage, session), true);
        assert.deepEqual(core.readSave(storage).session, session);
        assert.equal(core.advance(session), true);
      }
      assert.equal(session.completed, true);
      assert.equal(core.advance(session), false);
      assert.equal(core.answer(session, 'anything'), false);
      assert.deepEqual(core.validateSession(session), session);
      const score = core.totals(session);
      assert.ok(score.health >= 0 && score.health <= 100);
      assert.ok(score.knowledge >= 15 && score.knowledge <= 50);
    }
  });
  test(`${character}: strongest choices earn 100/100 and 50/50`, () => {
    const session = core.createSession(character);
    for (const round of data.challenges[character]) { core.answer(session, round.best); core.advance(session); }
    assert.deepEqual(core.totals(session), { health: 100, knowledge: 50 });
  });
  test(`${character}: always choosing the first displayed answer cannot earn a perfect report`, () => {
    for (let seed = 0; seed < 100; seed++) {
      let value = seed + 1;
      const random = () => ((value = (value * 16807) % 2147483647) - 1) / 2147483646;
      const session = core.createSession(character, '', random);
      for (let i = 0; i < 5; i++) { core.answer(session, session.orders[i][0]); core.advance(session); }
      assert.ok(core.totals(session).knowledge < 50);
    }
  });
}
test('invalid and older saves fail safely without trusting supplied scores', () => {
  const storage = memoryStore();
  storage.setItem(core.STORAGE_KEY, '{bad'); assert.equal(core.readSave(storage).status, 'invalid');
  storage.setItem(core.STORAGE_KEY, 'null'); assert.equal(core.readSave(storage).status, 'invalid');
  storage.setItem(core.STORAGE_KEY, JSON.stringify({ version: 1, session: core.createSession('otter') })); assert.equal(core.readSave(storage).status, 'invalid');
  const valid = core.createSession('beaver');
  for (const patch of [{ character: '__proto__' }, { index: -1 }, { completed: true }, { answers: ['unknown'] }, { name: '' }, { name: 'x'.repeat(25) }, { orders: [['avoid', 'avoid', 'avoid']] }]) assert.equal(core.validateSession({ ...valid, ...patch }), null);
  const restored = core.validateSession({ ...valid, health: 999, knowledge: 999 });
  assert.deepEqual(core.totals(restored), { health: 60, knowledge: 0 });
});
test('blocked or full storage never stops play', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); }, removeItem() { throw new Error('blocked'); } };
  assert.equal(core.readSave(blocked).status, 'unavailable');
  assert.equal(core.writeSave(blocked, core.createSession('otter')), false);
  assert.equal(core.writeSave(blocked, null), false);
  assert.equal(core.readSave(null).status, 'unavailable');
});
test('names normalise whitespace, remove control characters and preserve Unicode', () => {
  assert.equal(core.cleanName('  River  Friend \n'), 'River Friend');
  assert.equal([...core.cleanName('🦦'.repeat(30))].length, 24);
  assert.equal(core.cleanName('Hi\u202e there'), 'Hi there');
  assert.equal(core.createSession('otter', ' ').name, 'Otter');
});
test('reset removes the stored nickname and decisions', () => {
  const storage = memoryStore(); const session = core.createSession('beaver', 'Willow');
  core.answer(session, data.challenges.beaver[0].best); core.writeSave(storage, session);
  assert.equal(core.writeSave(storage, null), true); assert.equal(storage.getItem(core.STORAGE_KEY), null);
});
