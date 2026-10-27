const {test}=require('node:test');
const assert=require('node:assert/strict');
const ready=Promise.all([import('three'),import('../motion-src/core/engine.js'),import('../motion-src/core/mesh.js'),import('../motion-src/core/exercises.js'),import('../motion-src/core/mannequin.js')]);
async function create(){const [T,{ExerciseEngine},{createMaterials},{EXERCISES},{DIMENSIONS}]=await ready;return {T,EXERCISES,DIMENSIONS,engine:new ExerciseEngine(T,createMaterials(T,{foreground:new T.Color('gray'),background:new T.Color('white'),muted:new T.Color('gray'),primary:new T.Color('red'),secondary:new T.Color('orange')}))};}
const near=(a,b,label,tolerance=1e-5)=>assert(Math.abs(a-b)<tolerance,`${label}: ${a} != ${b}`);
test('all shared clips keep limb lengths, exact foot targets and equipment grip across 121 poses',async()=>{
 const {engine,EXERCISES,DIMENSIONS,T}=await create();
 try{for(const clip of Object.values(EXERCISES)){
  engine.setExercise(clip.id);
  for(let frame=0;frame<=120;frame++){
   const pose=engine.poseAt(clip.duration*frame/120);
   for(const item of engine.model.diagnostics){for(const key of ['upperArm','forearm','thigh','shin'])near(item[key],DIMENSIONS[key],clip.id+' '+key);near(item.armReachError,0,clip.id+' arm');near(item.legReachError,0,clip.id+' leg');}
   for(const {arm,leg}of engine.model.limbs){near(arm.hand.gripPosition().distanceTo(pose.hands[arm.side].grip),0,clip.id+' palm');near(leg.ankle.distanceTo(pose.feet[leg.side].ankle),0,clip.id+' foot');}
   for(const handle of engine.equipment.handles.filter(h=>h.userData.side)){const grip=engine.grips.find(g=>g.side===handle.userData.side);near(handle.getWorldPosition(new T.Vector3()).distanceTo(grip.position),0,clip.id+' handle');}
   if(pose.bar)for(const grip of engine.grips){const delta=grip.position.clone().sub(pose.bar),zAxis=['bench-press','incline-barbell-press','incline-dumbbell-press','lying-triceps-press','flat-dumbbell-press','close-grip-bench-press'].includes(clip.id);near(zAxis?Math.hypot(delta.x,delta.y):Math.hypot(delta.y,delta.z),0,clip.id+' rigid bar');}
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

test('underhand curls, overhand presses and neutral handles have different anatomical palm orientations',async()=>{
 const {engine,EXERCISES,T}=await create(),{gripMode,gripLabel}=await import('../motion-src/core/grips.js');
 try{
  for(const clip of Object.values(EXERCISES)){assert(gripMode(clip),clip.id+' explicit grip');assert(gripLabel(clip,'ua')&&gripLabel(clip,'en'));}
  for(const id of ['barbell-curl','cable-preacher-curl','concentration-curl']){
   engine.setExercise(id);
   for(let i=0;i<60;i++){engine.poseAt(engine.clip.duration*i/60);for(const {arm}of engine.model.limbs){if(id==='concentration-curl'&&arm.side!==1)continue;const forward=arm.wrist.clone().sub(arm.elbow).normalize(),expected=new T.Vector3(0,forward.z,-forward.y).normalize(),palm=new T.Vector3(0,0,1).applyQuaternion(arm.hand.root.quaternion);near(palm.dot(expected),1,id+' supinated palm');}}
  }
  engine.setExercise('bench-press');engine.poseAt(0);for(const {arm}of engine.model.limbs)assert(new T.Vector3(0,0,1).applyQuaternion(arm.hand.root.quaternion).x<-0.9,'bench is overhand, not curl grip');
  for(const id of ['trap-bar-deadlift','seated-cable-row','leverage-row','kneeling-single-arm-pulldown']){
   engine.setExercise(id);for(let i=0;i<60;i++){engine.poseAt(engine.clip.duration*i/60);for(const {arm}of engine.model.limbs){if(id==='kneeling-single-arm-pulldown'&&arm.side!==1)continue;const palm=new T.Vector3(0,0,1).applyQuaternion(arm.hand.root.quaternion);assert(palm.x*-arm.side>0.75,id+' inward neutral palm');}}
  }
  for(const {arm}of engine.model.limbs){assert(arm.hand.root.getObjectByName('palm-surface'));let nails=0;arm.hand.root.traverse(o=>{if(o.name==='fingernail')nails++;});assert.equal(nails,4);}
 }finally{engine.dispose();}
});
test('kneeling has a supported knee, hanging legs rise to hip height, trap plates start above the floor',async()=>{
 const {engine}=await create();
 try{
  engine.setExercise('kneeling-single-arm-pulldown');for(let i=0;i<60;i++){engine.poseAt(i*0.08);near(engine.model.limbs.find(l=>l.leg.side===1).leg.knee.y,0.095,'supported knee');}
  engine.setExercise('hanging-leg-raise');const bar=engine.poseAt(0).hands[1].grip.clone();engine.poseAt(engine.clip.duration*0.49);for(const {leg}of engine.model.limbs){assert(leg.ankle.z-leg.hip.z>0.85);assert(Math.abs(leg.ankle.y-leg.hip.y)<0.03);}near(engine.pose.hands[1].grip.distanceTo(bar),0,'stationary hanging grip');
  engine.setExercise('trap-bar-deadlift');const height=engine.poseAt(0).bar.y-0.22;assert(height>=0.005&&height<0.03,'plates above floor');
 }finally{engine.dispose();}
});
