import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const appPath = join(root, 'src/App.jsx');
const appText = readFileSync(appPath, 'utf8');
const marker = "const appVersion = '";
const start = appText.indexOf(marker);

if (start < 0) {
  throw new Error('appVersion marker not found');
}

const valueStart = start + marker.length;
const valueEnd = appText.indexOf("';", valueStart);

if (valueEnd < 0) {
  throw new Error('appVersion closing marker not found');
}

const nextText = `${appText.slice(0, valueStart)}${pkg.version}${appText.slice(valueEnd)}`;
writeFileSync(appPath, nextText);
console.log(`Synced appVersion to ${pkg.version}`);
