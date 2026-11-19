import { renderRoadmap, missableWarning } from './roadmap.js';
const trophies = (await (await fetch('data/trophies.json')).json()).trophies;
const $ = s => document.querySelector(s);
const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const grades = ['platinum','gold','silver','bronze'];
const roadmapOrder = (a,b) => a.stage-b.stage || a.id-b.id;
let state;
try { state=JSON.parse(localStorage.getItem('ledger'))||{}; } catch { state={}; }
if(new URLSearchParams(location.search).has('sample')&&!state.initialized) state={earned:trophies.slice(1,13).map(t=>t.id),sample:true};
state.earned = [...new Set(Array.isArray(state.earned) ? state.earned.filter(id=>trophies.some(t=>t.id===id)) : [])];
let filters={kind:'',grade:'',status:'',query:'',sort:'roadmap'};
const earned = t => state.earned.includes(t.id);
const concealed = t => $('#spoilers').checked && t.kind==='story' && !earned(t);
const displayName = t => concealed(t)?'Hidden story trophy':t.name;
const badge = t => `<span class="badge ${t.grade}"><i></i>${t.grade.toUpperCase()}</span><span class="tag">${t.kind}</span>${t.target?`<span class="tag">TARGET ${escapeHtml(t.target)}</span>`:''}`;
function saveProgress(){state.initialized=true;localStorage.setItem('ledger',JSON.stringify(state));}
function renderStats(){
 const next=[...trophies].sort(roadmapOrder).find(t=>!earned(t));
 $('#progress').innerHTML=`<div class="total"><strong>${state.earned.length}<small> / 55</small></strong><span>TROPHIES EARNED<progress max="55" value="${state.earned.length}"></progress></span></div><div class="gradeStats">${grades.map(g=>`<div><span class="badge ${g}"><i></i>${g.toUpperCase()}</span><b>${trophies.filter(t=>t.grade===g&&earned(t)).length}<small> / ${trophies.filter(t=>t.grade===g).length}</small></b></div>`).join('')}</div><div class="stageStats">${[1,2,3].map(s=>`<span>STAGE ${s} <b>${trophies.filter(t=>t.stage===s&&earned(t)).length}/${trophies.filter(t=>t.stage===s).length}</b></span>`).join('')}<span class="next">UP NEXT / ${next?`STAGE ${next.stage} · #${next.id} · ${next.grade.toUpperCase()} · ${escapeHtml(displayName(next))}`:'Platinum route complete'}</span></div>`;
 $('#notice').textContent=state.sample?'Sample progress · saved on this device':'Progress saved on this device';
}
function applyFilters(){return trophies.filter(t=>(!filters.kind||t.kind===filters.kind)&&(!filters.grade||t.grade===filters.grade)&&(!filters.status||(filters.status==='earned'?earned(t):!earned(t)))&&`${displayName(t)} ${concealed(t)?'':t.description}`.toLowerCase().includes(filters.query.toLowerCase())).sort(filters.sort==='name'?(a,b)=>displayName(a).localeCompare(displayName(b)):filters.sort==='grade'?(a,b)=>grades.indexOf(a.grade)-grades.indexOf(b.grade)||roadmapOrder(a,b):roadmapOrder);}
function renderFilters(){
 $('#filters').innerHTML=`<input id="search" aria-label="Search trophies" placeholder="Search the ledger…" value="${escapeHtml(filters.query)}">${[['kind',['story','missable','collectibles','activities','misc']],['grade',grades],['status',['earned','remaining']]].map(([key,options])=>`<select id="${key}" aria-label="Filter ${key}"><option value="">All ${key==='status'?'progress':key+'s'}</option>${options.map(v=>`<option value="${v}" ${filters[key]===v?'selected':''}>${v}</option>`).join('')}</select>`).join('')}<select id="sort" aria-label="Sort trophies">${[['roadmap','Roadmap order'],['grade','Grade'],['name','Name A–Z']].map(([v,n])=>`<option value="${v}" ${filters.sort===v?'selected':''}>${n}</option>`).join('')}</select>`;
 $('#search').oninput=e=>{filters.query=e.target.value;renderChecklist();};
 for(const key of ['kind','grade','status','sort']) $('#'+key).onchange=e=>{filters[key]=e.target.value;renderChecklist();};
}
function renderChecklist(){
 const list=applyFilters();
 $('#content').innerHTML=`<div class="sectionhead"><h2>${filters.kind==='missable'?'The one you cannot leave behind':'The trophy ledger'}</h2><span>${list.length} RESULTS / OFFICIAL DESCRIPTIONS</span></div>${filters.kind==='missable'?`<aside>${missableWarning}</aside>`:''}<div class="ledger">${list.map(t=>`<article><input type="checkbox" aria-label="Mark ${escapeHtml(displayName(t))} earned" data-id="${t.id}" ${earned(t)?'checked':''}><div><div class="rowmeta">${badge(t)}<span>STAGE ${t.stage}${t.missable?' · MISSABLE':''}</span></div><a href="#trophy=${t.id}"><h3>${escapeHtml(displayName(t))}</h3></a><p>${escapeHtml(concealed(t)?'Story name and description protected until earned.':t.description)}</p></div><a class="open" href="#trophy=${t.id}" aria-label="Open guide">↗</a></article>`).join('')}</div>${!list.length?'<p>No trophies match. Try a different filter.</p>':''}`;
 bindChecklist();
}
function bindChecklist(){document.querySelectorAll('[data-id]').forEach(el=>el.onchange=()=>{const id=Number(el.dataset.id);state.earned=el.checked?[...new Set([...state.earned,id])]:state.earned.filter(x=>x!==id);saveProgress();renderStats();renderChecklist();});}
function renderDetail(t){
 const ordered=[...trophies].sort(roadmapOrder),i=ordered.indexOf(t);
 $('#content').innerHTML=`<div class="sectionhead"><a href="#">← Checklist</a><span>${i+1} / 55 <a href="#trophy=${ordered[(i+54)%55].id}">← Previous</a>　<a href="#trophy=${ordered[(i+1)%55].id}">Next →</a></span></div><section class="detail"><div><div class="rowmeta">${badge(t)}<span>STAGE ${t.stage}</span></div><h2>${escapeHtml(displayName(t))}</h2><p class="official">${escapeHtml(concealed(t)?'Story description protected until earned.':t.description)}</p>${t.missable?`<aside>${missableWarning}</aside>`:''}${concealed(t)?'<p>Earn this story trophy or turn off spoiler protection to read its guide.</p>':`<h3>Field guide</h3><p>${escapeHtml(t.guide)}</p>${/confirmed|unconfirmed/i.test(t.guide)?'<p class="uncertain">Unconfirmed / exact trigger still being confirmed where noted above.</p>':''}<ol>${(t.steps||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol>`}</div><div class="sources"><p class="eyebrow">RESEARCH & ATTRIBUTION</p><h3>Sources, not guesswork.</h3><p>Official description above. Practical guidance in our own words.</p>${t.sources.map(s=>`<a href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.name)} ↗</a>`).join('')}<p class="muted">Links open only on request. This guide runs offline.</p></div></section>`;
}
function render(){
 if(location.hash==='#filter=missable')filters.kind='missable';
 if(location.hash==='' && filters.kind==='missable')filters.kind='';
 if(location.hash==='#spoilers=on')$('#spoilers').checked=true;
 saveProgress();renderStats();renderFilters();
 const t=trophies.find(t=>location.hash===`#trophy=${t.id}`);
 $('#filters').hidden=!!t||location.hash==='#roadmap';
 if(t)renderDetail(t);else if(location.hash==='#roadmap')$('#content').innerHTML=renderRoadmap();else renderChecklist();
}
$('#spoilers').onchange=render;
$('#clear').onclick=()=>{state={earned:[],initialized:true};render();};
$('#export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='leonida-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#import').onchange=async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data.earned)||data.earned.some(id=>!trophies.some(t=>t.id===id)))throw Error('Invalid trophy IDs');state={earned:[...new Set(data.earned)],sample:!!data.sample};render();}catch(err){$('#notice').textContent='Import failed: '+err.message;}};
addEventListener('hashchange',render);
render();
