import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

// Guard runtime/application surfaces for hidden network calls, telemetry hooks,
// analytics hooks, and secret-like implementation values. Documentation is
// intentionally excluded because docs must be allowed to say things like
// "no analytics" and "no telemetry" without tripping the guard.
const scannedRoots = ['src', 'schemas', 'examples', 'fixtures'];
const scannedFiles = ['index.html', 'vite.config.js', 'package.json'];
const scannedExtension = /\.(js|jsx|mjs|json|css|html|yml|yaml)$/;

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

function collectFiles() {
  const files = [];

  for (const folder of scannedRoots) {
    const abs = join(root, folder);
    if (!existsSync(abs)) continue;
    files.push(...walk(abs));
  }

  for (const file of scannedFiles) {
    const abs = join(root, file);
    if (existsSync(abs)) files.push(abs);
  }

  return [...new Set(files)].filter((file) => scannedExtension.test(file));
}

const findings = [];
for (const file of collectFiles()) {
  const body = readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(body)) findings.push({ file: relative(root, file), pattern: String(pattern) });
  }
}

if (findings.length) {
  console.error('Local-first guard failed. Review these implementation-surface findings:');
  for (const item of findings) console.error(`- ${item.file}: ${item.pattern}`);
  process.exit(1);
}

console.log('Local-first guard passed: no hidden network, telemetry, analytics, or secret patterns found in runtime surfaces.');
