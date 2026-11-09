const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),s={window:{},self:{},document:{addEventListener(){}}};
for(const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','exercise-atlas'])vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),s);
const expected=['Machine_Preacher_Curls','Leverage_Incline_Chest_Press','Straight-Arm_Pulldown','Cable_Crossover','Kneeling_Single-Arm_High_Pulley_Row','Leverage_Iso_Row'].sort();
test('v77 contains exactly the six authorized guides and excludes the rejected trap-bar draft',()=>{
 const added=s.window.GYM_NATIVE_MOTIONS.filter(c=>c.release==='v77');
 assert.deepEqual(Array.from(added,c=>c.catalogId).sort(),expected);
 assert.equal(s.window.GYM_NATIVE_MOTIONS.length,51);
 assert.equal(s.window.GymAtlas.entries.length,113);
 for(const c of added){
  assert.equal(c.views.length,3);assert.equal(c.motionQA.posesChecked,49);
  assert.equal(c.motionQA.publicationAuthorizedOn,'2026-11-09');
  assert(/^[a-f0-9]{64}$/.test(c.motionQA.sourceBlendSha256));
  assert(c.views.every(v=>v.src.includes(c.motionQA.sourceBlendSha256.slice(0,12))));
  assert(s.window.GymAtlas.entries.some(e=>e.id===c.catalogId));
 }
 assert(!added.some(c=>c.catalogId==='Trap_Bar_Deadlift'));
 assert.equal(s.window.GymAtlas.nativeMotion(s.window.GymAtlas.byId.get('Preacher_Curl')).release,'v66');
});
test('single-arm pull follows the cable and row correction retains its mechanism checks',()=>{
 const clips=s.window.GYM_NATIVE_MOTIONS;
 const pull=clips.find(c=>c.catalogId==='Kneeling_Single-Arm_High_Pulley_Row');
 assert(pull.motionQA.maxForearmCableAngleDegrees<.05);
 assert(pull.motionQA.minimumElbowInternalAngleDegrees>=25);
 assert(pull.motionQA.maxWristBendDegrees<.05);
 assert.equal(pull.views[1].label_ua,'Зверху');
 const row=clips.find(c=>c.catalogId==='Leverage_Iso_Row');
 assert.equal(row.motionQA.leftGripMirroredFromApprovedRight,true);
 assert(row.motionQA.maxLeftHandSymmetryErrorM<.00001);
 assert(row.motionQA.maxSavedLinkClosureErrorM<.00001);
 const machine=s.window.GymAtlas.byId.get('Machine_Preacher_Curls');
 assert(machine.instructions_ua.length>=4);
 assert(s.window.GymAtlas.search('Біцепс на лавці Скотта у тренажері',{limit:100}).some(e=>e.id===machine.id));
});
