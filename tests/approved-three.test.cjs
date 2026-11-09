const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},self:{},document:{addEventListener(){}}};
for(const n of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','exercise-guides','exercise-atlas'])
 vm.runInNewContext(fs.readFileSync(path.join(root,'src',n+'.js'),'utf8'),scope);
test('v75 publishes exactly the three approved guides without new exercise IDs',()=>{
 const ids=['Barbell_Deadlift','Svend_Press','repdb-smith-machine-front-squat'].sort();
 const added=scope.window.GYM_NATIVE_MOTIONS.filter(c=>c.release==='v75');
 assert.deepEqual(Array.from(added,c=>c.catalogId).sort(),ids);
 assert.equal(scope.window.GymAtlas.entries.length,113);
 for(const c of added){
  const e=scope.window.GymAtlas.byId.get(c.catalogId);
  assert(e);assert.equal(scope.window.GymAtlas.nativeMotion(e),c);
  assert(scope.window.GYM_EXERCISE_GUIDES[c.catalogId]);
  assert.equal(c.motionQA.posesChecked,49);assert.equal(c.views.length,3);
  assert(c.views.every(v=>v.src.includes(c.motionQA.sourceBlendSha256.slice(0,12))));
 }
 const smith=added.find(c=>c.catalogId==='repdb-smith-machine-front-squat');
 assert(smith.motionQA.opaqueShorts);assert(smith.reviewedReplacement);
});
