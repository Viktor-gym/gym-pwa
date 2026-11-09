const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},self:{},document:{addEventListener(){}}};
for(const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','exercise-guides','exercise-identity','exercise-atlas'])vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),scope);
test('every visible exercise has bilingual names and English technique plus a Ukrainian guide',()=>{
 for(const e of scope.window.GymAtlas.entries){
  assert(/[А-Яа-яІіЇїЄєҐґ]/u.test(e.name_ua),e.id);
  assert(/[A-Za-z]/.test(e.name)&&!/[А-Яа-яІіЇїЄєҐґ]/u.test(e.name),e.id);
  assert(e.instructions?.length,e.id+' English technique');
  assert(!/[А-Яа-яІіЇїЄєҐґ]/u.test(e.instructions.join(' ')),e.id);
  assert(scope.window.GYM_EXERCISE_GUIDES[e.id]||e.instructions_ua?.length,e.id+' Ukrainian technique');
 }
 const atlas=scope.window.GymAtlas;
 assert(!atlas.entries.some(e=>['Machine_Preacher_Curls','Leverage_Chest_Press'].includes(e.id)));
 assert.equal(atlas.nativeMotion(atlas.byId.get('Machine_Preacher_Curls')),atlas.nativeMotion(atlas.byId.get('Cable_Preacher_Curl')));
 assert.equal(atlas.match({catalogId:'Leverage_Chest_Press'}).id,'Leverage_Chest_Press','historical IDs must still resolve');
});
test('both UI dictionaries cover the same navigation and message keys',()=>{
 const source=fs.readFileSync(path.join(root,'src/app.js'),'utf8');
 const start=source.indexOf('const i18n ='),end=source.indexOf('// ---------- categories ----------',start),context={};
 vm.runInNewContext(source.slice(start,end)+';globalThis.dictionary=i18n;',context);
 assert.deepEqual(Object.keys(context.dictionary.ua).sort(),Object.keys(context.dictionary.en).sort());
 for(const match of source.matchAll(/\bt\(["']([^"']+)["']\)/g)){
  assert(context.dictionary.ua[match[1]],match[1]);assert(context.dictionary.en[match[1]],match[1]);
 }
 assert(source.includes('document.documentElement.lang='));assert(source.includes("label.textContent=t(b.getAttribute('data-tab'))"));
});
test('home is limited to five recent sessions and library has no animation-only filtering',()=>{
 const source=fs.readFileSync(path.join(root,'src/app.js'),'utf8');
 const recent=source.slice(source.indexOf('function renderRecentWorkouts()'),source.indexOf('function renderFavStrip()'));
 assert(recent.includes('[...state.workouts].sort('));assert(/\.slice\(0,\s*5\)/.test(recent));assert(!recent.includes('state.workouts ='));
 const library=source.slice(source.indexOf('function viewExerciseLibrary()'),source.indexOf('function activeProfile()'));
 assert(!library.includes('atlasMotionOnly'));assert(!library.includes('atlasAnimatedOnly'));
 assert(!library.includes('additional animations:'));assert(!library.includes('додаткових анімацій:'));
});
