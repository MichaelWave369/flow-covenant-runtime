# Flow Covenant Runtime

**A playfield governance model for coherent systems.**

Flow Covenant Runtime (FCR) is a public-safe, local-first React app that turns the insight **life is play, not force** into a practical decision and governance workbench.

> Force creates compliance. Flow creates participation.

Live app:

```text
https://michaelwave369.github.io/flow-covenant-runtime/
```

## Claim-safe boundary

This is a philosophy and systems-design model, not a claim that physical laws literally want, think, or feel.

FCR keeps boundaries, evidence, law, accountability, consent, and repair visible.

## Interactive app

The v0.8 app includes:

- Facilitator Mode with session timer, room prompts, decision summary, closeout checks, and facilitator packet export
- Guided Mode wizard for walking the whole loop step by step
- Guided completion meter and session save path
- About / Manifesto section
- Visual Runtime Loop Explorer
- Law vs Flow Simulator
- Shareable scenario URLs
- Governance Gates checklist
- Gate summary counts
- Repair Builder for turning drift into a concrete repair path
- Reversibility Helper with score and guidance before action settles
- Public Practice Pack with worksheet, workshop flow, and decision-card deck
- Practice Evidence Pack with worked examples, fixtures, example receipts, and accessibility checklist
- Local-only Receipt Builder with JSON and Markdown export
- Local saved scenario and receipt libraries using browser storage
- Import / replay for receipts and full library bundles
- Public-safe docs, schemas, example receipts, and GitHub Pages workflow

## Facilitator Mode

Facilitator Mode is for people running a live room, team review, release check, community session, or reflection process.

It adds:

- Session presets
- Timer controls
- Room-mode prompts
- Decision summary
- Closeout validation checks
- Exportable facilitator packets in Markdown and JSON

See [`docs/facilitator-mode.md`](./docs/facilitator-mode.md).

## Guided Mode

Guided Mode is for first-time users, facilitators, and teams who want the full FCR process without needing to understand the whole model up front.

It walks through:

```text
Context -> Signal -> Invitation -> Affected Parties -> Consent -> Gates -> Alignment -> Repair -> Flow -> Receipt -> Renewal -> Evidence -> Finish
```

See [`docs/guided-mode.md`](./docs/guided-mode.md).

## Public Practice Pack

The practice pack is designed for meetings, workshops, team reviews, community sessions, and personal reflection.

Included documents:

- [`docs/practice-pack/worksheet.md`](./docs/practice-pack/worksheet.md)
- [`docs/practice-pack/workshop-guide.md`](./docs/practice-pack/workshop-guide.md)
- [`docs/practice-pack/decision-cards.md`](./docs/practice-pack/decision-cards.md)

## Practice Evidence Pack

The evidence pack gives users worked examples and fixtures so they can learn by replaying public-safe scenarios.

Included documents:

- [`docs/evidence-pack.md`](./docs/evidence-pack.md)
- [`docs/worked-examples.md`](./docs/worked-examples.md)
- [`docs/accessibility-checklist.md`](./docs/accessibility-checklist.md)
- [`fixtures/evidence-pack.fixtures.json`](./fixtures/evidence-pack.fixtures.json)
- [`examples/community-governance-receipt.json`](./examples/community-governance-receipt.json)

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

## Roadmap

See [`ROADMAP.md`](./ROADMAP.md).

## License

MIT License.
