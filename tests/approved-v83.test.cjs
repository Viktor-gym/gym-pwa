const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

test('v83 exposes the nine approved motions and caches all three angles', () => {
  const scope = { window: {}, self: {}, document: { addEventListener() {} } };
  for (const name of ['exercise-library', 'exercise-motion', 'exercise-repdb',
    'exercise-legacy', 'gym-motion-catalog', 'native-motion-catalog',
    'native-motion-precache', 'exercise-identity', 'exercise-atlas']) {
    vm.runInNewContext(fs.readFileSync(path.join(root, 'src', name + '.js'), 'utf8'), scope);
  }
  const all = scope.window.GYM_NATIVE_MOTIONS;
  const release = all.filter(clip => clip.release === 'v83');
  assert.equal(all.length, 87);
  assert.deepEqual(Array.from(release, clip => clip.catalogId).sort(), [
    'Leg_Press', 'Hack_Squat', 'Leg_Extensions', 'Seated_Calf_Raise', 'Thigh_Abductor',
    'Butterfly', 'Reverse_Machine_Flyes', 'One-Legged_Cable_Kickback', 'Barbell_Hip_Thrust',
  ].sort());
  const cache = new Set(scope.self.GYM_NATIVE_MOTION_ASSETS);
  for (const clip of release) {
    const entry = scope.window.GymAtlas.byId.get(clip.catalogId);
    assert.equal(scope.window.GymAtlas.nativeMotion(entry), clip);
    assert.equal(clip.motionQA.ownerApproved, true);
    assert.equal(clip.motionQA.surfaceAuditPassed, true);
    assert.deepEqual(Array.from(clip.motionQA.renderedFramesPerView), [48, 48, 48]);
    assert.deepEqual(Array.from(clip.views, view => view.id), ['primary', 'side', 'opposite']);
    assert.deepEqual(Array.from(clip.views, view => view.label_ua), ['Основний', 'Збоку', 'Інший бік']);
    assert.deepEqual(Array.from(clip.views, view => view.label_en), ['Main', 'Side', 'Other side']);
    for (const view of clip.views) {
      assert(view.src.includes(`-v83-${clip.motionQA.sourceBlendSha256.slice(0,12)}-`));
      assert(cache.has(view.src));
      assert(cache.has(view.poster));
    }
  }
});
