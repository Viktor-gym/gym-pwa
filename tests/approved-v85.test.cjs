const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const scope={window:{},self:{},document:{addEventListener(){}}};
for(const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','native-motion-precache','exercise-guides','exercise-identity','exercise-atlas'])
 vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),scope);
const expected=['Lying_Leg_Curls','One_Leg_Barbell_Squat','motion-0084','Front_Plate_Raise',
 'Standing_Dumbbell_Upright_Row','Upright_Barbell_Row','repdb-ez-bar-upright-row',
 'Bent_Over_Low-Pulley_Side_Lateral','motion-0095','motion-0097','repdb-kneeling-cable-row',
 'repdb-thruster','Side_Bridge','Mountain_Climbers','Battling_Ropes','Rope_Jumping',
 'Rowing_Stationary','Bicycling_Stationary','Elliptical_Trainer','Running_Treadmill'];
test('v85 activates the exact approved twenty with three complete offline camera views',()=>{
 const all=scope.window.GYM_NATIVE_MOTIONS,clips=all.filter(c=>c.release==='v85');
 assert.equal(all.length,107);
 assert.deepEqual(Array.from(clips,c=>c.catalogId).sort(),expected.slice().sort());
 const cached=new Set(scope.self.GYM_NATIVE_MOTION_ASSETS);
 for(const clip of clips){
  const entry=scope.window.GymAtlas.byId.get(clip.catalogId);
  assert.equal(scope.window.GymAtlas.nativeMotion(entry),clip);
  assert.equal(clip.motionQA.ownerApproved,true);
  assert.equal(clip.motionQA.sampledGeometryChecksPassed,true);
  assert.equal(clip.motionQA.publicationAuthorizedOn,'2026-11-19');
  assert(/^[a-f0-9]{64}$/.test(clip.motionQA.sourceBlendSha256));
  assert.deepEqual(Array.from(clip.views,v=>v.id),['primary','side','opposite']);
  assert(clip.motionQA.renderedFramesPerView.every(n=>n>=48));
  for(const view of clip.views){
   assert(['Основний','Збоку','Спереду','Інший бік'].includes(view.label_ua));
   assert(view.src.includes(`-v85-${clip.motionQA.sourceBlendSha256.slice(0,12)}-`));
   for(const asset of [view.src,view.poster]){assert(cached.has(asset));assert(fs.existsSync(path.join(root,asset)));}
  }
 }
});
test('walking retains the saved treadmill ID and the side plank holds instead of restarting',()=>{
 const atlas=scope.window.GymAtlas,walk=atlas.byId.get('Running_Treadmill');
 assert.equal(walk.name_ua,'Ходьба на біговій доріжці');
 assert(walk.aliases.includes('Running, Treadmill'));
 assert(walk.instructions_ua.some(x=>x.includes('п’яти')));
 assert(!walk.instructions_ua.some(x=>x.includes('перейдіть до бігу')));
 const plank=atlas.nativeMotion(atlas.byId.get('Side_Bridge'));
 assert.equal(plank.loop,false);
 const smith=atlas.nativeMotion(atlas.byId.get('motion-0084'));
 assert.equal(smith.motionQA.straightArmsThroughHinge,true);
 assert(smith.motionQA.maxElbowFlexionDegrees<5);
 const climber=atlas.nativeMotion(atlas.byId.get('Mountain_Climbers'));
 assert.equal(climber.motionQA.relaxedAirborneToes,true);
 assert(climber.motionQA.maxAirborneAnkleBendDegrees<32.1);
 assert.equal(plank.motionQA.fps,32);
 assert(plank.motionQA.renderedFramesPerView.every(n=>n===192));
 for(const id of ['Upright_Barbell_Row','repdb-ez-bar-upright-row']){
  const clip=atlas.nativeMotion(atlas.byId.get(id));
  assert.equal(clip.motionQA.elbowOpenBoundaryEdges,0);
  assert.equal(clip.motionQA.elbowSkinFairing,true);
 }
 assert(scope.window.GYM_EXERCISE_GUIDES['motion-0097'].src.includes('motion-0097-'));
});
