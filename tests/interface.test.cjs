const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const data = require('../game-data.js');
const core = require('../game-core.js');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function boot(save, unavailable = false) {
  const dom = new JSDOM(html, { url: 'https://example.test/beaver-v-otter/', runScripts: 'outside-only', pretendToBeVisual: true });
  const window = dom.window;
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.HTMLElement.prototype.scrollIntoView = function () {};
  // JSDOM does not simulate modal layout or the browser's focus trap.
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new window.Event('close')); };
  if (unavailable) Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  else if (save) window.localStorage.setItem(core.STORAGE_KEY, save);
  for (const file of ['game-data.js', 'game-core.js', 'script.js']) window.eval(fs.readFileSync(path.join(root, file), 'utf8'));
  return { dom, window, document: window.document, $: selector => window.document.querySelector(selector) };
}
function start(app, character = 'beaver', name = '') {
  app.$(`[data-character="${character}"]`).click();
  app.$('#character-name').value = name;
  app.$('#character-setup').dispatchEvent(new app.window.Event('submit', { bubbles: true, cancelable: true }));
}
for (const character of ['beaver', 'otter']) {
  test(`${character}: full UI journey, scores, evidence, report and other route`, t => {
    const app = boot(); t.after(() => app.dom.window.close()); start(app, character, 'River friend');
    assert.equal(app.$('#mission').hidden, false);
    assert.equal(app.document.activeElement.id, 'challenge-title');
    for (let i = 0; i < 5; i++) {
      const round = data.challenges[character][i];
      assert.equal(app.$('#challenge-title').textContent, round.title);
      const pick = i === 1 ? round.choices.find(c => c.id !== round.best).id : round.best;
      app.$(`[data-choice-id="${pick}"]`).click();
      assert.equal(app.$('#feedback').hidden, false);
      assert.equal(app.document.activeElement.id, 'feedback-title');
      assert.equal(app.$('.choice-state').textContent, 'Your choice');
      assert.ok([...app.document.querySelectorAll('.choice')].every(button => button.disabled));
      assert.equal(app.$('#challenge-progress').value, i + 1);
      assert.ok(app.$('#challenge-sources a').href.startsWith('https://'));
      assert.match(app.$('#score-change').textContent, /River health .+ · Civic knowledge \+/);
      app.$('#next-challenge').click();
    }
    assert.equal(app.$('#game-result').hidden, false);
    assert.equal(app.document.activeElement.id, 'result-title');
    assert.equal(app.document.querySelectorAll('#review-list details').length, 5);
    assert.match(app.$('#review-list').textContent, /A stronger approach:/);
    assert.equal(app.$('#follow-up-link').href, data.sources[data.characters[character].followUp].url);
    app.$('#try-other').click(); assert.equal(app.$('#restart-dialog').open, true);
    app.$('#confirm-restart').click(); assert.equal(app.$('#character-setup').hidden, false);
    assert.match(app.$('#naming-title').textContent, new RegExp(character === 'beaver' ? 'otter' : 'beaver'));
  });
}
test('refresh after an answer restores the same order, feedback and scores without double scoring', t => {
  const first = boot(); t.after(() => first.dom.window.close()); start(first);
  first.$('.choice').click();
  const order = [...first.document.querySelectorAll('.choice')].map(button => button.dataset.choiceId);
  const second = boot(first.window.localStorage.getItem(core.STORAGE_KEY)); t.after(() => second.dom.window.close());
  assert.equal(second.$('#resume-panel').hidden, false); second.$('#resume-game').click();
  assert.deepEqual([...second.document.querySelectorAll('.choice')].map(button => button.dataset.choiceId), order);
  assert.equal(second.$('#feedback-copy').textContent, first.$('#feedback-copy').textContent);
  assert.equal(second.$('#health-score').textContent, first.$('#health-score').textContent);
  assert.equal(second.$('#next-challenge').hidden, false);
  second.$('.choice').click(); assert.equal(second.$('#health-score').textContent, first.$('#health-score').textContent);
});
test('completed report survives reload', t => {
  const session = core.createSession('otter', 'Ripple');
  for (const round of data.challenges.otter) { core.answer(session, round.best); core.advance(session); }
  const app = boot(JSON.stringify({ version: core.VERSION, session })); t.after(() => app.dom.window.close());
  assert.equal(app.$('#resume-game').textContent, 'View your river report'); app.$('#resume-game').click();
  assert.equal(app.$('#game-result').hidden, false); assert.equal(app.$('#final-knowledge').textContent, '50/50');
});
test('changing animals can be cancelled or confirmed without accidental loss', t => {
  const app = boot(); t.after(() => app.dom.window.close()); start(app); app.$('.choice').click();
  const saved = app.window.localStorage.getItem(core.STORAGE_KEY);
  app.$('#change-character').focus(); app.$('#change-character').click();
  assert.equal(app.$('#restart-dialog').open, true); assert.equal(app.document.activeElement.id, 'keep-playing');
  app.$('#keep-playing').click(); assert.equal(app.document.activeElement.id, 'change-character');
  assert.equal(app.window.localStorage.getItem(core.STORAGE_KEY), saved);
  app.$('#change-character').click(); app.$('#confirm-restart').click();
  assert.equal(app.$('#character-select').hidden, false); assert.equal(app.window.localStorage.getItem(core.STORAGE_KEY), null);
});
test('storage failures and corrupt saves still allow a complete game', t => {
  for (const app of [boot(null, true), boot('{bad')]) {
    t.after(() => app.dom.window.close());
    assert.match(app.$('#storage-note').textContent, /unavailable|could not be restored/);
    start(app, 'otter');
    for (let i = 0; i < 5; i++) { app.$('.choice').click(); app.$('#next-challenge').click(); }
    assert.equal(app.$('#game-result').hidden, false);
  }
});
test('nicknames render as text, never HTML', t => {
  const app = boot(); t.after(() => app.dom.window.close()); start(app, 'beaver', '<img src=x onerror=x>');
  assert.equal(app.$('#player-name').children.length, 0); assert.match(app.$('#player-name').textContent, /^<img/);
});
test('topic tabs support arrow keys, Home and End, with one tab in the focus order', t => {
  const app = boot(); t.after(() => app.dom.window.close());
  const tabs = [...app.document.querySelectorAll('[role="tab"]')]; assert.equal(tabs.length, 6);
  tabs[0].focus(); tabs[0].dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  assert.equal(app.document.activeElement, tabs[5]); assert.equal(tabs[5].getAttribute('aria-selected'), 'true');
  assert.equal(app.$('#impact-panel').getAttribute('aria-labelledby'), tabs[5].id);
  assert.equal(tabs.filter(tab => tab.tabIndex === 0).length, 1);
  tabs[5].dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); assert.equal(app.document.activeElement, tabs[0]);
  tabs[3].dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'Home', bubbles: true })); assert.equal(app.document.activeElement, tabs[0]);
});
test('menu closes on Escape and returns focus; fact toggles retain their own labels', t => {
  const app = boot(); t.after(() => app.dom.window.close()); app.$('.menu-toggle').click();
  assert.equal(app.$('.menu-toggle').getAttribute('aria-expanded'), 'true');
  app.document.dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(app.$('.menu-toggle').getAttribute('aria-expanded'), 'false'); assert.equal(app.document.activeElement, app.$('.menu-toggle'));
  const toggle = app.$('.civic-fact .fact-toggle'); const label = toggle.textContent;
  toggle.click(); toggle.click(); assert.equal(toggle.textContent, label);
  assert.ok(app.document.getElementById(toggle.getAttribute('aria-controls')));
});
test('page semantics, local assets and fragment destinations are valid', t => {
  const app = boot(); t.after(() => app.dom.window.close());
  const ids = [...app.document.querySelectorAll('[id]')].map(element => element.id); assert.equal(new Set(ids).size, ids.length);
  assert.equal(app.$('.skip-link').hash, '#game');
  assert.equal(app.$('#health-meter').tagName, 'METER'); assert.equal(app.$('#health-meter').getAttribute('aria-labelledby'), 'health-label');
  assert.equal(app.$('#mission').hasAttribute('aria-live'), false); assert.equal(app.$('#game-result').hasAttribute('aria-live'), false);
  for (const link of app.document.querySelectorAll('a[href^="#"]')) assert.ok(app.document.getElementById(link.hash.slice(1)), `Missing ${link.hash}`);
  for (const element of app.document.querySelectorAll('img[src], script[src], link[rel="stylesheet"]')) {
    const source = element.getAttribute('src') || element.getAttribute('href');
    if (!source.startsWith('http')) assert.ok(fs.existsSync(path.join(root, source.split('?')[0])), `Missing ${source}`);
  }
  for (const element of app.document.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls]')) {
    for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) for (const id of (element.getAttribute(attr) || '').split(/\s+/).filter(Boolean)) assert.ok(app.document.getElementById(id), `Missing ${attr} target ${id}`);
  }
  assert.ok(!html.includes('share.google'));
  assert.ok(!html.includes('Civic power'));
});
test('hero copy is real text, available immediately, with no stale CSS-generated headline', () => {
  const css = fs.readFileSync(path.join(root, 'hero-staging.css'), 'utf8');
  assert.ok(html.includes('Two animals. One river. <span>Your choices matter.</span>'));
  assert.ok(!css.includes('Ten Data Centres.'));
  assert.ok(!css.includes('Every choice changes the water.'));
  assert.ok(!/hero h1[^}]*font-size:\s*0[;}]/.test(css));
  assert.ok(!/hero-actions[^}]*opacity:\s*0[;}]/.test(css));
});
