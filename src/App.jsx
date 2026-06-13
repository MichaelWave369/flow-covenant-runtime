import { useMemo, useState } from 'react';

const appVersion = '0.2.0';
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

const samples = [
  {
    title: 'AI collaborator receives an unclear request',
    domain: 'AI collaboration',
    text: 'A user asks an AI assistant to generate a strong public claim from a poetic idea, but the evidence is still early and mostly metaphorical.',
  },
  {
    title: 'Team wants to rush a release',
    domain: 'Software workflow',
    text: 'A product team wants to ship a feature today even though consent language, rollback behavior, and audit receipts are incomplete.',
  },
  {
    title: 'Community meeting around a public promise',
    domain: 'Community governance',
    text: 'A community has heard job and infrastructure promises, but residents want receipts, repair paths, and transparent decision records.',
  },
  {
    title: 'Personal decision with emotional charge',
    domain: 'Personal reflection',
    text: 'A person feels pressure to make a fast decision while angry, but wants to preserve relationship, truth, and future repair.',
  },
];

const scenarioTypes = ['AI collaboration', 'Software workflow', 'Community governance', 'Personal reflection', 'Product decision', 'Other'];

const manifestoCards = [
  ['Life is play, not force.', 'The model begins from a softer center: order can arise through invitation, relation, rhythm, and repair.'],
  ['Boundaries are instruments, not cages.', 'A good boundary gives life shape without pretending compliance is the whole story.'],
  ['Correction is return, not shame.', 'When a system drifts, the first question is what needs repair so future play can continue.'],
  ['Receipts replace authority theater.', 'Trust grows when actions can be explained, reviewed, reversed, or renewed.'],
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

function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function getSearchParam(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const value = new URLSearchParams(window.location.search).get(name);
  return value || fallback;
}

function summarizeGates(gateStates) {
  return gateStates.reduce(
    (summary, gate) => ({ ...summary, [gate.status]: (summary[gate.status] || 0) + 1 }),
    { pass: 0, watch: 0, block: 0, total: gateStates.length },
  );
}

function evaluate(text) {
  const lower = text.toLowerCase();
  const watchSignals = [];
  const consent = /consent|permission|affected|community|team|people|user|resident/.test(lower);
  const evidence = /evidence|claim|promise|receipt|audit|data|proof|release/.test(lower);
  const irreversible = /irreversible|permanent|delete|public|publish|ship/.test(lower);
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

function makeShareUrl(scenario, scenarioType, activeStep) {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('scenario', scenario);
  url.searchParams.set('type', scenarioType);
  url.searchParams.set('step', activeStep);
  return url.toString();
}

function makeReceipt(scenario, scenarioType, fields, gateStates, shareUrl) {
  const gateCounts = summarizeGates(gateStates);
  const identity = JSON.stringify({ scenario, scenarioType, fields, gateStates });
  return {
    id: `fcr-${hash(identity)}`,
    model: 'Flow Covenant Runtime',
    version: appVersion,
    createdAt: new Date().toISOString(),
    scenarioType,
    scenario,
    ...fields,
    gateSummary: gateStates,
    gateCounts,
    shareUrl,
    claimBoundary,
  };
}

function receiptToMarkdown(receipt) {
  return `# Flow Covenant Receipt ${receipt.id}\n\n**Scenario type:** ${receipt.scenarioType}\n\n**Created:** ${receipt.createdAt}\n\n**Gate summary:** ${receipt.gateCounts.pass} pass · ${receipt.gateCounts.watch} watch · ${receipt.gateCounts.block} block\n\n## Scenario\n\n${receipt.scenario}\n\n## Runtime fields\n\n- **Signal:** ${receipt.signal}\n- **Invitation:** ${receipt.invitation}\n- **Affected parties:** ${receipt.affectedParties}\n- **Consent:** ${receipt.consent}\n- **Alignment:** ${receipt.alignment}\n- **Action:** ${receipt.action}\n- **Outcome:** ${receipt.outcome}\n- **Renewal:** ${receipt.renewal}\n\n## Evidence posture\n\n- **Evidence:** ${receipt.evidence}\n- **Assumptions:** ${receipt.assumptions}\n- **Unknowns:** ${receipt.unknowns}\n\n## Share URL\n\n${receipt.shareUrl}\n\n## Claim-safe boundary\n\n${receipt.claimBoundary}\n\n\`\`\`json\n${JSON.stringify(receipt, null, 2)}\n\`\`\``;
}

async function copyText(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  window.prompt('Copy this text:', text);
}

function LoopDiagram({ active, onSelect }) {
  return (
    <div className="loopDiagram" aria-label="Flow Covenant Runtime loop diagram">
      <div className="loopRing" />
      <div className="loopCenter">
        <b>Playfield Governance</b>
        <span>boundaries · receipts · repair</span>
      </div>
      {steps.map((step, index) => {
        const angle = (index / steps.length) * 360 - 90;
        const transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-192px) rotate(${-angle}deg)`;
        return (
          <button
            key={step.id}
            className={`loopNode ${active === step.id ? 'active' : ''}`}
            style={{ transform }}
            onClick={() => onSelect(step.id)}
          >
            <span>{step.number}</span>
            <b>{step.title}</b>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(() => getSearchParam('step', 'signal'));
  const [scenario, setScenario] = useState(() => getSearchParam('scenario', samples[0].text));
  const [scenarioType, setScenarioType] = useState(() => getSearchParam('type', samples[0].domain));
  const [receiptFields, setReceiptFields] = useState(starterReceipt);
  const [gateStates, setGateStates] = useState(gates.map(([id]) => ({ gateId: id, status: 'watch', note: '' })));
  const [notice, setNotice] = useState('');

  const currentStep = steps.find((step) => step.id === active) ?? steps[0];
  const evaluation = useMemo(() => evaluate(scenario), [scenario]);
  const shareUrl = useMemo(() => makeShareUrl(scenario, scenarioType, active), [scenario, scenarioType, active]);
  const receipt = useMemo(() => makeReceipt(scenario, scenarioType, receiptFields, gateStates, shareUrl), [scenario, scenarioType, receiptFields, gateStates, shareUrl]);
  const markdownReceipt = useMemo(() => receiptToMarkdown(receipt), [receipt]);

  const setField = (key, value) => setReceiptFields((current) => ({ ...current, [key]: value }));
  const setGate = (gateId, patch) => setGateStates((current) => current.map((gate) => (gate.gateId === gateId ? { ...gate, ...patch } : gate)));

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 1800);
  };

  const applySample = (sample) => {
    setScenario(sample.text);
    setScenarioType(sample.domain);
    setActive('signal');
  };

  const copyShareLink = async () => {
    await copyText(shareUrl);
    flash('Share link copied');
  };

  const copyReceipt = async () => {
    await copyText(markdownReceipt);
    flash('Receipt copied as Markdown');
  };

  const downloadReceipt = (format) => {
    const isMarkdown = format === 'md';
    const blob = new Blob([isMarkdown ? markdownReceipt : JSON.stringify(receipt, null, 2)], { type: isMarkdown ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receipt.id}.${isMarkdown ? 'md' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      {notice && <div className="toast">{notice}</div>}

      <section className="hero">
        <div>
          <p className="eyebrow">Flow Covenant Runtime v{appVersion}</p>
          <h1>A Playfield Governance Model for Coherent Systems</h1>
          <p className="lead">Move from force-first law thinking into participation-first flow thinking.</p>
          <div className="formula">Force creates compliance. Flow creates participation.</div>
          <nav className="actions" aria-label="Page sections">
            <a href="#about">About</a>
            <a href="#loop">Explore loop</a>
            <a href="#simulator">Simulator</a>
            <a href="#receipt">Build receipt</a>
          </nav>
        </div>
        <aside className="boundary"><b>Claim-safe boundary</b><p>{claimBoundary}</p></aside>
      </section>

      <section className="panel about" id="about">
        <p className="eyebrow">About / Manifesto</p>
        <h2>Life is play, not force.</h2>
        <p className="sectionLead">FCR keeps accountability, evidence, boundaries, and repair — but changes the emotional and architectural center of gravity from domination to coherent participation.</p>
        <div className="manifestoGrid">
          {manifestoCards.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="panel shift">
        <div><p className="eyebrow">Core shift</p><h2>Law-thinking vs flow-thinking</h2></div>
        <article><h3>Law-thinking</h3><p>obedience · enforcement · punishment · compliance</p></article>
        <strong className="vs">VS</strong>
        <article><h3>Flow-thinking</h3><p>participation · alignment · repair · renewal</p></article>
      </section>

      <section className="panel" id="loop">
        <p className="eyebrow">Runtime loop explorer</p>
        <h2>Signal → Invitation → Consent → Alignment → Flow → Receipt → Renewal</h2>
        <div className="loopGrid">
          <LoopDiagram active={active} onSelect={setActive} />
          <article className="stepCard"><span>{currentStep.number}</span><h3>{currentStep.title}</h3><h4>{currentStep.prompt}</h4><p>{currentStep.detail}</p><blockquote>Boundaries shape play. Receipts keep trust. Repair keeps flow alive.</blockquote></article>
        </div>
        <div className="loopButtons compact">
          {steps.map((step) => <button key={step.id} className={active === step.id ? 'active' : ''} onClick={() => setActive(step.id)}><span>{step.number}</span>{step.title}</button>)}
        </div>
      </section>

      <section className="panel" id="simulator">
        <p className="eyebrow">Law vs flow simulator</p>
        <h2>Turn a scenario into two decision paths</h2>
        <div className="samples">{samples.map((sample) => <button key={sample.title} onClick={() => applySample(sample)}><b>{sample.title}</b><span>{sample.domain}</span></button>)}</div>
        <label className="typePicker">Scenario type<select value={scenarioType} onChange={(event) => setScenarioType(event.target.value)}>{scenarioTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <textarea value={scenario} onChange={(event) => setScenario(event.target.value)} />
        <div className="shareBox"><input readOnly value={shareUrl} aria-label="Shareable scenario URL" /><button onClick={copyShareLink}>Copy share link</button></div>
        <div className="paths">
          <article><h3>Law-thinking path</h3><ol>{evaluation.lawPath.map((item) => <li key={item}>{item}</li>)}</ol></article>
          <article className="flow"><h3>Flow-thinking path</h3><ol>{evaluation.flowPath.map((item) => <li key={item}>{item}</li>)}</ol></article>
        </div>
        <div className={`risk ${evaluation.risk}`}><b>Risk level: {evaluation.risk}</b>{evaluation.watchSignals.length ? <ul>{evaluation.watchSignals.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No major watch signal detected. Still run the gates before settlement.</p>}</div>
      </section>

      <section className="panel" id="gates">
        <p className="eyebrow">Governance gates</p>
        <h2>Check the field before action settles</h2>
        <div className="gateSummary"><b>{receipt.gateCounts.pass}</b> pass <b>{receipt.gateCounts.watch}</b> watch <b>{receipt.gateCounts.block}</b> block</div>
        <div className="gates">{gates.map(([id, title, prompt]) => {
          const gate = gateStates.find((item) => item.gateId === id);
          return <article key={id} className={gate.status}><div><h3>{title}</h3><p>{prompt}</p></div><label>Status<select value={gate.status} onChange={(e) => setGate(id, { status: e.target.value })}><option value="pass">Pass</option><option value="watch">Watch</option><option value="block">Block</option></select></label><label>Note<input value={gate.note} onChange={(e) => setGate(id, { note: e.target.value })} /></label></article>;
        })}</div>
      </section>

      <section className="panel" id="receipt">
        <p className="eyebrow">Receipt builder</p>
        <h2>Create a local Flow Covenant receipt</h2>
        <div className="receiptLayout">
          <div className="fields">{Object.entries(receiptFields).map(([key, value]) => <label key={key}>{key}<textarea value={value} onChange={(e) => setField(key, e.target.value)} /></label>)}</div>
          <aside className="receipt"><div><b>{receipt.id}</b><button onClick={copyReceipt}>Copy Markdown</button><button onClick={() => downloadReceipt('json')}>JSON</button><button onClick={() => downloadReceipt('md')}>MD</button></div><pre>{JSON.stringify(receipt, null, 2)}</pre></aside>
        </div>
      </section>

      <footer><b>Flow Covenant Runtime v{appVersion}</b><span>{claimBoundary}</span></footer>
    </main>
  );
}
