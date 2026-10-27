const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const scope={window:{},document:{addEventListener(){}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'exercise-library-v47.js'),'utf8'),scope);
vm.runInNewContext(fs.readFileSync(path.join(root,'exercise-atlas-v47.js'),'utf8'),scope);
const atlas=scope.window.GymAtlas;
test('library has unique entries and valid local image assets',()=>{
 assert.equal(atlas.entries.length,876);
 assert.equal(new Set(atlas.entries.map(x=>x.id)).size,876);
 for(const entry of atlas.entries){
   assert(entry.name&&Array.isArray(entry.images)&&entry.primaryMuscles.length>=1);
   assert(['strength','reps','time','distance'].includes(entry.trackingType));
   for(const image of entry.images){assert(!image.includes('..'));if(entry.localImages)assert(fs.existsSync(path.join(root,'assets/exercises',image)));}
 }
 assert.equal(atlas.entries.filter(entry=>entry.images.length===0).length,3);
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
 const app=fs.readFileSync(path.join(root,'app-v47.js'),'utf8');
 assert(!app.includes('gym_pva/111'));
 assert(app.includes('gymPwaData_v3')&&app.includes('gymPwaApp_v4'));
});
