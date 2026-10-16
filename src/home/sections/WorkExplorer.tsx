"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { SectionCell } from "../Frame";
import { Icon } from "../Icon";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { useMotionAllowed } from "@/design-system/motion/useMotionAllowed";
import { AgentPortrait } from "../mockups/AgentPortrait";

/** Who makes the call in a chapter: you approve the exact writes ("approval"), or a reviewer from your team or the
 *  New Machines reviewer network gives a verdict ("review"). Nobody is assigned by name. */
type Mode = "approval" | "review";

/** One record in a workflow's table. `decided` is the state once the person decides (a "Review" row becomes "Approved"
 *  by default); `reason` explains a row; `held` marks a row the run lists but leaves alone. */
type RecordRow = Readonly<{ name: string; value: string; state: string; decided?: string; reason?: string; held?: true }>;

/** One line of an approval card: every write is counted, and writes after the first are covered by the same approval. */
type ApprovalCall = Readonly<{ app: string; action: string; count: number; sandbox?: true; also?: true }>;

type Workflow = Readonly<{
  team: string;
  title: string;
  body: string;
  /** The Workflow Pack the chapter runs. */
  pack: string;
  credit?: string;
  agent: string;
  agentNote: string;
  source: string;
  systems?: readonly string[];
  sourceInfo: string;
  output: string;
  outputNote: string;
  records: Readonly<{ heading: string; value: string; rows: readonly RecordRow[] }>;
  mode: Mode;
  decision: string;
  /** The reviewer's typed verdict (review mode only). */
  reply: string;
  approval?: Readonly<{ title: string; calls: readonly ApprovalCall[] }>;
  writes?: Readonly<{ before: string; after: string }>;
  roles: string;
  steps: readonly string[];
  data: string;
  verifiedNote: string;
}>;

const SYNTHETIC = "synthetic data";

const WORKFLOWS: readonly Workflow[] = [
  {
    team: "Finance", title: "Every order, followed to cash.", pack: "Order-to-Cash Exception Desk", credit: "Pack contributed by Adrian Anton Ladia",
    body: "Follow each order from store to warehouse to ledger and find every break: payments pending confirmation, orders shipped but not paid, paid but not shipped, and disputed invoices. One approval covers every write, and each write is counted.",
    agent: "Order-to-Cash Triage Agent", agentNote: "With the Collections Writer and Report Agent",
    source: "Kalumpang Demo Supply Co.", systems: ["Store", "Ledger", "Warehouse", "Sales app"], sourceInfo: "Read only · 48 orders",
    output: "Exception desk report", outputNote: "One row per exception, with the evidence from each system and the policy action. Reminders come from each account manager, for the largest overdue balances; the rest are listed, not sent.",
    records: { heading: "Order", value: "At stake", rows: [
      { name: "SO-2041 · Bakawan Bakeshop", value: "₱48,600.00", state: "Reminder", decided: "Drafted", reason: "Shipped, not paid · 21 days past terms" },
      { name: "SO-2044 · Dalisay Hardware", value: "₱31,250.00", state: "Reminder", decided: "Drafted", reason: "Shipped, not paid · 9 days past terms" },
      { name: "SO-2047 · Liwayway Catering", value: "₱27,900.00", state: "Warehouse note", decided: "Noted", reason: "Paid, not shipped" },
      { name: "SO-2052 · Malaya Grocery", value: "₱12,350.00", state: "Finance note", decided: "Noted", reason: "Payment pending confirmation" },
      { name: "SO-2058 · Tala Eatery", value: "₱9,480.00", state: "Finance note", decided: "Noted", reason: "Disputed invoice" },
      { name: "SO-2063 · Sampaguita Café", value: "₱3,200.00", state: "Listed only", reason: "Shipped, not paid · not among the largest balances", held: true },
    ] },
    mode: "approval",
    decision: "Six breaks across 48 orders. Save 2 collection reminders as Gmail drafts (₱79,850.00 outstanding), post 2 finance notes and 1 warehouse note? Sampaguita Café is listed only.",
    reply: "",
    approval: { title: "Save reminder drafts and post notes", calls: [
      { app: "Gmail", action: "Save a reminder draft", count: 2 },
      { app: "Ledger", action: "Post a finance note", count: 2, sandbox: true, also: true },
      { app: "Warehouse", action: "Post a warehouse note", count: 1, sandbox: true, also: true },
    ] },
    writes: { before: "None until you approve", after: "5, all after your approval" },
    roles: "The agents follow each order and draft the reminders. You approve once; nothing is sent and no money moves.",
    steps: ["Read the store, ledger, warehouse and sales app", "Follow each order across all four", "Name each break and its policy action", "Draft reminders from each account manager", "Save drafts and post notes after one approval", "Write the report, one row per exception"],
    data: "illustrative demo data", verifiedNote: "5 writes counted · Work receipt ready",
  },
  {
    team: "Sales", title: "More conversations. Less preparation.", pack: "Inbox Lead Tracker",
    body: "Every real enquiry in your inbox added to your leads sheet, with who asked, what for and how soon. A decision model sorts real enquiries from the rest, and you approve the rows before anything is written.",
    agent: "Lead Agent", agentNote: "With the decision model",
    source: "Gmail inbox", sourceInfo: "This week · read only",
    output: "Leads sheet rows", outputNote: "One row per real enquiry: who asked, what for and how soon. Emails that are not enquiries are left out, each with a reason.",
    records: { heading: "Enquiry", value: "How soon", rows: [
      { name: "Aster Labs · bulk order", value: "This month", state: "Add row", decided: "Added" },
      { name: "Meridian · price list", value: "Next week", state: "Add row", decided: "Added" },
      { name: "Newsletter signup", value: "—", state: "Not a lead", reason: "Sorted as not an enquiry", held: true },
    ] },
    mode: "approval",
    decision: "Two real enquiries this week. Add them to your leads sheet? One newsletter signup was sorted out and is not added.",
    reply: "",
    approval: { title: "Add rows to your leads sheet", calls: [{ app: "Google Sheets", action: "Append a row", count: 2 }] },
    roles: "The agent reads and sorts. You approve the rows; nothing is written before that.",
    steps: ["Read this week’s inbox", "Sort real enquiries from the rest", "Note who asked, what for and how soon", "Add the rows after your approval"],
    data: SYNTHETIC, verifiedNote: "2 rows added · Ready to inspect",
  },
  {
    team: "Operations", title: "Keep the business moving.", pack: "Weekly Expense Check",
    body: "A week of expenses sorted by category, with missing receipts, items over the limit and duplicates flagged. A reviewer checks what is flagged, and you approve the summary before it reaches your inbox.",
    agent: "Expense Agent", agentNote: "With the Writer Agent",
    source: "Expenses sheet", sourceInfo: "Week 41 · 23 expenses",
    output: "Weekly expense summary", outputNote: "Every expense sorted by category, each flag with its reason, and a short summary drafted for your inbox.",
    records: { heading: "Expense", value: "Amount", rows: [
      { name: "Taxi · client visit", value: "₱486.00", state: "Ready", decided: "Categorised" },
      { name: "Team lunch", value: "₱6,240.00", state: "Review", decided: "Accepted", reason: "₱1,240.00 over the meal limit" },
      { name: "Design software", value: "₱2,950.00", state: "Review", decided: "Duplicate", reason: "Possible duplicate of a 7 October charge" },
    ] },
    mode: "review",
    decision: "The team lunch is over the meal limit, and the design software charge may duplicate one from 7 October. Accept the lunch and flag the duplicate?",
    reply: "The lunch was a client workshop, agreed in advance: accept it. The software is a duplicate: flag it for a refund request.",
    roles: "The agent sorts and flags. A reviewer checks the flags; you approve the summary.",
    steps: ["Read the week’s expenses", "Sort each by category", "Flag missing receipts, limits and duplicates", "Draft the summary for your inbox"],
    data: SYNTHETIC, verifiedNote: "Ready to inspect",
  },
  {
    team: "Support", title: "Thoughtful replies. At your pace.", pack: "Support Inbox Triage",
    body: "Every customer email sorted into a case, complaints and refund requests checked by a person, replies drafted and each case logged in your sheet.",
    agent: "Support Agent", agentNote: "With the Writer Agent and the decision model",
    source: "Support inbox", sourceInfo: "16 emails · today",
    output: "Reviewed reply drafts", outputNote: "Each email sorted into a case and logged, a reply drafted from the facts, and complaints and refund requests sent to a person.",
    records: { heading: "Email", value: "Case", rows: [
      { name: "Delivery update", value: "Question", state: "Ready", decided: "Reply drafted" },
      { name: "Account access", value: "Question", state: "Ready", decided: "Reply drafted" },
      { name: "Charged twice", value: "Refund request", state: "Review", decided: "Reply drafted", reason: "Refund requests go to a person" },
    ] },
    mode: "review",
    decision: "A customer was charged ₱1,280.00 twice for the October invoice and asks for a refund. The draft confirms the double charge. Is it right to send?",
    reply: "Confirmed in the order record: the second charge is a duplicate. Approve the draft and log the case for the refunds team.",
    roles: "The agent sorts and drafts. A reviewer checks complaints and refund requests; nothing is sent from here.",
    steps: ["Sort each email into a case", "Look up the facts", "Send complaints and refunds to a person", "Draft replies and log each case"],
    data: SYNTHETIC, verifiedNote: "Ready to inspect",
  },
];

/** The words for the person in the loop, by mode. */
const PERSON = {
  approval: { kicker: "Your approval", name: "You", detail: "Approve each exact write", entry: "What you are approving", awaiting: "Awaiting your approval", reviewing: "Waiting for your approval.", submit: "Approve", submitted: "Approved", recorded: "Approved by you · Every write counted", pending: "One approval · Every write counted", decided: "Approved by you" },
  review: { kicker: "Reviewer", name: "A reviewer", detail: "From your team or the network", entry: "The reviewer’s verdict", awaiting: "Awaiting a reviewer", reviewing: "A reviewer is checking.", submit: "Submit verdict", submitted: "Submitted", recorded: "Verdict recorded with the work", pending: "Redacted for the network · Verdict required", decided: "Verdict recorded" },
} as const;

type RunState = "ready" | "running" | "review" | "verified";
/** The reviewer's verdict types out at this pace, then a cursor presses Submit. */
const TYPE_MS = 24;
const CURSOR_PRESS_MS = 700;
const SUBMIT_MS = 1000;
/** With reduced motion the whole verdict shows at once and submits after this pause. */
const STILL_SUBMIT_MS = 900;

const PORTRAITS = ["invoice", "leads", "receipt", "support"] as const;

function WorkflowFromUrl({ onSelect }: { onSelect: (index: number) => void }) {
  const searchParams = useSearchParams();
  const team = searchParams?.get("workflow");
  useEffect(() => {
    const index = WORKFLOWS.findIndex((workflow) => workflow.team.toLowerCase() === team);
    if (index >= 0) onSelect(index);
  }, [team, onSelect]);
  return null;
}

/** One workflow chapter at a time: the team selector switches which chapter is shown (the others carry `hidden`),
 *  and switching resets that chapter's demo. `?workflow=<team>` selects on load. */
export function WorkExplorer() {
  const [selected, setSelected] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [resets, setResets] = useState([0, 0, 0, 0]);
  const chapters = useRef<HTMLDivElement | null>(null);
  const selectTeam = useCallback((index: number) => {
    setSelected(index);
    setResets((values) => values.map((value, i) => i === index ? value + 1 : value));
    // The chapters column is always rendered (unlike the chapter React is about to show), so it is the scroll target.
    chapters.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, []);
  return (
    <SectionCell id="work-explorer" labelledBy="explorer-title" className="explorer-section">
      <Suspense fallback={null}><WorkflowFromUrl onSelect={selectTeam} /></Suspense>
      <div className="section-opener"><div><p className="section-eyebrow"><span aria-hidden="true" />Your workforce, in action</p><h2 id="explorer-title">Less busywork.<br /><span>More business.</span></h2></div><p>Four of the platform Workflow Packs, run on sample data. Agents do the work; a person approves every write and reviews what needs judgment.</p></div>
      <div className="workflow-browser">
        <aside className="workflow-sidebar">
          <span className="micro-label">Explore by team</span>
          <div className="workflow-selector" role="group" aria-label="Choose a team workflow" data-keyboard={keyboard} style={{ "--tab-index": selected } as CSSProperties} onKeyDown={() => setKeyboard(true)} onPointerDown={() => setKeyboard(false)}>
            <span className="workflow-selection" aria-hidden="true" />
            {WORKFLOWS.map((workflow, i) => <button type="button" key={workflow.team} aria-label={`0${i + 1} ${workflow.team}`} aria-pressed={selected === i} aria-controls={"workflow-" + workflow.team.toLowerCase()} data-component={"workflowTeam" + workflow.team} onClick={() => selectTeam(i)}><span className="workflow-tab-index">0{i + 1}</span>{workflow.team}<Icon /></button>)}
          </div>
          <a className="text-link" href="#hire">Find your next pack<Icon /></a>
          <div className="workflow-legend"><span data-accent="machine"><i className="bg-machine" />AI does the work</span><span data-accent="human"><i className="bg-human" />You make the call</span></div>
        </aside>
        <div className="workflow-chapters" ref={chapters}>
          {WORKFLOWS.map((flow, i) => <section key={flow.team} id={"workflow-" + flow.team.toLowerCase()} className="workflow-chapter" data-active={selected === i} hidden={selected !== i} aria-labelledby={"workflow-title-" + i}>
            <div className="workflow-description"><span className="micro-label">{flow.team} / {flow.pack}</span><h3 id={"workflow-title-" + i}>{flow.title}</h3><p>{flow.body}</p>{flow.credit ? <p className="workflow-credit">{flow.credit}</p> : null}</div>
            <WorkflowPreview key={i + "-" + resets[i]} index={i} />
          </section>)}
        </div>
      </div>
    </SectionCell>
  );
}

function ApprovalCard({ approval }: { approval: NonNullable<Workflow["approval"]> }) {
  const first = approval.calls.filter((call) => !call.also);
  const also = approval.calls.filter((call) => call.also);
  const line = (call: ApprovalCall) => <li key={call.app + call.action}><span>{call.app}<small>{call.action}{call.sandbox ? " · sandbox only" : ""}</small></span><strong>Calls × {call.count}</strong></li>;
  return (
    <div className="review-entry-box approval-calls">
      <p className="approval-calls-title">{approval.title}</p>
      <ul>{first.map(line)}</ul>
      {also.length ? <><p className="scene-kicker">Also covered by this approval</p><ul>{also.map(line)}</ul></> : null}
    </div>
  );
}

function WorkflowPreview({ index }: { index: number }) {
  const [run, setRun] = useState<RunState>("ready");
  const flow = WORKFLOWS[index];
  const person = PERSON[flow.mode];
  const { records } = flow;
  const motion = useMotionAllowed();
  const [typed, setTyped] = useState(0);
  const [pressing, setPressing] = useState(false);
  useEffect(() => {
    if (run !== "running") return;
    const timeout = setTimeout(() => setRun("review"), 1100);
    return () => clearTimeout(timeout);
  }, [run]);
  // The visitor watches: the reviewer types a verdict and submits it, or the approval card is approved.
  useEffect(() => {
    if (run !== "review") return;
    if (!motion) {
      const submit = setTimeout(() => setRun("verified"), STILL_SUBMIT_MS);
      return () => clearTimeout(submit);
    }
    if (typed < flow.reply.length) {
      const next = setTimeout(() => setTyped((count) => count + 1), TYPE_MS);
      return () => clearTimeout(next);
    }
    const press = setTimeout(() => setPressing(true), CURSOR_PRESS_MS);
    const submit = setTimeout(() => setRun("verified"), SUBMIT_MS);
    return () => { clearTimeout(press); clearTimeout(submit); };
  }, [run, typed, motion, flow.reply]);
  const startOrReset = () => { setTyped(0); setPressing(false); setRun(run === "verified" ? "ready" : "running"); };
  const finished = run === "review" || run === "verified";
  const verified = run === "verified";
  const shown = verified || (run === "review" && !motion) ? flow.reply : run === "review" ? flow.reply.slice(0, typed) : "";
  const typing = run === "review" && motion && typed < flow.reply.length;
  const typedOut = verified || (run === "review" && shown.length === flow.reply.length);
  const placeholder = "The reviewer replies here once the agent flags a decision.";
  const data = flow.data[0].toUpperCase() + flow.data.slice(1);
  // Every footer line is laid out (only the current one visibly), so the footer keeps the height of the longest and never jumps.
  const status: Record<RunState, string> = { ready: `Try a complete run with ${flow.data}.`, running: `Agent working on ${flow.data}…`, review: `Agent complete. ${person.reviewing}`, verified: `Verified · Human approved · ${flow.verifiedNote}` };
  const announced = flow.mode === "approval" ? `${person.decided}: ${flow.approval?.title ?? ""}` : `The reviewer submitted: ${flow.reply}`;
  return (
        <div className="workflow-canvas task-preview">
          <div className="workflow-canvas-toolbar"><span><Icon name="file" />{flow.pack}</span><span className="micro-label">Sandbox preview</span></div>
          <div className="task-input-file"><Icon name="file" /><span>{flow.source}</span>{flow.systems ? <span className="task-systems">{flow.systems.map((system) => <span key={system}>{system}</span>)}</span> : null}<span>{flow.sourceInfo}</span></div>
          <div className="task-preview-content">
            <div className={cn("task-output", run === "running" && "task-output-running")}>
              <div className="task-specialist"><AgentPortrait kind={PORTRAITS[index]} /><div><strong>{flow.agent}</strong><span>{flow.agentNote}</span></div><Badge status={run === "review" ? "waiting-for-human" : verified ? "verified" : "running"}>{run === "ready" ? "Ready" : run === "review" ? "Needs review" : undefined}</Badge></div>
              <div className="task-output-document"><span className="scene-kicker">Expected output</span><h4>{flow.output}</h4><p>{flow.outputNote}</p><table className="workflow-record-table"><caption className="sr-only">{`Records for this workflow: ${flow.data}`}</caption><thead><tr><th scope="col">{records.heading}</th><th scope="col">{records.value}</th><th scope="col">Status</th></tr></thead><tbody>{records.rows.map(({ name, value, state, decided, reason, held }) => <tr key={name}><td>{name}{reason ? <span className="workflow-record-reason">{reason}</span> : null}</td><td>{value}</td><td><span className="workflow-record-state" data-review={!held && state !== "Ready" && !verified} data-excluded={held || undefined}>{verified ? decided ?? (state === "Review" ? "Approved" : state) : state}</span></td></tr>)}</tbody></table><dl><div><dt>Input</dt><dd>{flow.sourceInfo}</dd></div><div><dt>{flow.mode === "approval" ? "Your approval" : "Human review"}</dt><dd>{verified ? person.decided : "Required"}</dd></div>{flow.writes ? <div><dt>Writes</dt><dd>{verified ? flow.writes.after : flow.writes.before}</dd></div> : null}<div><dt>Evidence</dt><dd>{verified ? "Work receipt · Verified" : "Collected with the work"}</dd></div></dl></div>
              <details className="task-activity"><summary>Run activity<span>{finished ? `${flow.steps.length} actions completed` : `${flow.steps.length} planned actions`}<Icon name="plus" /></span></summary><ol>{flow.steps.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}{finished ? <Icon name="check" /> : null}</li>)}</ol></details>
            </div>
            <div className={cn("workflow-review task-reviewer", run === "review" && "review-active")}>
              <span className="scene-kicker">{person.kicker}</span><div className="review-title">{flow.mode === "approval" ? <span className="review-avatar" data-accent="human">You</span> : <AgentPortrait kind="human" />}<div><p>{person.name}<small>{person.detail}</small></p></div></div>
              <div className="task-review-context"><span className="scene-kicker">Flagged by the agent</span><p className="review-reason">{flow.decision}</p></div>
              <div className="review-entry" data-component={"workflowDecision" + flow.team} data-state={run}>
                <span className="scene-kicker">{person.entry}</span>
                {flow.approval
                  ? <ApprovalCard approval={flow.approval} />
                  : /* A picture of the reviewer's input, not a form: the visitor watches, and screen readers hear the submitted verdict once. */
                    <div className="review-entry-box" aria-hidden="true"><span className="review-entry-ghost">{flow.reply}</span><span className="review-entry-ghost">{placeholder}</span><span className="review-entry-text">{shown || <span className="review-entry-placeholder">{placeholder}</span>}{typing ? <span className="review-caret" /> : null}</span></div>}
                <div className="review-entry-actions" aria-hidden="true"><span className="review-submit" data-enabled={(run === "review" && typedOut) || verified || undefined} data-pressed={pressing || undefined}>{verified ? person.submitted : person.submit}<Icon name="check" /></span>{run === "review" && motion && typedOut ? <svg className="review-cursor" viewBox="0 0 24 28"><path d="M3 2v21l6-5 4 8 4-2-4-8 8-1Z" /></svg> : null}</div>
                <p className="sr-only" aria-live="polite">{verified ? announced : ""}</p>
              </div>
              <div className="task-review-state"><Icon name={verified ? "check" : "shield"} /><span>{verified ? person.recorded : person.pending}</span></div>
              <p className="task-review-note">{flow.roles}</p>
            </div>
          </div>
          <div className="workflow-result" aria-live="polite"><div><Icon name="shield" /><div><p>{verified ? flow.output : "Evidence follows the work."}</p><span className="workflow-result-status"><span>{status[run]}</span>{(Object.keys(status) as RunState[]).filter((state) => state !== run).map((state) => <span key={state} aria-hidden="true">{status[state]}</span>)}</span></div></div><button type="button" className="demo-run-button" disabled={run === "running" || run === "review"} onClick={startOrReset}>{run === "running" ? "Running…" : run === "review" ? person.awaiting : verified ? "Reset demo" : "Run demo"}<Icon name={verified ? "arrow" : "play"} /></button></div>
          <p className="canvas-caption">Interactive demo · {data}{flow.systems ? `, ${flow.source}` : ""} · No real actions or charges</p>
        </div>
  );
}
