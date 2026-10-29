const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},document:{addEventListener(){}}};
for(const file of ['exercise-library-v47.js','exercise-motion-v48.js','exercise-repdb-v49.js',
  'exercise-legacy-v51.js','gym-motion-catalog-v55.js','exercise-atlas-v54.js','muscle-load-v56.js']){
  vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
}
const api=scope.window.GymMuscleLoad,atlas=scope.window.GymAtlas;
const plain=value=>JSON.parse(JSON.stringify(value));
const near=(a,b)=>assert(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const lookup=ex=>atlas.match(ex);
test('close-grip press uses triceps as primary, chest and shoulders secondary',()=>{
 const ex={id:'saved-1',catalogId:'Close-Grip_Barbell_Bench_Press',category:'arms'};
 const roles=api.roles(ex,lookup);
 assert.deepEqual(plain(roles.primary),['triceps']);
 const rows=api.distribute(800,roles),byId=Object.fromEntries(rows.map(row=>[row.id,row.value]));
 near(byId.triceps,560);near(byId.chest,120);near(byId.shoulders,120);
 near(rows.reduce((sum,row)=>sum+row.value,0),800);
});
test('all catalog muscles conserve volume and do not repeat primary as secondary',()=>{
 for(const entry of atlas.entries){
  const roles=api.roles({catalogId:entry.id},lookup);
  const rows=api.distribute(1234.567,roles);
  near(rows.reduce((sum,row)=>sum+row.value,0),1234.567);
  assert.equal(new Set(rows.map(row=>row.id)).size,rows.length);
 }
 assert.deepEqual(plain(api.distribute(10,{primary:['chest','chest'],secondary:['chest','triceps']})).map(r=>r.id),['chest','triceps']);
});
test('unmatched custom movement retains its user category without guessed muscle labels',()=>{
 const ex={id:'custom',name_ua:'Not a library exercise',category:'my-category'};
 const roles=api.roles(ex,lookup);
 assert.equal(roles.matched,false);
 assert.deepEqual(plain(api.distribute(100,roles)),[{id:'category:my-category',value:100,role:'primary'}]);
});
test('aggregate is profile-local, read-only, respects workout deletion and separates set units',()=>{
 const exercises=[{id:'a',catalogId:'Close-Grip_Barbell_Bench_Press'},{id:'b',catalogId:'Pushups',trackingType:'reps'}];
 const workouts=[{id:'w',items:[{exerciseId:'a',sets:[{weight:100,reps:8}]},{exerciseId:'b',sets:[{reps:10},{reps:12}]}]}];
 const original=JSON.stringify({workouts,exercises});
 const volumeOfSets=sets=>sets.reduce((sum,s)=>sum+(s.weight||0)*(s.reps||0),0);
 const volume=api.aggregate(workouts,exercises,{lookup,volumeOfSets});
 const sets=api.aggregate(workouts,exercises,{lookup,volumeOfSets,mode:'sets'});
 near(volume.total,800);near(sets.total,3);
 near(volume.rows.reduce((sum,row)=>sum+row.value,0),800);
 near(sets.rows.reduce((sum,row)=>sum+row.value,0),3);
 assert.equal(api.aggregate([],exercises,{lookup,volumeOfSets}).total,0);
 assert.equal(JSON.stringify({workouts,exercises}),original);
});
test('rounded percentages total 100; invalid data cannot create negative or infinite load',()=>{
 assert.deepEqual(plain(api.percentages([{value:1},{value:1},{value:1}])),[34,33,33]);
 assert.deepEqual(plain(api.distribute(Infinity,{primary:['chest']})),[]);
 assert.deepEqual(plain(api.distribute(-1,{primary:['chest']})),[]);
 assert.throws(()=>api.distribute(1,{primary:['chest']},1.1));
});
