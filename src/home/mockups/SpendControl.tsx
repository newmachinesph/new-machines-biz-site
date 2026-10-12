"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { useMotionAllowed } from "@/design-system/motion/useMotionAllowed";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon";
import { DEMO_AGENTS } from "./data";
import { AgentPortrait } from "./AgentPortrait";
import { Check, Toggle } from "./parts";

const RULES = ["Pause at cap", "Require human over ¥50,000", "Verify before charge"];
const DAILY_SPEND = [9200, 13400, 10800, 15400, 12100, 17100, 14600, 9600, 13700, 15800, 12100, 16600, 8300, 11540];
const PORTRAITS = ["invoice", "human", "leads", "receipt", "support"] as const;
const TOTAL_SPEND = DAILY_SPEND.reduce((total, day) => total + day, 0);
const AGENT_SPEND = DEMO_AGENTS.reduce((total, agent) => total + Number(agent.cost.replace(/[^\d]/g, "")), 0);
const AGENT_RUNS = DEMO_AGENTS.reduce((total, agent) => total + agent.runs, 0);
const yen = (amount: number) => `¥${amount.toLocaleString("en-US")}`;

export function SpendControl({ className }: { className?: string }) {
  const chart = useRef<HTMLDivElement>(null);
  const chartVisible = useInView(chart, { once: true, amount: .4 });
  const motionAllowed = useMotionAllowed();
  const [capPreview, setCapPreview] = useState(false);
  return (
    <div ref={chart} className={cn("spend-workspace", className)} data-chart-entered={chartVisible && motionAllowed}>
      <div className="spend-workspace-header"><h3>Workforce spend</h3><span>October 2026</span></div>
      <div className="spend-overview">
        <div className="spend-amount"><span className="scene-kicker">Total used</span><strong>{yen(TOTAL_SPEND)}</strong><span>Across your agents and reviewers</span></div>
        <div className="spend-cap"><span className="scene-kicker">Spending cap</span><strong>¥300,000</strong><div className="budget-meter"><span /></div><span>60% used · Pauses at your cap</span></div>
      </div>
      <div className="spend-chart-block">
        <div className="chart-heading"><span>Daily spend</span><span>Illustrative 14-day period</span></div>
        <svg className="daily-spend-chart" viewBox="0 0 460 155" role="img" aria-label="Synthetic daily spend over fourteen sample days">
          {[20, 65, 110].map((y, i) => <g key={y}><line x1="38" x2="452" y1={y} y2={y} className="chart-grid-line" /><text x="0" y={y + 4} className="chart-axis-label">{["¥20k", "¥10k", "¥0"][i]}</text></g>)}
          {DAILY_SPEND.map((value, i) => <rect key={i} x={48 + i * 28} y={110 - value / 20000 * 90} width="14" height={value / 20000 * 90} rx="2" style={{ animationDelay: i * 35 + "ms" }} className={i === DAILY_SPEND.length - 1 ? "chart-bar-current" : "chart-bar"} />)}
          <text x="46" y="142" className="chart-axis-label">Day 01</text><text x="206" y="142" className="chart-axis-label">Day 07</text><text x="382" y="142" className="chart-axis-label">Day 14</text>
        </svg>
      </div>
      <div className="spend-detail-grid">
        <div className="spend-agent-breakdown"><h4>By specialist</h4><table><caption className="sr-only">Example specialist spending</caption><thead><tr><th scope="col">Specialist</th><th scope="col">Runs</th><th scope="col">Cost</th></tr></thead><tbody>{DEMO_AGENTS.map((agent, i) => <tr key={agent.name}><td><div><AgentPortrait kind={PORTRAITS[i]} /><span>{agent.name}</span>{agent.verified ? <span className="sr-only">Verified</span> : <Badge status="waiting-for-human">Pending</Badge>}</div></td><td>{agent.runs}</td><td>{agent.cost}</td></tr>)}</tbody></table><dl className="spend-cost-summary"><div><dt>Agent work</dt><dd>{yen(AGENT_SPEND)}</dd></div><div><dt>Expert reviews</dt><dd>{yen(TOTAL_SPEND - AGENT_SPEND)}</dd></div></dl></div>
        <aside className="spend-rules"><h4>Your rules</h4><ul>{RULES.map((rule) => <li key={rule}><Toggle label={rule} on /></li>)}</ul><div className="settlement-rule"><Icon name="shield" /><div><strong>{capPreview ? "Run paused" : "Eligible"}</strong><span>{capPreview ? "Your cap holds the line" : "Verified before charge"}</span></div></div><button className="cap-preview-button" type="button" aria-pressed={capPreview} onClick={() => setCapPreview((value) => !value)}>{capPreview ? "Reset cap preview" : "Preview cap reached"}<Icon name="arrow" /></button></aside>
      </div>
      {capPreview ? <div className="cap-preview-event" aria-live="polite"><Icon name="shield" /><div><strong>This run would cross your cap.</strong><p>¥180,240 used + ¥129,760 requested = ¥310,000. Your ¥300,000 cap pauses the run before any charge.</p></div></div> : null}
      <div className="spend-workspace-footer"><span>Average agent run <strong>{yen(Math.round(AGENT_SPEND / AGENT_RUNS))}</strong></span><span><Check />Verification required</span></div>
    </div>
  );
}
