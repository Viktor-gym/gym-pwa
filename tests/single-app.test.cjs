const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');

test('the PWA loads one current JS bundle and one current CSS file', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const scripts = Array.from(html.matchAll(/<script[^>]+src="([^"]+)"/g), match => match[1]);
  const styles = Array.from(html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g), match => match[1]);
  assert.deepEqual(scripts, ['app.js?v=74']);
  assert.deepEqual(styles, ['app.css?v=74']);
  assert(!fs.readdirSync(root).some(name => /-v\d+\.(?:js|css)$/.test(name)));
  const worker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  for (const asset of [...scripts, ...styles]) assert(worker.includes("'./" + asset + "'"));
  assert(worker.includes("importScripts('./media-precache.js?v=74')"));
  assert(worker.includes("const MEDIA_CACHE = 'gym-pwa-exercise-media-v1'"));
});

test('checked-in bundles exactly match their current unnumbered source modules', () => {
  execFileSync(process.execPath, ['scripts/build-app.cjs', '--check'], {cwd: root});
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  for (const name of ['exercise-legacy', 'exercise-atlas', 'body-metrics', 'muscle-load', 'app']) {
    assert(app.includes(fs.readFileSync(path.join(root, 'src', name + '.js'), 'utf8').replace(/\r\n/g, '\n')));
  }
  assert(app.includes('"gymPwaData_v3"'));
  assert(app.includes('"gymPwaApp_v4"'));
});
