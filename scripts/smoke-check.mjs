import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const claimBoundary = 'This is a philosophy and systems-design model, not a claim that physical laws literally want, think, or feel.';
const loop = 'Signal -> Invitation -> Consent -> Alignment -> Flow -> Receipt -> Renewal';

const checks = [];
function check(label, ok) {
  checks.push({ label, ok: Boolean(ok) });
}
function text(path) {
  return readFileSync(join(root, path), 'utf8');
}
function json(path) {
  return JSON.parse(text(path));
}

const app = text('src/App.jsx');
const readme = text('README.md');
const packageJson = json('package.json');
const receiptSchema = json('schemas/flow-receipt.schema.json');
const syncVersion = text('scripts/sync-version.mjs');

check('package is named flow-covenant-runtime', packageJson.name === 'flow-covenant-runtime');
check('package is v1 candidate or stable', /^1\.0\.0(-rc\.\d+)?$/.test(packageJson.version));
check('app includes package runtime version after sync', app.includes(`const appVersion = '${packageJson.version}';`));
check('sync-version script exists and targets appVersion', syncVersion.includes('appVersion'));
check('README identifies current candidate', readme.includes(packageJson.version));
check('app includes claim-safe boundary', app.includes(claimBoundary));
check('README includes claim-safe boundary', readme.includes(claimBoundary));
check('README includes runtime loop', readme.includes(loop));
check('receipt schema requires claim boundary', receiptSchema.required.includes('claimBoundary'));
check('receipt schema includes repair plan', Boolean(receiptSchema.properties.repairPlan));
check('guided docs exist', existsSync(join(root, 'docs/guided-mode.md')));
check('facilitator docs exist', existsSync(join(root, 'docs/facilitator-mode.md')));
check('evidence fixtures exist', existsSync(join(root, 'fixtures/evidence-pack.fixtures.json')));
check('v1.0 checklist exists', existsSync(join(root, 'docs/v1-release-checklist.md')));
check('v1 release notes exist', existsSync(join(root, `docs/release-notes-v${packageJson.version}.md`)));

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.label}`);
}

if (failed.length) {
  console.error(`\n${failed.length} smoke check(s) failed.`);
  process.exit(1);
}

console.log('\nAll Flow Covenant smoke checks passed.');
