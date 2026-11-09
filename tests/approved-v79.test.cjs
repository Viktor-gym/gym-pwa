const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},self:{},document:{addEventListener(){}}};
for(const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','native-motion-precache','exercise-identity','exercise-atlas'])
 vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),scope);
const approved={
 Decline_Barbell_Bench_Press:'035988f501e136b2510a2e34198c3084dcbeb23c8ea47cb541c8aa8c23b1421c',
 Decline_Dumbbell_Bench_Press:'37051f745df047939062f00b70a0425b53d48b594f6cccdfa14cfd86c9a8c315',
 Decline_Dumbbell_Flyes:'edd2ed8c4d160d933ba8c708d19411cf7be952267d2b8dbfd2c06da358210408',
 Seated_Cable_Rows:'e9e2764481f95547005444002dd4527b0d8a6fe03716a821589fc5e2f8f5b3b0',
 Pullups:'1c35470aa9149436d95b4dfdd3654755633a07abb6c40d4b8ff4f8e8e9afc78e',
 Trap_Bar_Deadlift:'1fce71fe9d6c7312839d6484ca737ccc0a8d431d975d3dafa035d5e0afb269e6'
};
test('v79 publishes exactly the six approved sources with existing exercise IDs',()=>{
 const clips=scope.window.GYM_NATIVE_MOTIONS.filter(clip=>clip.release==='v79');
 assert.deepEqual(Array.from(clips,clip=>clip.catalogId).sort(),Object.keys(approved).sort());
 assert.equal(scope.window.GymAtlas.entries.length,111);
 assert.equal(scope.window.GYM_NATIVE_MOTIONS.length,57);
 const cached=new Set(scope.self.GYM_NATIVE_MOTION_ASSETS);
 for(const clip of clips){
  assert.equal(clip.motionQA.sourceBlendSha256,approved[clip.catalogId]);
  assert.equal(clip.motionQA.ownerApproved,true);
  assert.equal(clip.motionQA.posesChecked,49);
  assert.equal(clip.motionQA.fps,16);
  assert(clip.motionQA.renderedFramesPerView.every(count=>count>=48));
  assert.equal(scope.window.GymAtlas.nativeMotion(scope.window.GymAtlas.byId.get(clip.catalogId)),clip);
  assert.deepEqual(Array.from(clip.views,view=>view.id),['primary','side','opposite']);
  for(const view of clip.views){
   assert(view.src.includes('-v79-'+approved[clip.catalogId].slice(0,12)));
   assert(cached.has(view.src)&&cached.has(view.poster));
   assert(fs.existsSync(path.join(root,view.src))&&fs.existsSync(path.join(root,view.poster)));
  }
 }
});
test('unapproved pull-up and cable candidates are not part of this release',()=>{
 for(const id of ['Chin-Up','Close-Grip_Front_Lat_Pulldown','Underhand_Cable_Pulldowns','Seated_One-arm_Cable_Pulley_Rows',
                  'Rope_Straight-Arm_Pulldown','Low_Cable_Crossover','Triceps_Pushdown','Triceps_Pushdown_-_Rope_Attachment',
                  'repdb-single-arm-tricep-pushdown','Face_Pull'])
  assert(!scope.window.GYM_NATIVE_MOTIONS.some(clip=>clip.catalogId===id&&clip.release==='v79'));
});
