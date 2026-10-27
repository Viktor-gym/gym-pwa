const {test}=require('node:test');
const assert=require('node:assert/strict');
const ready=Promise.all([import('three'),import('../motion-src/core/engine.js'),import('../motion-src/core/mesh.js'),import('../motion-src/core/exercises.js'),import('../motion-src/core/mannequin.js')]);
async function create(){const [T,{ExerciseEngine},{createMaterials},{EXERCISES},{DIMENSIONS}]=await ready;return {T,EXERCISES,DIMENSIONS,engine:new ExerciseEngine(T,createMaterials(T,{foreground:new T.Color('gray'),background:new T.Color('white'),muted:new T.Color('gray'),primary:new T.Color('red'),secondary:new T.Color('orange')}))};}
const near=(a,b,label,tolerance=1e-5)=>assert(Math.abs(a-b)<tolerance,`${label}: ${a} != ${b}`);
test('all ten shared clips keep limb lengths, planted feet and equipment grip across 121 poses',async()=>{
 const {engine,EXERCISES,DIMENSIONS,T}=await create();
 try{for(const clip of Object.values(EXERCISES)){
  engine.setExercise(clip.id);
  for(let frame=0;frame<=120;frame++){
   const pose=engine.poseAt(clip.duration*frame/120);
   for(const item of engine.model.diagnostics){for(const key of ['upperArm','forearm','thigh','shin'])near(item[key],DIMENSIONS[key],clip.id+' '+key);near(item.armReachError,0,clip.id+' arm');near(item.legReachError,0,clip.id+' leg');}
   for(const {arm,leg}of engine.model.limbs){near(arm.hand.gripPosition().distanceTo(pose.hands[arm.side].grip),0,clip.id+' palm');near(leg.ankle.distanceTo(pose.feet[leg.side].ankle),0,clip.id+' foot');}
   if(['incline-dumbbell-press','concentration-curl','cable-crossover','hammer-incline-press','dumbbell-curl'].includes(clip.id))for(const handle of engine.equipment.handles){const grip=engine.grips.find(g=>g.side===handle.userData.side);near(handle.getWorldPosition(new T.Vector3()).distanceTo(grip.position),0,clip.id+' handle');}
   if(pose.bar)for(const grip of engine.grips){const delta=grip.position.clone().sub(pose.bar);near(clip.id==='barbell-curl'||clip.id==='cable-preacher-curl'?Math.hypot(delta.y,delta.z):Math.hypot(delta.x,delta.y),0,clip.id+' rigid bar');}
  }
 }}finally{engine.dispose();}
});
test('switching all clips reuses one mannequin and every hand/geometry; cycles close without jumps',async()=>{
 const {engine,EXERCISES}=await create(),identity=()=>{const ids=[];engine.model.root.traverse(o=>{ids.push(o.uuid);if(o.geometry)ids.push(o.geometry.uuid);});return ids;},ids=identity();
 try{for(let pass=0;pass<2;pass++)for(const clip of Object.values(EXERCISES)){
  engine.setExercise(clip.id);assert.deepEqual(identity(),ids);assert.equal(engine.root.children.length,2);
  engine.poseAt(0);const zero=engine.grips.map(g=>g.position.clone());engine.poseAt(clip.duration-1e-6);engine.grips.forEach((g,i)=>near(g.position.distanceTo(zero[i]),0,clip.id+' loop'));
  engine.root.traverse(o=>{if(o.geometry)for(const attribute of Object.values(o.geometry.attributes))for(const value of attribute.array)assert(Number.isFinite(value),clip.id+' finite geometry');});
 }}finally{engine.dispose();}
});
test('isolation clips keep elbows fixed; crossover keeps a constant elbow bend; Hammer follows a fixed lever arc',async()=>{
 const {engine,EXERCISES,T}=await create();
 try{for(const id of ['barbell-curl','cable-preacher-curl','lying-triceps-press','concentration-curl']){
  engine.setExercise(id);const elbows=engine.model.limbs.map(({arm})=>arm.elbow.clone());
  for(let frame=0;frame<60;frame++){engine.poseAt(EXERCISES[id].duration*frame/60);engine.model.limbs.forEach(({arm},index)=>{if(id!=='concentration-curl'||arm.side===1)near(arm.elbow.distanceTo(elbows[index]),0,id+' elbow');});}
 }
 engine.setExercise('cable-crossover');for(let i=0;i<60;i++){engine.poseAt(i*0.08);for(const {arm}of engine.model.limbs)near(arm.shoulder.distanceTo(arm.wrist),0.59,'fly reach');}
 engine.setExercise('hammer-incline-press');for(let i=0;i<60;i++){const p=engine.poseAt(i*0.08);for(const side of [-1,1])near(p.hands[side].grip.distanceTo(new T.Vector3(side*0.56,1.95,-0.35)),Math.hypot(0.21,0.9,0.46),'lever radius');}
 }finally{engine.dispose();}
});
