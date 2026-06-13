# Flow Covenant Runtime

**A playfield governance model for coherent systems.**

Flow Covenant Runtime (FCR) is a public-safe, local-first React app that turns the insight **life is play, not force** into a practical decision and governance workbench.

> Force creates compliance. Flow creates participation.

Live app:

```text
https://michaelwave369.github.io/flow-covenant-runtime/
```

## Release status

Current stable release: **v1.0.0**

This is the first public stable release of Flow Covenant Runtime. It was promoted after the v1.0.0-rc.1 GitHub Pages deployment passed the hardening checks and the live app was manually verified.

Release notes: [`docs/release-notes-v1.0.0.md`](./docs/release-notes-v1.0.0.md)

## Claim-safe boundary

This is a philosophy and systems-design model, not a claim that physical laws literally want, think, or feel.

FCR keeps boundaries, evidence, law, accountability, consent, and repair visible.

## Interactive app

The v1.0.0 app includes:

- Facilitator Mode with session timer, room prompts, decision summary, closeout checks, and facilitator packet export
- Guided Mode wizard for walking the whole loop step by step
- About / Manifesto section
- Visual Runtime Loop Explorer
- Law vs Flow Simulator
- Shareable scenario URLs
- Governance Gates checklist
- Repair Builder and Reversibility Helper
- Public Practice Pack and Practice Evidence Pack
- Local-only Receipt Builder with JSON and Markdown export
- Local saved scenario and receipt libraries using browser storage
- Import / replay for receipts and full library bundles
- v1 stable hardening checks and GitHub Pages workflow

## Stable checks

The repository includes trust rails that run before GitHub Pages deploys:

- [`scripts/sync-version.mjs`](./scripts/sync-version.mjs)
- [`scripts/smoke-check.mjs`](./scripts/smoke-check.mjs)
- [`scripts/local-first-guard.mjs`](./scripts/local-first-guard.mjs)
- [`docs/testing-hardening.md`](./docs/testing-hardening.md)
- [`docs/v1-release-checklist.md`](./docs/v1-release-checklist.md)

Run all local checks:

```bash
npm run check
```

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Core loop

```text
Signal -> Invitation -> Consent -> Alignment -> Flow -> Receipt -> Renewal
```

## Docs

- [`docs/facilitator-mode.md`](./docs/facilitator-mode.md)
- [`docs/guided-mode.md`](./docs/guided-mode.md)
- [`docs/evidence-pack.md`](./docs/evidence-pack.md)
- [`docs/practice-pack/worksheet.md`](./docs/practice-pack/worksheet.md)
- [`docs/practice-pack/workshop-guide.md`](./docs/practice-pack/workshop-guide.md)
- [`docs/practice-pack/decision-cards.md`](./docs/practice-pack/decision-cards.md)

## Roadmap

See [`ROADMAP.md`](./ROADMAP.md).
