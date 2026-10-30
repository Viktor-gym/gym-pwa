const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},document:{addEventListener(){}}};
for(const file of ['exercise-library-v47.js','exercise-motion-v48.js','exercise-repdb-v49.js','exercise-legacy-v51.js','gym-motion-catalog-v55.js','native-motion-catalog-v56.js','exercise-atlas-v54.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
const atlas=scope.window.GymAtlas;

test('curated catalog and search contain only Ukrainian-named retained movements',()=>{
 assert.equal(atlas.entries.length,111);
 const available=new Set(atlas.entries.map(entry=>entry.id));
 for(const entry of atlas.entries){
  assert(/[А-Яа-яІіЇїЄєҐґ]/u.test(entry.name_ua),entry.id);
  assert(!/\balternating\b/i.test(entry.name));
 }
 assert.deepEqual(Array.from(atlas.search('',{limit:2000}),e=>e.id).sort(),Array.from(available).sort());
 for(const query of ['running','планка','скручування','Alternating','Atlas Stones','Ankle Circles']){
  for(const result of atlas.search(query,{limit:1000}))assert(available.has(result.id),query);
 }
 for(const query of ['Alternating','Atlas Stones','Ankle Circles'])assert.equal(atlas.search(query,{limit:1000}).length,0,query);
});

test('explicit removals disappear but completed in-house 3D guides are retained',()=>{
 for(const id of ['repdb-running','Machine_Preacher_Curls','Leverage_High_Row','motion-0094','Leverage_Shoulder_Press','Machine_Bench_Press','Cable_Rear_Delt_Fly','Preacher_Curl','repdb-cat-cow','motion-0070','motion-0072','motion-0065','repdb-side-lying-lateral-raise','Flat_Bench_Lying_Leg_Raise','motion-0071','Flat_Bench_Leg_Pull-In','Plank','motion-0066','Seated_Triceps_Press','Ab_Roller','Russian_Twist','Crunches','Cable_Crunch','Split_Squat_with_Dumbbells','repdb-one-arm-kettlebell-row','EZ-Bar_Skullcrusher','Walking_Treadmill','Butt_Lift_Bridge']){
  assert(atlas.byId.has(id),'historical ID must resolve: '+id);
  assert(!atlas.entries.some(e=>e.id===id),id);
 }
 for(const motion of [...scope.window.GYM_NATIVE_MOTIONS,...scope.window.GYM_CUSTOM_MOTIONS]){
  assert(atlas.entries.some(e=>e.id===motion.catalogId),'completed in-house guide retained: '+motion.catalogId);
 }
 assert(atlas.entries.some(e=>e.id==='Wide-Grip_Barbell_Bench_Press'),'explicit removal exception');
});

test('new Ukrainian names are searchable and archived history still resolves',()=>{
 assert.equal(atlas.search('Згинання з EZ-грифом')[0].id,'EZ-Bar_Curl');
 assert.equal(atlas.search('Випади назад з гантелями')[0].id,'Dumbbell_Rear_Lunge');
 for(const id of ['Plank','Atlas_Stones','Preacher_Curl'])assert.equal(atlas.match({catalogId:id}).id,id);
 const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
 assert(sw.includes("ASSETS.push('./exercise-atlas-v54.js?v=65')"));
 assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('exercise-atlas-v54.js?v=65'));
});

test('seated leg curl is removed but lying curl, extensions and saved IDs remain',()=>{
 for(const id of ['Seated_Leg_Curl']){
  assert(!atlas.entries.some(e=>e.id===id));assert.equal(atlas.match({catalogId:id}).id,id);
 }
 assert(atlas.entries.some(e=>e.id==='Leg_Extensions'));
 assert(atlas.entries.some(e=>e.id==='Lying_Leg_Curls'));
 assert(!atlas.search('згинання ніг сидячи',{limit:1000}).length);
});
