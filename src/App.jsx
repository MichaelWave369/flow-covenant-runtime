import { useMemo, useState } from 'react';

const claimBoundary = 'This is a philosophy and systems-design model, not a claim that physical laws literally want, think, or feel.';

const steps = [
  ['signal', 1, 'Signal', 'What is arising?', 'Name the event, tension, request, opportunity, or drift before deciding what it means.'],
  ['invitation', 2, 'Invitation', 'What is being offered?', 'Convert command energy into a clear offer with a refusal path.'],
  ['consent', 3, 'Consent', 'Who or what is affected?', 'Identify affected parties, permission, refusal paths, and valid authority.'],
  ['alignment', 4, 'Alignment', 'Does this preserve coherence?', 'Check values, harms, claims, evidence, reversibility, and future play.'],
  ['flow', 5, 'Flow', 'What action moves?', 'Take the smallest accountable action that keeps correction possible.'],
  ['receipt', 6, 'Receipt', 'What changed and why?', 'Record what was decided, what evidence supported it, and what remains unknown.'],
  ['renewal', 7, 'Renewal', 'What repairs or regenerates?', 'Close the loop through repair, learning, rollback, apology, or adjustment.'],
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

function makeReceipt(scenario, fields, gateStates) {
  const body = {
    model: 'Flow Covenant Runtime',
    version: '0.1.0',
    createdAt: new Date().toISOString(),
    scenario,
    ...fields,
    gateSummary: gateStates,
    claimBoundary,
  };
  return { id: `fcr-${hash(JSON.stringify({ scenario, fields, gateStates }))}`, ...body };
}

export default function App() {
  const [active, setActive] = useState('signal');
  const [scenario, setScenario] = useState(samples[0].text);
  const [receiptFields, setReceiptFields] = useState(starterReceipt);
  const [gateStates, setGateStates] = useState(gates.map(([id]) => ({ gateId: id, status: 'watch', note: '' })));
  const [copied, setCopied] = useState(false);

  const currentStep = steps.find(([id]) => id === active) ?? steps[0];
  const evaluation = useMemo(() => evaluate(scenario), [scenario]);
  const receipt = useMemo(() => makeReceipt(scenario, receiptFields, gateStates), [scenario, receiptFields, gateStates]);

  const setField = (key, value) => setReceiptFields((current) => ({ ...current, [key]: value }));
  const setGate = (gateId, patch) => setGateStates((current) => current.map((gate) => (gate.gateId === gateId ? { ...gate, ...patch } : gate)));

  const copyReceipt = async () => {
    const md = `# Flow Covenant Receipt ${receipt.id}\n\n\`\`\`json\n${JSON.stringify(receipt, null, 2)}\n\`\`\``;
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadReceipt = () => {
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receipt.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Flow Covenant Runtime v0.1</p>
          <h1>A Playfield Governance Model for Coherent Systems</h1>
          <p className="lead">Move from force-first law thinking into participation-first flow thinking.</p>
          <div className="formula">Force creates compliance. Flow creates participation.</div>
          <nav className="actions">
            <a href="#loop">Explore loop</a>
            <a href="#receipt">Build receipt</a>
          </nav>
        </div>
        <aside className="boundary"><b>Claim-safe boundary</b><p>{claimBoundary}</p></aside>
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
          <div className="loopButtons">
            {steps.map(([id, number, title]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => setActive(id)}><span>{number}</span>{title}</button>)}
          </div>
          <article className="stepCard"><span>{currentStep[1]}</span><h3>{currentStep[2]}</h3><h4>{currentStep[3]}</h4><p>{currentStep[4]}</p><blockquote>Boundaries shape play. Receipts keep trust. Repair keeps flow alive.</blockquote></article>
        </div>
      </section>

      <section className="panel" id="simulator">
        <p className="eyebrow">Law vs flow simulator</p>
        <h2>Turn a scenario into two decision paths</h2>
        <div className="samples">{samples.map((sample) => <button key={sample.title} onClick={() => setScenario(sample.text)}><b>{sample.title}</b><span>{sample.domain}</span></button>)}</div>
        <textarea value={scenario} onChange={(event) => setScenario(event.target.value)} />
        <div className="paths">
          <article><h3>Law-thinking path</h3><ol>{evaluation.lawPath.map((item) => <li key={item}>{item}</li>)}</ol></article>
          <article className="flow"><h3>Flow-thinking path</h3><ol>{evaluation.flowPath.map((item) => <li key={item}>{item}</li>)}</ol></article>
        </div>
        <div className={`risk ${evaluation.risk}`}><b>Risk level: {evaluation.risk}</b>{evaluation.watchSignals.length ? <ul>{evaluation.watchSignals.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No major watch signal detected. Still run the gates before settlement.</p>}</div>
      </section>

      <section className="panel" id="gates">
        <p className="eyebrow">Governance gates</p>
        <h2>Check the field before action settles</h2>
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
          <aside className="receipt"><div><b>{receipt.id}</b><button onClick={copyReceipt}>{copied ? 'Copied' : 'Copy Markdown'}</button><button onClick={downloadReceipt}>Download JSON</button></div><pre>{JSON.stringify(receipt, null, 2)}</pre></aside>
        </div>
      </section>

      <footer><b>Flow Covenant Runtime</b><span>{claimBoundary}</span></footer>
    </main>
  );
}
