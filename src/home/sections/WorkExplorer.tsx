"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { SectionCell } from "../Frame";
import { Icon } from "../Icon";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { MARKETPLACE_COPY } from "@/marketplace/copy";
import { countWord, lineDiffs, yen, SAMPLE_BATCH, SAMPLE_RUN, type Recommendation } from "@/marketplace/invoiceMatcher";
import { useMotionAllowed } from "@/design-system/motion/useMotionAllowed";
import { AgentPortrait } from "../mockups/AgentPortrait";
import { InvoicePhotoPreview } from "../mockups/InvoicePhotoPreview";

const WORKFLOWS = [
  { team: "Finance", title: "Close the books. Open up your time.", body: "Check each invoice is genuine and agrees with the purchase order and receiving report. The agent recommends; a qualified reviewer approves before anything is paid.", task: "Month-end reconciliation", agent: "Invoice matcher", source: "supplier_invoices.csv", sourceInfo: "24 invoices · October 2026", output: "Invoice match report", roles: "The agent matches the documents. M. Tanaka decides what gets paid.", decision: `Receipt ${SAMPLE_RUN.record.invoice.number}: ${countWord(lineDiffs(SAMPLE_RUN.record).length).toLowerCase()} PO quantities differ from what was received. Revise the PO and approve the invoice?`, reply: "Checked with the warehouse: the quantity change at dispatch was agreed. Revise the PO to match the receipt and approve.", person: "M. Tanaka", initials: "MT", role: "Finance reviewer · Tokyo", steps: ["Verify supplier, bank and PO", "Screen duplicates and tampering", "Match PO, receipt and invoice", "Diagnose exceptions and recommend"] },
  { team: "Sales", title: "More conversations. Less preparation.", body: "Research accounts and score their fit, with evidence for every score. The agent never makes contact: your team reviews the shortlist and owns the next conversation.", task: "Inbound lead qualification", agent: "Lead qualifier", source: "inbound_accounts.csv", sourceInfo: "18 accounts · This week", output: "Qualified account shortlist", roles: "The agent researches and scores. S. Lim decides who gets contacted.", decision: "Meridian scored 88 but is enterprise tier, with about 1,400 employees. Is it worth the enterprise sales cycle?", reply: "Worth it. Strong fit across Tokyo, Singapore and Seoul. Approve Meridian and route it to the enterprise team.", person: "S. Lim", initials: "SL", role: "GTM reviewer · Singapore", steps: ["Check CRM and exclusions", "Research company evidence", "Score fit against your rubric", "Prepare shortlist with evidence"] },
  { team: "Operations", title: "Keep the business moving.", body: "Check every supplier’s documents against each other and screen for risk. Bank details and the final call stay with a person.", task: "Vendor onboarding", agent: "Vendor intake agent", source: "vendor_applications.csv", sourceInfo: "12 applications · This week", output: "Reviewed vendor register", roles: "The agent checks the documents. J. Park decides who gets onboarded.", decision: "Kanso Studio’s bank account is in a different name from its legal entity. Hold it until a callback confirms the account?", reply: "Hold Kanso Studio until I confirm the bank account by phone. Send Meridian the tax certificate request.", person: "J. Park", initials: "JP", role: "Operations reviewer · Seoul", steps: ["Check documents are present and valid", "Cross-check names, IDs and bank holder", "Screen duplicates and sanctions", "Prepare register and bank callbacks"] },
  { team: "Support", title: "Thoughtful replies. At your pace.", body: "Draft helpful answers in your customer’s language. Keep sensitive cases with a human who can make the call.", task: "Bilingual customer support", agent: "Support reply drafter", source: "support_queue.csv", sourceInfo: "16 conversations · 日本語 / English", output: "Reviewed response drafts", roles: "The agent drafts the replies. A. Sato decides what gets sent.", decision: "Yamada-sama was charged ¥12,800 twice for the October invoice. Approve the refund so the reply can go out?", reply: "Refund approved in billing. Send the reply.", person: "A. Sato", initials: "AS", role: "Support reviewer · Tokyo", steps: ["Classify the request", "Look up the records", "Run six checks", "Route the draft for review"] },
] as const;
/** What each chapter's demo runs on, mid-sentence: the invoice matcher uses real invoices with names and dates changed. */
const INVOICE_DATA = MARKETPLACE_COPY.listing.run.dataNote;
const DATA = [INVOICE_DATA[0].toLowerCase() + INVOICE_DATA.slice(1), "synthetic data", "synthetic data", "synthetic data"] as const;

type RunState = "ready" | "running" | "review" | "verified";
/** The reviewer's reply types out at this pace, then a cursor presses Submit. */
const TYPE_MS = 24;
const CURSOR_PRESS_MS = 700;
const SUBMIT_MS = 1000;
/** With reduced motion the whole reply shows at once and submits after this pause. */
const STILL_SUBMIT_MS = 900;

const PORTRAITS = ["invoice", "leads", "pack", "support"] as const;
const OUTPUT_NOTES = [
  `${countWord(SAMPLE_RUN.document_checks.length)} document checks and a three-way match per invoice, each exception diagnosed with its arithmetic, and a recommendation: approve, review or hold.`,
  "Fit scores with a dated source for each, intent kept separate, and excluded accounts listed with a reason.",
  "Every document checked for validity and consistency, each check with its reason, and bank callbacks left to your team.",
  "Drafts in the customer’s language, every fact cited, six checks attached and routed ready, review or blocked.",
] as const;

function WorkflowFromUrl({ onSelect }: { onSelect: (index: number) => void }) {
  const searchParams = useSearchParams();
  const team = searchParams?.get("workflow");
  useEffect(() => {
    const index = WORKFLOWS.findIndex((workflow) => workflow.team.toLowerCase() === team);
    if (index >= 0) onSelect(index);
  }, [team, onSelect]);
  return null;
}


/** One record in a workflow's table. `decided` is the state once the reviewer approves (a "Review" row becomes "Approved" by default);
 *  `reason` explains a row the reviewer needs to look at, or one the agent left out. */
type RecordRow = Readonly<{ name: string; value: string; state: string; decided?: string; reason?: string }>;

const DECIDED: Record<Recommendation, string> = { approve: "Approved", review: "Approved", hold: "On hold" };
/** Finance rows name invoices by number; each opens its redacted source photo. */
const INVOICE_RECORDS = new Map(SAMPLE_BATCH.map((record) => [record.invoice.number, record]));
const RECOMMENDATION_ORDER: Record<Recommendation, number> = { approve: 0, review: 1, hold: 2 };
/** The invoice matcher's real batch, clean invoices first and exceptions after, in recommendation order. */
const INVOICE_ROWS: readonly RecordRow[] = [...SAMPLE_BATCH].sort((a, b) => RECOMMENDATION_ORDER[a.recommendation] - RECOMMENDATION_ORDER[b.recommendation]).map((record) => {
  const diffs = lineDiffs(record).length;
  return { name: record.invoice.number, value: yen(record.invoice.amount), state: MARKETPLACE_COPY.listing.run.recommendation[record.recommendation], decided: DECIDED[record.recommendation], reason: diffs ? `${countWord(diffs)} PO ${diffs === 1 ? "line differs" : "lines differ"} from the receipt` : undefined };
});

const WORKFLOW_RECORDS: readonly { heading: string; value: string; rows: readonly RecordRow[] }[] = [
  { heading: "Invoice", value: "Amount", rows: INVOICE_ROWS },
  { heading: "Account", value: "Fit", rows: [
    { name: "Aster Labs", value: "92", state: "Ready", decided: "Sent to owner" },
    { name: "Meridian", value: "88", state: "Review", reason: "Enterprise tier, about 1,400 employees" },
    { name: "Kanso Studio", value: "—", state: "Excluded", reason: "Existing customer with an owner. Routed to them, not a new lead." },
  ] },
  { heading: "Supplier", value: "Valid docs", rows: [
    { name: "Aster Supply", value: "4 / 4", state: "Ready", decided: "Onboarded" },
    { name: "Meridian", value: "3 / 4", state: "Review", decided: "Request sent", reason: "Tax certificate missing. Request drafted." },
    { name: "Kanso Studio", value: "4 / 4", state: "Blocked", decided: "On hold", reason: "Bank account name differs from the legal entity" },
  ] },
  { heading: "Conversation", value: "Language", rows: [
    { name: "Delivery update", value: "日本語", state: "Ready", decided: "Sent" },
    { name: "Account access", value: "English", state: "Ready", decided: "Sent" },
    { name: "Billing exception", value: "日本語", state: "Review", decided: "Sent", reason: "Charged ¥12,800 twice. Refund needs approval." },
  ] },
];

/** One workflow chapter at a time: the team selector switches which chapter is shown (the others carry `hidden`),
 *  and switching resets that chapter's demo. `?workflow=<team>` selects on load. */
export function WorkExplorer() {
  const [selected, setSelected] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [resets, setResets] = useState([0, 0, 0, 0]);
  const chapters = useRef<HTMLDivElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);
  const motion = useMotionAllowed();
  const choose = useCallback((index: number) => {
    setSelected(index);
    setResets((values) => values.map((value, i) => i === index ? value + 1 : value));
  }, []);
  // A link to `?workflow=<team>` lands on the chapters column. The column is always rendered (unlike the chapter React is
  // about to show), so it is the scroll target.
  const selectFromUrl = useCallback((index: number) => {
    choose(index);
    chapters.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [choose]);
  // A tap only scrolls when the visitor has read past the top of the chapter, and then glides back to it: the page never
  // jumps under their thumb, and a tap with the chapter's opening already in view leaves the page where it is.
  const selectTeam = useCallback((index: number) => {
    choose(index);
    const column = chapters.current?.getBoundingClientRect().top;
    const stuck = sidebar.current?.getBoundingClientRect().bottom;
    if (column === undefined || stuck === undefined || column >= stuck - 1) return;
    chapters.current?.scrollIntoView({ block: "start", behavior: motion ? "smooth" : "instant" });
  }, [choose, motion]);
  return (
    <SectionCell id="work-explorer" labelledBy="explorer-title" className="explorer-section">
      <Suspense fallback={null}><WorkflowFromUrl onSelect={selectFromUrl} /></Suspense>
      <div className="section-opener"><div><p className="section-eyebrow"><span aria-hidden="true" />Your workforce, in action</p><h2 id="explorer-title">Less busywork.<br /><span>More business.</span></h2></div><p>Give work to agents that know how to do it, and bring in people when it needs a human touch.</p></div>
      <div className="workflow-browser">
        <aside className="workflow-sidebar" ref={sidebar}>
          <span className="micro-label">Explore by team</span>
          <div className="workflow-selector" role="group" aria-label="Choose a team workflow" data-keyboard={keyboard} style={{ "--tab-index": selected } as CSSProperties} onKeyDown={() => setKeyboard(true)} onPointerDown={() => setKeyboard(false)}>
            <span className="workflow-selection" aria-hidden="true" />
            {WORKFLOWS.map((workflow, i) => <button type="button" key={workflow.team} aria-label={`0${i + 1} ${workflow.team}`} aria-pressed={selected === i} aria-controls={"workflow-" + workflow.team.toLowerCase()} data-component={"workflowTeam" + workflow.team} onClick={() => selectTeam(i)}><span className="workflow-tab-index">0{i + 1}</span>{workflow.team}<Icon /></button>)}
          </div>
          <a className="text-link" href="#hire">Find your next agent<Icon /></a>
          <div className="workflow-legend"><span data-accent="machine"><i className="bg-machine" />AI does the work</span><span data-accent="human"><i className="bg-human" />You make the call</span></div>
        </aside>
        <div className="workflow-chapters" ref={chapters}>
          {WORKFLOWS.map((flow, i) => <section key={flow.team} id={"workflow-" + flow.team.toLowerCase()} className="workflow-chapter" data-active={selected === i} hidden={selected !== i} aria-labelledby={"workflow-title-" + i}>
            <div className="workflow-description"><span className="micro-label">{flow.team} / Example workflow</span><h3 id={"workflow-title-" + i}>{flow.title}</h3><p>{flow.body}</p></div>
            <WorkflowPreview key={i + "-" + resets[i]} index={i} />
          </section>)}
        </div>
      </div>
    </SectionCell>
  );
}

function WorkflowPreview({ index }: { index: number }) {
  const [run, setRun] = useState<RunState>("ready");
  const flow = WORKFLOWS[index];
  const records = WORKFLOW_RECORDS[index];
  const motion = useMotionAllowed();
  const [typed, setTyped] = useState(0);
  const [pressing, setPressing] = useState(false);
  useEffect(() => {
    if (run !== "running") return;
    const timeout = setTimeout(() => setRun("review"), 1100);
    return () => clearTimeout(timeout);
  }, [run]);
  // The visitor watches; the named reviewer types their decision and submits it.
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
  const shown = run === "verified" || (run === "review" && !motion) ? flow.reply : run === "review" ? flow.reply.slice(0, typed) : "";
  const typing = run === "review" && motion && typed < flow.reply.length;
  const typedOut = run === "verified" || (run === "review" && shown.length === flow.reply.length);
  const placeholder = `${flow.person} replies here once the agent flags a decision.`;
  // Every footer line is laid out (only the current one visibly), so the footer keeps the height of the longest and never jumps.
  const status: Record<RunState, string> = { ready: `Try a complete run with ${DATA[index]}.`, running: `Agent working on ${DATA[index]}…`, review: `Agent complete. ${flow.person} is reviewing.`, verified: "Verified · Human approved · Ready to inspect" };
  return (
        <div className="workflow-canvas task-preview">
          <div className="workflow-canvas-toolbar"><span><Icon name="file" />{flow.task}</span><span className="micro-label">Sandbox preview</span></div>
          <div className="task-input-file"><Icon name="file" /><span>{flow.source}</span><span>{flow.sourceInfo}</span></div>
          <div className="task-preview-content">
            <div className={cn("task-output", run === "running" && "task-output-running")}>
              <div className="task-specialist"><AgentPortrait kind={PORTRAITS[index]} /><div><strong>{flow.agent}</strong><span>Versioned specialist</span></div><Badge status={run === "review" ? "waiting-for-human" : run === "verified" ? "verified" : "running"}>{run === "ready" ? "Ready" : run === "review" ? "Needs review" : undefined}</Badge></div>
              <div className="task-output-document"><span className="scene-kicker">Expected output</span><h4>{flow.output}</h4><p>{OUTPUT_NOTES[index]}</p><table className="workflow-record-table"><caption className="sr-only">{index === 0 ? `Records for this workflow: ${DATA[0]}` : "Synthetic records for this workflow"}</caption><thead><tr><th scope="col">{records.heading}</th><th scope="col">{records.value}</th><th scope="col">Status</th></tr></thead><tbody>{records.rows.map(({ name, value, state, decided, reason }) => { const invoice = INVOICE_RECORDS.get(name); return <tr key={name}><td>{invoice ? <InvoicePhotoPreview record={invoice} dataComponent="financeInvoicePhoto">{name}</InvoicePhotoPreview> : name}{reason ? <span className="workflow-record-reason">{reason}</span> : null}</td><td>{value}</td><td><span className="workflow-record-state" data-review={(state === "Review" || state === "Blocked" || state === "Hold") && run !== "verified"} data-excluded={state === "Excluded" || undefined}>{run === "verified" ? decided ?? (state === "Review" ? "Approved" : state) : state}</span></td></tr>; })}</tbody></table><dl><div><dt>Input</dt><dd>{flow.sourceInfo}</dd></div><div><dt>Human approval</dt><dd>{run === "verified" ? "Recorded" : "Required"}</dd></div><div><dt>Evidence</dt><dd>{run === "verified" ? "Ready to inspect" : "Collected with the work"}</dd></div></dl></div>
              <details className="task-activity"><summary>Run activity<span>{finished ? "4 actions completed" : "4 planned actions"}<Icon name="plus" /></span></summary><ol>{flow.steps.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}{finished ? <Icon name="check" /> : null}</li>)}</ol></details>
            </div>
            <div className={cn("workflow-review task-reviewer", run === "review" && "review-active")}>
              <span className="scene-kicker">Assigned reviewer</span><div className="review-title">{flow.initials === "MT" ? <AgentPortrait kind="human" /> : <span className="review-avatar" data-accent="human">{flow.initials}</span>}<div><p>{flow.person}<small>{flow.role}</small></p></div></div>
              <div className="task-review-context"><span className="scene-kicker">Flagged by the agent</span><p className="review-reason">{flow.decision}</p></div>
              <div className="review-entry" data-component={"workflowDecision" + flow.team} data-state={run}>
                <span className="scene-kicker">{flow.person}’s decision</span>
                {/* A picture of the reviewer's input, not a form: the visitor watches, and screen readers hear the submitted decision once. */}
                <div className="review-entry-box" aria-hidden="true"><span className="review-entry-ghost">{flow.reply}</span><span className="review-entry-ghost">{placeholder}</span><span className="review-entry-text">{shown || <span className="review-entry-placeholder">{placeholder}</span>}{typing ? <span className="review-caret" /> : null}</span></div>
                <div className="review-entry-actions" aria-hidden="true"><span className="review-submit" data-enabled={typedOut || undefined} data-pressed={pressing || undefined}>{run === "verified" ? "Submitted" : "Submit decision"}<Icon name="check" /></span>{run === "review" && motion && typedOut ? <svg className="review-cursor" viewBox="0 0 24 28"><path d="M3 2v21l6-5 4 8 4-2-4-8 8-1Z" /></svg> : null}</div>
                <p className="sr-only" aria-live="polite">{run === "verified" ? `${flow.person} submitted: ${flow.reply}` : ""}</p>
              </div>
              <div className="task-review-state"><Icon name={run === "verified" ? "check" : "shield"} /><span>{run === "verified" ? `Submitted by ${flow.person} · Decision recorded` : "Scoped access · Approval required"}</span></div>
              <p className="task-review-note">{flow.roles}</p>
            </div>
          </div>
          <div className="workflow-result" aria-live="polite"><div><Icon name="shield" /><div><p>{run === "verified" ? flow.output : "Evidence follows the work."}</p><span className="workflow-result-status"><span>{status[run]}</span>{(Object.keys(status) as RunState[]).filter((state) => state !== run).map((state) => <span key={state} aria-hidden="true">{status[state]}</span>)}</span></div></div><button type="button" className="demo-run-button" disabled={run === "running" || run === "review"} onClick={startOrReset}>{run === "running" ? "Running…" : run === "review" ? `Awaiting ${flow.person}` : run === "verified" ? "Reset demo" : "Run demo"}<Icon name={run === "verified" ? "arrow" : "play"} /></button></div>
          <p className="canvas-caption">Interactive demo · {DATA[index][0].toUpperCase() + DATA[index].slice(1)} · No real actions or charges</p>
        </div>
  );
}
