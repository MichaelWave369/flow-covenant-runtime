# Flow Covenant Runtime v1.0.0-rc.1 Release Notes

Status: public stable candidate.

This release candidate gathers the v0.1 through v0.9 work into the first stable public package for Flow Covenant Runtime.

## What is included

- Runtime Loop Explorer
- Law vs Flow Simulator
- Governance Gates checklist
- Receipt Builder with JSON and Markdown export
- Local saved scenario and receipt libraries
- Import and replay for receipts and library bundles
- Repair Builder and Reversibility Helper
- Public Practice Pack
- Guided Mode
- Practice Evidence Pack
- Facilitator Mode
- Smoke checks and local-first guard
- GitHub Pages build checks before deployment

## Claim-safe boundary

This is a philosophy and systems-design model, not a claim that physical laws literally want, think, or feel.

## Local-first boundary

The app does not require accounts, login, backend services, analytics, telemetry, or hidden network calls. Saved scenarios and receipts stay in browser localStorage unless the user exports them.

## Candidate checks

The following commands are part of the candidate gate:

```bash
npm run check
npm run build
```

## Promotion rule

Promote this candidate to v1.0.0 after GitHub Pages is green and the live app is manually smoke-tested after deployment.
