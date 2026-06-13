# v1.0 Pre-Release Checklist

Flow Covenant Runtime should only be called v1.0 when the following gates pass.

## Public-safe claim gate

- [ ] The claim-safe boundary is visible in the app, README, and relevant docs.
- [ ] No text claims that physical laws literally want, think, or feel.
- [ ] No medical, legal, spiritual-authority, scientific-proof, or prediction claims are introduced.

## Local-first gate

- [ ] No backend service is required.
- [ ] No accounts, login, telemetry, analytics, or hidden network calls are present.
- [ ] Saved scenarios and receipts stay in browser localStorage unless exported by the user.
- [ ] Export/import paths are user-initiated and readable.

## Receipt gate

- [ ] Receipts include scenario, signal, invitation, affected parties, consent, alignment, action, outcome, renewal, evidence, assumptions, unknowns, gates, repair plan, reversibility assessment, facilitator session, and claim boundary.
- [ ] Receipt JSON exports replay correctly through import.
- [ ] Markdown exports are readable and shareable.

## Repair and reversibility gate

- [ ] Blocked gates do not silently settle.
- [ ] High-impact scenarios prompt pause, rollback, draft, sandbox, staged rollout, or review.
- [ ] Repair plans identify drift, stabilization, affected repair, reversible action, repair action, follow-up, and renewal receipt.

## Facilitator gate

- [ ] Facilitator Mode exports a complete packet.
- [ ] Decision owner, closeout summary, follow-up, validation checks, and parking lot are visible.
- [ ] Room prompts preserve consent, accountability, repair, and non-shaming language.

## Accessibility and usability gate

- [ ] Keyboard navigation reaches core controls.
- [ ] Buttons have readable labels.
- [ ] Printable docs remain usable without the app.
- [ ] Empty states and import errors are understandable.

## Release gate

- [ ] `npm run build` passes.
- [ ] `node scripts/smoke-check.mjs` passes.
- [ ] `node scripts/local-first-guard.mjs` passes.
- [ ] GitHub Pages deploy is green.
- [ ] Live app is manually smoke-tested after deploy.
