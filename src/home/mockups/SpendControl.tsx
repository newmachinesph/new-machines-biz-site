"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { useMotionAllowed } from "@/design-system/motion/useMotionAllowed";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon";
import { DEMO_PACK_SPEND } from "./data";
import { AgentPortrait } from "./AgentPortrait";
import { Check, Toggle } from "./parts";

const RULES = ["Stop at cap", "Approve every write", "Verify before charge"];
/** Illustrative daily spend in US cents. */
const DAILY_SPEND = [920, 1340, 1080, 1540, 1210, 1710, 1460, 960, 1370, 1580, 1210, 1660, 830, 1154];
const PORTRAITS = ["pack", "receipt", "support", "leads", "brief"] as const;
const CAP = 30000;
const TOTAL_SPEND = DAILY_SPEND.reduce((total, day) => total + day, 0);
const PACK_SPEND = DEMO_PACK_SPEND.reduce((total, pack) => total + pack.cents, 0);
const PACK_RUNS = DEMO_PACK_SPEND.reduce((total, pack) => total + pack.runs, 0);
const usd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function SpendControl({ className }: { className?: string }) {
  const chart = useRef<HTMLDivElement>(null);
  const chartVisible = useInView(chart, { once: true, amount: .4 });
  const motionAllowed = useMotionAllowed();
  const [capPreview, setCapPreview] = useState(false);
  return (
    <div ref={chart} className={cn("spend-workspace", className)} data-chart-entered={chartVisible && motionAllowed}>
      <div className="spend-workspace-header"><h3>Workforce spend</h3><span>October 2026 · Simulated billing</span></div>
      <div className="spend-overview">
        <div className="spend-amount"><span className="scene-kicker">Total used</span><strong>{usd(TOTAL_SPEND)}</strong><span>Across your packs and reviewers</span></div>
        <div className="spend-cap"><span className="scene-kicker">Monthly cap</span><strong>{usd(CAP)}</strong><div className="budget-meter"><span /></div><span>60% used · Runs stop at your cap</span></div>
      </div>
      <div className="spend-chart-block">
        <div className="chart-heading"><span>Daily spend</span><span>Illustrative 14-day period</span></div>
        <svg className="daily-spend-chart" viewBox="0 10 460 140" role="img" aria-label="Synthetic daily spend over fourteen sample days">
          {[20, 65, 110].map((y, i) => <g key={y}><line x1="38" x2="452" y1={y} y2={y} className="chart-grid-line" /><text x="0" y={y + 4} className="chart-axis-label">{["$20", "$10", "$0"][i]}</text></g>)}
          {DAILY_SPEND.map((value, i) => <rect key={i} x={48 + i * 28} y={110 - value / 2000 * 90} width="14" height={value / 2000 * 90} rx="2" style={{ animationDelay: i * 35 + "ms" }} className={i === DAILY_SPEND.length - 1 ? "chart-bar-current" : "chart-bar"} />)}
          <text x="46" y="142" className="chart-axis-label">Day 01</text><text x="206" y="142" className="chart-axis-label">Day 07</text><text x="382" y="142" className="chart-axis-label">Day 14</text>
        </svg>
      </div>
      <div className="spend-detail-grid">
        <div className="spend-agent-breakdown"><h4>By pack</h4><table><caption className="sr-only">Illustrative spending per Workflow Pack</caption><thead><tr><th scope="col">Pack</th><th scope="col">Runs</th><th scope="col">Cost</th></tr></thead><tbody>{DEMO_PACK_SPEND.map((pack, i) => <tr key={pack.name}><td><div><AgentPortrait kind={PORTRAITS[i]} /><span>{pack.name}</span>{pack.verified ? <span className="sr-only">Verified</span> : <Badge status="waiting-for-human">Pending</Badge>}</div></td><td>{pack.runs}</td><td>{usd(pack.cents)}</td></tr>)}</tbody></table><dl className="spend-cost-summary"><div><dt>AI work</dt><dd>{usd(PACK_SPEND)}</dd></div><div><dt>Reviewer time</dt><dd>{usd(TOTAL_SPEND - PACK_SPEND)}</dd></div></dl></div>
        <aside className="spend-rules"><h4>Your rules</h4><ul>{RULES.map((rule) => <li key={rule}><Toggle label={rule} on /></li>)}</ul><div className="settlement-rule"><Icon name="shield" /><div><strong>{capPreview ? "Run stopped" : "Eligible"}</strong><span>{capPreview ? "Your cap holds the line" : "Verified before charge"}</span></div></div><button className="cap-preview-button" type="button" aria-pressed={capPreview} onClick={() => setCapPreview((value) => !value)}>{capPreview ? "Reset cap preview" : "Preview cap reached"}<Icon name="arrow" /></button></aside>
      </div>
      {capPreview ? <div className="cap-preview-event" aria-live="polite"><Icon name="shield" /><div><strong>This run would cross your cap.</strong><p>{usd(TOTAL_SPEND)} used + {usd(CAP - TOTAL_SPEND + 1000)} more = {usd(CAP + 1000)}. The run stops before it passes your {usd(CAP)} cap, and new runs wait for next month or a higher cap.</p></div></div> : null}
      <div className="spend-workspace-footer"><span>Average run <strong>{usd(Math.round(PACK_SPEND / PACK_RUNS))}</strong></span><span><Check />Verification required</span></div>
    </div>
  );
}
