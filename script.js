'use strict';
const $ = selector => document.querySelector(selector);
const { characters, challenges, sources } = RiverGameData;
const core = RiverGame;
let storage;
try { storage = window.localStorage; } catch { storage = null; }
const saved = core.readSave(storage);
let session = saved.session;
let selectedCharacter = null;
const characterNames = { beaver: '', otter: '' };
if (session) characterNames[session.character] = session.name;
const panels = ['character-select', 'character-setup', 'mission', 'game-result'];
let restartAction = null;
let restartTrigger = null;
let announcementTimer;

function announce(text) {
  clearTimeout(announcementTimer);
  $('#game-announcement').textContent = '';
  announcementTimer = setTimeout(() => { $('#game-announcement').textContent = text; }, 40);
}
function focusStep(target, container = target) {
  target.focus({ preventScroll: true });
  container.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}
function saveProgress() {
  const success = core.writeSave(storage, session);
  $('#storage-note').textContent = success
    ? 'Your nickname and progress are saved only in this browser. You can clear them with “Start a new game”.'
    : 'Saving is unavailable in this browser. You can still play, but refreshing or closing this page may lose your progress.';
  return success;
}
function showPanel(id) {
  panels.forEach(panel => { $('#' + panel).hidden = panel !== id; });
  $('#resume-panel').hidden = true;
  const active = id === 'mission' || id === 'game-result';
  $('#game').classList.toggle('game-active', active);
  $('#game-title').textContent = id === 'mission' ? `${characters[session.character].label}: ${characters[session.character].focus}` : id === 'game-result' ? 'Your river journey' : 'Choose your river advocate';
  $('#game-intro-copy').hidden = active;
  $('#game-intro .scenario-note').hidden = active;
  $('#game-intro .eyebrow').hidden = active;
  $('#score-guide').open = false;
}
function showSelection(moveFocus = true) {
  showPanel('character-select');
  if (moveFocus) focusStep($(`[data-character="${selectedCharacter || 'beaver'}"]`), $('#character-select'));
}
function setAnimalImage(element, character) {
  const animal = characters[character];
  element.src = animal.image;
  element.width = character === 'beaver' ? 372 : 384;
  element.height = character === 'beaver' ? 384 : 342;
}
function chooseCharacter(character) {
  selectedCharacter = character;
  showPanel('character-setup');
  const animal = characters[character];
  setAnimalImage($('#naming-art'), character);
  $('#naming-title').textContent = `Name your ${character}`;
  $('#route-focus').textContent = animal.focus;
  $('#name-hint').textContent = `Choose a nickname, up to 24 characters. Leave blank to play as ${animal.label}.`;
  $('#character-name').placeholder = `e.g. ${animal.example}`;
  $('#character-name').value = characterNames[character];
  focusStep($('#character-name'), $('#character-setup'));
}
function requestRestart(action) {
  if (!session) { action(); return; }
  restartAction = action;
  restartTrigger = document.activeElement;
  $('#restart-title').textContent = session.completed ? 'Clear this river report?' : 'Leave this unfinished game?';
  $('#restart-copy').textContent = session.completed
    ? 'Starting again clears your saved nickname and decision review from this browser.'
    : `You have answered ${session.answers.length} of 5 challenges. Starting again clears this game’s nickname, choices and progress.`;
  $('#restart-dialog').showModal();
  $('#keep-playing').focus();
}
$('#keep-playing').addEventListener('click', () => $('#restart-dialog').close());
$('#restart-dialog').addEventListener('close', () => {
  restartAction = null;
  if (restartTrigger?.isConnected && !restartTrigger.closest('[hidden]')) restartTrigger.focus();
});
$('#confirm-restart').addEventListener('click', () => {
  const action = restartAction;
  restartAction = null;
  restartTrigger = null;
  $('#restart-dialog').close();
  session = null;
  characterNames.beaver = '';
  characterNames.otter = '';
  saveProgress();
  action?.();
});
function evidenceList(keys) {
  const list = document.createElement('ul');
  list.className = 'evidence-links';
  keys.forEach(key => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = sources[key].label;
    link.href = sources[key].url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const hint = document.createElement('span');
    hint.className = 'sr-only'; hint.textContent = ' (opens in a new tab)';
    link.append(hint); item.append(link); list.append(item);
  });
  return list;
}
function scoreDelta(index) {
  const before = core.totals(session, index), after = core.totals(session, index + 1);
  const signed = n => n > 0 ? `+${n}` : String(n);
  return `River health ${signed(after.health - before.health)} · Civic knowledge ${signed(after.knowledge - before.knowledge)}`;
}
function updateDashboard() {
  const score = core.totals(session);
  $('#health-score').textContent = score.health;
  $('#knowledge-score').textContent = score.knowledge;
  $('#health-meter').value = score.health;
  $('#health-meter').textContent = `${score.health} out of 100`;
  $('#challenge-progress').value = session.answers.length;
  $('#challenge-progress').textContent = `${session.answers.length} of 5 answered`;
  const outlook = score.health >= 85 ? 'strong' : score.health >= 60 ? 'developing' : 'pressure';
  $('#game-river').dataset.outlook = outlook;
  const labels = { strong: 'Building resilience', developing: 'Room to recover', pressure: 'Under pressure' };
  const descriptions = {
    strong: 'Your choices support stronger protection in the game. In a real catchment, monitoring would still be needed to see whether conditions improve over time.',
    developing: 'The game river still has room to recover. Use the next decision to connect ecological evidence with a practical safeguard.',
    pressure: 'The game river is under pressure. Review the feedback for a stronger approach. Real recovery depends on the cause, local conditions and follow-through.'
  };
  $('#river-outlook-label').textContent = labels[outlook];
  $('#river-outlook-copy').textContent = descriptions[outlook];
}
function renderFeedback(round, selected) {
  $('#feedback').hidden = false;
  $('#feedback-title').textContent = selected.id === round.best ? 'Strongest response for this situation' : 'A useful starting point, with a gap to address';
  if (selected.health < 0) $('#feedback-title').textContent = 'This approach leaves an important risk';
  $('#score-change').textContent = scoreDelta(session.index);
  $('#feedback-copy').textContent = selected.feedback;
  $('#challenge-why').textContent = round.why;
  $('#challenge-sources').replaceChildren(...evidenceList(round.sources).children);
  $('#next-challenge').hidden = false;
  $('#next-challenge').textContent = session.index === 4 ? 'See your river report' : 'Next challenge';
}
function renderMission(moveFocus = false) {
  showPanel('mission');
  const animal = characters[session.character], round = challenges[session.character][session.index];
  const selectedId = session.answers[session.index];
  setAnimalImage($('#player-art'), session.character);
  $('#player-name').textContent = session.name;
  $('#player-species').textContent = `${animal.label} · River advocate`;
  $('#round-label').textContent = `Challenge ${session.index + 1} of 5`;
  $('#challenge-type').textContent = round.type;
  $('#challenge-title').textContent = round.title;
  $('#challenge-copy').textContent = round.copy;
  $('#feedback').hidden = true;
  $('#explanation').open = false;
  $('#next-challenge').hidden = true;
  $('#choices').replaceChildren();
  session.orders[session.index].forEach((id, index) => {
    const choice = round.choices.find(item => item.id === id);
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'choice'; button.dataset.choiceId = id;
    const letter = document.createElement('span');
    letter.className = 'choice-letter'; letter.textContent = String.fromCharCode(65 + index); letter.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span'); label.textContent = choice.text;
    button.append(letter, label);
    if (selectedId) {
      button.disabled = true;
      if (id === selectedId) {
        button.classList.add('selected', choice.id === round.best ? 'correct' : 'partial');
        const marker = document.createElement('span'); marker.className = 'choice-state'; marker.textContent = 'Your choice'; button.append(marker);
      }
    }
    button.addEventListener('click', () => {
      if (!core.answer(session, id)) return;
      saveProgress();
      renderMission();
      // Move focus off the newly disabled choice, while the short status announces only scores.
      $('#feedback-title').focus({ preventScroll: true });
      $('#feedback').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
      announce(scoreDelta(session.index));
    });
    $('#choices').append(button);
  });
  if (selectedId) renderFeedback(round, round.choices.find(c => c.id === selectedId));
  updateDashboard();
  if (moveFocus) focusStep($('#challenge-title'), $('#mission'));
}
function renderResult(moveFocus = true) {
  showPanel('game-result');
  const animal = characters[session.character], score = core.totals(session);
  setAnimalImage($('#result-art'), session.character);
  $('#result-character').textContent = session.name === animal.label ? animal.label : `${session.name} the ${animal.label}`;
  $('#final-health').textContent = `${score.health}/100`;
  $('#final-knowledge').textContent = `${score.knowledge}/50`;
  const strongest = session.answers.filter((id, i) => id === challenges[session.character][i].best).length;
  $('#result-title').textContent = score.health >= 85 ? 'A stronger voice for the river' : score.health >= 60 ? 'Your campaign is taking shape' : 'A chance to rethink the approach';
  $('#result-copy').textContent = `You explored ${animal.focus.toLowerCase()} and chose the strongest response in ${strongest} of 5 situations. Your review shows what worked and what you could strengthen.`;
  const other = session.character === 'beaver' ? 'otter' : 'beaver';
  $('#try-other').textContent = `Try the ${characters[other].label}`;
  $('#review-list').replaceChildren();
  challenges[session.character].forEach((round, index) => {
    const selected = round.choices.find(c => c.id === session.answers[index]);
    const details = document.createElement('details');
    const summary = document.createElement('summary'); summary.textContent = `${index + 1}. ${round.title}`;
    const status = document.createElement('span'); status.className = 'review-status'; status.textContent = selected.id === round.best ? 'Strongest response' : 'Room to strengthen'; summary.append(status);
    details.append(summary);
    const picked = document.createElement('p'); const label = document.createElement('strong'); label.textContent = 'Your choice: '; picked.append(label, selected.text); details.append(picked);
    const delta = document.createElement('p'); delta.className = 'score-change'; delta.textContent = scoreDelta(index); details.append(delta);
    const feedback = document.createElement('p'); feedback.textContent = selected.feedback; details.append(feedback);
    if (selected.id !== round.best) {
      const better = document.createElement('p'); const heading = document.createElement('strong'); heading.textContent = 'A stronger approach: '; better.append(heading, round.choices.find(c => c.id === round.best).text); details.append(better);
    }
    const why = document.createElement('p'); why.textContent = round.why; details.append(why, evidenceList(round.sources));
    $('#review-list').append(details);
  });
  const source = sources[animal.followUp];
  $('#follow-up-copy').textContent = session.character === 'beaver' ? 'Explore how protected sites and habitat evidence can inform questions about a real place.' : 'Explore how river monitoring uses evidence to understand ecological conditions.';
  $('#follow-up-link').href = source.url; $('#follow-up-link').textContent = source.label;
  if (moveFocus) focusStep($('#result-title'), $('#game-result'));
}
function resume() {
  selectedCharacter = session.character;
  if (session.completed) renderResult(); else renderMission(true);
}
document.querySelectorAll('.character-card').forEach(button => button.addEventListener('click', () => requestRestart(() => chooseCharacter(button.dataset.character))));
$('#character-name').addEventListener('input', event => { event.target.value = [...event.target.value].slice(0, 24).join(''); });
$('#character-setup').addEventListener('submit', event => {
  event.preventDefault();
  if (!selectedCharacter) return;
  characterNames[selectedCharacter] = core.cleanName($('#character-name').value);
  session = core.createSession(selectedCharacter, characterNames[selectedCharacter]);
  saveProgress(); renderMission(true);
});
$('#back-to-animals').addEventListener('click', () => {
  characterNames[selectedCharacter] = core.cleanName($('#character-name').value);
  showSelection();
});
$('#change-character').addEventListener('click', () => requestRestart(() => showSelection()));
$('#new-game').addEventListener('click', () => requestRestart(() => showSelection()));
$('#play-again').addEventListener('click', () => requestRestart(() => showSelection()));
$('#try-other').addEventListener('click', () => {
  const other = session.character === 'beaver' ? 'otter' : 'beaver';
  requestRestart(() => chooseCharacter(other));
});
$('#resume-game').addEventListener('click', resume);
$('#next-challenge').addEventListener('click', () => {
  if (!core.advance(session)) return;
  saveProgress();
  if (session.completed) renderResult(); else renderMission(true);
});
$('#model-note a').addEventListener('click', () => { $('#score-guide').open = true; });
// Reuse the existing illustrated habitat rather than introduce a second visual style.
[...$('.hero .river-scene').children].forEach(child => $('#game-river').append(child.cloneNode(true)));
if (session) {
  showSelection(false);
  $('#character-select').hidden = true;
  $('#resume-panel').hidden = false;
  $('#resume-title').textContent = session.completed ? `${session.name}’s river report is saved` : `${session.name}’s river story is waiting`;
  $('#resume-copy').textContent = `${characters[session.character].label} · ${session.answers.length} of 5 challenges answered. Saved on this browser.`;
  $('#resume-game').textContent = session.completed ? 'View your river report' : 'Continue your game';
} else if (saved.status === 'unavailable') {
  $('#storage-note').textContent = 'Saving is unavailable in this browser. You can still play, but refreshing or closing this page may lose your progress.';
} else if (saved.status === 'invalid') {
  $('#storage-note').textContent = 'The saved game could not be restored. Choose an animal to begin a new story.';
}
document.querySelectorAll('.fact-toggle').forEach((button, index) => {
  const detail = button.nextElementSibling, original = button.textContent;
  detail.id = `fact-detail-${index}`; button.setAttribute('aria-controls', detail.id);
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open)); detail.hidden = open;
    button.textContent = open ? original : 'Hide detail';
  });
});
const menu = $('.menu-toggle'), nav = $('#site-nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  closeMenu();
  const target = document.querySelector(link.hash);
  if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
}));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu(); });
const dataCentreImpacts={
  energy:{
    stat:'21.2%',
    statLabel:"of Ireland's electricity demand in 2024",
    kicker:'National grid',
    title:'Large demand changes the electricity system',
    copy:'Servers and cooling equipment need electricity continuously. The climate effect depends on efficiency, the real-time generation mix and whether demand can move away from periods when the grid is under pressure.',
    points:['Measure total energy use as well as efficiency per unit of computing.','Plan for clean electricity at the hours it is used, not only as an annual average.','Use flexible demand and storage where they can reduce pressure at peak times.']
  },
  water:{
    stat:'Cooling choice',
    statLabel:'changes local water demand',
    kicker:'Catchment pressure',
    title:'Cooling can connect a server hall to a river',
    copy:'Some cooling systems use much more water than others. The important local questions are where that water comes from, what happens during drought and whether warm or treated water returns safely to the catchment.',
    points:['Compare air cooling, closed-loop systems, potable water and reclaimed water.','Publish expected use during normal operation, heatwaves and dry periods.','Protect environmental flows and plan a drought response before permission is granted.']
  },
  habitat:{
    stat:'Plan early',
    statLabel:'because habitat is hard to replace later',
    kicker:'Site footprint',
    title:'The building is only part of the habitat change',
    copy:'Roads, substations, grid connections, drainage and construction compounds can expand the footprint beyond the server halls. Poor siting can remove or fragment wetlands, hedgerows and wildlife corridors.',
    points:['Prefer already-developed land where suitable and avoid sensitive habitats.','Keep generous buffers around rivers, wetlands and established wildlife routes.','Use nature-based drainage and fund long-term habitat monitoring, not only planting at launch.']
  },
  community:{
    stat:'24/7',
    statLabel:'operations need continuous local safeguards',
    kicker:'Air and sound',
    title:'Cooling and backup systems are local neighbours',
    copy:'Cooling fans may run continuously, while backup generators are tested and may operate during outages. Their noise, lighting and exhaust need site-specific assessment rather than assumptions based only on distance.',
    points:['Model night-time and low-frequency noise as well as daytime averages.','Publish generator testing schedules and use the cleanest practical backup technology.','Monitor noise and air quality after opening, with a clear community complaints process.']
  },
  design:{
    stat:'Measure it',
    statLabel:'energy, water, heat and habitat performance',
    kicker:'Better outcomes',
    title:'A lower-impact data centre is designed as part of its place',
    copy:'Efficiency is important, but the strongest plans combine clean power, low-water cooling, heat reuse, careful siting, transparent reporting and benefits that work for the surrounding community and ecosystem.',
    points:['Report energy and water performance consistently so claims can be checked.','Reuse waste heat where a real nearby demand and heat network exist.','Set measurable biodiversity, water and community targets for the full operating life.']
  },
  advocacy:{
    stat:'Public power',
    statLabel:'turns ecological evidence into accountable decisions',
    kicker:'Advocacy and policy',
    title:'Environmental limits need organised defenders',
    copy:'Companies can hire lobbyists and advisers. Communities can build a different kind of power by combining evidence, public participation, broad coalitions and persistent scrutiny before and after permission is granted.',
    points:['Identify the exact decision maker, legal process, deadline and remedy being sought.','Demand publication of lobbying contacts, environmental data, permit conditions and compliance results.','Judge proposals by planetary limits and public benefit, not by the private wealth of their owners.']
  }
};

const impactTabs=[...document.querySelectorAll('.impact-tab')];
const impactSources = { energy: { label: 'SEAI: Energy in Ireland 2025 (PDF, 2024 data)', url: 'https://www.seai.ie/sites/default/files/publications/Energy%20in%20Ireland%202025%20v1.0%20complete.pdf' }, water: sources.reporting, habitat: sources.habitat, community: { label: 'EPA: State of the Environment', url: 'https://epawebapp.epa.ie/ebooks/soe2024/359/' }, design: sources.reporting, advocacy: sources.catchments };
const desktopTabs = matchMedia('(min-width: 901px)');
const setTabOrientation = () => $('.impact-tabs').setAttribute('aria-orientation', desktopTabs.matches ? 'vertical' : 'horizontal');
setTabOrientation();
desktopTabs.addEventListener('change', setTabOrientation);
function renderDataCentreImpact(key){
  const impact=dataCentreImpacts[key],activeTab=impactTabs.find(tab=>tab.dataset.impact===key);
  if(!impact||!activeTab)return;
  impactTabs.forEach(tab=>{const active=tab===activeTab;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
  $('#impact-panel').setAttribute('aria-labelledby',activeTab.id);
  $('#impact-stat').textContent=impact.stat;
  $('#impact-stat-label').textContent=impact.statLabel;
  $('#impact-kicker').textContent=impact.kicker;
  $('#impact-title').textContent=impact.title;
  $('#impact-copy').textContent=impact.copy;
  $('#impact-source').href=impactSources[key].url;
  $('#impact-source').textContent=impactSources[key].label;
  const points=$('#impact-points');points.innerHTML='';
  impact.points.forEach(point=>{const item=document.createElement('li');item.textContent=point;points.appendChild(item)});
}
impactTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>renderDataCentreImpact(tab.dataset.impact));
  tab.addEventListener('keydown',event=>{
    const last=impactTabs.length-1;let next=index;
    if(event.key==='ArrowRight'||event.key==='ArrowDown')next=index===last?0:index+1;
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=index===0?last:index-1;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=last;
    else return;
    event.preventDefault();impactTabs[next].focus();impactTabs[next].click();
  });
});
