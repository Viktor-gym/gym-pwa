const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},document:{addEventListener(){}}};
for(const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','exercise-identity','exercise-atlas'])vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),scope);
const expected=['Chin-Up','Close-Grip_Front_Lat_Pulldown','Underhand_Cable_Pulldowns','Triceps_Pushdown','Triceps_Pushdown_-_Rope_Attachment','repdb-single-arm-tricep-pushdown','Low_Cable_Crossover','Seated_One-arm_Cable_Pulley_Rows'].sort();
test('v80 publishes exactly eight authorized native guides without changing exercise IDs',()=>{
 const clips=scope.window.GYM_NATIVE_MOTIONS.filter(c=>c.release==='v80');
 assert.deepEqual(Array.from(clips,c=>c.catalogId).sort(),expected);
 assert.equal(scope.window.GYM_NATIVE_MOTIONS.length,65);
 for(const clip of clips){
  assert(scope.window.GymAtlas.byId.has(clip.catalogId));
  assert.equal(clip.motionQA.ownerApproved,true);assert.equal(clip.motionQA.posesChecked,49);
  assert.equal(clip.motionQA.fps,16);assert.deepEqual(Array.from(clip.motionQA.renderedFramesPerView),[48,48,48]);
  assert(/^[a-f0-9]{64}$/.test(clip.motionQA.sourceBlendSha256));
  assert.equal(clip.views.length,3);
  for(const view of clip.views)assert(view.src.includes('-v80-'+clip.motionQA.sourceBlendSha256.slice(0,12)));
 }
});
test('face pull and rope pullover remain unpublished native candidates with original fallbacks',()=>{
 for(const id of ['Face_Pull','Rope_Straight-Arm_Pulldown']){
  const exercise=scope.window.GymAtlas.byId.get(id);assert(exercise);
  assert(!scope.window.GYM_NATIVE_MOTIONS.some(c=>c.catalogId===id));
  assert(exercise.motion||exercise.images.length,'keep the existing demonstration');
 }
});
