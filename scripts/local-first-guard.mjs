import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const scannedRoots = ['src', 'docs', 'schemas', 'examples', 'fixtures'];
const forbidden = [
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /new\s+WebSocket/,
  /navigator\.sendBeacon/,
  /analytics/i,
  /telemetry/i,
  /apiKey/i,
  /secret/i,
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return walk(path);
    return path;
  });
}

const findings = [];
for (const folder of scannedRoots) {
  const abs = join(root, folder);
  let files = [];
  try { files = walk(abs); } catch { continue; }
  for (const file of files) {
    if (!/\.(js|jsx|mjs|json|md|css|html|yml|yaml)$/.test(file)) continue;
    const body = readFileSync(file, 'utf8');
    for (const pattern of forbidden) {
      if (pattern.test(body)) findings.push({ file: file.replace(`${root}/`, ''), pattern: String(pattern) });
    }
  }
}

if (findings.length) {
  console.error('Local-first guard failed. Review these findings:');
  for (const item of findings) console.error(`- ${item.file}: ${item.pattern}`);
  process.exit(1);
}

console.log('Local-first guard passed: no hidden network, telemetry, analytics, or secret patterns found.');
