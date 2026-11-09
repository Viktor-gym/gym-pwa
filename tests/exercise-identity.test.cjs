const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),box={exports:{}};
new Function('module',fs.readFileSync(path.resolve(__dirname,'../src/exercise-identity.js'),'utf8'))(box);
const identity=box.exports;
const clone=x=>JSON.parse(JSON.stringify(x));
const total=data=>(data.workouts||[]).reduce((n,w)=>n+w.items.reduce((n,i)=>n+(i.sets||[]).reduce((n,s)=>n+s.weight*s.reps,0),0),0);
function fixture(){return {
 exercises:[{id:'old-hammer',catalogId:'Leverage_Chest_Press',trackingType:'strength',name_ua:'Жим у Hammer'},{id:'new-hammer',catalogId:'Leverage_Incline_Chest_Press',trackingType:'strength'},{id:'scott',catalogId:'Cable_Preacher_Curl'},{id:'machine',catalogId:'Machine_Preacher_Curls'},{id:'other',catalogId:'Barbell_Curl'}],
 workouts:[{id:'w1',date:'2026-10-20',items:[{exerciseId:'old-hammer',sets:[{weight:80,reps:8,completed:true,note:'original'}]},{exerciseId:'new-hammer',sets:[{weight:100,reps:4}]},{exerciseId:'other',sets:[{weight:20,reps:10}]}]},{id:'w2',date:'2026-10-21',items:[{exerciseId:'machine',sets:[{weight:40,reps:9}]},{exerciseId:'scott',sets:[{weight:30,reps:12}]}]}],
 prs:{'old-hammer':{weight:80,reps:8},'new-hammer':{weight:100,reps:4},machine:{weight:40,reps:9},scott:{weight:30,reps:12}},
 favorites:['new-hammer','old-hammer','machine'],goals:[{id:'goal',exerciseId:'new-hammer',target:120}],
 plannedWorkouts:[{id:'plan',items:[{exerciseId:'new-hammer'},{exerciseId:'old-hammer'}]}],
 workoutTemplates:[{id:'template',items:[{exerciseId:'machine'},{exerciseId:'scott'},{exerciseId:'other'}]}],
 body:[{id:'body',weight:80,custom:{pressure:{systolic:120,diastolic:80}}}],bodyMetrics:[{id:'pressure',name:'Pressure'}],settings:{defaultRestSec:90},recommendations:[{exerciseId:'new-hammer'}]
};}
test('owner-requested consolidation preserves every session, set, volume and unrelated body data',()=>{
 const original=fixture(),before=clone(original),result=identity.mergeProfile(original);
 assert.deepEqual(original,before,'migration must not mutate its input');
 assert.equal(result.exercises.length,3);assert.equal(result.workouts.length,2);assert.equal(total(result),total(before));
 assert.equal(result.exercises.find(e=>e.id==='old-hammer').catalogId,'Leverage_Incline_Chest_Press');
 assert.equal(result.exercises.find(e=>e.id==='old-hammer').name_ua,'Жим у Hammer під кутом');
 assert.equal(result.workouts[0].items[0].sets.length,2);
 assert.deepEqual(result.workouts[0].items[0].sets[0],before.workouts[0].items[0].sets[0]);
 assert.deepEqual(result.body,before.body);assert.deepEqual(result.bodyMetrics,before.bodyMetrics);assert.deepEqual(result.settings,before.settings);
 assert.equal(result.prs['old-hammer'].weight,100);assert.equal(result.prs.scott.weight,40);
 assert.deepEqual(result.favorites,['old-hammer','scott']);assert.equal(result.goals[0].exerciseId,'old-hammer');
 assert.deepEqual(result.plannedWorkouts[0].items,[{exerciseId:'old-hammer'}]);
 assert.deepEqual(result.workoutTemplates[0].items,[{exerciseId:'scott'},{exerciseId:'other'}]);
 assert.equal(result.recommendations[0].exerciseId,'old-hammer');
 assert.deepEqual(clone(identity.mergeProfile(result)),clone(result),'repeat migrations must be idempotent');
});
test('single old exercise keeps its ID and existing barbell Scott is not merged',()=>{
 const data={exercises:[{id:'old',catalogId:'Leverage_Chest_Press'},{id:'barbell',catalogId:'Preacher_Curl'}],workouts:[],prs:{},favorites:[]};
 const result=identity.mergeProfile(data);assert.equal(result.exercises[0].id,'old');assert.equal(result.exercises[0].catalogId,'Leverage_Incline_Chest_Press');
 assert.deepEqual(result.exercises[1],data.exercises[1]);
 assert.equal(identity.canonicalId('__proto__'),'__proto__');assert.equal(identity.canonicalId('constructor'),'constructor');
});
test('equal legitimate sets are retained and merges remain profile-local',()=>{
 const data=fixture();data.workouts[0].items[1].sets=clone(data.workouts[0].items[0].sets);
 const second=fixture(),snapshot=clone(second),result=identity.mergeProfile(data);
 assert.equal(result.workouts[0].items[0].sets.length,2);assert.deepEqual(second,snapshot);
});
