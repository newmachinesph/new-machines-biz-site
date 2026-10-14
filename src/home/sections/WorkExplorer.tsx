"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { SectionCell } from "../Frame";
import { Icon } from "../Icon";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { AgentPortrait } from "../mockups/AgentPortrait";

const WORKFLOWS = [
  { team: "Finance", title: "Close the books. Open up your time.", body: "Match invoices, find exceptions, and get a qualified reviewer’s sign-off before anything settles.", task: "Month-end reconciliation", agent: "Invoice matcher", source: "supplier_invoices.csv", sourceInfo: "24 invoices · October 2026", output: "Reconciliation report", review: "Tax line differs from purchase order", person: "M. Tanaka", initials: "MT", role: "Finance reviewer · Tokyo", steps: ["Read supplier invoices", "Match purchase orders", "Flag one tax exception", "Prepare evidence report"] },
  { team: "Sales", title: "More conversations. Less preparation.", body: "Research accounts and score their fit, with evidence for every score. The agent never makes contact: your team reviews the shortlist and owns the next conversation.", task: "Inbound lead qualification", agent: "Lead qualifier", source: "inbound_accounts.csv", sourceInfo: "18 accounts · This week", output: "Qualified account shortlist", review: "Enterprise tier: confirm fit before outreach", person: "S. Lim", initials: "SL", role: "GTM reviewer · Singapore", steps: ["Check CRM and exclusions", "Research company evidence", "Score fit against your rubric", "Prepare shortlist with evidence"] },
  { team: "Operations", title: "Keep the business moving.", body: "Turn a messy intake queue into organised work. Route the exceptions to someone who knows the answer.", task: "Vendor onboarding", agent: "Vendor intake agent", source: "vendor_applications.csv", sourceInfo: "12 applications · This week", output: "Reviewed vendor register", review: "Confirm an overseas supplier’s eligibility", person: "J. Park", initials: "JP", role: "Operations reviewer · Seoul", steps: ["Collect vendor documents", "Check required fields", "Route eligibility exception", "Prepare vendor register"] },
  { team: "Support", title: "Thoughtful replies. At your pace.", body: "Draft helpful answers in your customer’s language. Keep sensitive cases with a human who can make the call.", task: "Bilingual customer support", agent: "Support reply drafter", source: "support_queue.csv", sourceInfo: "16 conversations · 日本語 / English", output: "Reviewed response drafts", review: "Approve a refund reply for a double charge", person: "A. Sato", initials: "AS", role: "Support reviewer · Tokyo", steps: ["Classify the request", "Look up the records", "Run six checks", "Route the draft for review"] },
] as const;
type RunState = "ready" | "running" | "review" | "verified";

const PORTRAITS = ["invoice", "leads", "pack", "support"] as const;
const OUTPUT_NOTES = [
  "Invoice and purchase-order matches, with exceptions separated for review.",
  "Fit scores with a dated source for each, intent kept separate, and excluded accounts listed with a reason.",
  "Vendor documents and required fields, with eligibility exceptions identified.",
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


const WORKFLOW_RECORDS = [
  { heading: "Invoice", value: "Amount", rows: [["INV-2289", "¥480,000", "Matched"], ["INV-2290", "¥96,000", "Matched"], ["INV-2291", "¥1,284,000", "Review"]] },
  { heading: "Account", value: "Fit", rows: [["Aster Labs", "92", "Ready"], ["Meridian", "88", "Review"], ["Kanso Studio", "—", "Excluded"]] },
  { heading: "Supplier", value: "Documents", rows: [["Aster Supply", "4 / 4", "Ready"], ["Meridian", "4 / 4", "Ready"], ["Kanso Studio", "3 / 4", "Review"]] },
  { heading: "Conversation", value: "Language", rows: [["Delivery update", "日本語", "Ready"], ["Account access", "English", "Ready"], ["Billing exception", "日本語", "Review"]] },
] as const;

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
              <div className="task-output-document"><span className="scene-kicker">Expected output</span><h4>{flow.output}</h4><p>{OUTPUT_NOTES[index]}</p><table className="workflow-record-table"><caption className="sr-only">Synthetic records for this workflow</caption><thead><tr><th scope="col">{records.heading}</th><th scope="col">{records.value}</th><th scope="col">Status</th></tr></thead><tbody>{records.rows.map(([name, value, state]) => <tr key={name}><td>{name}</td><td>{value}</td><td><span className="workflow-record-state" data-review={state === "Review" && run !== "verified"} data-excluded={state === "Excluded" || undefined}>{state === "Review" && run === "verified" ? "Approved" : state}</span></td></tr>)}</tbody></table><dl><div><dt>Input</dt><dd>{flow.sourceInfo}</dd></div><div><dt>Human approval</dt><dd>{run === "verified" ? "Recorded" : "Required"}</dd></div><div><dt>Evidence</dt><dd>{run === "verified" ? "Ready to inspect" : "Collected with the work"}</dd></div></dl></div>
              <details className="task-activity"><summary>Run activity<span>{finished ? "4 actions completed" : "4 planned actions"}<Icon name="plus" /></span></summary><ol>{flow.steps.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}{finished ? <Icon name="check" /> : null}</li>)}</ol></details>
            </div>
            <div className={cn("workflow-review task-reviewer", run === "review" && "review-active")}>
              <span className="scene-kicker">Assigned reviewer</span><div className="review-title">{flow.initials === "MT" ? <AgentPortrait kind="human" /> : <span className="review-avatar" data-accent="human">{flow.initials}</span>}<div><p>{flow.person}<small>{flow.role}</small></p></div></div>
              <div className="task-review-context"><span className="scene-kicker">The decision</span><p className="review-reason">{flow.review}</p></div>
              {run === "review" ? <button type="button" className="review-approve" onClick={() => setRun("verified")}>Approve demo outcome<Icon name="check" /></button> : <div className="task-review-state"><Icon name={run === "verified" ? "check" : "shield"} /><span>{run === "verified" ? "Approved · Decision recorded" : "Scoped access · Approval required"}</span></div>}
              <p className="task-review-note">Your reviewer makes the call. The decision stays with the work.</p>
            </div>
          </div>
          <div className="workflow-result" aria-live="polite"><div><Icon name="shield" /><div><p>{run === "verified" ? flow.output : "Evidence follows the work."}</p><span>{run === "verified" ? "Verified · Human approved · Ready to inspect" : run === "review" ? "Agent complete. Your reviewer has the final call." : run === "running" ? "Agent working on synthetic data…" : "Try a complete run with synthetic data."}</span></div></div><button type="button" className="demo-run-button" disabled={run === "running" || run === "review"} onClick={() => setRun(run === "verified" ? "ready" : "running")}>{run === "running" ? "Running…" : run === "review" ? "Awaiting review" : run === "verified" ? "Reset demo" : "Run demo"}<Icon name={run === "verified" ? "arrow" : "play"} /></button></div>
          <p className="canvas-caption">Interactive demo · Synthetic data · No real actions or charges</p>
        </div>
  );
}
