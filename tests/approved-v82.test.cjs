const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const scope = {window:{}, document:{addEventListener(){}}};
for (const name of ['exercise-library','exercise-motion','exercise-repdb','exercise-legacy',
  'gym-motion-catalog','native-motion-catalog','exercise-identity','exercise-atlas']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'src', `${name}.js`), 'utf8'), scope);
}

test('v82 guides remain active alongside the updated hip thrust', () => {
  const clips = scope.window.GYM_NATIVE_MOTIONS;
  const release = clips.filter(clip => clip.release === 'v82');
  assert.deepEqual(Array.from(release, clip => clip.catalogId).sort(), [
    'Barbell_Squat','Front_Barbell_Squat','Goblet_Squat','motion-0063','motion-0059',
    'Dumbbell_Step_Ups','Standing_Calf_Raises','Pushups',
    'Dips_-_Chest_Version','Hanging_Leg_Raise','Hyperextensions_Back_Extensions',
  ].sort());
  for (const clip of release) {
    const entry = scope.window.GymAtlas.byId.get(clip.catalogId);
    assert(entry);
    assert.equal(scope.window.GymAtlas.nativeMotion(entry), clip);
    assert.equal(clip.motionQA.ownerApproved, true);
    assert.deepEqual(Array.from(clip.motionQA.renderedFramesPerView), [48,48,48]);
    for (const view of clip.views) assert(view.src.includes(`-v82-${clip.motionQA.sourceBlendSha256.slice(0,12)}`));
  }
  assert.equal(release.find(clip => clip.clipId === 'back-extension').motionQA.surfaceAuditPassed, true);
});
