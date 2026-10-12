"use client";

import { useState } from "react";
import { Badge } from "@/design-system/components/Badge";
import { Button } from "@/design-system/components/Button";
import { Icon } from "../Icon";
import { AgentPortrait } from "./AgentPortrait";
import { DEMO_LOG } from "./data";

export const LOG_MS = 3000;

export function ReviewerTask() {
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  return (
    <div className="review-workspace">
      <div className="review-workspace-header"><div><span className="scene-kicker">Assigned to you</span><h3>Review 3 exceptions</h3></div><span className="review-deadline">Tokyo · JST · due 12:00</span></div>
      <div className="review-assignee"><AgentPortrait kind="human" /><div><strong>M. Tanaka</strong><span>Finance specialist · 日本語 / English</span></div><Badge status="waiting-for-human">Qualified reviewer</Badge></div>
      <div className="review-brief"><span className="scene-kicker">Exception 1 of 3 / Invoice INV-2291</span><h4>A small difference.<br />An important decision.</h4><p>The supplier’s tax line is ¥1,200 above the purchase order. The agent has paused settlement for your review.</p></div>
      <div className="review-document-reference" data-accent="machine"><Icon name="file" /><span>invoice_2291.pdf</span><span>PO-55120 matched</span><Icon name="check" /></div>
      <table className="review-field-table"><caption className="sr-only">Invoice compared with purchase order</caption><thead><tr><th scope="col">Field</th><th scope="col">Invoice</th><th scope="col">Purchase order</th></tr></thead><tbody><tr><td>Subtotal</td><td>¥1,167,273</td><td>¥1,167,273</td></tr><tr className="review-tax-row"><td>Consumption tax</td><td>¥116,727</td><td>¥115,527</td></tr><tr><td>Total</td><td>¥1,284,000</td><td>¥1,282,800</td></tr></tbody></table>
      <div className="review-decision-area" aria-live="polite">
        {decision ? <div className="review-decision-record"><Icon name={decision === "approved" ? "check" : "shield"} /><div><strong>Review {decision}</strong><span>Demo decision recorded with the evidence.</span></div><button type="button" onClick={() => setDecision(null)}>Reset review</button></div> : <><span>Use your judgment. Leave a record.</span><div><Button size="md" variant="secondary" onClick={() => setDecision("rejected")}>Reject review</Button><Button size="md" onClick={() => setDecision("approved")}>Approve review<Icon name="check" /></Button></div></>}
      </div>
      <div className="review-proof-line"><Icon name="shield" /><span>Every approval is logged as evidence.</span></div>
    </div>
  );
}

const SCOPES = [
  { title: "Read one sheet", meta: "売上_2026Q3 · read-only" },
  { title: "Comment on run", meta: "run_01HX4QHM" },
  { title: "Approve or reject", meta: "up to ¥2,000,000" },
];

export function ScopedPermissions() {
  return (
    <div className="permission-details">
      <div className="review-side-header"><h3>Scoped permissions</h3><span>Expires in 4h</span></div>
      <p className="permission-intro">Only what this review needs.</p>
      <ul>{SCOPES.map((scope) => <li key={scope.title}><Icon name="check" /><div><strong>{scope.title}</strong><span>{scope.meta}</span></div><span className="scope-granted">Granted</span></li>)}</ul>
    </div>
  );
}

/** Static, legible audit records; no rotating or deliberately blurred rows. */
export function ApprovalLog() {
  return (
    <div className="approval-history">
      <div className="review-side-header"><h3>Approval log</h3><Icon name="shield" /></div>
      <ol>{DEMO_LOG.slice(0, 5).map((row) => <li key={row.id}><span className="history-dot" aria-hidden="true" /><div><p><strong>{row.who}</strong> {row.what}</p><span>{row.at}</span></div></li>)}</ol>
      <p className="history-footer">Append-only. Kept with the work.</p>
    </div>
  );
}
