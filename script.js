const challenges={beaver:[{type:'Habitat',title:'A fast stream rushes through the valley',copy:'Young fish have little shelter and water disappears quickly after rain. What should the beaver do?',choices:[['Build a dam where the valley can safely spread water',12,10,'Good choice. A well-sited beaver dam can slow flow, create wetland habitat and increase habitat complexity.'],['Block the narrowest culvert under a road',-14,2,'Not here. Blocking infrastructure can cause flooding and harm both people and habitat. Site matters.'],['Remove every branch from the stream',-8,1,'Large wood often creates shelter and flow diversity. Removing all of it can simplify habitat.']]},{type:'Water quality',title:'The pond turns green in midsummer',copy:'Algae is spreading after nutrients wash into the water from upstream. What is the best response?',choices:[['Protect vegetated river margins that intercept runoff',12,10,'Correct. Riparian vegetation can slow runoff, trap sediment and take up nutrients before they reach the river.'],['Make the pond warmer and shallower',-12,1,'That can worsen the problem. Warm, nutrient-rich water can favour algal growth and hold less dissolved oxygen.'],['Clear plants from the banks',-10,1,'Bank vegetation is useful habitat and can help filter runoff.']]},{type:'Flow',title:'Heavy rain is coming',copy:'The catchment is saturated and water will rise quickly. Which feature helps make the river more resilient?',choices:[['Connected floodplains and wetlands',10,10,'Yes. Floodplains and wetlands can temporarily store water and reduce the force of high flows.'],['Straight, concrete-lined channels everywhere',-10,2,'Straightened hard channels can move water downstream faster and remove habitat complexity.'],['Bare soil beside the river',-12,1,'Bare soil is vulnerable to erosion, adding sediment to the river during heavy rain.']]},{type:'Food web',title:'Aquatic insects are disappearing',copy:'The insects that fish feed on are declining. What should you investigate first?',choices:[['Water quality and habitat conditions',8,10,'Exactly. Aquatic invertebrates respond to oxygen, pollution, sediment, flow and habitat, so they are useful indicators.'],['Whether the moon is brighter this month',0,1,'Interesting, but not the strongest first lead. Start with water quality and habitat.'],['Whether there are enough roads nearby',-3,1,'Roads can affect runoff, but the immediate investigation should focus on water and habitat conditions.']]},{type:'River connection',title:'The wetland is healthy — but isolated',copy:'A barrier prevents wildlife moving between river reaches. What principle matters most?',choices:[['Restore safe ecological connectivity',10,10,'Correct. Connected habitats allow wildlife to move, feed, disperse and respond to changing conditions.'],['Keep each habitat completely separate',-8,1,'Isolation can make populations more vulnerable and restrict access to food or refuge.'],['Replace the wetland with lawn',-14,0,'That would remove valuable habitat and many of its water-management functions.']]}],otter:[{type:'Food web',title:'Fish are becoming scarce',copy:'The otter has to travel farther to find food. Which clue should you investigate?',choices:[['Water quality and the health of aquatic prey',10,10,'Correct. Otters depend on functioning aquatic food webs, so declining prey can signal broader ecosystem stress.'],['Paint more rocks beside the river',0,1,'Colourful, perhaps, but it will not repair the aquatic food web.'],['Remove shaded riverbank vegetation',-10,1,'Shade and bank vegetation can be important for temperature, habitat and water quality.']]},{type:'Water quality',title:'A tributary becomes cloudy after rain',copy:'Fine sediment is washing into the river. Why can that be a problem?',choices:[['It can smother habitat and reduce feeding or spawning quality',10,10,'Exactly. Excess fine sediment can cover gravel, affect invertebrates and reduce habitat quality.'],['Cloudy water always means the river is healthier',-10,1,'Not necessarily. Some sediment is natural, but excessive fine sediment can be harmful.'],['It gives every fish more oxygen',-8,0,'Sediment does not add oxygen; high sediment loads can stress aquatic organisms.']]},{type:'Temperature',title:'The river is unusually warm',copy:'A heatwave has raised water temperature. What happens to dissolved oxygen as water warms?',choices:[['Warm water generally holds less dissolved oxygen',8,10,'Correct. That can add stress for fish and other aquatic organisms during hot periods.'],['Warm water always holds more oxygen',-8,0,'It is the opposite: warmer water generally holds less dissolved oxygen.'],['Temperature has no relationship with aquatic life',-10,0,'Temperature strongly influences metabolism, oxygen availability and species suitability.']]},{type:'Habitat',title:'The otter needs a safe river corridor',copy:'Which riverbank is most useful for wildlife?',choices:[['A varied, vegetated bank with cover and connected habitat',10,10,'Yes. Diverse bank vegetation provides cover, stabilises soil and supports food webs.'],['A completely bare bank',-10,1,'Bare banks provide less cover and can be prone to erosion.'],['A bank sealed entirely in concrete',-8,1,'Hard engineering has uses, but a fully sealed bank usually provides less ecological habitat.']]},{type:'Pollution',title:'A pollution pulse moves downstream',copy:'The river smells unusual and fish are distressed. What is the responsible lesson?',choices:[['Pollution upstream can affect the whole connected river system',10,10,'Correct. Rivers connect places. What enters upstream can travel and affect habitats downstream.'],['Only the exact entry point can be affected',-10,0,'Flow can transport pollutants well beyond their source.'],['Wildlife can always avoid pollution immediately',-12,0,'Aquatic organisms may have limited escape routes, especially during sudden pollution events.']]}]};
let state={character:null,index:0,health:60,knowledge:0,answered:false};
const $=s=>document.querySelector(s);const select=$('#character-select'),mission=$('#mission'),result=$('#game-result');
function start(character){state={character,index:0,health:60,knowledge:0,answered:false};select.hidden=true;result.hidden=true;mission.hidden=false;render();mission.scrollIntoView({behavior:'smooth',block:'start'});}
function render(){const item=challenges[state.character][state.index];$('#round-label').textContent=`Challenge ${state.index+1} of ${challenges[state.character].length}`;$('#health-score').textContent=state.health;$('#knowledge-score').textContent=state.knowledge;$('#health-bar').style.width=`${Math.max(0,Math.min(100,state.health))}%`;$('#challenge-type').textContent=item.type;$('#challenge-title').textContent=item.title;$('#challenge-copy').textContent=item.copy;$('#feedback').hidden=true;$('#next-challenge').hidden=true;state.answered=false;const choices=$('#choices');choices.innerHTML='';item.choices.forEach((choice,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=choice[0];b.addEventListener('click',()=>answer(i,b));choices.appendChild(b)});}
function answer(i,button){if(state.answered)return;state.answered=true;const item=challenges[state.character][state.index],choice=item.choices[i],best=Math.max(...item.choices.map(c=>c[1]));state.health=Math.max(0,Math.min(100,state.health+choice[1]));state.knowledge+=choice[2];document.querySelectorAll('.choice').forEach(b=>b.disabled=true);button.classList.add(choice[1]===best?'correct':'incorrect');$('#health-score').textContent=state.health;$('#knowledge-score').textContent=state.knowledge;$('#health-bar').style.width=`${state.health}%`;const f=$('#feedback');f.textContent=choice[3];f.hidden=false;$('#next-challenge').textContent=state.index===challenges[state.character].length-1?'See river report':'Next challenge';$('#next-challenge').hidden=false;}
function finish(){mission.hidden=true;result.hidden=false;$('#final-health').textContent=`${state.health}/100`;$('#final-knowledge').textContent=`${state.knowledge}/50`;let title,copy,icon;if(state.health>=85){title='The river is thriving';copy='Your choices protected water quality, habitat and the connections that keep a river ecosystem resilient.';icon='🌿'}else if(state.health>=65){title='The river is recovering';copy='You made several strong ecological choices. Replay to see how different decisions affect the same river.';icon='🌊'}else{title='The river needs help';copy='Some choices put extra pressure on the ecosystem. The useful part is knowing why — replay and rebuild the river.';icon='💧'}$('#result-title').textContent=title;$('#result-copy').textContent=copy;$('#result-icon').textContent=icon;result.scrollIntoView({behavior:'smooth',block:'center'});}
document.querySelectorAll('.character-card').forEach(b=>b.addEventListener('click',()=>start(b.dataset.character)));$('#next-challenge').addEventListener('click',()=>{if(state.index<challenges[state.character].length-1){state.index++;render()}else finish()});$('#change-character').addEventListener('click',()=>{mission.hidden=true;select.hidden=false;select.scrollIntoView({behavior:'smooth'})});$('#play-again').addEventListener('click',()=>{result.hidden=true;select.hidden=false;select.scrollIntoView({behavior:'smooth'})});document.querySelectorAll('.fact-toggle').forEach(b=>b.addEventListener('click',()=>{const detail=b.nextElementSibling,open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));detail.hidden=open;b.textContent=open?'Why that matters':'Hide detail'}));const menu=$('.menu-toggle'),nav=$('#site-nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

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
  }
};

const impactTabs=[...document.querySelectorAll('.impact-tab')];
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
