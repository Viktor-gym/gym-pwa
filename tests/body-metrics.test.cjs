const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../body-metrics-v52.js'),'utf8'),scope);
const metrics=scope.window.GymBodyMetrics,plain=value=>JSON.parse(JSON.stringify(value));
const number=(id,name='Pulse',unit='bpm')=>({id,name,unit,type:'number'});
test('strict decimal inputs preserve zero and signed values without accepting pressure as a scalar',()=>{
 for(const [text,value]of [['0',0],[' 35,5 ',35.5],['-0.5',-0.5],['.25',0.25]])assert.equal(metrics.parseInput(text).value,value);
 assert(metrics.parseInput('  ').empty);
 for(const text of ['120/80','abc','1.2.3','1e309','Infinity','12 cm'])assert(metrics.parseInput(text).invalid);
});
test('only finite scalar and two-part values enter custom charts; special object keys stay data',()=>{
 const values=metrics.normalizeValues(JSON.parse('{"__proto__":0,"pulse":68,"bp":{"systolic":120,"diastolic":80},"partial":{"systolic":120},"text":"bad"}'));
 assert.equal(Object.getOwnPropertyDescriptor(values,'__proto__').value,0);
 assert(metrics.hasValue({custom:values},number('pulse')));
 assert(metrics.hasValue({custom:values},{id:'bp',type:'pressure'}));
 assert(!metrics.hasValue({custom:values},number('missing')));
 assert(!Object.hasOwn(values,'partial')&&!Object.hasOwn(values,'text'));
});
test('equivalent definitions deduplicate, different units and ID collisions are remapped without conversion',()=>{
 const target=[number('a'),number('collision','Glutes','cm')];let id=0;
 const result=metrics.mergeDefinitions(target,[number('other',' pulse '),number('collision','Glutes','in'),{id:'bp',name:'Pressure',unit:'mmHg',type:'pressure'}],()=>`generated-${++id}`);
 assert.equal(result.added,2);assert.equal(result.idMap.get('other'),'a');assert.equal(result.idMap.get('collision'),'generated-1');
 const values=metrics.remapValues({other:0,collision:40,bp:{systolic:120,diastolic:80}},result.idMap);
 assert.deepEqual(plain(values),{a:0,'generated-1':40,bp:{systolic:120,diastolic:80}});
 const again=metrics.mergeDefinitions(result.metrics,[number('other'),number('collision','Glutes','in')],()=>`unused-${++id}`);
 assert.equal(again.added,0);assert.equal(again.idMap.get('collision'),'generated-1');
 assert.equal(target.length,2,'source array is not mutated');
});
test('body fingerprints include all custom values and distinguish zero from missing',()=>{
 assert.equal(metrics.fingerprint({a:1,b:{systolic:120,diastolic:80}}),metrics.fingerprint({b:{diastolic:80,systolic:120},a:1}));
 assert.notEqual(metrics.fingerprint({a:0}),metrics.fingerprint({}));
 assert.notEqual(metrics.fingerprint({a:1}),metrics.fingerprint({a:2}));
 assert.deepEqual(plain(metrics.combineValues({a:0},{b:2})),{a:0,b:2});
 assert.equal(metrics.combineValues({a:1},{a:2}),null);
});
test('archived definitions and labels are retained, duplicate IDs are not offered twice',()=>{
 const result=metrics.normalizeMetrics([{...number('a'),archived:true},number('a','Other'),{id:'empty',name:'',unit:'cm'}]);
 assert.equal(result.length,1);assert.equal(result[0].archived,true);
});
