# Testing and Hardening v0.9

Flow Covenant Runtime v0.9 adds trust rails before the v1.0 candidate.

## Goals

- Keep the project public-safe and claim-safe.
- Keep the app local-first: no backend, accounts, telemetry, analytics, or hidden network calls.
- Preserve receipt, repair, reversibility, facilitator, and guided-mode schemas.
- Add repeatable smoke checks that future contributors can run before release.

## Required checks

1. The claim-safe boundary appears in the app and docs.
2. The runtime loop remains: Signal -> Invitation -> Consent -> Alignment -> Flow -> Receipt -> Renewal.
3. Receipt examples include evidence, assumptions, unknowns, repair plan, gate summary, and claim boundary.
4. Facilitator packets include room prompts, decision summary, validation, receipt, and claim boundary.
5. Source files do not add fetch, XMLHttpRequest, WebSocket, analytics, telemetry, or backend endpoints.
6. GitHub Pages build runs the smoke check before publishing.

## Local-first boundary

Data stays in the user's browser unless the user chooses to export a JSON or Markdown file. Browser localStorage is used for saved scenarios, receipts, facilitator state, and timer state.

## v1.0 gate

Do not call the project v1.0 until the pre-release checklist is complete.
