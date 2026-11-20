const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),scope={window:{},self:{},document:{addEventListener(){}}};
for(const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','native-motion-precache','exercise-identity','exercise-atlas'])
 vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),scope);
const expected=['Step_Mill','motion-0082','motion-0053','motion-0058','Front_Barbell_Squat','repdb-smith-machine-front-squat'];
test('v86 publishes the exact six reviewed guides and covers the retained catalog',()=>{
 const all=scope.window.GYM_NATIVE_MOTIONS,clips=all.filter(c=>c.release==='v86'),atlas=scope.window.GymAtlas;
 assert.equal(all.length,111);assert.equal(new Set(all.map(c=>c.catalogId)).size,111);
 assert.deepEqual(Array.from(clips,c=>c.catalogId).sort(),expected.slice().sort());
 assert.equal(atlas.entries.length,111);
 const cached=new Set(scope.self.GYM_NATIVE_MOTION_ASSETS);
 for(const entry of atlas.entries)assert(atlas.nativeMotion(entry),'No native guide: '+entry.id);
 for(const clip of clips){
  assert.equal(atlas.nativeMotion(atlas.byId.get(clip.catalogId)),clip);
  assert(clip.reviewedReplacement&&clip.motionQA.ownerApproved&&clip.motionQA.kinematicAuditPassed);
  assert.equal(clip.motionQA.publicationAuthorizedOn,'2026-11-20');
  assert.equal(clip.motionQA.posesChecked,97);assert.equal(clip.motionQA.fps,32);
  assert.deepEqual(Array.from(clip.motionQA.renderedFramesPerView),[96,96,96]);
  assert.equal(clip.motionQA.continuousCollisionAuditPassed,false);
  assert.match(clip.motionQA.sourceBlendSha256,/^[a-f0-9]{64}$/);
  assert.deepEqual(Array.from(clip.views,v=>v.label_ua),['Основний','Збоку','Інший бік']);
  const hashes=new Set();
  for(const view of clip.views){
   assert(view.src.includes(`-v86-${clip.motionQA.sourceBlendSha256.slice(0,12)}-`));
   assert(cached.has(view.src)&&cached.has(view.poster));
   const movie=fs.readFileSync(path.join(root,view.src));
   assert.equal(movie.subarray(4,8).toString(),'ftyp');assert(movie.includes(Buffer.from('avc1')));assert(movie.length<500000);
   assert.equal(fs.readFileSync(path.join(root,view.poster)).readUInt16BE(),0xffd8);
   hashes.add(crypto.createHash('sha256').update(movie).digest('hex'));
  }
  assert.equal(hashes.size,3);
 }
 for(const id of ['Step_Mill','motion-0082']){
  const qa=atlas.nativeMotion(atlas.byId.get(id)).motionQA;
  assert(qa.railParallelToStairs&&qa.upperPlatformRemoved);assert.equal(qa.stanceEndKneeFlexionDegrees,15);
 }
});
