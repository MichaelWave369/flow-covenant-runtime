# v1.0 Release Checklist

Flow Covenant Runtime can be called stable after these gates pass.

Current status: **v1.0.0 stable**.

## Public-safe claim gate

- [x] The claim-safe boundary is visible in the app, README, and relevant docs.
- [x] No text claims that physical laws literally want, think, or feel.
- [x] No medical, legal, spiritual-authority, scientific-proof, or prediction claims are introduced.

## Local-first gate

- [x] No backend service is required.
- [x] No accounts, login, telemetry, analytics, or hidden network calls are present.
- [x] Saved scenarios and receipts stay in browser localStorage unless exported by the user.
- [x] Export/import paths are user-initiated and readable.

## Receipt gate

- [x] Receipts include scenario, signal, invitation, affected parties, consent, alignment, action, outcome, renewal, evidence, assumptions, unknowns, gates, repair plan, reversibility assessment, facilitator session, and claim boundary.
- [x] Receipt JSON exports replay through import.
- [x] Markdown exports are readable and shareable.

## Repair and reversibility gate

- [x] Blocked gates do not silently settle.
- [x] High-impact scenarios prompt pause, rollback, draft, sandbox, staged rollout, or review.
- [x] Repair plans identify drift, stabilization, affected repair, reversible action, repair action, follow-up, and renewal receipt.

## Facilitator gate

- [x] Facilitator Mode exports a complete packet.
- [x] Decision owner, closeout summary, follow-up, validation checks, and parking lot are visible.
- [x] Room prompts preserve consent, accountability, repair, and non-shaming language.

## Accessibility and usability gate

- [x] Keyboard navigation reaches core controls.
- [x] Buttons have readable labels.
- [x] Printable docs remain usable without the app.
- [x] Empty states and import errors are understandable.

## Release gate

- [x] `npm run check` is defined.
- [x] `node scripts/smoke-check.mjs` is included in the check path.
- [x] `node scripts/local-first-guard.mjs` is included in the check path.
- [x] App runtime version is synced from `package.json` during dev/build/check.
- [x] GitHub Pages deploy was green for v1.0.0-rc.1.
- [x] Live app was manually smoke-tested after deploy.

## Stable promotion record

Promoted from `v1.0.0-rc.1` to `v1.0.0` after the final release-gate items were verified.
