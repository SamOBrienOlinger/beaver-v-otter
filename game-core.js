(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./game-data.js'));
  else root.RiverGame = factory(root.RiverGameData);
}(typeof globalThis !== 'undefined' ? globalThis : this, function (data) {
  'use strict';
  const VERSION = 2;
  const STORAGE_KEY = 'beaver-v-otter-progress';
  const validCharacter = character => Object.hasOwn(data.characters, character);
  const cleanName = value => [...String(value).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '').replace(/\s+/g, ' ').trim()].slice(0, 24).join('');
  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function createSession(character, name = '', random = Math.random) {
    if (!validCharacter(character)) throw new Error('Unknown character');
    const rounds = data.challenges[character];
    const orders = rounds.map(round => shuffle(round.choices.map(c => c.id), random));
    // Avoid a full route with every strongest answer in the same display position.
    const positions = orders.map((order, i) => order.indexOf(rounds[i].best));
    if (positions.every(position => position === positions[0])) orders[orders.length - 1].push(orders[orders.length - 1].shift());
    return { character, name: cleanName(name) || data.characters[character].label, index: 0, answers: [], orders, completed: false };
  }
  function totals(session, count = session.answers.length) {
    let health = 60, knowledge = 0;
    session.answers.slice(0, count).forEach((answer, index) => {
      const choice = data.challenges[session.character][index].choices.find(c => c.id === answer);
      health = Math.max(0, Math.min(100, health + choice.health));
      knowledge += choice.knowledge;
    });
    return { health, knowledge };
  }
  function answer(session, id) {
    if (session.completed || session.answers.length !== session.index) return false;
    const round = data.challenges[session.character][session.index];
    if (!round.choices.some(c => c.id === id)) return false;
    session.answers.push(id);
    return true;
  }
  function advance(session) {
    if (session.completed || session.answers.length !== session.index + 1) return false;
    if (session.index === data.challenges[session.character].length - 1) session.completed = true;
    else session.index++;
    return true;
  }
  function validateSession(value) {
    if (!value || !validCharacter(value.character) || typeof value.name !== 'string' || !value.name || cleanName(value.name) !== value.name) return null;
    const rounds = data.challenges[value.character];
    if (!Number.isInteger(value.index) || value.index < 0 || value.index >= rounds.length || typeof value.completed !== 'boolean') return null;
    if (!Array.isArray(value.answers) || !Array.isArray(value.orders) || value.orders.length !== rounds.length) return null;
    if (value.answers.length !== value.index && value.answers.length !== value.index + 1) return null;
    if (value.completed && (value.index !== rounds.length - 1 || value.answers.length !== rounds.length)) return null;
    if (!value.answers.every((id, i) => rounds[i].choices.some(choice => choice.id === id))) return null;
    if (!value.orders.every((order, i) => Array.isArray(order) && order.length === rounds[i].choices.length && new Set(order).size === order.length && order.every(id => rounds[i].choices.some(c => c.id === id)))) return null;
    return { character: value.character, name: value.name, index: value.index, completed: value.completed, answers: [...value.answers], orders: value.orders.map(order => [...order]) };
  }
  function readSave(storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return { status: 'empty', session: null };
      const envelope = JSON.parse(raw);
      const session = envelope && envelope.version === VERSION && validateSession(envelope.session);
      return session ? { status: 'saved', session } : { status: 'invalid', session: null };
    } catch (error) {
      return { status: error instanceof SyntaxError ? 'invalid' : 'unavailable', session: null };
    }
  }
  function writeSave(storage, session) {
    try {
      if (session) storage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, session }));
      else storage.removeItem(STORAGE_KEY);
      return true;
    } catch { return false; }
  }
  return { VERSION, STORAGE_KEY, cleanName, createSession, totals, answer, advance, validateSession, readSave, writeSave };
}));
