import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon";
import { AgentPortrait } from "./AgentPortrait";

export const RAIL_NODES = [
  { title: "Agent executed", meta: "Contract clause check · v1.4", detail: "09:35:02 JST" },
  { title: "Judgment recommended", meta: "Recommendation recorded", detail: "Advisory only" },
  { title: "Policy authorized", meta: "Policy v3 · Human review required", detail: "In scope" },
  { title: "Human approved", meta: "M. Tanaka · Qualified reviewer", detail: "09:36:12 JST" },
  { title: "Verification passed", meta: "Source, scope and approval checked", detail: "3 / 3 checks" },
] as const;
const STATUSES = ["Executed", "Verified", "Accepted", "Settlement eligible"] as const;

/** An inspectable work receipt, rather than a decorative process diagram. */
export function DecisionRail({ className }: { className?: string }) {
  return (
    <div className={cn("work-receipt", className)}>
      <div className="receipt-top"><span className="scene-kicker">Work receipt / NM-4QHM</span><Icon name="shield" /></div>
      <div className="receipt-headline"><div><p>Contract review.</p><p>Accounted for.</p></div><span className="receipt-verification"><Icon name="check" /><span>Verified</span></span></div>
      <div className="receipt-reference"><span>run_01HX4QHM</span><span>11 October 2026 · Tokyo</span></div>
      <dl className="receipt-checks">
        {RAIL_NODES.map((node, i) => <div key={node.title} data-lit="true"><dt><span className="receipt-index">0{i + 1}</span>{node.title}</dt><dd><span>{node.meta}</span><span>{node.detail}</span></dd></div>)}
      </dl>
      <div className="receipt-signature"><AgentPortrait kind="human" /><div><strong>M. Tanaka</strong><span>Human approval preserved in the record</span></div><Icon name="file" /><span>3 evidence files</span></div>
      <div className="receipt-policy"><Badge status="blocked" /><p>Blocked never becomes approved.</p><span>Policy holds the line.</span></div>
      <ul className="receipt-lifecycle" aria-label="Work lifecycle">{STATUSES.map((status, i) => <li key={status}><Icon name="check" />{status}{i < STATUSES.length - 1 ? <span aria-hidden="true">/</span> : null}</li>)}</ul>
    </div>
  );
}
