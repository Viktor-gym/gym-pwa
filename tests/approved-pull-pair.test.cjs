const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),s={window:{},self:{},document:{addEventListener(){}}};
for(const n of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','exercise-guides','exercise-atlas'])vm.runInNewContext(fs.readFileSync(path.join(root,'src',n+'.js'),'utf8'),s);
test('approved row and pulldown retain their existing IDs and mechanical metadata',()=>{
 const clips=s.window.GYM_NATIVE_MOTIONS.filter(c=>['Leverage_Iso_Row','Wide-Grip_Lat_Pulldown'].includes(c.catalogId));
 assert.deepEqual(Array.from(clips,c=>c.catalogId).sort(),['Leverage_Iso_Row','Wide-Grip_Lat_Pulldown']);
 assert.equal(s.window.GYM_NATIVE_MOTIONS.length,51);assert.equal(s.window.GymAtlas.entries.length,113);
 for(const clip of clips){assert.equal(clip.views.length,3);assert.equal(clip.motionQA.posesChecked,49);assert.equal(s.window.GymAtlas.nativeMotion(s.window.GymAtlas.byId.get(clip.catalogId)),clip);assert(s.window.GYM_EXERCISE_GUIDES[clip.catalogId]);}
 const row=clips.find(c=>c.catalogId==='Leverage_Iso_Row');assert(row.motionQA.gripsVertical);assert(row.motionQA.maxSavedLinkClosureErrorM<1e-5);assert.equal(row.motionQA.loadedPlates,2);
 const lat=clips.find(c=>c.catalogId==='Wide-Grip_Lat_Pulldown');assert(lat.motionQA.stackCoupled);assert(lat.motionQA.maxCableLengthErrorM<1e-5);
});
