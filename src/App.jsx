import { useEffect, useMemo, useRef, useState } from 'react';

const appVersion = '0.8.0';
const claimBoundary = 'This is a philosophy and systems-design model, not a claim that physical laws literally want, think, or feel.';

const steps = [
  { id: 'signal', number: 1, title: 'Signal', prompt: 'What is arising?', field: 'signal' },
  { id: 'invitation', number: 2, title: 'Invitation', prompt: 'What is being offered?', field: 'invitation' },
  { id: 'consent', number: 3, title: 'Consent', prompt: 'Who or what is affected?', field: 'consent' },
  { id: 'alignment', number: 4, title: 'Alignment', prompt: 'Does this preserve coherence?', field: 'alignment' },
  { id: 'flow', number: 5, title: 'Flow', prompt: 'What action moves?', field: 'action' },
  { id: 'receipt', number: 6, title: 'Receipt', prompt: 'What changed and why?', field: 'outcome' },
  { id: 'renewal', number: 7, title: 'Renewal', prompt: 'What repairs or regenerates?', field: 'renewal' },
];

const gates = [
  ['consent', 'Consent Gate', 'Is participation informed and voluntary?'],
  ['harm', 'Harm Gate', 'Does this minimize harm and coercion?'],
  ['claim', 'Claim Gate', 'Is the claim clear and self-contained?'],
  ['evidence', 'Evidence Gate', 'What signals, data, or receipts support this?'],
  ['reversibility', 'Reversibility Gate', 'Can this be undone or adjusted if needed?'],
  ['repair', 'Repair Gate', 'If disruption occurs, how will we repair?'],
];

const scenarioTypes = ['AI collaboration', 'Software workflow', 'Community governance', 'Personal reflection', 'Product decision', 'Other'];

const samples = [
  { title: 'AI claim boundary', domain: 'AI collaboration', text: 'A user asks an AI assistant to publish a poetic metaphor as a strong factual claim.' },
  { title: 'Release without rollback', domain: 'Software workflow', text: 'A team wants to ship a release before rollback, staging, and receipt capture are ready.' },
  { title: 'Public promise review', domain: 'Community governance', text: 'A community hears a public promise, but records and accountability paths are unclear.' },
  { title: 'Emotional decision pause', domain: 'Personal reflection', text: 'A person feels pressure to act while emotionally charged, but wants truth and future repair.' },
  { title: 'Surprise pricing change', domain: 'Product decision', text: 'A product team wants to change pricing quickly, but it could surprise existing users and weaken trust.' },
];

const starterReceipt = {
  signal: 'A request, drift, opportunity, or tension has appeared.',
  invitation: 'Translate the command into a clear offer with a refusal path.',
  affectedParties: 'Name the people, systems, records, and future users affected.',
  consent: 'Confirm permission, delegated authority, opt-out, refusal path, or the need to pause.',
  alignment: 'Check consent, harm, claims, evidence, reversibility, and repair.',
  action: 'Take the smallest coherent next action.',
  outcome: 'Record what changed after the action.',
  renewal: 'Define repair, learning, rollback, or follow-up.',
  evidence: 'List direct signals, data, tests, source material, or receipts.',
  assumptions: 'List what is believed but not proven.',
  unknowns: 'List what remains uncertain.',
};

const starterRepairPlan = {
  drift: 'Name what drifted, broke trust, confused consent, or created risk.',
  immediateStabilization: 'Pause escalation, name uncertainty, protect affected parties, and keep the next move reversible.',
  affectedRepair: 'Name who needs clarification, apology, rollback, support, or a new consent path.',
  reversibleAction: 'Define what can be paused, undone, reduced, sandboxed, staged, or tested before settlement.',
  repairAction: 'Choose the concrete repair move that restores coherence without hiding accountability.',
  followUp: 'Define when the repair will be reviewed and what signal proves the field is healthier.',
  renewalReceipt: 'Record the repair decision, evidence, assumptions, unknowns, and next check-in.',
};

const repairTemplates = {
  'AI collaboration': { ...starterRepairPlan, drift: 'A request may blur metaphor, evidence, authority, or public claim boundaries.', repairAction: 'Rewrite as philosophy, design pattern, or hypothesis; remove overclaiming language.' },
  'Software workflow': { ...starterRepairPlan, drift: 'A release may be moving faster than consent, rollback, testing, or audit readiness.', reversibleAction: 'Use feature flags, staged rollout, sandbox testing, backups, and a rollback command.' },
  'Community governance': { ...starterRepairPlan, drift: 'A promise or impact may be unclear, undocumented, disputed, or missing public repair paths.', repairAction: 'Create a public repair packet that separates measured, promised, claimed, unknown, and disputed items.' },
  'Personal reflection': { ...starterRepairPlan, drift: 'Emotion, pressure, fear, shame, or urgency may be narrowing choice.', immediateStabilization: 'Pause, breathe, lower intensity, and choose the smallest non-harming next move.' },
  'Product decision': { ...starterRepairPlan, drift: 'A product move may optimize growth while weakening consent, clarity, trust, or support load.', reversibleAction: 'Use experiments, opt-in toggles, rollback windows, and transparent change notes.' },
  Other: starterRepairPlan,
};

const decisionCards = [
  { title: 'Name the Signal', prompt: 'What is actually arising before interpretation, blame, or urgency gets added?' },
  { title: 'Turn Command into Invitation', prompt: 'What is being offered, and what would a clean refusal path look like?' },
  { title: 'Map Affected Parties', prompt: 'Who or what is affected now, downstream, and after the decision becomes public?' },
  { title: 'Separate Evidence from Story', prompt: 'What is measured, promised, claimed, assumed, unknown, or disputed?' },
  { title: 'Choose the Reversible Move', prompt: 'What is the smallest pause, draft, test, rollback, or staged action that preserves repair?' },
  { title: 'Write the Receipt', prompt: 'What changed, why, who consented, what remains unknown, and when will we review it?' },
];

const evidenceExamples = [
  { title: 'AI collaboration', signal: 'The idea is meaningful, but claim-risk is present.', receipt: 'Record what was softened, what remains metaphor, and what is still unproven.' },
  { title: 'Software workflow', signal: 'Speed is creating release drift.', receipt: 'Record test result, rollback owner, staged scope, and review time.' },
  { title: 'Community governance', signal: 'Trust depends on separating evidence classes.', receipt: 'Record measured, promised, claimed, unknown, and disputed items.' },
  { title: 'Personal reflection', signal: 'Urgency may narrow choice.', receipt: 'Record what was felt, what was chosen, and what still needs repair.' },
];

const evidenceFixtures = [
  { id: 'fixture-ai-claim-boundary', domain: 'AI collaboration', expected: 'Claim and evidence gates should block until boundary language is clean.' },
  { id: 'fixture-release-rollback', domain: 'Software workflow', expected: 'Reversibility gate should block until rollback or staged rollout exists.' },
  { id: 'fixture-public-promise', domain: 'Community governance', expected: 'Evidence gate should block until public records and promise classes are visible.' },
];

const guidedSteps = ['Context', 'Signal', 'Invitation', 'Affected Parties', 'Consent', 'Gates', 'Alignment', 'Repair', 'Flow', 'Receipt', 'Renewal', 'Evidence', 'Finish'];

const facilitatorModes = [
  { id: 'reflection', title: 'Reflection Session', minutes: 25, focus: 'Slow down a personal or relational decision and protect repair.' },
  { id: 'team-review', title: 'Team Review', minutes: 45, focus: 'Move a team decision through gates, rollback, receipt, and follow-up.' },
  { id: 'community-room', title: 'Community Room', minutes: 60, focus: 'Separate measured, promised, claimed, unknown, and disputed items without shaming participants.' },
  { id: 'release-check', title: 'Release Check', minutes: 30, focus: 'Verify evidence, reversibility, support load, and rollback before shipping.' },
];

const roomPrompts = [
  { stage: 'Open the room', prompt: 'Name the claim-safe boundary and remind everyone that flow does not bypass accountability.' },
  { stage: 'Name the signal', prompt: 'Ask: what is actually arising before blame, urgency, or solution language?' },
  { stage: 'Map affected parties', prompt: 'Ask who is affected now, downstream, and after the decision becomes public.' },
  { stage: 'Run the gates', prompt: 'Check consent, harm, claims, evidence, reversibility, and repair out loud.' },
  { stage: 'Choose the smallest move', prompt: 'Prefer the reversible move that preserves future repair and produces a receipt.' },
  { stage: 'Close with renewal', prompt: 'Name who owns follow-up, what evidence will be checked, and when the room returns.' },
];

const starterFacilitator = {
  facilitatorName: '',
  sessionTitle: 'Flow Covenant working session',
  mode: 'team-review',
  roomPurpose: 'Move a decision through signal, consent, evidence, repair, and receipt without force-first escalation.',
  participants: 'List roles or groups, not sensitive personal data unless everyone consents.',
  agreements: 'No shaming. No forced consensus. Name uncertainty. Keep receipts. Protect refusal paths.',
  decisionOwner: 'Name who can make or hold the decision after the room closes.',
  followUpDate: '',
  parkingLot: 'Questions, unknowns, or unresolved items that should not be forced today.',
  closeoutSummary: 'What the room decided, paused, repaired, or sent for review.',
};

function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) { h ^= input.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function useLocalState(key, fallback) {
  const [value, setValue] = useState(() => {
    try { const stored = window.localStorage.getItem(key); return stored ? JSON.parse(stored) : fallback; } catch { return fallback; }
  });
  const setStoredValue = (next) => setValue((current) => {
    const resolved = typeof next === 'function' ? next(current) : next;
    try { window.localStorage.setItem(key, JSON.stringify(resolved)); } catch { /* local storage may be blocked */ }
    return resolved;
  });
  return [value, setStoredValue];
}

function summarizeGates(gateStates) {
  return gateStates.reduce((summary, gate) => ({ ...summary, [gate.status]: (summary[gate.status] || 0) + 1 }), { pass: 0, watch: 0, block: 0, total: gateStates.length });
}

function evaluate(text) {
  const lower = text.toLowerCase();
  const watchSignals = [];
  const consent = /consent|permission|affected|community|team|people|user|resident/.test(lower);
  const evidence = /evidence|claim|promise|receipt|audit|data|proof|release|record/.test(lower);
  const irreversible = /irreversible|permanent|delete|public|publish|ship|deploy|final|contract/.test(lower);
  const harm = /harm|unsafe|medical|legal|financial|threat|coerce|force/.test(lower);
  if (consent) watchSignals.push('Affected parties or consent boundaries may need to be named.');
  if (evidence) watchSignals.push('Evidence, assumptions, and unknowns should be separated.');
  if (irreversible) watchSignals.push('Prefer reversible action or a rollback path before settlement.');
  if (harm) watchSignals.push('Harm and coercion checks should be explicit before action.');
  return { risk: harm || irreversible ? 'high' : evidence ? 'medium' : 'low', watchSignals };
}

function assessReversibility(scenario, fields, repairPlan, gateStates) {
  const text = `${scenario} ${fields.action} ${fields.outcome} ${repairPlan.reversibleAction}`.toLowerCase();
  const blockers = gateStates.filter((gate) => gate.status === 'block').length;
  const hardWords = /permanent|irreversible|delete|public|publish|legal|medical|financial|unsafe|deploy|ship|contract|final/.test(text);
  const safetyWords = /pause|rollback|sandbox|draft|test|review|temporary|opt-in|staged|backup|flag|reversible|undo|delay/.test(text);
  const score = Math.max(0, Math.min(4, (safetyWords ? 2 : 0) + (blockers === 0 ? 1 : 0) + (!hardWords ? 1 : 0) - blockers));
  const label = score >= 3 ? 'reversible' : score === 2 ? 'guarded' : 'hard-stop';
  const guidance = [];
  if (blockers > 0) guidance.push('At least one governance gate is blocking. Do not settle action until the block has a repair path.');
  if (hardWords) guidance.push('High-impact language is present. Prefer draft, pause, sandbox, staged rollout, or explicit rollback.');
  if (!safetyWords) guidance.push('Add a visible rollback, delay, opt-in, sandbox, backup, or review step before action settles.');
  if (guidance.length === 0) guidance.push('This action appears repair-capable. Keep the receipt and follow-up check visible.');
  return { score, label, guidance };
}

function validateSession(fields, repairPlan, gateStates, facilitator) {
  const checks = [
    ['Scenario is named', Boolean(fields.signal && fields.invitation)],
    ['Affected parties are visible', Boolean(fields.affectedParties && fields.consent)],
    ['Evidence boundary exists', Boolean(fields.evidence && fields.assumptions && fields.unknowns)],
    ['Repair path exists', Boolean(repairPlan.drift && repairPlan.repairAction && repairPlan.followUp)],
    ['No gate is silently blocking', !gateStates.some((gate) => gate.status === 'block' && !gate.note.trim())],
    ['Facilitator follow-up is named', Boolean(facilitator.decisionOwner && facilitator.closeoutSummary)],
  ];
  const passed = checks.filter(([, ok]) => ok).length;
  return { passed, total: checks.length, ready: passed === checks.length, checks: checks.map(([label, ok]) => ({ label, ok })) };
}

function formatSeconds(total) {
  const minutes = Math.floor(total / 60).toString().padStart(2, '0');
  const seconds = Math.floor(total % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function makeReceipt(scenario, scenarioType, fields, repairPlan, reversibilityAssessment, gateStates, facilitatorSession) {
  const gateCounts = summarizeGates(gateStates);
  const identity = JSON.stringify({ scenario, scenarioType, fields, repairPlan, gateStates, facilitatorSession });
  return { id: `fcr-${hash(identity)}`, model: 'Flow Covenant Runtime', version: appVersion, createdAt: new Date().toISOString(), scenarioType, scenario, ...fields, repairPlan, reversibilityAssessment, gateSummary: gateStates, gateCounts, facilitatorSession, claimBoundary };
}

function makeFacilitatorPacket(receipt, validation, remainingSeconds) {
  return {
    id: `fcr-facilitator-${hash(JSON.stringify({ receipt, validation }))}`,
    model: 'Flow Covenant Runtime Facilitator Packet',
    version: appVersion,
    createdAt: new Date().toISOString(),
    timerRemaining: formatSeconds(remainingSeconds),
    roomPrompts,
    validation,
    decisionSummary: {
      sessionTitle: receipt.facilitatorSession.sessionTitle,
      mode: receipt.facilitatorSession.mode,
      purpose: receipt.facilitatorSession.roomPurpose,
      scenarioType: receipt.scenarioType,
      scenario: receipt.scenario,
      gateCounts: receipt.gateCounts,
      reversibility: receipt.reversibilityAssessment.label,
      decisionOwner: receipt.facilitatorSession.decisionOwner,
      closeoutSummary: receipt.facilitatorSession.closeoutSummary,
      followUpDate: receipt.facilitatorSession.followUpDate,
      parkingLot: receipt.facilitatorSession.parkingLot,
    },
    receipt,
    claimBoundary,
  };
}

function receiptToMarkdown(receipt) {
  return `# Flow Covenant Receipt ${receipt.id}\n\n**Scenario type:** ${receipt.scenarioType}\n\n**Scenario:** ${receipt.scenario}\n\n## Runtime Fields\n\n- Signal: ${receipt.signal}\n- Invitation: ${receipt.invitation}\n- Affected parties: ${receipt.affectedParties}\n- Consent: ${receipt.consent}\n- Alignment: ${receipt.alignment}\n- Action: ${receipt.action}\n- Outcome: ${receipt.outcome}\n- Renewal: ${receipt.renewal}\n\n## Repair Plan\n\n- Drift: ${receipt.repairPlan.drift}\n- Reversible action: ${receipt.repairPlan.reversibleAction}\n- Repair action: ${receipt.repairPlan.repairAction}\n- Follow-up: ${receipt.repairPlan.followUp}\n\n## Facilitator Closeout\n\n- Session: ${receipt.facilitatorSession.sessionTitle}\n- Mode: ${receipt.facilitatorSession.mode}\n- Decision owner: ${receipt.facilitatorSession.decisionOwner}\n- Closeout summary: ${receipt.facilitatorSession.closeoutSummary}\n- Parking lot: ${receipt.facilitatorSession.parkingLot}\n\n## Evidence Boundary\n\n- Evidence: ${receipt.evidence}\n- Assumptions: ${receipt.assumptions}\n- Unknowns: ${receipt.unknowns}\n\n## Claim-Safe Boundary\n\n${receipt.claimBoundary}\n`;
}

function packetToMarkdown(packet) {
  return `# Facilitator Packet ${packet.id}\n\n**Session:** ${packet.decisionSummary.sessionTitle}\n**Mode:** ${packet.decisionSummary.mode}\n**Timer remaining:** ${packet.timerRemaining}\n\n## Decision Summary\n\n- Purpose: ${packet.decisionSummary.purpose}\n- Scenario type: ${packet.decisionSummary.scenarioType}\n- Scenario: ${packet.decisionSummary.scenario}\n- Reversibility: ${packet.decisionSummary.reversibility}\n- Gate counts: ${JSON.stringify(packet.decisionSummary.gateCounts)}\n- Decision owner: ${packet.decisionSummary.decisionOwner}\n- Follow-up date: ${packet.decisionSummary.followUpDate}\n- Closeout summary: ${packet.decisionSummary.closeoutSummary}\n- Parking lot: ${packet.decisionSummary.parkingLot}\n\n## Validation\n\n${packet.validation.checks.map((check) => `- ${check.ok ? 'PASS' : 'WATCH'}: ${check.label}`).join('\n')}\n\n## Room Prompts\n\n${packet.roomPrompts.map((prompt) => `- ${prompt.stage}: ${prompt.prompt}`).join('\n')}\n\n## Claim-Safe Boundary\n\n${packet.claimBoundary}\n`;
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  window.prompt('Copy this text:', text);
}

export default function App() {
  const [active, setActive] = useState('signal');
  const [scenario, setScenario] = useState(samples[0].text);
  const [scenarioType, setScenarioType] = useState(samples[0].domain);
  const [receiptFields, setReceiptFields] = useState(starterReceipt);
  const [repairPlan, setRepairPlan] = useState(starterRepairPlan);
  const [gateStates, setGateStates] = useState(gates.map(([id]) => ({ gateId: id, status: 'watch', note: '' })));
  const [facilitatorSession, setFacilitatorSession] = useLocalState('fcr.facilitator.v1', starterFacilitator);
  const [timerSeconds, setTimerSeconds] = useLocalState('fcr.facilitatorTimer.v1', 45 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [notice, setNotice] = useState('');
  const [guidedIndex, setGuidedIndex] = useLocalState('fcr.guidedIndex.v1', 0);
  const [savedScenarios, setSavedScenarios] = useLocalState('fcr.savedScenarios.v1', []);
  const [savedReceipts, setSavedReceipts] = useLocalState('fcr.savedReceipts.v1', []);
  const importRef = useRef(null);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const interval = window.setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, setTimerSeconds]);

  const evaluation = useMemo(() => evaluate(scenario), [scenario]);
  const reversibilityAssessment = useMemo(() => assessReversibility(scenario, receiptFields, repairPlan, gateStates), [scenario, receiptFields, repairPlan, gateStates]);
  const receipt = useMemo(() => makeReceipt(scenario, scenarioType, receiptFields, repairPlan, reversibilityAssessment, gateStates, facilitatorSession), [scenario, scenarioType, receiptFields, repairPlan, reversibilityAssessment, gateStates, facilitatorSession]);
  const validation = useMemo(() => validateSession(receiptFields, repairPlan, gateStates, facilitatorSession), [receiptFields, repairPlan, gateStates, facilitatorSession]);
  const facilitatorPacket = useMemo(() => makeFacilitatorPacket(receipt, validation, timerSeconds), [receipt, validation, timerSeconds]);
  const markdownReceipt = useMemo(() => receiptToMarkdown(receipt), [receipt]);
  const facilitatorMarkdown = useMemo(() => packetToMarkdown(facilitatorPacket), [facilitatorPacket]);
  const gateCounts = receipt.gateCounts;
  const currentStep = steps.find((step) => step.id === active) || steps[0];

  const flash = (message) => { setNotice(message); setTimeout(() => setNotice(''), 1700); };
  const setField = (key, value) => setReceiptFields((current) => ({ ...current, [key]: value }));
  const setRepairField = (key, value) => setRepairPlan((current) => ({ ...current, [key]: value }));
  const setFacilitatorField = (key, value) => setFacilitatorSession((current) => ({ ...current, [key]: value }));
  const setGate = (gateId, patch) => setGateStates((current) => current.map((gate) => (gate.gateId === gateId ? { ...gate, ...patch } : gate)));
  const applySample = (sample) => { setScenario(sample.text); setScenarioType(sample.domain); setRepairPlan(repairTemplates[sample.domain] || starterRepairPlan); setActive('signal'); };
  const applyMode = (mode) => { setFacilitatorSession((current) => ({ ...current, mode: mode.id, sessionTitle: mode.title, roomPurpose: mode.focus })); setTimerSeconds(mode.minutes * 60); flash(`${mode.title} loaded`); };
  const saveScenario = () => { const record = { id: `scenario-${hash(JSON.stringify({ scenario, scenarioType, receiptFields, repairPlan, gateStates, facilitatorSession }))}`, title: scenario.slice(0, 80), scenario, scenarioType, receiptFields, repairPlan, gateStates, facilitatorSession, updatedAt: new Date().toISOString() }; setSavedScenarios((current) => [record, ...current.filter((item) => item.id !== record.id)]); flash('Scenario saved locally'); };
  const loadScenario = (record) => { setScenario(record.scenario); setScenarioType(record.scenarioType); setReceiptFields(record.receiptFields || starterReceipt); setRepairPlan(record.repairPlan || starterRepairPlan); setGateStates(record.gateStates || gateStates); setFacilitatorSession(record.facilitatorSession || facilitatorSession); flash('Scenario loaded'); };
  const saveReceipt = () => { const record = { ...receipt, savedAt: new Date().toISOString() }; setSavedReceipts((current) => [record, ...current.filter((item) => item.id !== record.id)]); flash('Receipt saved locally'); };
  const loadReceipt = (record) => { setScenario(record.scenario || ''); setScenarioType(record.scenarioType || 'Other'); setRepairPlan(record.repairPlan || starterRepairPlan); setGateStates(record.gateSummary || gateStates); setFacilitatorSession(record.facilitatorSession || facilitatorSession); setReceiptFields({ signal: record.signal || '', invitation: record.invitation || '', affectedParties: record.affectedParties || '', consent: record.consent || '', alignment: record.alignment || '', action: record.action || '', outcome: record.outcome || '', renewal: record.renewal || '', evidence: record.evidence || '', assumptions: record.assumptions || '', unknowns: record.unknowns || '' }); flash('Receipt replayed'); };
  const importJson = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const parsed = JSON.parse(await file.text()); if (parsed.model === 'Flow Covenant Runtime' || String(parsed.id || '').startsWith('fcr-')) loadReceipt(parsed); else flash('Import file was not recognized'); } catch { flash('Import failed'); } finally { event.target.value = ''; } };

  return (
    <main>
      {notice && <div className="toast">{notice}</div>}
      <section className="hero">
        <div><p className="eyebrow">Flow Covenant Runtime v{appVersion}</p><h1>A Playfield Governance Model for Coherent Systems</h1><p className="lead">Move from force-first law thinking into participation-first flow thinking.</p><div className="formula">Force creates compliance. Flow creates participation.</div><nav className="actions"><a href="#facilitator">Facilitator</a><a href="#guide">Guide</a><a href="#simulator">Simulator</a><a href="#repair">Repair</a><a href="#practice">Practice</a><a href="#evidence">Evidence</a><a href="#receipt">Receipt</a><a href="#library">Library</a></nav></div>
        <aside className="boundary"><b>Claim-safe boundary</b><p>{claimBoundary}</p></aside>
      </section>

      <section className="panel about" id="about"><p className="eyebrow">About / Manifesto</p><h2>Life is play, not force.</h2><p className="sectionLead">FCR keeps accountability, evidence, boundaries, and repair visible while shifting the center from domination to coherent participation.</p><div className="manifestoGrid"><article><h3>Boundaries are instruments.</h3><p>They shape the playfield without turning compliance into the whole story.</p></article><article><h3>Correction is return.</h3><p>When drift appears, the goal is repair, not shame.</p></article><article><h3>Receipts keep trust.</h3><p>Every meaningful move should be explainable, reviewable, and repair-capable.</p></article></div></section>

      <section className="panel facilitatorMode" id="facilitator"><p className="eyebrow">Facilitator Mode</p><h2>Run the room without forcing the field</h2><p className="sectionLead">Use v0.8 facilitator tools for meetings, workshops, release reviews, and community sessions. Everything stays local unless exported.</p><div className="facilitatorModes">{facilitatorModes.map((mode) => <button key={mode.id} className={facilitatorSession.mode === mode.id ? 'active' : ''} onClick={() => applyMode(mode)}><b>{mode.title}</b><span>{mode.minutes} min · {mode.focus}</span></button>)}</div><div className="facilitatorLayout"><article className="timerCard"><p className="eyebrow">Session timer</p><strong>{formatSeconds(timerSeconds)}</strong><div className="timerControls"><button onClick={() => setTimerRunning((value) => !value)}>{timerRunning ? 'Pause' : 'Start'}</button><button className="secondary" onClick={() => setTimerSeconds((facilitatorModes.find((mode) => mode.id === facilitatorSession.mode)?.minutes || 45) * 60)}>Reset mode</button><button className="secondary" onClick={() => setTimerSeconds((seconds) => seconds + 5 * 60)}>+5 min</button></div><div className={`validation ${validation.ready ? 'ready' : 'watch'}`}><b>{validation.passed}/{validation.total} closeout checks</b>{validation.checks.map((check) => <span key={check.label}>{check.ok ? '✓' : '•'} {check.label}</span>)}</div></article><article className="facilitatorFields"><p className="eyebrow">Room notes</p>{Object.entries(facilitatorSession).map(([key, value]) => <label key={key}>{key}{key === 'mode' ? <select value={value} onChange={(event) => setFacilitatorField(key, event.target.value)}>{facilitatorModes.map((mode) => <option key={mode.id} value={mode.id}>{mode.title}</option>)}</select> : <textarea value={value} onChange={(event) => setFacilitatorField(key, event.target.value)} />}</label>)}</article></div><div className="practiceGrid"><article><h3>Room prompts</h3>{roomPrompts.map((item) => <p key={item.stage}><b>{item.stage}</b><span>{item.prompt}</span></p>)}</article><article><h3>Decision summary</h3><p><b>Owner</b><span>{facilitatorSession.decisionOwner || 'Not named yet'}</span></p><p><b>Gate state</b><span>{gateCounts.pass} pass · {gateCounts.watch} watch · {gateCounts.block} block</span></p><p><b>Reversibility</b><span>{reversibilityAssessment.label} · score {reversibilityAssessment.score}/4</span></p><p><b>Closeout</b><span>{facilitatorSession.closeoutSummary}</span></p></article></div><div className="practiceActions"><button onClick={() => copyText(facilitatorMarkdown).then(() => flash('Facilitator packet copied'))}>Copy facilitator packet</button><button className="secondary" onClick={() => downloadText(`${facilitatorPacket.id}.md`, facilitatorMarkdown, 'text/markdown')}>Download packet MD</button><button className="secondary" onClick={() => downloadText(`${facilitatorPacket.id}.json`, JSON.stringify(facilitatorPacket, null, 2), 'application/json')}>Download packet JSON</button></div></section>

      <section className="panel guidedMode" id="guide"><p className="eyebrow">Guided Mode</p><h2>Walk the whole loop one clean step at a time</h2><div className="guidedProgress"><span><b>{Math.round(((guidedIndex + 1) / guidedSteps.length) * 100)}%</b> guided</span><progress value={guidedIndex + 1} max={guidedSteps.length}>{guidedIndex + 1}</progress><span>{guidedSteps[guidedIndex]}</span></div><div className="guidedLayout"><aside className="guidedRail">{guidedSteps.map((step, index) => <button key={step} className={index === guidedIndex ? 'active' : ''} onClick={() => setGuidedIndex(index)}><span>{index + 1}</span>{step}</button>)}</aside><article className="guidedCard"><p className="eyebrow">Step {guidedIndex + 1} of {guidedSteps.length}</p><h3>{guidedSteps[guidedIndex]}</h3><p>Use the current section below to complete this part of the process, then move forward when the receipt field is clean enough.</p><div className="guidedNav"><button className="secondary" onClick={() => setGuidedIndex(Math.max(0, guidedIndex - 1))}>Back</button><button onClick={() => setGuidedIndex(Math.min(guidedSteps.length - 1, guidedIndex + 1))}>Next</button><button className="secondary" onClick={saveScenario}>Save guided session</button></div></article></div></section>

      <section className="panel" id="loop"><p className="eyebrow">Runtime Loop Explorer</p><h2>Signal → Invitation → Consent → Alignment → Flow → Receipt → Renewal</h2><div className="loopButtons">{steps.map((step) => <button key={step.id} className={active === step.id ? 'active' : ''} onClick={() => setActive(step.id)}><span>{step.number}</span>{step.title}</button>)}</div><article className="stepCard"><span>{currentStep.number}</span><h3>{currentStep.title}</h3><h4>{currentStep.prompt}</h4><p>Boundaries shape play. Receipts keep trust. Repair keeps flow alive.</p></article></section>

      <section className="panel" id="simulator"><p className="eyebrow">Law vs Flow Simulator</p><h2>Turn a scenario into two decision paths</h2><div className="samples">{samples.map((sample) => <button key={sample.title} onClick={() => applySample(sample)}><b>{sample.title}</b><span>{sample.domain}</span></button>)}</div><div className="scenarioEditor"><label>Scenario type<select value={scenarioType} onChange={(event) => { setScenarioType(event.target.value); setRepairPlan(repairTemplates[event.target.value] || starterRepairPlan); }}>{scenarioTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label>Scenario<textarea value={scenario} onChange={(event) => setScenario(event.target.value)} /></label></div><div className="paths"><article><h3>Law-thinking path</h3><ol><li>Convert the situation into a rule or command.</li><li>Ask whether participants complied or violated.</li><li>Escalate through enforcement or punishment.</li></ol></article><article className="flow"><h3>Flow-thinking path</h3><ol><li>Name the signal without rushing to judgment.</li><li>Translate command energy into invitation.</li><li>Check consent, harm, evidence, reversibility, and repair.</li><li>Take the smallest coherent action and write a receipt.</li></ol></article></div><div className={`risk ${evaluation.risk}`}><b>Risk level: {evaluation.risk}</b>{evaluation.watchSignals.length ? <ul>{evaluation.watchSignals.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No major watch signal detected. Still run the gates before settlement.</p>}</div></section>

      <section className="panel" id="gates"><p className="eyebrow">Governance Gates</p><h2>Check the field before action settles</h2><div className="gateSummary"><span><b>{gateCounts.pass}</b> pass</span><span><b>{gateCounts.watch}</b> watch</span><span><b>{gateCounts.block}</b> block</span></div><div className="gates">{gates.map(([id, title, prompt]) => { const gate = gateStates.find((item) => item.gateId === id); return <article key={id} className={gate.status}><div><h3>{title}</h3><p>{prompt}</p></div><label>Status<select value={gate.status} onChange={(event) => setGate(id, { status: event.target.value })}><option value="pass">Pass</option><option value="watch">Watch</option><option value="block">Block</option></select></label><label>Note<input value={gate.note} onChange={(event) => setGate(id, { note: event.target.value })} /></label></article>; })}</div></section>

      <section className="panel" id="repair"><p className="eyebrow">Repair Builder / Reversibility Helper</p><h2>Turn drift into a clean repair path</h2><div className="repairToolbar"><button onClick={() => { setRepairPlan(repairTemplates[scenarioType] || starterRepairPlan); flash('Repair template applied'); }}>Apply {scenarioType} template</button><button className="secondary" onClick={() => setRepairField('drift', scenario)}>Draft from scenario</button></div><div className="repairLayout"><div className="fields repairFields">{Object.entries(repairPlan).map(([key, value]) => <label key={key}>{key}<textarea value={value} onChange={(event) => setRepairField(key, event.target.value)} /></label>)}</div><aside className={`reversibility ${reversibilityAssessment.label}`}><p className="eyebrow">Reversibility helper</p><h3>{reversibilityAssessment.label}</h3><strong>Score {reversibilityAssessment.score} / 4</strong><ul>{reversibilityAssessment.guidance.map((item) => <li key={item}>{item}</li>)}</ul></aside></div></section>

      <section className="panel practicePack" id="practice"><p className="eyebrow">Public Practice Pack</p><h2>Use FCR in a room, meeting, workshop, or reflection session</h2><div className="practiceActions"><button onClick={() => window.print()}>Print current page</button><button className="secondary" onClick={() => copyText(decisionCards.map((card) => `${card.title}: ${card.prompt}`).join('\n\n')).then(() => flash('Decision cards copied'))}>Copy decision cards</button></div><div className="cardDeck">{decisionCards.map((card) => <article key={card.title}><b>{card.title}</b><p>{card.prompt}</p><button onClick={() => { setScenario(`${scenario}\n\nPractice card — ${card.title}: ${card.prompt}`); flash('Decision card added'); }}>Add to scenario</button></article>)}</div></section>

      <section className="panel practicePack" id="evidence"><p className="eyebrow">Practice Evidence Pack</p><h2>Worked examples, fixtures, and public-safe review checks</h2><p className="sectionLead">v0.7 adds evidence-pack assets so users can learn from examples and future tests can replay expected gate behavior.</p><div className="practiceGrid"><article><h3>Worked examples</h3>{evidenceExamples.map((item) => <p key={item.title}><b>{item.title}</b><span>{item.signal} Receipt focus: {item.receipt}</span></p>)}</article><article><h3>Fixture expectations</h3>{evidenceFixtures.map((fixture) => <p key={fixture.id}><b>{fixture.id}</b><span>{fixture.domain}: {fixture.expected}</span></p>)}</article></div><div className="practiceActions"><a href="./docs/evidence-pack.md">Evidence overview</a><a href="./docs/worked-examples.md">Worked examples</a><a href="./docs/accessibility-checklist.md">Accessibility checklist</a></div></section>

      <section className="panel" id="receipt"><p className="eyebrow">Receipt Builder</p><h2>Create a local Flow Covenant receipt</h2><div className="receiptLayout"><div className="fields">{Object.entries(receiptFields).map(([key, value]) => <label key={key}>{key}<textarea value={value} onChange={(event) => setField(key, event.target.value)} /></label>)}</div><aside className="receipt"><div><b>{receipt.id}</b><button onClick={() => copyText(markdownReceipt).then(() => flash('Markdown copied'))}>Copy MD</button><button onClick={() => downloadText(`${receipt.id}.md`, markdownReceipt, 'text/markdown')}>MD</button><button onClick={() => downloadText(`${receipt.id}.json`, JSON.stringify(receipt, null, 2), 'application/json')}>JSON</button><button className="secondary" onClick={saveReceipt}>Save</button></div><pre>{JSON.stringify(receipt, null, 2)}</pre></aside></div></section>

      <section className="panel" id="library"><p className="eyebrow">Local Library</p><h2>Saved scenarios and receipt replay</h2><p className="sectionLead">Everything stays in this browser unless you export it. No accounts, no backend, no hidden network calls.</p><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importJson} /><div className="libraryActions"><button onClick={saveScenario}>Save current scenario</button><button onClick={saveReceipt}>Save current receipt</button><button className="secondary" onClick={() => importRef.current?.click()}>Import receipt JSON</button><button className="danger" onClick={() => { setSavedScenarios([]); setSavedReceipts([]); flash('Local library cleared'); }}>Clear local library</button></div><div className="libraryGrid"><article><h3>Saved scenarios</h3>{savedScenarios.length === 0 ? <p className="empty">No saved scenarios yet.</p> : savedScenarios.map((item) => <div className="savedItem" key={item.id}><b>{item.title}</b><small>{item.scenarioType} · {item.updatedAt}</small><button onClick={() => loadScenario(item)}>Load</button></div>)}</article><article><h3>Saved receipts</h3>{savedReceipts.length === 0 ? <p className="empty">No saved receipts yet.</p> : savedReceipts.map((item) => <div className="savedItem" key={item.id}><b>{item.id}</b><small>{item.scenarioType} · {item.savedAt || item.createdAt}</small><button onClick={() => loadReceipt(item)}>Replay</button></div>)}</article></div></section>

      <footer><b>Flow Covenant Runtime</b><span>{claimBoundary}</span></footer>
    </main>
  );
}
