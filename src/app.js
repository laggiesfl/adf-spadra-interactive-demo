import { DEMO_DATA } from './data.js';
import { createStore } from './state.js';
import { filterPolicies, filterResources } from './filters.js';
import { applyPreferences, bindDialog } from './accessibility.js';
import { validateJoin } from './forms.js';
import { validateResourceMetadata, validateUploadDescriptor, mergeResources } from './resource-contract.js';
import { createResourceApi } from './resource-api.js';
import { bindBackToTop } from './back-to-top.js';
import { navigateToHash } from './hash-navigation.js';
import { gradeKnowledgeCheck } from './learning.js';
import { t } from './i18n.js';
import { WALKTHROUGH_STEPS, boundedStep } from './walkthrough.js';
import { renderCountries, renderPolicies, renderResources, setOptions, showErrors } from './render.js';

const $ = selector => document.querySelector(selector);
const store = createStore(localStorage);
const announce = message => { $('#live-region').textContent = ''; requestAnimationFrame(() => { $('#live-region').textContent = message; }); };
let policies = [...DEMO_DATA.policies];
let resources = [...DEMO_DATA.resources];
let liveResources = [];
let staffResources = [];
const resourceApi=createResourceApi();

function values(form) { return Object.fromEntries(new FormData(form).entries()); }
function clearInvalid(form, summary) { summary.hidden = true; summary.replaceChildren(); form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid')); }

function syncPreferences(state, shouldAnnounce = false) {
  const applied = applyPreferences(document.documentElement, state);
  $('#low-bandwidth').checked = applied.lowBandwidth;
  $('#high-contrast').checked = applied.highContrast;
  $('#reduced-motion').checked = applied.reducedMotion;
  $('#text-scale').value = String(applied.textScale);
  $('#language').value = applied.language;
  $('#bandwidth-quick').textContent = applied.lowBandwidth ? 'Turn off low-bandwidth mode' : 'Turn on low-bandwidth mode';
  let banner = $('#mode-banner');
  if (applied.lowBandwidth && !banner) { banner = document.createElement('div'); banner.id = 'mode-banner'; banner.className = 'mode-banner'; banner.textContent = 'Low-bandwidth mode active — essential content and controls are prioritised.'; document.body.prepend(banner); }
  if (!applied.lowBandwidth) banner?.remove();
  renderCurrentResults();
  if (shouldAnnounce) announce(`Display preferences updated. Low-bandwidth mode ${applied.lowBandwidth ? 'on' : 'off'}.`);
}

function initialiseOptions() {
  const pf = $('#policy-filters');
  setOptions(pf.elements.country, policies.map(x => x.country), 'All regions');
  setOptions(pf.elements.status, policies.map(x => x.status), 'All statuses');
  setOptions(pf.elements.framework, policies.map(x => x.framework), 'All frameworks');
  const rf = $('#resource-filters');
  setOptions(rf.elements.country, resources.map(x => x.country), 'All regions');
  setOptions(rf.elements.topic, resources.map(x => x.topic), 'All topics');
  setOptions(rf.elements.language, resources.map(x => x.language), 'All languages');
}

function filterForm(form) { return { query: form.elements.query.value, ...Object.fromEntries([...form.querySelectorAll('select')].map(select => [select.name, select.value])) }; }

function renderCurrentResults() {
  const low = store.getState().lowBandwidth;
  const foundPolicies = filterPolicies(policies, filterForm($('#policy-filters')));
  const foundResources = filterResources(resources, filterForm($('#resource-filters')));
  $('#policy-count').textContent = `${foundPolicies.length} policy or programme records found.`;
  $('#resource-count').textContent = `${foundResources.length} resources found.`;
  renderPolicies($('#policy-results'), foundPolicies, low);
  renderResources($('#resource-results'), foundResources, low);
}

function renderStats() {
  const stats = [
    [`${DEMO_DATA.countries.length}`, 'fictional regional members'],
    [`${policies.length}`, 'illustrative tracker records'],
    [`${resources.length}`, 'visible sample and published resources']
  ];
  $('#tracker-stats').replaceChildren(...stats.map(([value, label]) => { const item = document.createElement('div'); item.className = 'stat'; const strong = document.createElement('strong'); strong.textContent = value; const text = document.createElement('span'); text.textContent = label; item.append(strong, text); return item; }));
}

function bindFilters(form) {
  form.addEventListener('submit', event => { event.preventDefault(); renderCurrentResults(); announce('Filtered results updated.'); });
  form.addEventListener('reset', () => setTimeout(() => { renderCurrentResults(); announce('Filters cleared.'); }, 0));
}

function renderLearning() {
  const state = store.getState();
  const wrapper = document.createElement('div'); wrapper.className = 'two-column';
  const lesson = document.createElement('article'); lesson.className = 'card'; lesson.innerHTML = '<h3>Mini-module: From activity to accountability</h3><p>A progress record becomes defensible when it connects an action to evidence, responsibility and timing. This helps partners learn, follow up and improve.</p><p><strong>Estimated time:</strong> 3 minutes • Text-first format</p>';
  const complete = document.createElement('button'); complete.className = 'button'; complete.textContent = state.learning.completedLessons.includes('accountability') ? 'Lesson completed' : 'Mark lesson complete'; complete.disabled = state.learning.completedLessons.includes('accountability'); complete.addEventListener('click', () => { store.update({ learning: { ...store.getState().learning, completedLessons: ['accountability'] } }); renderLearning(); announce('Learning lesson marked complete.'); }); lesson.append(complete);
  const quiz = document.createElement('form'); quiz.className = 'card'; quiz.innerHTML = '<h3>Knowledge check</h3><fieldset><legend>Which action best supports accountable progress?</legend><label class="check"><input type="radio" name="answer" value="publish-only"> Publish an update without an owner</label><label class="check"><input type="radio" name="answer" value="document-owner-date"> Record evidence, assign an owner and agree a date</label><label class="check"><input type="radio" name="answer" value="count-only"> Show only an animated counter</label></fieldset><button class="button button-primary" type="submit">Check answer</button><p class="quiz-feedback" tabindex="-1"></p>';
  quiz.addEventListener('submit', event => { event.preventDefault(); const answer = new FormData(quiz).get('answer'); const result = gradeKnowledgeCheck(answer); const feedback = quiz.querySelector('.quiz-feedback'); feedback.textContent = t(store.getState().language, result.messageKey); feedback.className = result.correct ? 'quiz-feedback note' : 'quiz-feedback error-summary'; feedback.focus(); store.update({ learning: { ...store.getState().learning, quizAnswer: answer } }); });
  wrapper.append(lesson, quiz); $('#learning-content').replaceChildren(wrapper);
}

function bindForms() {
  $('#join-form').addEventListener('submit', event => {
    event.preventDefault(); const form = event.currentTarget; const summary = $('#join-errors'); clearInvalid(form, summary); const raw = values(form); raw.consent = form.elements.consent.checked; const result = validateJoin(raw);
    if (!result.valid) return showErrors(summary, form, result.errors);
    form.reset(); $('#join-status').textContent = 'Demonstration complete. Nothing was sent or stored externally.'; announce('Join form demonstration completed safely.');
  });
}

async function loadLiveResources(announceResult=false){
  try{liveResources=await resourceApi.listPublished();resources=mergeResources(DEMO_DATA.resources,liveResources);$('#live-resource-status').textContent=`${liveResources.length} persistent published demonstration resource${liveResources.length===1?'':'s'} loaded.`;initialiseOptions();renderStats();renderCurrentResults();if(announceResult)announce('Published resources refreshed.');}
  catch{$('#live-resource-status').textContent='Live published resources could not be loaded. The six bundled illustrative resources remain available.';resources=[...DEMO_DATA.resources];initialiseOptions();renderStats();renderCurrentResults();}
}

function showStaffState(session){const signed=Boolean(session?.authenticated);$('#staff-signed-out').hidden=signed;$('#staff-signed-in').hidden=!signed;if(signed)$('#staff-identity').textContent=`Signed in as ${session.user.name}`;}
function normaliseStaffForm(form){const raw=values(form);return {...raw,title:raw.title?.trim(),summary:raw.summary?.trim(),accessibility:raw.accessibility?.trim()}}
function resetStaffForm(){const form=$('#staff-form');form.reset();form.elements.recordId.value='';form.elements.file.required=true;form.querySelector('[type="submit"]').textContent='Upload resource';$('#staff-cancel-edit').hidden=true;}
function renderStaffResources(){const host=$('#staff-resource-list');if(!staffResources.length){host.textContent='No persistent resources have been created yet.';return}host.replaceChildren(...staffResources.map(record=>{const card=document.createElement('article');const h=document.createElement('h4');h.textContent=record.title;const p=document.createElement('p');p.textContent=`${record.publicationStatus} • ${record.country} • ${record.language}`;const actions=document.createElement('div');actions.className='resource-actions';
  const edit=document.createElement('button');edit.type='button';edit.className='button';edit.textContent=`Edit ${record.title}`;edit.addEventListener('click',()=>{const form=$('#staff-form');for(const key of ['title','summary','country','topic','language','accessibility','publicationStatus'])if(form.elements[key])form.elements[key].value=record[key]||'';form.elements.recordId.value=record.id;form.elements.file.required=false;form.querySelector('[type="submit"]').textContent='Save resource changes';$('#staff-cancel-edit').hidden=false;form.elements.title.focus()});
  const toggle=document.createElement('button');toggle.type='button';toggle.className='button';toggle.textContent=record.publicationStatus==='Published'?'Unpublish':'Publish';toggle.addEventListener('click',async()=>{toggle.disabled=true;try{await resourceApi.update(record.id,{...record,publicationStatus:record.publicationStatus==='Published'?'Draft':'Published'});await refreshStaff();await loadLiveResources(true)}catch(e){$('#staff-status').textContent=e.message}finally{toggle.disabled=false}});
  const del=document.createElement('button');del.type='button';del.className='button';del.textContent=`Delete ${record.title}`;del.addEventListener('click',async()=>{if(!confirm(`Delete “${record.title}”? This cannot be undone.`))return;del.disabled=true;try{await resourceApi.delete(record.id);await refreshStaff();await loadLiveResources(true);$('#staff-status').textContent='Resource deleted.'}catch(e){$('#staff-status').textContent=e.message}finally{del.disabled=false}});actions.append(edit,toggle,del);card.append(h,p,actions);return card}))}
async function refreshStaff(){staffResources=await resourceApi.listStaff();renderStaffResources()}
function bindStaff(){
  $('#staff-login').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('button');button.disabled=true;$('#login-status').textContent='Signing in…';try{const data=await resourceApi.login(form.elements.email.value,form.elements.password.value);form.reset();showStaffState({authenticated:true,user:data.user});await refreshStaff();$('#staff-status').textContent='Protected workspace ready.'}catch(e){$('#login-status').textContent=e.message;form.elements.email.focus()}finally{button.disabled=false}});
  $('#staff-logout').addEventListener('click',async()=>{await resourceApi.logout();showStaffState({authenticated:false});staffResources=[];resetStaffForm();$('#login-status').textContent='Signed out securely.';$('#staff-login').elements.email.focus()});
  $('#staff-cancel-edit').addEventListener('click',resetStaffForm);
  $('#staff-form').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget,summary=$('#staff-errors'),button=form.querySelector('[type="submit"]');clearInvalid(form,summary);const raw=normaliseStaffForm(form),meta=validateResourceMetadata(raw);if(!meta.valid)return showErrors(summary,form,meta.errors);const editing=Boolean(raw.recordId);if(!editing){const file=form.elements.file.files[0],check=validateUploadDescriptor(file);if(!check.valid)return showErrors(summary,form,{file:check.error})}button.disabled=true;$('#staff-status').textContent=editing?'Saving changes…':'Uploading and saving the resource…';try{if(editing)await resourceApi.update(raw.recordId,raw);else await resourceApi.create(form);resetStaffForm();await refreshStaff();await loadLiveResources(true);$('#staff-status').textContent=editing?'Resource changes saved.':'Resource uploaded and stored online.'}catch(e){$('#staff-status').textContent=e.message}finally{button.disabled=false}});
}

function bindSettings() {
  bindDialog($('#settings-dialog'), $('#settings-open'));
  ['low-bandwidth','high-contrast','reduced-motion'].forEach(id => $(`#${id}`).addEventListener('change', event => { const key = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); store.update({ [key]: event.target.checked }); syncPreferences(store.getState(), true); }));
  $('#text-scale').addEventListener('change', event => { store.update({ textScale: Number(event.target.value) }); syncPreferences(store.getState(), true); });
  $('#language').addEventListener('change', event => { store.update({ language: event.target.value }); syncPreferences(store.getState(), true); document.querySelectorAll('.french-note').forEach(x => x.remove()); if (event.target.value === 'fr') { const note = document.createElement('p'); note.className = 'french-note'; note.textContent = 'Aperçu français illustratif — une production réelle nécessiterait une traduction professionnelle approuvée par l’organisation utilisatrice.'; $('#overview').prepend(note); } });
  $('#bandwidth-quick').addEventListener('click', () => { store.update({ lowBandwidth: !store.getState().lowBandwidth }); syncPreferences(store.getState(), true); });
}

function bindWalkthrough() {
  const dialog = $('#walkthrough-dialog'); let step = boundedStep(store.getState().walkthroughStep); let source;
  function paint() { const item = WALKTHROUGH_STEPS[step]; $('#walkthrough-progress').textContent = `Step ${step + 1} of ${WALKTHROUGH_STEPS.length}`; $('#walkthrough-title').textContent = item.title; $('#walkthrough-prompt').textContent = item.prompt; $('#walkthrough-back').disabled = step === 0; $('#walkthrough-next').textContent = step === WALKTHROUGH_STEPS.length - 1 ? 'Finish' : 'Next'; store.update({ walkthroughStep: step }); }
  $('#walkthrough-open').addEventListener('click', () => { source = document.activeElement; step = boundedStep(store.getState().walkthroughStep); paint(); dialog.showModal(); });
  $('#walkthrough-close').addEventListener('click', () => dialog.close()); dialog.addEventListener('close', () => source?.focus());
  $('#walkthrough-back').addEventListener('click', () => { step = boundedStep(step - 1); paint(); });
  $('#walkthrough-next').addEventListener('click', () => { if (step === WALKTHROUGH_STEPS.length - 1) { store.update({ walkthroughStep: 0 }); dialog.close(); announce('Guided demonstration completed.'); } else { step = boundedStep(step + 1); paint(); } });
  $('#walkthrough-show').addEventListener('click', () => { const target = $(`#${WALKTHROUGH_STEPS[step].targetId}`); dialog.close(); target.scrollIntoView(); target.querySelector('h1,h2')?.setAttribute('tabindex','-1'); target.querySelector('h1,h2')?.focus(); $('#walkthrough-open').textContent = 'Resume guided demonstration'; });
}

function initialise() {
  renderCountries($('#country-grid'), $('#country-detail'), DEMO_DATA.countries);
  policies = [...DEMO_DATA.policies]; resources = [...DEMO_DATA.resources]; initialiseOptions(); renderStats(); renderLearning(); renderCurrentResults();
  bindFilters($('#policy-filters')); bindFilters($('#resource-filters')); bindForms(); bindSettings(); bindWalkthrough(); bindStaff();bindBackToTop($('#back-to-top'),$('#page-start'));
  $('#menu-button').addEventListener('click', event => { const nav = $('#primary-nav'); const open = nav.dataset.open !== 'true'; nav.dataset.open = String(open); event.currentTarget.setAttribute('aria-expanded', String(open)); });
  $('#reset-demo').addEventListener('click', () => { if (!confirm('Reset display preferences and browser-only learning progress? Persistent resources will not be deleted.')) return; store.reset(); policies = [...DEMO_DATA.policies]; resources = mergeResources(DEMO_DATA.resources,liveResources); initialiseOptions(); renderStats(); renderLearning(); syncPreferences(store.getState(), true); $('#staff-status').textContent = 'Browser-only preferences and learning progress reset. Persistent resources were preserved.'; $('#walkthrough-open').textContent = 'Start guided demonstration'; });
  syncPreferences(store.getState());
  resourceApi.session().then(async session=>{showStaffState(session);if(session.authenticated)await refreshStaff()}).catch(()=>showStaffState({authenticated:false}));loadLiveResources();
  requestAnimationFrame(() => requestAnimationFrame(() => navigateToHash(document, location.hash)));
  window.addEventListener('hashchange', () => navigateToHash(document, location.hash));
}

initialise();
