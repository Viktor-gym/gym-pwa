const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const {packageSite, publicFiles, publicDirectories} = require('../scripts/package-site.cjs');

test('only one Pages workflow publishes sequentially without cancellation or retries', () => {
  const workflows = fs.readdirSync(path.join(root, '.github/workflows'));
  assert.deepEqual(workflows, ['pages.yml']);
  const text = fs.readFileSync(path.join(root, '.github/workflows/pages.yml'), 'utf8');
  assert.match(text, /group: pages\s+cancel-in-progress: false/);
  assert.match(text, /path: _site/);
  assert.match(text, /run: npm test/);
  assert.doesNotMatch(text, /reRun|\/cancel|recover-pages|contents: write/);
  for (const use of text.matchAll(/uses: (\S+)/g)) assert.match(use[1], /^actions\/[a-z-]+@[a-f0-9]{40}$/);
});

test('the Pages package contains only runtime files and a verifiable build receipt', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'gym-pwa-site-test-'));
  try {
    const hashes = packageSite(folder);
    assert.deepEqual(fs.readdirSync(folder).sort(), [...publicFiles, ...publicDirectories, 'build-info.json'].sort());
    for (const file of publicFiles) {
      assert(fs.readFileSync(path.join(root, file)).equals(fs.readFileSync(path.join(folder, file))));
      assert.equal(hashes[file], crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex'));
    }
    assert.equal(JSON.parse(fs.readFileSync(path.join(folder, 'build-info.json'), 'utf8')).files['app.js'], hashes['app.js']);
    for (const name of ['src', 'tests', 'node_modules', '.git', 'work', '111']) assert(!fs.existsSync(path.join(folder, name)));
    assert.throws(() => packageSite(root), /source directory/);
  } finally {
    const resolved = path.resolve(folder);
    const prefix = path.join(path.resolve(os.tmpdir()), 'gym-pwa-site-test-');
    if (!resolved.startsWith(prefix)) throw new Error('Unsafe temporary output path');
    fs.rmSync(resolved, {recursive: true, force: true});
  }
});
