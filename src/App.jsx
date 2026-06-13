import { useMemo, useRef, useState } from 'react';

const appVersion = '0.5.0';
const claimBoundary = 'This is a philosophy and systems-design model, not a claim that physical laws literally want, think, or feel.';

const steps = [
  { id: 'signal', number: 1, title: 'Signal', prompt: 'What is arising?', detail: 'Name the event, tension, request, opportunity, or drift before deciding what it means.' },
  { id: 'invitation', number: 2, title: 'Invitation', prompt: 'What is being offered?', detail: 'Convert command energy into a clear offer with a refusal path.' },
  { id: 'consent', number: 3, title: 'Consent', prompt: 'Who or what is affected?', detail: 'Identify affected parties, permission, refusal paths, and valid authority.' },
  { id: 'alignment', number: 4, title: 'Alignment', prompt: 'Does this preserve coherence?', detail: 'Check values, harms, claims, evidence, reversibility, and future play.' },
  { id: 'flow', number: 5, title: 'Flow', prompt: 'What action moves?', detail: 'Take the smallest accountable action that keeps correction possible.' },
  { id: 'receipt', number: 6, title: 'Receipt', prompt: 'What changed and why?', detail: 'Record what was decided, what evidence supported it, and what remains unknown.' },
  { id: 'renewal', number: 7, title: 'Renewal', prompt: 'What repairs or regenerates?', detail: 'Close the loop through repair, learning, rollback, apology, or adjustment.' },
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

const manifestoCards = [
  ['Life is play, not force.', 'The model begins from a softer center: order can arise through invitation, relation, rhythm, and repair.'],
  ['Boundaries are instruments, not cages.', 'A good boundary gives life shape without pretending compliance is the whole story.'],
  ['Correction is return, not shame.', 'When a system drifts, the first question is what needs repair so future play can continue.'],
  ['Receipts replace authority theater.', 'Trust grows when actions can be explained, reviewed, reversed, or renewed.'],
];

const samples = [
  { title: 'AI collaborator receives an unclear request', domain: 'AI collaboration', text: 'A user asks an AI assistant to generate a strong public claim from a poetic idea, but the evidence is still early and mostly metaphorical.' },
  { title: 'Team wants to rush a release', domain: 'Software workflow', text: 'A product team wants to ship a feature today even though consent language, rollback behavior, and audit receipts are incomplete.' },
  { title: 'Community meeting around a public promise', domain: 'Community governance', text: 'A community has heard job and infrastructure promises, but residents want receipts, repair paths, and transparent decision records.' },
  { title: 'Personal decision with emotional charge', domain: 'Personal reflection', text: 'A person feels pressure to make a fast decision while angry, but wants to preserve relationship, truth, and future repair.' },
];

const starterReceipt = {
  signal: 'A request, drift, opportunity, or tension has appeared.',
  invitation: 'Translate the command into a clear offer with a refusal path.',
  affectedParties: 'Name the people, systems, records, and future users affected.',
  consent: 'Confirm permission, delegated authority, or the need to pause.',
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
  immediateStabilization: 'Pause escalation, name the uncertainty, protect affected parties, and keep the next move reversible.',
  affectedRepair: 'Name who needs clarification, apology, rollback, support, or a new consent path.',
  reversibleAction: 'Define what can be paused, undone, reduced, sandboxed, or tested before full settlement.',
  repairAction: 'Choose the concrete repair move that restores coherence without hiding accountability.',
  followUp: 'Define when the repair will be reviewed and what signal proves the field is healthier.',
  renewalReceipt: 'Record the repair decision, evidence, assumptions, unknowns, and next check-in.',
};

const repairTemplates = {
  'AI collaboration': {
    drift: 'A request may blur metaphor, evidence, authority, or public claim boundaries.',
    immediateStabilization: 'Pause strong claims and restate the claim-safe boundary before generating output.',
    affectedRepair: 'Protect the user, audience, collaborators, and future readers from confusing metaphor with proof.',
    reversibleAction: 'Produce a draft, not a final public claim; keep language editable and cite unknowns.',
    repairAction: 'Rewrite the output as philosophy, design pattern, or hypothesis; remove overclaiming language.',
    followUp: 'Review whether the final artifact clearly separates facts, assumptions, and poetic framing.',
    renewalReceipt: 'Attach a receipt that names the boundary, changes made, and remaining unknowns.',
  },
  'Software workflow': {
    drift: 'A release or workflow may be moving faster than consent, rollback, testing, or audit readiness.',
    immediateStabilization: 'Freeze risky deployment paths and move the change behind a reversible flag or review gate.',
    affectedRepair: 'Name users, maintainers, operators, support teams, and downstream systems affected by the change.',
    reversibleAction: 'Prefer feature flags, staged rollout, sandbox testing, backups, and a documented rollback command.',
    repairAction: 'Create a patch plan with owner, test, rollback, receipt, and post-release review.',
    followUp: 'Run a release health check after deployment and record any drift signals.',
    renewalReceipt: 'Save a release receipt with test result, rollback status, and repair decisions.',
  },
  'Community governance': {
    drift: 'A promise, decision, or impact may be unclear, undocumented, disputed, or missing public repair paths.',
    immediateStabilization: 'Slow the decision, publish the knowns and unknowns, and invite affected voices before settlement.',
    affectedRepair: 'Name residents, workers, officials, landholders, future generations, and institutions affected.',
    reversibleAction: 'Use public questions, staged commitments, written receipts, and review windows before irreversible action.',
    repairAction: 'Create a public repair packet: what happened, what was promised, what is disputed, and what will be checked.',
    followUp: 'Schedule a review date and define the receipts required to close the issue.',
    renewalReceipt: 'Publish a plain-language receipt that separates measured, promised, claimed, unknown, and disputed items.',
  },
  'Personal reflection': {
    drift: 'Emotion, pressure, fear, shame, or urgency may be narrowing choice and reducing future repair.',
    immediateStabilization: 'Pause, breathe, lower the intensity, and choose the smallest non-harming next move.',
    affectedRepair: 'Name self, relationships, responsibilities, and any person who needs respect or clarity.',
    reversibleAction: 'Delay irreversible words or actions; choose a temporary boundary, note, draft, or check-in instead.',
    repairAction: 'Offer clarification, apology, boundary, changed behavior, or a truthful follow-up conversation.',
    followUp: 'Review the situation after emotion settles and decide whether another repair step is needed.',
    renewalReceipt: 'Write a private receipt: what I felt, what I chose, what I repaired, and what I learned.',
  },
  'Product decision': {
    drift: 'A product move may optimize growth while weakening consent, clarity, trust, or support load.',
    immediateStabilization: 'Hold the decision until user impact, opt-out, rollback, and support paths are visible.',
    affectedRepair: 'Name users, customers, maintainers, support, partners, and public trust affected by the decision.',
    reversibleAction: 'Use experiments, beta cohorts, opt-in toggles, rollback windows, and transparent change notes.',
    repairAction: 'Change the product path to preserve agency, reduce surprise, and add support or reversal tools.',
    followUp: 'Review adoption, complaint, support, and trust signals after the change.',
    renewalReceipt: 'Record what changed, why, who was affected, and how repair remains available.',
  },
  Other: starterRepairPlan,
};

const decisionCards = [
  { title: 'Name the Signal', prompt: 'What is actually arising before interpretation, blame, or urgency gets added?', use: 'Start here when the group is arguing about meaning before naming the event.' },
  { title: 'Turn Command into Invitation', prompt: 'What is being offered, and what would a clean refusal path look like?', use: 'Use when the request feels like pressure, compliance, or authority theater.' },
  { title: 'Map Affected Parties', prompt: 'Who or what is affected now, downstream, and after the decision becomes public?', use: 'Use before settlement, publication, deployment, or public promise.' },
  { title: 'Separate Evidence from Story', prompt: 'What is measured, promised, claimed, assumed, unknown, or disputed?', use: 'Use when claims are emotionally strong but records are incomplete.' },
  { title: 'Choose the Reversible Move', prompt: 'What is the smallest pause, draft, test, rollback, or staged action that preserves repair?', use: 'Use whenever the move could be hard to undo.' },
  { title: 'Write the Receipt', prompt: 'What changed, why, who consented, what remains unknown, and when will we review it?', use: 'Use at the end of every meaningful decision or repair step.' },
];

const workshopFlow = [
  ['0-5 min', 'Read the claim-safe boundary and the core formula aloud.'],
  ['5-15 min', 'Name the scenario, affected parties, and obvious watch signals.'],
  ['15-30 min', 'Run the six governance gates and mark pass, watch, or block.'],
  ['30-45 min', 'Build a repair or reversibility path for every watch/block item.'],
  ['45-55 min', 'Write the receipt: facts, assumptions, unknowns, action, review date.'],
  ['55-60 min', 'Name the renewal step and decide what evidence will close the loop.'],
];

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

function getSearchParam(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(name) || fallback;
}

function summarizeGates(gateStates) {
  return gateStates.reduce((summary, gate) => ({ ...summary, [gate.status]: (summary[gate.status] || 0) + 1 }), { pass: 0, watch: 0, block: 0, total: gateStates.length });
}

function evaluate(text) {
  const lower = text.toLowerCase();
  const watchSignals = [];
  const consent = /consent|permission|affected|community|team|people|user|resident/.test(lower);
  const evidence = /evidence|claim|promise|receipt|audit|data|proof|release/.test(lower);
  const irreversible = /irreversible|permanent|delete|public|publish|ship|deploy|final/.test(lower);
  const harm = /harm|unsafe|medical|legal|financial|threat|coerce|force/.test(lower);
  if (consent) watchSignals.push('Affected parties or consent boundaries may need to be named.');
  if (evidence) watchSignals.push('Evidence, assumptions, and unknowns should be separated.');
  if (irreversible) watchSignals.push('Prefer reversible action or a rollback path before settlement.');
  if (harm) watchSignals.push('Harm and coercion checks should be explicit before any action.');
  return {
    risk: harm || irreversible ? 'high' : evidence ? 'medium' : 'low',
    watchSignals,
    lawPath: ['Convert the situation into a rule or command.', 'Ask whether participants complied or violated the rule.', 'Escalate through enforcement, correction, or punishment.', 'Record the outcome mostly as pass/fail compliance.'],
    flowPath: ['Name the signal without rushing to judgment.', 'Translate the request into a clear invitation with refusal paths.', 'Check consent, harm, claims, evidence, reversibility, and repair.', 'Take the smallest coherent action and produce a receipt.', 'Renew the field through learning, rollback, apology, or adjustment.'],
  };
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
  if (hardWords) guidance.push('Irreversible or high-impact language is present. Prefer draft, pause, sandbox, staged rollout, or explicit rollback.');
  if (!safetyWords) guidance.push('Add a visible rollback, delay, opt-in, sandbox, backup, or review step before action settles.');
  if (guidance.length === 0) guidance.push('This action appears repair-capable. Keep the receipt and follow-up check visible.');
  return { score, label, guidance };
}

function makeShareUrl(scenario, scenarioType, activeStep) {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('scenario', scenario);
  url.searchParams.set('type', scenarioType);
  url.searchParams.set('step', activeStep);
  return url.toString();
}

function makeReceipt(scenario, scenarioType, fields, repairPlan, reversibilityAssessment, gateStates, shareUrl) {
  const gateCounts = summarizeGates(gateStates);
  const identity = JSON.stringify({ scenario, scenarioType, fields, repairPlan, gateStates });
  return { id: `fcr-${hash(identity)}`, model: 'Flow Covenant Runtime', version: appVersion, createdAt: new Date().toISOString(), scenarioType, scenario, ...fields, repairPlan, reversibilityAssessment, gateSummary: gateStates, gateCounts, shareUrl, claimBoundary };
}

function receiptToMarkdown(receipt) {
  return `# Flow Covenant Receipt ${receipt.id}\n\n**Scenario type:** ${receipt.scenarioType}\n\n**Scenario:** ${receipt.scenario}\n\n## Runtime Fields\n\n- Signal: ${receipt.signal}\n- Invitation: ${receipt.invitation}\n- Affected parties: ${receipt.affectedParties}\n- Consent: ${receipt.consent}\n- Alignment: ${receipt.alignment}\n- Action: ${receipt.action}\n- Outcome: ${receipt.outcome}\n- Renewal: ${receipt.renewal}\n\n## Repair Plan\n\n- Drift: ${receipt.repairPlan.drift}\n- Immediate stabilization: ${receipt.repairPlan.immediateStabilization}\n- Affected repair: ${receipt.repairPlan.affectedRepair}\n- Reversible action: ${receipt.repairPlan.reversibleAction}\n- Repair action: ${receipt.repairPlan.repairAction}\n- Follow-up: ${receipt.repairPlan.followUp}\n- Renewal receipt: ${receipt.repairPlan.renewalReceipt}\n\n## Reversibility\n\n**Label:** ${receipt.reversibilityAssessment.label}\n\n${receipt.reversibilityAssessment.guidance.map((item) => `- ${item}`).join('\n')}\n\n## Evidence Boundary\n\n- Evidence: ${receipt.evidence}\n- Assumptions: ${receipt.assumptions}\n- Unknowns: ${receipt.unknowns}\n\n## Claim-Safe Boundary\n\n${receipt.claimBoundary}\n`;
}

function practiceWorksheetMarkdown(scenario, scenarioType, gateStates, repairPlan, receipt) {
  const gateRows = gateStates.map((gate) => `- ${gate.gateId}: ${gate.status}${gate.note ? ` — ${gate.note}` : ''}`).join('\n');
  return `# Flow Covenant Runtime Practice Worksheet\n\n## 1. Scenario\n\nType: ${scenarioType}\n\n${scenario}\n\n## 2. Signal and Invitation\n\n- What is arising?\n- What is being offered?\n- What refusal path exists?\n\n## 3. Affected Parties\n\n- Who is directly affected?\n- Who is downstream?\n- What records or systems are affected?\n\n## 4. Governance Gates\n\n${gateRows}\n\n## 5. Repair and Reversibility\n\n- Drift: ${repairPlan.drift}\n- Stabilization: ${repairPlan.immediateStabilization}\n- Reversible action: ${repairPlan.reversibleAction}\n- Repair action: ${repairPlan.repairAction}\n- Follow-up: ${repairPlan.followUp}\n\n## 6. Receipt\n\nReceipt ID: ${receipt.id}\n\n- What changed?\n- Why was this action chosen?\n- What remains unknown?\n- What proves renewal is working?\n\n## Claim-Safe Boundary\n\n${claimBoundary}\n`;
}

async function copyText(text) {
  if (navigator.clipboard) { await navigator.clipboard.writeText(text); return; }
  window.prompt('Copy this text:', text);
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

function dedupeById(records) {
  const map = new Map();
  records.forEach((record) => map.set(record.id, record));
  return Array.from(map.values()).sort((a, b) => String(b.updatedAt || b.savedAt || b.createdAt).localeCompare(String(a.updatedAt || a.savedAt || a.createdAt)));
}

function LoopDiagram({ active, onSelect }) {
  return <div className='loopDiagram' aria-label='Flow Covenant Runtime loop diagram'><div className='loopRing' /><div className='loopCenter'><b>Playfield Governance</b><span>boundaries · receipts · repair</span></div>{steps.map((step, index) => { const angle = (index / steps.length) * 360 - 90; const transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-192px) rotate(${-angle}deg)`; return <button key={step.id} className={`loopNode ${active === step.id ? 'active' : ''}`} style={{ transform }} onClick={() => onSelect(step.id)}><span>{step.number}</span><b>{step.title}</b></button>; })}</div>;
}

export default function App() {
  const [active, setActive] = useState(() => getSearchParam('step', 'signal'));
  const [scenario, setScenario] = useState(() => getSearchParam('scenario', samples[0].text));
  const [scenarioType, setScenarioType] = useState(() => getSearchParam('type', samples[0].domain));
  const [receiptFields, setReceiptFields] = useState(starterReceipt);
  const [repairPlan, setRepairPlan] = useState(starterRepairPlan);
  const [gateStates, setGateStates] = useState(gates.map(([id]) => ({ gateId: id, status: 'watch', note: '' })));
  const [notice, setNotice] = useState('');
  const [savedScenarios, setSavedScenarios] = useLocalState('fcr.savedScenarios.v1', []);
  const [savedReceipts, setSavedReceipts] = useLocalState('fcr.savedReceipts.v1', []);
  const importRef = useRef(null);

  const currentStep = steps.find((step) => step.id === active) ?? steps[0];
  const evaluation = useMemo(() => evaluate(scenario), [scenario]);
  const shareUrl = useMemo(() => makeShareUrl(scenario, scenarioType, active), [scenario, scenarioType, active]);
  const reversibilityAssessment = useMemo(() => assessReversibility(scenario, receiptFields, repairPlan, gateStates), [scenario, receiptFields, repairPlan, gateStates]);
  const receipt = useMemo(() => makeReceipt(scenario, scenarioType, receiptFields, repairPlan, reversibilityAssessment, gateStates, shareUrl), [scenario, scenarioType, receiptFields, repairPlan, reversibilityAssessment, gateStates, shareUrl]);
  const markdownReceipt = useMemo(() => receiptToMarkdown(receipt), [receipt]);
  const worksheetMarkdown = useMemo(() => practiceWorksheetMarkdown(scenario, scenarioType, gateStates, repairPlan, receipt), [scenario, scenarioType, gateStates, repairPlan, receipt]);
  const gateCounts = receipt.gateCounts;

  const flash = (message) => { setNotice(message); setTimeout(() => setNotice(''), 1800); };
  const setField = (key, value) => setReceiptFields((current) => ({ ...current, [key]: value }));
  const setRepairField = (key, value) => setRepairPlan((current) => ({ ...current, [key]: value }));
  const setGate = (gateId, patch) => setGateStates((current) => current.map((gate) => (gate.gateId === gateId ? { ...gate, ...patch } : gate)));
  const applySample = (sample) => { setScenario(sample.text); setScenarioType(sample.domain); setActive('signal'); setRepairPlan(repairTemplates[sample.domain] || starterRepairPlan); };
  const applyRepairTemplate = () => { setRepairPlan(repairTemplates[scenarioType] || starterRepairPlan); flash('Repair template applied'); };
  const draftRepairFromScenario = () => { setRepairPlan((current) => ({ ...current, drift: scenario, immediateStabilization: evaluation.risk === 'high' ? 'Pause action, name the risk, and choose a reversible next move before settlement.' : 'Slow down enough to name affected parties, evidence, and repair paths.', reversibleAction: 'Use a draft, pause, sandbox, staged rollout, review window, backup, opt-in, or rollback path before final action.', followUp: 'Review the repair after the next meaningful signal or within an agreed time window.' })); flash('Repair draft generated from scenario'); };

  const scenarioSnapshot = () => ({ id: `scenario-${hash(JSON.stringify({ scenario, scenarioType, receiptFields, repairPlan, gateStates }))}`, title: scenario.slice(0, 82) || 'Untitled scenario', scenario, scenarioType, active, receiptFields, repairPlan, gateStates, updatedAt: new Date().toISOString() });
  const saveScenario = () => { const record = scenarioSnapshot(); setSavedScenarios((current) => dedupeById([record, ...current])); flash('Scenario saved locally'); };
  const loadScenario = (record) => { setScenario(record.scenario || ''); setScenarioType(record.scenarioType || 'Other'); setActive(record.active || 'signal'); setReceiptFields(record.receiptFields || starterReceipt); setRepairPlan(record.repairPlan || starterRepairPlan); setGateStates(record.gateStates || gates.map(([id]) => ({ gateId: id, status: 'watch', note: '' }))); flash('Scenario loaded'); };
  const saveReceipt = () => { const record = { ...receipt, savedAt: new Date().toISOString() }; setSavedReceipts((current) => dedupeById([record, ...current])); flash('Receipt saved locally'); };
  const loadReceipt = (record) => { setScenario(record.scenario || ''); setScenarioType(record.scenarioType || 'Other'); setReceiptFields({ signal: record.signal || '', invitation: record.invitation || '', affectedParties: record.affectedParties || '', consent: record.consent || '', alignment: record.alignment || '', action: record.action || '', outcome: record.outcome || '', renewal: record.renewal || '', evidence: record.evidence || '', assumptions: record.assumptions || '', unknowns: record.unknowns || '' }); setRepairPlan(record.repairPlan || starterRepairPlan); setGateStates(record.gateSummary || gateStates); setActive('receipt'); flash('Receipt replayed into builder'); };
  const exportLibrary = () => { const bundle = { model: 'Flow Covenant Runtime Library Bundle', version: appVersion, exportedAt: new Date().toISOString(), savedScenarios, savedReceipts, claimBoundary }; downloadText(`fcr-library-${hash(JSON.stringify(bundle))}.json`, JSON.stringify(bundle, null, 2), 'application/json'); };
  const importJson = async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const parsed = JSON.parse(await file.text()); if (Array.isArray(parsed.savedScenarios) || Array.isArray(parsed.savedReceipts)) { setSavedScenarios((current) => dedupeById([...(parsed.savedScenarios || []), ...current])); setSavedReceipts((current) => dedupeById([...(parsed.savedReceipts || []), ...current])); flash('Library bundle imported'); } else if (parsed.model === 'Flow Covenant Runtime' || parsed.id?.startsWith?.('fcr-')) { setSavedReceipts((current) => dedupeById([parsed, ...current])); loadReceipt(parsed); flash('Receipt imported and replayed'); } else { flash('Import file was not recognized'); } } catch { flash('Import failed: invalid JSON'); } finally { event.target.value = ''; } };
  const applyCard = (card) => { setScenario((current) => `${current}\n\nPractice card — ${card.title}: ${card.prompt}`); flash('Decision card added to scenario'); };

  return (
    <main>
      {notice && <div className='toast'>{notice}</div>}
      <section className='hero'>
        <div><p className='eyebrow'>Flow Covenant Runtime v{appVersion}</p><h1>A Playfield Governance Model for Coherent Systems</h1><p className='lead'>Move from force-first law thinking into participation-first flow thinking.</p><div className='formula'>Force creates compliance. Flow creates participation.</div><nav className='actions' aria-label='Page sections'><a href='#about'>About</a><a href='#loop'>Explore loop</a><a href='#simulator'>Simulator</a><a href='#gates'>Gates</a><a href='#repair'>Repair</a><a href='#practice'>Practice</a><a href='#receipt'>Receipt</a><a href='#library'>Library</a></nav></div>
        <aside className='boundary'><b>Claim-safe boundary</b><p>{claimBoundary}</p></aside>
      </section>

      <section className='panel about' id='about'><p className='eyebrow'>About / Manifesto</p><h2>Life is play, not force.</h2><p className='sectionLead'>FCR keeps accountability, evidence, boundaries, and repair — but changes the emotional and architectural center of gravity from domination to coherent participation.</p><div className='manifestoGrid'>{manifestoCards.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>

      <section className='panel shift'><div><p className='eyebrow'>Core shift</p><h2>Law-thinking vs flow-thinking</h2></div><article><h3>Law-thinking</h3><p>obedience · enforcement · punishment · compliance</p></article><strong className='vs'>VS</strong><article><h3>Flow-thinking</h3><p>participation · alignment · repair · renewal</p></article></section>

      <section className='panel' id='loop'><p className='eyebrow'>Runtime loop explorer</p><h2>Signal → Invitation → Consent → Alignment → Flow → Receipt → Renewal</h2><div className='loopGrid'><LoopDiagram active={active} onSelect={setActive} /><article className='stepCard'><span>{currentStep.number}</span><h3>{currentStep.title}</h3><h4>{currentStep.prompt}</h4><p>{currentStep.detail}</p><blockquote>Boundaries shape play. Receipts keep trust. Repair keeps flow alive.</blockquote></article></div><div className='loopButtons compact'>{steps.map((step) => <button key={step.id} className={active === step.id ? 'active' : ''} onClick={() => setActive(step.id)}><span>{step.number}</span>{step.title}</button>)}</div></section>

      <section className='panel' id='simulator'><p className='eyebrow'>Law vs flow simulator</p><h2>Turn a scenario into two decision paths</h2><div className='samples'>{samples.map((sample) => <button key={sample.title} onClick={() => applySample(sample)}><b>{sample.title}</b><span>{sample.domain}</span></button>)}</div><div className='scenarioEditor'><label>Scenario type<select value={scenarioType} onChange={(event) => { setScenarioType(event.target.value); setRepairPlan(repairTemplates[event.target.value] || starterRepairPlan); }}>{scenarioTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label>Scenario<textarea value={scenario} onChange={(event) => setScenario(event.target.value)} /></label></div><div className='shareBox'><b>Shareable scenario URL</b><input value={shareUrl} readOnly /><button onClick={() => copyText(shareUrl).then(() => flash('Share link copied'))}>Copy link</button><button className='secondary' onClick={saveScenario}>Save scenario</button></div><div className='paths'><article><h3>Law-thinking path</h3><ol>{evaluation.lawPath.map((item) => <li key={item}>{item}</li>)}</ol></article><article className='flow'><h3>Flow-thinking path</h3><ol>{evaluation.flowPath.map((item) => <li key={item}>{item}</li>)}</ol></article></div><div className={`risk ${evaluation.risk}`}><b>Risk level: {evaluation.risk}</b>{evaluation.watchSignals.length ? <ul>{evaluation.watchSignals.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No major watch signal detected. Still run the gates before settlement.</p>}</div></section>

      <section className='panel' id='gates'><p className='eyebrow'>Governance gates</p><h2>Check the field before action settles</h2><div className='gateSummary'><span><b>{gateCounts.pass}</b> pass</span><span><b>{gateCounts.watch}</b> watch</span><span><b>{gateCounts.block}</b> block</span></div><div className='gates'>{gates.map(([id, title, prompt]) => { const gate = gateStates.find((item) => item.gateId === id) || { status: 'watch', note: '' }; return <article key={id} className={gate.status}><div><h3>{title}</h3><p>{prompt}</p></div><label>Status<select value={gate.status} onChange={(e) => setGate(id, { status: e.target.value })}><option value='pass'>Pass</option><option value='watch'>Watch</option><option value='block'>Block</option></select></label><label>Note<input value={gate.note} onChange={(e) => setGate(id, { note: e.target.value })} /></label></article>; })}</div></section>

      <section className='panel' id='repair'><p className='eyebrow'>Repair builder / Reversibility helper</p><h2>Turn drift into a clean repair path</h2><p className='sectionLead'>Repair does not excuse harm or erase accountability. It names what drifted, protects affected parties, chooses reversible action where possible, and records a renewal receipt.</p><div className='repairToolbar'><button onClick={applyRepairTemplate}>Apply {scenarioType} template</button><button className='secondary' onClick={draftRepairFromScenario}>Draft from scenario</button><button className='secondary' onClick={() => setActive('renewal')}>Jump to Renewal step</button></div><div className='repairLayout'><div className='fields repairFields'>{Object.entries(repairPlan).map(([key, value]) => <label key={key}>{key}<textarea value={value} onChange={(e) => setRepairField(key, e.target.value)} /></label>)}</div><aside className={`reversibility ${reversibilityAssessment.label}`}><p className='eyebrow'>Reversibility helper</p><h3>{reversibilityAssessment.label}</h3><strong>Score {reversibilityAssessment.score} / 4</strong><ul>{reversibilityAssessment.guidance.map((item) => <li key={item}>{item}</li>)}</ul></aside></div></section>

      <section className='panel practicePack' id='practice'><p className='eyebrow'>Public Practice Pack</p><h2>Use FCR in a room, meeting, workshop, or reflection session</h2><p className='sectionLead'>v0.5 turns the app into a practice kit: printable worksheet, 60-minute facilitation flow, and decision cards that help a group stay grounded without needing any hidden context.</p><div className='practiceActions'><button onClick={() => downloadText('flow-covenant-practice-worksheet.md', worksheetMarkdown, 'text/markdown')}>Download worksheet</button><button className='secondary' onClick={() => copyText(worksheetMarkdown).then(() => flash('Worksheet copied'))}>Copy worksheet</button><button className='secondary' onClick={() => window.print()}>Print current page</button></div><div className='practiceGrid'><article><h3>One-page worksheet</h3><ol><li>Name the scenario and signal.</li><li>Map affected parties and consent boundaries.</li><li>Run the six gates.</li><li>Choose the reversible move.</li><li>Write the receipt and renewal check.</li></ol></article><article><h3>60-minute workshop</h3><div className='timeline'>{workshopFlow.map(([time, action]) => <p key={time}><b>{time}</b><span>{action}</span></p>)}</div></article></div><h3>Decision-card deck</h3><div className='cardDeck'>{decisionCards.map((card) => <article key={card.title}><b>{card.title}</b><p>{card.prompt}</p><small>{card.use}</small><div><button onClick={() => copyText(`${card.title}: ${card.prompt}`).then(() => flash('Decision card copied'))}>Copy card</button><button className='secondary' onClick={() => applyCard(card)}>Add to scenario</button></div></article>)}</div></section>

      <section className='panel' id='receipt'><p className='eyebrow'>Receipt builder</p><h2>Create a local Flow Covenant receipt</h2><div className='receiptLayout'><div className='fields'>{Object.entries(receiptFields).map(([key, value]) => <label key={key}>{key}<textarea value={value} onChange={(e) => setField(key, e.target.value)} /></label>)}</div><aside className='receipt'><div><b>{receipt.id}</b><button onClick={() => copyText(markdownReceipt).then(() => flash('Markdown copied'))}>Copy MD</button><button onClick={() => downloadText(`${receipt.id}.md`, markdownReceipt, 'text/markdown')}>MD</button><button onClick={() => downloadText(`${receipt.id}.json`, JSON.stringify(receipt, null, 2), 'application/json')}>JSON</button><button className='secondary' onClick={saveReceipt}>Save</button></div><pre>{JSON.stringify(receipt, null, 2)}</pre></aside></div></section>

      <section className='panel' id='library'><p className='eyebrow'>Local library</p><h2>Saved scenarios and receipt replay</h2><p className='sectionLead'>Everything in this library stays in this browser unless you export it. No accounts, no backend, no hidden network calls.</p><input ref={importRef} type='file' accept='application/json,.json' hidden onChange={importJson} /><div className='libraryActions'><button onClick={saveScenario}>Save current scenario</button><button onClick={saveReceipt}>Save current receipt</button><button className='secondary' onClick={exportLibrary}>Export library bundle</button><button className='secondary' onClick={() => importRef.current?.click()}>Import JSON</button><button className='danger' onClick={() => { setSavedScenarios([]); setSavedReceipts([]); flash('Local library cleared'); }}>Clear local library</button></div><div className='libraryGrid'><article><h3>Saved scenarios</h3>{savedScenarios.length === 0 ? <p className='empty'>No saved scenarios yet.</p> : savedScenarios.map((item) => <div className='savedItem' key={item.id}><b>{item.title}</b><small>{item.scenarioType} · {item.updatedAt}</small><div><button onClick={() => loadScenario(item)}>Load</button><button className='secondary' onClick={() => setSavedScenarios((current) => current.filter((record) => record.id !== item.id))}>Remove</button></div></div>)}</article><article><h3>Saved receipts</h3>{savedReceipts.length === 0 ? <p className='empty'>No saved receipts yet.</p> : savedReceipts.map((item) => <div className='savedItem' key={item.id}><b>{item.id}</b><small>{item.scenarioType} · {item.savedAt || item.createdAt}</small><div><button onClick={() => loadReceipt(item)}>Replay</button><button className='secondary' onClick={() => downloadText(`${item.id}.json`, JSON.stringify(item, null, 2), 'application/json')}>Export</button><button className='secondary' onClick={() => setSavedReceipts((current) => current.filter((record) => record.id !== item.id))}>Remove</button></div></div>)}</article></div></section>

      <footer><b>Flow Covenant Runtime</b><span>{claimBoundary}</span></footer>
    </main>
  );
}
