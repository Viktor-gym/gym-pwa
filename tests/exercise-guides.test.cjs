const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{},self:{},document:{addEventListener(){}}};
for(const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy','gym-motion-catalog','native-motion-catalog','exercise-guides','exercise-guides-precache','exercise-atlas'])vm.runInNewContext(fs.readFileSync(path.join(root,'src',name+'.js'),'utf8'),scope);

test('all 112 visible exercises have one exact illustrated guide, without changing IDs',()=>{
 const entries=scope.window.GymAtlas.entries,guides=scope.window.GYM_EXERCISE_GUIDES;
 assert.equal(entries.length,112);assert.equal(Object.keys(guides).length,112);
 for(const entry of entries){
  const guide=guides[entry.id];assert(guide,entry.id);assert(guide.width>=800&&guide.height>guide.width);
  const bytes=fs.readFileSync(path.join(root,guide.src));
  assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');
  assert.equal(guide.language,'ua');assert(guide.src.includes('/exercise-guides/'));
 }
 assert.equal(new Set(Object.values(guides).map(g=>g.src)).size,112);
});

test('illustrated guides are available to the stable offline media cache',()=>{
 const guides=Object.values(scope.window.GYM_EXERCISE_GUIDES).map(x=>x.src).sort();
 assert.deepEqual(Array.from(scope.self.GYM_EXERCISE_GUIDE_ASSETS).sort(),guides);
 const worker=fs.readFileSync(path.join(root,'sw.js'),'utf8');
 assert(worker.includes('self.GYM_EXERCISE_GUIDE_ASSETS||[]'));
 assert(worker.includes('exercises|exercise-guides|poses'));
});

test('guide zoom stays in the app without a full-size navigation link',()=>{
 const source=fs.readFileSync(path.join(root,'src/exercise-atlas.js'),'utf8');
 const tools=source.slice(source.indexOf('<div class="atlasGuideTools">'),source.indexOf('<div class="atlasGuideViewport"'));
 assert(tools.includes('data-guide-zoom="50"'));assert(tools.includes('data-guide-zoom="-50"'));
 assert(!tools.includes('<a '));assert(!tools.includes('target='));
 assert(!source.includes('Full size'));assert(!source.includes('Повний розмір'));
});
