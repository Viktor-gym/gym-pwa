const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const publicFiles = ['index.html', 'app.js', 'app.css', 'sw.js', 'media-precache.js', 'manifest.json'];
const publicDirectories = ['assets', 'icons'];

function packageSite(destination) {
  const target = path.resolve(destination);
  if (target === root || root.startsWith(target + path.sep) ||
      (target.startsWith(root + path.sep) && target !== path.join(root, '_site'))) throw new Error('Cannot package over the source directory.');
  if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error('Site output must not be a symlink.');
  fs.mkdirSync(target, {recursive: true});
  const permitted = new Set([...publicFiles, ...publicDirectories, 'build-info.json']);
  if (fs.readdirSync(target).some(name => !permitted.has(name))) throw new Error('Site output contains unexpected files.');
  for (const file of publicFiles) fs.copyFileSync(path.join(root, file), path.join(target, file));
  for (const directory of publicDirectories) fs.cpSync(path.join(root, directory), path.join(target, directory), {recursive: true});
  const hashes = Object.fromEntries(publicFiles.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(target, file))).digest('hex')]));
  fs.writeFileSync(path.join(target, 'build-info.json'), JSON.stringify({commit: process.env.GITHUB_SHA || null, files: hashes}, null, 2) + '\n');
  return hashes;
}

module.exports = {packageSite, publicFiles, publicDirectories};
if (require.main === module) {
  packageSite(path.join(root, '_site'));
  console.log('Packaged one application. Sources, tests, dependencies and private work folders are excluded.');
}
