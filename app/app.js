const trophies = (await (await fetch('data/trophies.json')).json()).trophies;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state;
try { state = JSON.parse(localStorage.getItem('ledger')) || {}; } catch { state = {}; }
if (new URLSearchParams(location.search).has('sample') && !state.initialized) state = {earned:trophies.filter(t=>t.id!==1).slice(0,12).map(t=>t.id),sample:true};
state.earned ||= [];
let kind = '', grade = '', status = '', query = '';
const save = () => { state.initialized = true; localStorage.setItem('ledger',JSON.stringify(state)); };
const earned = t => state.earned.includes(t.id);
const concealed = t => $('#spoilers').checked && t.kind === 'story' && !earned(t);
const name = t => concealed(t) ? 'Hidden story trophy — earn it to reveal' : t.name;
function render() {
 save();
 $('#notice').textContent = state.sample ? 'Sample progress — clear it to start your own' : 'Your progress is saved on this device.';
 $('#progress').innerHTML = `<strong>${state.earned.length} / 55 <em>ON THE ROAD TO PLATINUM</em></strong><progress max="55" value="${state.earned.length}"></progress><p>${['platinum','gold','silver','bronze'].map(g=>`${g.toUpperCase()} ${trophies.filter(t=>t.grade===g&&earned(t)).length}/${trophies.filter(t=>t.grade===g).length}`).join('　 /　 ')}</p>`;
 const hash = location.hash;
 if (hash === '#roadmap') { roadmap(); return; }
 if (hash === '#spoilers=on') $('#spoilers').checked = true;
 if (hash === '#filter=missable') kind = 'missable';
 $('#filters').hidden = false;
 $('#filters').innerHTML = `<input id="search" placeholder="Search trophy names" value="${esc(query)}"><select id="kind"><option value="">All kinds · 55</option>${['story','missable','collectibles','activities','misc'].map(k=>`<option value="${k}" ${kind===k?'selected':''}>${k} · ${trophies.filter(t=>t.kind===k).length}</option>`).join('')}</select><select id="grade"><option value="">All grades · 55</option>${['platinum','gold','silver','bronze'].map(g=>`<option ${grade===g?'selected':''}>${g}</option>`).join('')}</select><select id="status"><option value="">All progress · 55</option><option value="earned" ${status==='earned'?'selected':''}>Earned · ${state.earned.length}</option><option value="remaining" ${status==='remaining'?'selected':''}>Remaining · ${55-state.earned.length}</option></select>`;
 $('#search').oninput = e => { const cursor=e.target.selectionStart; query=e.target.value; render(); $('#search').focus(); $('#search').setSelectionRange(cursor,cursor); };
 for (const key of ['kind','grade','status']) $('#'+key).onchange = e => { if(key==='kind') kind=e.target.value; if(key==='grade') grade=e.target.value; if(key==='status') status=e.target.value; render(); };
 const selected = trophies.find(t=>hash===`#trophy=${t.id}`);
 const list = trophies.filter(t=>(!kind||t.kind===kind)&&(!grade||t.grade===grade)&&(!status||(status==='earned'?earned(t):!earned(t)))&&name(t).toLowerCase().includes(query.toLowerCase()));
 $('#content').innerHTML = selected ? detail(selected) : `<h2>${kind==='missable'?'The one to watch':'The trophy ledger'} <small>${list.length} entries</small></h2>`+list.map(t=>`<article><input aria-label="Mark ${esc(name(t))} earned" type="checkbox" data-id="${t.id}" ${earned(t)?'checked':''}><span class="disc ${t.grade}"></span><a href="#trophy=${t.id}"><b>${esc(name(t))}</b><p>${esc(concealed(t)?'Story details protected until earned.':t.description)}</p></a><span class="tag">${t.missable?'MISSABLE':t.grade.toUpperCase()}</span></article>`).join('');
 document.querySelectorAll('[data-id]').forEach(el=>el.onchange=()=>{const id=Number(el.dataset.id); state.earned=el.checked?[...new Set([...state.earned,id])]:state.earned.filter(x=>x!==id); render();});
}
function detail(t) {
 return `<a href="#">← Back to checklist</a><section class="detail"><p class="eyebrow">${t.grade} / ${t.kind} / ROADMAP STAGE ${t.stage}${t.missable&&t.kind!=='missable'?' / MISSABLE':''}</p><h2>${esc(name(t))}</h2><p>${esc(concealed(t)?'Earn this story trophy to reveal its details.':t.description)}</p>${concealed(t)?'':`<h3>Field guide</h3><p>${esc(t.guide)}</p><ol>${(t.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol><h3>Sources & further reading</h3>${t.sources.map(s=>`<a class="source" href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.name)} ↗</a>`).join('')}`}</section>`;
}
function roadmap() {
 $('#filters').hidden=true;
 $('#content').innerHTML=`<h2>Your route to Leonida Legend</h2><aside>MISSABLE · Positive Mental Attitude<br>After Down to Earth in Chapter 1, join Lucia on Jason’s balcony in the morning. Keep a Chapter 1 manual save until the trophy pops; the balcony requirement is still being confirmed. No mission replay or New Game Plus.</aside><div class="stages"><section><i>01 / STORY</i><h3>Protect your first chapter</h3><p>Gone Fishing → Chapters 1–5 → final mission. Save at each chapter start and before the finale. Avoid cheats: they disable trophies and saving.</p><p>After Down to Earth, do the balcony meditation. Save before Yago’s Chapter 3 hourglass races.</p></section><section><i>02 / EXPLORE</i><h3>Work the whole state</h3><p>Finish 8 stranger strands. Track all 18 meditation spots, 100 WAiNK locations, 3 card sets and 250 stunts for their trophies.</p><p>Chapter 4: That’s Where The Money Is opens vault jobs. Bring your partner for 5 vault escapes.</p></section><section><i>03 / CLEANUP</i><h3>Close the ledger</h3><p>Use Progress → Stats → 100% Completion after the story. Finish 42 range golds, 42 drone trials, 300 stunts, 33 underwater discoveries and 100 flamingos.</p><p>100% also needs 15 card sets and 15 meditations. Earn all other 54 trophies for platinum. Allow roughly 200 hours.</p></section></div>`;
}
$('#spoilers').onchange=render;
$('#clear').onclick=()=>{state={earned:[],initialized:true};render();};
$('#export').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state)],{type:'application/json'}));a.download='leonida-progress.json';a.click();URL.revokeObjectURL(a.href);};
$('#import').onchange=async e=>{try {const data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data.earned)||data.earned.some(id=>!trophies.some(t=>t.id===id)))throw Error('Invalid trophy IDs');state={earned:[...new Set(data.earned)],sample:!!data.sample};render();}catch(error){$('#notice').textContent='Import failed: '+error.message;}};
addEventListener('hashchange',render);
render();
