const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},self:{},document:{addEventListener(){}}};
for(const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','native-motion-precache','exercise-identity','exercise-atlas'])vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),scope);
const expected=['Chin-Up','Close-Grip_Front_Lat_Pulldown','Underhand_Cable_Pulldowns','Triceps_Pushdown','Triceps_Pushdown_-_Rope_Attachment','repdb-single-arm-tricep-pushdown','Low_Cable_Crossover','Seated_One-arm_Cable_Pulley_Rows'].sort();
test('v80 publishes exactly eight authorized native guides without changing exercise IDs',()=>{
 const clips=scope.window.GYM_NATIVE_MOTIONS.filter(c=>c.release==='v80');
 assert.deepEqual(Array.from(clips,c=>c.catalogId).sort(),expected);
 for(const clip of clips){
  assert(scope.window.GymAtlas.byId.has(clip.catalogId));
  assert.equal(clip.motionQA.ownerApproved,true);assert.equal(clip.motionQA.posesChecked,49);
  assert.equal(clip.motionQA.fps,16);assert.deepEqual(Array.from(clip.motionQA.renderedFramesPerView),[48,48,48]);
  assert(/^[a-f0-9]{64}$/.test(clip.motionQA.sourceBlendSha256));
  assert.equal(clip.views.length,3);
  for(const view of clip.views)assert(view.src.includes('-v80-'+clip.motionQA.sourceBlendSha256.slice(0,12)));
 }
});
test('v81 adds exactly the two authorized rope exercises with playable native views',()=>{
 const clips=scope.window.GYM_NATIVE_MOTIONS.filter(c=>c.release==='v81');
 assert.deepEqual(Array.from(clips,c=>c.catalogId).sort(),['Face_Pull','Rope_Straight-Arm_Pulldown']);
 const cached=new Set(scope.self.GYM_NATIVE_MOTION_ASSETS);
 for(const clip of clips){
  const entry=scope.window.GymAtlas.byId.get(clip.catalogId);
  assert.equal(scope.window.GymAtlas.nativeMotion(entry),clip);
  assert.equal(clip.motionQA.ownerApproved,true);
  assert.deepEqual(Array.from(clip.views,v=>v.id),['primary','side','opposite']);
  for(const view of clip.views){
   assert(cached.has(view.src)&&cached.has(view.poster));
   assert(fs.statSync(path.join(root,view.src)).size>0);
   assert(fs.statSync(path.join(root,view.poster)).size>0);
  }
 }
});
