const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},document:{addEventListener(){}}};
for(const f of ['exercise-library-v47.js','exercise-motion-v48.js','exercise-repdb-v49.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),scope);
const originals=JSON.parse(JSON.stringify(scope.window.GYM_EXERCISE_LIBRARY));
for(const f of ['exercise-legacy-v51.js','gym-motion-catalog-v55.js','native-motion-catalog-v56.js','exercise-atlas-v54.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),scope);
const atlas=scope.window.GymAtlas,clips=scope.window.GYM_NATIVE_MOTIONS;
test('reviewed native bindings retain all 68 original motion entries unchanged',()=>{
 assert.equal(clips.filter(c=>!c.release).length,14);assert.equal(new Set(clips.map(c=>c.catalogId)).size,clips.length);
 for(const original of originals)assert.deepEqual(JSON.parse(JSON.stringify(atlas.byId.get(original.id).motion||null)),original.motion||null);
 assert.equal(atlas.entries.filter(e=>e.motion).length,52);
 for(const c of clips){const e=atlas.byId.get(c.catalogId);assert(e&&(!e.motion||c.reviewedReplacement===true));assert.equal(atlas.nativeMotion(e),c);assert.equal(atlas.previewUrl(e),c.poster);assert(!atlas.thumbnail(e).includes('<video'));assert.deepEqual(JSON.parse(JSON.stringify(c.primaryMuscles)),JSON.parse(JSON.stringify(e.primaryMuscles)));assert.deepEqual(JSON.parse(JSON.stringify(c.secondaryMuscles)),JSON.parse(JSON.stringify(e.secondaryMuscles)));}
 assert.equal(atlas.nativeMotion(atlas.byId.get('Incline_Dumbbell_Curl')).release,'v67');
 assert.equal(atlas.nativeMotion(atlas.byId.get('Concentration_Curls')).release,'v68');
});
test('native payloads are small local H264 videos and single JPEG posters, never source models',()=>{
 for(const c of clips){assert(/^\.\/assets\/native-bench\/v56\/[a-z0-9-]+\.mp4$/.test(c.src));const bytes=fs.readFileSync(path.join(root,c.src));assert.equal(bytes.subarray(4,8).toString(),'ftyp');assert(bytes.length<500000);const jpg=fs.readFileSync(path.join(root,c.poster));assert.equal(jpg.readUInt16BE(),0xffd8);}
 const files=fs.readdirSync(path.join(root,'assets/native-bench/v56'));
 assert(!files.some(name=>/\.(blend|json|zip)$/i.test(name)));
 const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');assert(sw.includes('gym-pwa-v69-strength-batch'));assert(sw.includes('native-motion-precache-v56.js'));assert(sw.includes('muscle-load-v56.js'));
});

test('every native guide has three distinct real-camera videos and cached posters',()=>{
 const cacheScope={self:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'native-motion-precache-v56.js'),'utf8'),cacheScope);
 const cached=new Set(cacheScope.self.GYM_NATIVE_MOTION_ASSETS);
 for(const clip of clips){
  assert.equal(clip.views.length,3);assert.deepEqual(Array.from(clip.views,v=>v.id),['primary','side','opposite']);
  assert.equal(clip.views[0].src,clip.src);assert.equal(clip.views[0].poster,clip.poster);
  assert.equal(new Set(clip.views.map(v=>v.src)).size,3);
  const hashes=new Set();
  for(const view of clip.views){
   assert(view.label_ua&&view.label_en);assert(cached.has(view.src));assert(cached.has(view.poster));
   const bytes=fs.readFileSync(path.join(root,view.src));assert.equal(bytes.subarray(4,8).toString(),'ftyp');assert(bytes.includes(Buffer.from('avc1')));assert(bytes.length<500000);
   assert.equal(fs.readFileSync(path.join(root,view.poster)).readUInt16BE(),0xffd8);
   hashes.add(require('node:crypto').createHash('sha256').update(bytes).digest('hex'));
  }
  assert.equal(hashes.size,3,'camera videos must not be duplicates');
 }
});

test('barbell and EZ curls keep a forward elbow hinge and use fresh corrected media URLs',()=>{
 for(const id of ['Barbell_Curl','EZ-Bar_Curl','Reverse_Barbell_Curl']){
  const clip=clips.find(c=>c.catalogId===id);assert(clip);
  assert.equal(clip.motionQA.revision,'hinge-v2');assert.equal(clip.motionQA.posesChecked,49);
  assert(clip.motionQA.minForwardHingeY>1e-4,'Humerus and forearm must not cross elbow extension and flip the roll frame');
  assert(clip.views.every(v=>v.src.includes('-hinge-v2')&&v.poster.includes('-hinge-v2')));
 }
});

test('catalog revision bypasses an older phone cache and is available offline',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
 assert(html.includes('src="native-motion-catalog-v56.js?v=69"'));
 assert(sw.includes("ASSETS.push('./native-motion-catalog-v56.js?v=69')"));
 assert(html.includes("updateViaCache: 'none'"));
 assert(html.includes("document.addEventListener('visibilitychange', checkForUpdate)"));
});

test('two Smith guides have scene-reviewed support, grip checks and three real views',()=>{
 const added=clips.filter(c=>c.release==='v65');assert.equal(added.length,2);
 assert.deepEqual(Array.from(added,c=>c.catalogId).sort(),['Smith_Machine_Bench_Press','Smith_Machine_Overhead_Shoulder_Press']);
 for(const clip of added){
  assert.equal(clip.motionQA.posesChecked,49);assert.equal(clip.motionQA.supportContactsChecked,true);
  assert.equal(clip.motionQA.maxNonhandPenetrationMm,0);assert(clip.motionQA.maxHandPenetrationMm<.5);
  assert(/^[a-f0-9]{64}$/.test(clip.motionQA.sourceBlendSha256));assert.equal(clip.views.length,3);
  assert(clip.views.every(view=>view.src.includes('-v65')&&view.poster.includes('-v65')));
 }
 assert.equal(clips.length,40);
});

test('owner-selected Scott guide is exact, source-bound and honest about soft support',()=>{
 const clip=clips.find(c=>c.catalogId==='Preacher_Curl');assert(clip);
 assert.equal(clip.release,'v66');assert.equal(clip.clipId,'scott-curl');
 assert.equal(clip.motionQA.revision,'owner-scott-v66');assert.equal(clip.motionQA.posesChecked,49);
 assert(clip.motionQA.maxHandPenetrationMm<.5);assert.equal(clip.motionQA.maxNonhandPenetrationMm,0);
 assert.equal(clip.motionQA.supportContactsChecked,false);
 assert.equal(clip.motionQA.staticSoftSupportApproximation,true);
 assert.equal(clip.motionQA.fullSurfaceContactPass,false);
 assert(/^[a-f0-9]{64}$/.test(clip.motionQA.sourceBlendSha256));
 assert(clip.views.every(v=>v.src.includes('-v66')&&v.poster.includes('-v66')));
 assert(atlas.entries.some(e=>e.id==='Preacher_Curl'));
});

test('incline dumbbell curl uses audited support and preserves its original fallback',()=>{
 const clip=clips.find(c=>c.catalogId==='Incline_Dumbbell_Curl');assert(clip);
 assert.equal(clip.release,'v67');assert.equal(clip.motionQA.posesChecked,49);
 assert.equal(clip.motionQA.backrestAngleDeg,45);assert.equal(clip.motionQA.rigidBoneLengths,true);
 assert.equal(clip.motionQA.supportContactsChecked,true);assert(clip.motionQA.maxHandPenetrationMm<.5);
 assert.equal(clip.motionQA.maxNonhandPenetrationMm,0);assert(clip.reviewedReplacement);
 assert(clip.views.every(v=>v.src.includes('-v67')));
 const original=originals.find(e=>e.id===clip.catalogId);
 assert.deepEqual(JSON.parse(JSON.stringify(atlas.byId.get(clip.catalogId).motion)),original.motion);
 assert(/^[a-f0-9]{64}$/.test(clip.motionQA.surfaceAuditSha256));
});

test('concentration curl has working-arm collision checks and three audited views',()=>{
 const clip=clips.find(c=>c.catalogId==='Concentration_Curls');assert(clip);
 assert.equal(clip.release,'v68');assert.equal(clip.motionQA.posesChecked,49);
 assert.equal(clip.motionQA.workingSide,'R');assert.equal(clip.motionQA.workingArmThighIntersections,0);
 assert.equal(clip.motionQA.supportContactsChecked,true);assert.equal(clip.motionQA.rigidBoneLengths,true);
 assert(clip.motionQA.maxHandPenetrationMm<.5);assert.equal(clip.motionQA.maxNonhandPenetrationMm,0);
 assert(!('backrestAngleDeg' in clip.motionQA));assert.equal(clip.views.length,3);
 assert(clip.views.every(v=>v.src.includes('-v68')));
 assert(/^[a-f0-9]{64}$/.test(clip.motionQA.sourceBlendSha256));
});

test('v69 strength batch contains five exact source-reviewed movements',()=>{
 const expected=['Arnold_Dumbbell_Press','Barbell_Shoulder_Press','Standing_Dumbbell_Press','Dumbbell_Bicep_Curl','Barbell_Shrug'];
 const added=clips.filter(c=>c.release==='v69');
 assert.deepEqual(Array.from(added,c=>c.catalogId).sort(),expected.sort());
 for(const c of added){
  assert.equal(c.motionQA.posesChecked,49);assert(c.motionQA.rigidBoneLengths);
  assert(c.motionQA.noBackwardHinges);assert(c.motionQA.finiteShaftEndsClipped);
  assert(c.motionQA.maxHandPenetrationMm<=.5);assert(c.motionQA.maxNonhandPenetrationMm<=.1);
  assert(/^[a-f0-9]{64}$/.test(c.motionQA.sourceBlendSha256));
  assert(/^[a-f0-9]{64}$/.test(c.motionQA.surfaceAuditSha256));
  assert(c.views.every(v=>v.src.includes('-v69')&&v.poster.includes('-v69')));
  const entry=atlas.byId.get(c.catalogId);if(entry.motion)assert.equal(c.reviewedReplacement,true);
 }
});
