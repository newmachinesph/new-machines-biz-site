"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { SectionCell } from "../Frame";
import { Icon } from "../Icon";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { MARKETPLACE_COPY } from "@/marketplace/copy";
import { countWord, lineDiffs, yen, SAMPLE_BATCH, SAMPLE_RUN, type Recommendation } from "@/marketplace/invoiceMatcher";
import { AgentPortrait } from "../mockups/AgentPortrait";
import { InvoicePhotoPreview } from "../mockups/InvoicePhotoPreview";

const WORKFLOWS = [
  { team: "Finance", title: "Close the books. Open up your time.", body: "Check each invoice is genuine and agrees with the purchase order and receiving report. The agent recommends; a qualified reviewer approves before anything is paid.", task: "Month-end reconciliation", agent: "Invoice matcher", source: "supplier_invoices.csv", sourceInfo: "24 invoices · October 2026", output: "Invoice match report", review: `Revise ${countWord(lineDiffs(SAMPLE_RUN.record).length).toLowerCase()} PO quantities before approving receipt ${SAMPLE_RUN.record.invoice.number}`, person: "M. Tanaka", initials: "MT", role: "Finance reviewer · Tokyo", steps: ["Verify supplier, bank and PO", "Screen duplicates and tampering", "Match PO, receipt and invoice", "Diagnose exceptions and recommend"] },
  { team: "Sales", title: "More conversations. Less preparation.", body: "Research accounts and score their fit, with evidence for every score. The agent never makes contact: your team reviews the shortlist and owns the next conversation.", task: "Inbound lead qualification", agent: "Lead qualifier", source: "inbound_accounts.csv", sourceInfo: "18 accounts · This week", output: "Qualified account shortlist", review: "Enterprise tier: confirm fit before outreach", person: "S. Lim", initials: "SL", role: "GTM reviewer · Singapore", steps: ["Check CRM and exclusions", "Research company evidence", "Score fit against your rubric", "Prepare shortlist with evidence"] },
  { team: "Operations", title: "Keep the business moving.", body: "Check every supplier’s documents against each other and screen for risk. Bank details and the final call stay with a person.", task: "Vendor onboarding", agent: "Vendor intake agent", source: "vendor_applications.csv", sourceInfo: "12 applications · This week", output: "Reviewed vendor register", review: "Hold a supplier whose bank account name differs from its legal entity", person: "J. Park", initials: "JP", role: "Operations reviewer · Seoul", steps: ["Check documents are present and valid", "Cross-check names, IDs and bank holder", "Screen duplicates and sanctions", "Prepare register and bank callbacks"] },
  { team: "Support", title: "Thoughtful replies. At your pace.", body: "Draft helpful answers in your customer’s language. Keep sensitive cases with a human who can make the call.", task: "Bilingual customer support", agent: "Support reply drafter", source: "support_queue.csv", sourceInfo: "16 conversations · 日本語 / English", output: "Reviewed response drafts", review: "Approve a refund reply for a double charge", person: "A. Sato", initials: "AS", role: "Support reviewer · Tokyo", steps: ["Classify the request", "Look up the records", "Run six checks", "Route the draft for review"] },
] as const;
/** What each chapter's demo runs on, mid-sentence: the invoice matcher uses real invoices with names and dates changed. */
const INVOICE_DATA = MARKETPLACE_COPY.listing.run.dataNote;
const DATA = [INVOICE_DATA[0].toLowerCase() + INVOICE_DATA.slice(1), "synthetic data", "synthetic data", "synthetic data"] as const;

type RunState = "ready" | "running" | "review" | "verified";

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


/** name, value, state, and (optionally) the state once the reviewer approves; a "Review" row becomes "Approved" by default. */
type RecordRow = readonly [name: string, value: string, state: string, decided?: string];

const DECIDED: Record<Recommendation, string> = { approve: "Approved", review: "Approved", hold: "On hold" };
/** Finance rows name invoices by number; each opens its redacted source photo. */
const INVOICE_RECORDS = new Map(SAMPLE_BATCH.map((record) => [record.invoice.number, record]));
const RECOMMENDATION_ORDER: Record<Recommendation, number> = { approve: 0, review: 1, hold: 2 };
/** The invoice matcher's real batch, clean invoices first and exceptions after, in recommendation order. */
const INVOICE_ROWS: readonly RecordRow[] = [...SAMPLE_BATCH].sort((a, b) => RECOMMENDATION_ORDER[a.recommendation] - RECOMMENDATION_ORDER[b.recommendation]).map(({ invoice, recommendation }) => [invoice.number, yen(invoice.amount), MARKETPLACE_COPY.listing.run.recommendation[recommendation], DECIDED[recommendation]]);

const WORKFLOW_RECORDS: readonly { heading: string; value: string; rows: readonly RecordRow[] }[] = [
  { heading: "Invoice", value: "Amount", rows: INVOICE_ROWS },
  { heading: "Account", value: "Fit", rows: [["Aster Labs", "92", "Ready"], ["Meridian", "88", "Review"], ["Kanso Studio", "—", "Excluded"]] },
  { heading: "Supplier", value: "Valid docs", rows: [["Aster Supply", "4 / 4", "Ready"], ["Meridian", "3 / 4", "Review", "Request sent"], ["Kanso Studio", "4 / 4", "Blocked", "On hold"]] },
  { heading: "Conversation", value: "Language", rows: [["Delivery update", "日本語", "Ready"], ["Account access", "English", "Ready"], ["Billing exception", "日本語", "Review"]] },
];

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
      <div className="section-opener"><div><p className="section-eyebrow"><span aria-hidden="true" />Your workforce, in action</p><h2 id="explorer-title">Less busywork.<br /><span>More business.</span></h2></div><p>Give work to agents that know how to do it, and bring in people when it needs a human touch.</p></div>
      <div className="workflow-browser">
        <aside className="workflow-sidebar">
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
  useEffect(() => {
    if (run !== "running") return;
    const timeout = setTimeout(() => setRun("review"), 1100);
    return () => clearTimeout(timeout);
  }, [run]);
  const finished = run === "review" || run === "verified";
  return (
        <div className="workflow-canvas task-preview">
          <div className="workflow-canvas-toolbar"><span><Icon name="file" />{flow.task}</span><span className="micro-label">Sandbox preview</span></div>
          <div className="task-input-file"><Icon name="file" /><span>{flow.source}</span><span>{flow.sourceInfo}</span></div>
          <div className="task-preview-content">
            <div className={cn("task-output", run === "running" && "task-output-running")}>
              <div className="task-specialist"><AgentPortrait kind={PORTRAITS[index]} /><div><strong>{flow.agent}</strong><span>Versioned specialist</span></div><Badge status={run === "review" ? "waiting-for-human" : run === "verified" ? "verified" : "running"}>{run === "ready" ? "Ready" : run === "review" ? "Needs review" : undefined}</Badge></div>
              <div className="task-output-document"><span className="scene-kicker">Expected output</span><h4>{flow.output}</h4><p>{OUTPUT_NOTES[index]}</p><table className="workflow-record-table"><caption className="sr-only">{index === 0 ? `Records for this workflow: ${DATA[0]}` : "Synthetic records for this workflow"}</caption><thead><tr><th scope="col">{records.heading}</th><th scope="col">{records.value}</th><th scope="col">Status</th></tr></thead><tbody>{records.rows.map(([name, value, state, decided]) => { const invoice = INVOICE_RECORDS.get(name); return <tr key={name}><td>{invoice ? <InvoicePhotoPreview record={invoice} dataComponent="financeInvoicePhoto">{name}</InvoicePhotoPreview> : name}</td><td>{value}</td><td><span className="workflow-record-state" data-review={(state === "Review" || state === "Blocked" || state === "Hold") && run !== "verified"} data-excluded={state === "Excluded" || undefined}>{run === "verified" ? decided ?? (state === "Review" ? "Approved" : state) : state}</span></td></tr>; })}</tbody></table><dl><div><dt>Input</dt><dd>{flow.sourceInfo}</dd></div><div><dt>Human approval</dt><dd>{run === "verified" ? "Recorded" : "Required"}</dd></div><div><dt>Evidence</dt><dd>{run === "verified" ? "Ready to inspect" : "Collected with the work"}</dd></div></dl></div>
              <details className="task-activity"><summary>Run activity<span>{finished ? "4 actions completed" : "4 planned actions"}<Icon name="plus" /></span></summary><ol>{flow.steps.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}{finished ? <Icon name="check" /> : null}</li>)}</ol></details>
            </div>
            <div className={cn("workflow-review task-reviewer", run === "review" && "review-active")}>
              <span className="scene-kicker">Assigned reviewer</span><div className="review-title">{flow.initials === "MT" ? <AgentPortrait kind="human" /> : <span className="review-avatar" data-accent="human">{flow.initials}</span>}<div><p>{flow.person}<small>{flow.role}</small></p></div></div>
              <div className="task-review-context"><span className="scene-kicker">The decision</span><p className="review-reason">{flow.review}</p></div>
              {run === "review" ? <button type="button" className="review-approve" onClick={() => setRun("verified")}>Approve demo outcome<Icon name="check" /></button> : <div className="task-review-state"><Icon name={run === "verified" ? "check" : "shield"} /><span>{run === "verified" ? "Approved · Decision recorded" : "Scoped access · Approval required"}</span></div>}
              <p className="task-review-note">Your reviewer makes the call. The decision stays with the work.</p>
            </div>
          </div>
          <div className="workflow-result" aria-live="polite"><div><Icon name="shield" /><div><p>{run === "verified" ? flow.output : "Evidence follows the work."}</p><span>{run === "verified" ? "Verified · Human approved · Ready to inspect" : run === "review" ? "Agent complete. Your reviewer has the final call." : run === "running" ? `Agent working on ${DATA[index]}…` : `Try a complete run with ${DATA[index]}.`}</span></div></div><button type="button" className="demo-run-button" disabled={run === "running" || run === "review"} onClick={() => setRun(run === "verified" ? "ready" : "running")}>{run === "running" ? "Running…" : run === "review" ? "Awaiting review" : run === "verified" ? "Reset demo" : "Run demo"}<Icon name={run === "verified" ? "arrow" : "play"} /></button></div>
          <p className="canvas-caption">Interactive demo · {DATA[index][0].toUpperCase() + DATA[index].slice(1)} · No real actions or charges</p>
        </div>
  );
}
