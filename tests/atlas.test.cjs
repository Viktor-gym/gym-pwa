const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const scope={window:{},document:{addEventListener(){}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'exercise-library-v47.js'),'utf8'),scope);
vm.runInNewContext(fs.readFileSync(path.join(root,'exercise-motion-v48.js'),'utf8'),scope);
vm.runInNewContext(fs.readFileSync(path.join(root,'exercise-repdb-v49.js'),'utf8'),scope);
const original=JSON.parse(JSON.stringify(scope.window.GYM_EXERCISE_LIBRARY));
vm.runInNewContext(fs.readFileSync(path.join(root,'exercise-legacy-v51.js'),'utf8'),scope);
vm.runInNewContext(fs.readFileSync(path.join(root,'gym-motion-catalog-v55.js'),'utf8'),scope);
vm.runInNewContext(fs.readFileSync(path.join(root,'exercise-atlas-v54.js'),'utf8'),scope);
const atlas=scope.window.GymAtlas;
test('library has unique entries and valid local image assets',()=>{
 assert.equal(atlas.entries.length,111);
 assert.equal(new Set(atlas.entries.map(x=>x.id)).size,111);
 for(const entry of atlas.entries){
   assert(entry.name&&Array.isArray(entry.images)&&entry.primaryMuscles.length>=1);
   assert(['strength','reps','time','distance'].includes(entry.trackingType));
   for(const image of entry.images){assert(!image.includes('..'));if(entry.localImages)assert(fs.existsSync(path.join(root,'assets/exercises',image)));}
 }
 assert.equal(atlas.entries.filter(entry=>!entry.images.length&&!entry.motion&&!entry.poseGuide).length,0);
 assert.equal(atlas.imageUrl(atlas.byId.get('Kettlebell_Halo')),'');
});
test('equipment and variants are kept distinct',()=>{
 assert.equal(atlas.match('Жим штанги лежачи').id,'Barbell_Bench_Press_-_Medium_Grip');
 assert.equal(atlas.match('Жим гантелей лежачи').id,'Dumbbell_Bench_Press');
 assert.equal(atlas.match('Жим гантелей під кутом').id,'Incline_Dumbbell_Press');
 assert.equal(atlas.match('Тяга трап-гриф').id,'Trap_Bar_Deadlift');
 assert.equal(atlas.match('Біцепс на лавці Скотта').id,'Cable_Preacher_Curl');
 assert.equal(atlas.match({name_ua:'Невідомий рух',category:'chest'}),null);
 assert.equal(atlas.match({name_en:'Bench Press',catalogId:'none'}),null);
});
test('search updates on prefixes and supports translated Ukrainian tokens',()=>{
 assert(atlas.search('жим').some(x=>x.id==='Dumbbell_Bench_Press'));
 assert(atlas.search('Arnold').some(x=>x.id==='Arnold_Dumbbell_Press'));
 assert(atlas.search('гантелями',{limit:1000}).some(x=>x.equipment==='dumbbell'));
 assert.equal(atlas.search('вигаданийрух123').length,0);
 assert(atlas.search('жим',{category:'chest',limit:1000}).every(x=>x.muscleGroup==='chest'));
});
test('units follow the movement, muscle annotations use source metadata',()=>{
 assert.equal(atlas.match('Підтягування').trackingType,'reps');
 assert.equal(atlas.match('Планка').trackingType,'time');
 assert.equal(atlas.match('Бігова доріжка').trackingType,'distance');
 assert.equal(atlas.match('Жим штанги лежачи').primaryMuscles[0],'chest');
 assert(atlas.match('Жим штанги лежачи').secondaryMuscles.includes('triceps'));
 assert(atlas.match('Жим штанги лежачи').instructions_ua.length>=3);
});
test('public source does not bundle profile backups or private sample references',()=>{
 const files=fs.readdirSync(root);
 assert(!files.some(name=>name.startsWith('gym-tracker-profile-')));
 const app=fs.readFileSync(path.join(root,'app-v53.js'),'utf8');
 assert(!app.includes('gym_pva/111'));
 assert(app.includes('gymPwaData_v3')&&app.includes('gymPwaApp_v4'));
});

test('remaining exact 3D motions use local static posters and valid small H264 containers',()=>{
 const animated=atlas.entries.filter(entry=>entry.motion);
 assert.equal(animated.length,53);
 assert.equal(animated.filter(e=>e.motion.provider==='repdb').length,12);
 assert(animated.filter(e=>e.motion.provider==='repdb').every(e=>e.motion.license==='CC BY-NC 4.0'));
 for(const entry of animated){
  for(const file of [entry.motion.src,entry.motion.poster])assert(fs.existsSync(path.join(root,file)));
  const mp4=fs.readFileSync(path.join(root,entry.motion.src));
  assert.equal(mp4.subarray(4,8).toString(),'ftyp');
  assert(mp4.length<400000,'optimized animation size');
  assert(atlas.previewUrl(entry).endsWith('.jpg'));
  assert(!atlas.thumbnail(entry).includes('<video'),'lists contain only a static image');
 }
 assert(atlas.match('Жим Арнольда').motion);
 assert(atlas.match('Перехресне розведення в кросовері').motion);
 assert(!atlas.match('Жим гантелей сидячи').motion,'standing movement must not replace seated movement');
 assert(!atlas.match('Жим штанги лежачи').motion,'unavailable animation is not guessed');
 assert(atlas.match('Підтягування').motion);
 assert(atlas.match('Згинання на біцепс (гантелі)').motion);
 assert(!atlas.byId.get('One-Arm_Kettlebell_Row').motion,'bench-supported variant does not replace an unsupported row');
 assert(fs.readFileSync(path.join(root,'assets/repdb-motion/LICENSE.md'),'utf8').includes('CC BY-NC 4.0'));
 assert(fs.existsSync(path.join(root,'EXERCISE-MEDIA-NOTES.md')));
});

test('offline animation range responses handle iPhone probes, suffixes and invalid ranges',async()=>{
 const listeners={};
 const swScope={self:{addEventListener(name,fn){listeners[name]=fn;}},importScripts(){},Response,Headers,URL,Request};
 vm.createContext(swScope);vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),swScope);
 const response=()=>new Response(new Uint8Array([0,1,2,3,4,5]),{headers:{'Content-Type':'video/mp4'}});
 for(const [range,start,end]of [['bytes=0-1',0,1],['bytes=2-',2,5],['bytes=-2',4,5],['bytes=4-99',4,5]]){
  const part=await swScope.rangeResponse(response(),range);
  assert.equal(part.status,206);assert.equal(part.headers.get('Content-Range'),`bytes ${start}-${end}/6`);
  assert.deepEqual([...new Uint8Array(await part.arrayBuffer())],Array.from({length:end-start+1},(_,i)=>start+i));
 }
 for(const range of ['bytes=6-','bytes=3-2','bytes=','bytes=-0','bytes=0-1,3-4'])assert.equal((await swScope.rangeResponse(response(),range)).status,416);
});

test('all existing 3D entries are unchanged, not replaced with illustrated sequences',()=>{
 for(const entry of original.filter(e=>e.motion)){
  assert.deepEqual(JSON.parse(JSON.stringify(atlas.byId.get(entry.id))),entry);
 }
 assert(!atlas.entries.some(e=>e.motion&&e.poseGuide));
 const before=new Map();
 for(const e of original)for(const name of [e.name,e.name_ua,...e.aliases].filter(Boolean))before.set(atlas.normalize(name),e.id);
 for(const [name,id]of before)assert.equal(atlas.match(name)?.id,id,'existing exact name: '+name);
});

test('photo library is restored exactly and v50 saved variants remain resolvable',()=>{
 for(const entry of original){
  const saved=JSON.parse(JSON.stringify(atlas.byId.get(entry.id)));
  assert.deepEqual({...saved,name_ua:entry.name_ua},entry);
 }
 assert.equal(scope.window.GYM_LEGACY_EXERCISES.length,178);
 for(const entry of scope.window.GYM_LEGACY_EXERCISES){
  assert.equal(atlas.match({id:'saved-user-exercise',catalogId:entry.id}).id,entry.id);
  assert.equal(entry.sourceProvider,'workout-guide');
  assert(!entry.poseGuide&&!entry.motion);
  assert(!atlas.entries.some(e=>e.id===entry.id),'legacy variants are not offered as new library entries');
 }
 assert.equal(atlas.previewUrl(atlas.match('Жим штанги лежачи')),atlas.customMotion(atlas.match('Жим штанги лежачи')).poster);
 assert.equal(atlas.search('',{limit:1000}).length,111);
 const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert(!index.includes('exercise-poses-v50.js'));
 assert(index.includes('exercise-legacy-v51.js')&&index.includes('app-v53.js'));
 assert(!fs.readFileSync(path.join(root,'exercise-atlas-v54.js'),'utf8').includes('bindPoses'));
});

test('all new exact movements preserve existing 3D and distinct equipment variants',()=>{
 assert.equal(scope.window.GYM_CUSTOM_MOTIONS.length,21);
 assert.equal(atlas.customMotion(atlas.match('Жим штанги лежачи')).clipId,'bench-press');
 assert.equal(atlas.customMotion(atlas.byId.get('Dumbbell_Bicep_Curl')).clipId,'dumbbell-curl');
 for(const id of ['Side_Lateral_Raise','Triceps_Pushdown_-_Rope_Attachment','Seated_Dumbbell_Curl','Standing_Biceps_Cable_Curl','Leverage_Chest_Press'])assert(!atlas.customMotion(atlas.byId.get(id)));
 for(const item of scope.window.GYM_CUSTOM_MOTIONS.slice(2))assert(!atlas.byId.get(item.catalogId).motion,'do not replace existing 3D');
 assert.equal(atlas.match('Жим у Hammer').id,'Leverage_Chest_Press');
 assert.equal(atlas.match('Жим у Hammer під кутом').id,'Leverage_Incline_Chest_Press');
 assert.equal(atlas.customMotion(atlas.match('Жим у Hammer під кутом')).clipId,'hammer-incline-press');
 assert.equal(atlas.match('Тяга верхнього блоку однією рукою').id,'Kneeling_Single-Arm_High_Pulley_Row');
 assert.equal(atlas.entries.filter(atlas.hasAnimation).length,73);
 for(const item of scope.window.GYM_CUSTOM_MOTIONS)assert(fs.existsSync(path.join(root,item.poster)));
 assert(fs.existsSync(path.join(root,'gym-motion-v55.js')));
});
