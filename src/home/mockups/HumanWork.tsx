"use client";

import { useState } from "react";
import { Badge } from "@/design-system/components/Badge";
import { Button } from "@/design-system/components/Button";
import { Icon } from "../Icon";
import { AgentPortrait } from "./AgentPortrait";
import { DEMO_LOG } from "./data";
import { countWord, lineDiffs, yen, SAMPLE_RUN } from "@/marketplace/invoiceMatcher";

export const LOG_MS = 3000;

const { record } = SAMPLE_RUN;
const DIFFS = lineDiffs(record);
const EXCEPTION = SAMPLE_RUN.exceptions[0];

export function ReviewerTask() {
  const [decision, setDecision] = useState<"approved" | "sent-back" | null>(null);
  return (
    <div className="review-workspace">
      <div className="review-workspace-header"><div><span className="scene-kicker">Claimed by you</span><h3>Review 3 exceptions</h3></div><span className="review-deadline"><span>Hold 30 min</span> <span>Tokyo · JST</span></span></div>
      <div className="review-assignee"><AgentPortrait kind="human" /><div><strong>M. Tanaka</strong><span>Finance specialist · 日本語 / English</span><span className="review-fiction">Illustrative · fictional reviewer</span></div><Badge status="waiting-for-human">Qualified reviewer</Badge></div>
      <div className="review-brief"><span className="scene-kicker">Exception 1 of 3 / Receipt {record.invoice.number} · JPY</span><h4>A small difference.<br />An important decision.</h4><p>{countWord(DIFFS.length)} PO lines differ by {yen(EXCEPTION.difference)} from {record.supplier}’s receipt. The agent has paused settlement for your review.</p></div>
      <div className="review-document-reference" data-accent="machine"><Icon name="file" /><span>receipt_{record.invoice.number}.jpg</span><span>Receiving record matched</span><Icon name="check" /></div>
      <table className="review-field-table"><caption className="sr-only">Purchase order and receiving record compared with the receipt</caption><thead><tr><th scope="col">Item</th><th scope="col">PO</th><th scope="col">Received</th><th scope="col">Invoice</th></tr></thead><tbody>{DIFFS.map((line) => <tr key={line.item} className="review-exception-row"><td>{line.item}</td><td>{line.po}</td><td>{line.received}</td><td>{line.invoice}</td></tr>)}<tr><td>Amount</td><td>{yen(record.purchase_order.amount)}</td><td>—</td><td>{yen(record.invoice.amount)}</td></tr></tbody></table>
      <div className="review-decision-area" aria-live="polite">
        {decision ? <div className="review-decision-record"><Icon name={decision === "approved" ? "check" : "shield"} /><div><strong>{decision === "approved" ? "Verdict: approve as is" : "Verdict: send back with corrections"}</strong><span>Demo verdict recorded with the evidence.</span></div><button type="button" onClick={() => setDecision(null)}>Reset review</button></div> : <><span>Use your judgment. Leave a record.</span><div><Button size="md" variant="secondary" onClick={() => setDecision("sent-back")}>Send back</Button><Button size="md" onClick={() => setDecision("approved")}>Approve as is<Icon name="check" /></Button></div></>}
      </div>
      <div className="review-proof-line"><Icon name="shield" /><span>Every verdict is logged as evidence.</span></div>
    </div>
  );
}

const SCOPES = [
  { title: "Read one sheet", meta: "売上_2026Q3 · read-only" },
  { title: "Comment on run", meta: "run_01HX4QHM" },
  { title: "Give a verdict", meta: "Approve, send back, reject or escalate" },
];

export function ScopedPermissions() {
  return (
    <div className="permission-details">
      <div className="review-side-header"><h3>Scoped permissions</h3><span>Hold: 30 min</span></div>
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
