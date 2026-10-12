"use client";

import { useScenePlayback } from "../motion/useScenePlayback";
import { Mark } from "@/design-system/logo/Mark";
import { Badge } from "@/design-system/components/Badge";
import { Icon } from "../Icon";
import { AgentPortrait } from "./AgentPortrait";
import { HeroLedger } from "./HeroLedger";

const DURATIONS = [3800, 3800, 3800] as const;

export function HeroProduct() {
  const playback = useScenePlayback(DURATIONS);
  const { ref: region, phase: displayedPhase, reduced, paused } = playback;
  return (
    <div ref={region} className="hero-product hero-live-product" data-phase={displayedPhase} data-playing={playback.playing}>
      <div className="workspace-bar"><div><Mark className="h-3" title="" /><span>Sumnora workspace</span><span className="workspace-divider">/</span><span className="text-grey-500">Overview</span></div><span className="workspace-live"><span /> Workforce active</span></div>
      <figure className="hero-live-scene" aria-label="Animated workforce demo">
        <HeroLedger phase={displayedPhase} />
        <div className="hero-run-inspector">
          <div className="inspector-title"><AgentPortrait kind="invoice" /><div><strong>Invoice matcher</strong><span>Run NM-2291 / Sandbox</span></div><Badge status={displayedPhase === 0 ? "running" : displayedPhase === 1 ? "waiting-for-human" : "verified"} /></div>
          <div className="inspector-body" key={displayedPhase}>
            {displayedPhase === 0 ? <><span className="scene-kicker">Agent working</span><p className="inspector-headline">Matching the details.</p><div className="inspector-file"><Icon name="file" /><span>supplier_invoices.csv</span><span className="matching-indicator" /></div><div className="inspector-field"><span>Purchase orders</span><strong>Matched<Icon name="check" /></strong></div><div className="inspector-field"><span>Consumption tax</span><strong>Checking<span className="inspector-scanning" /></strong></div></> : displayedPhase === 1 ? <><span className="scene-kicker">Human judgment</span><p className="inspector-headline">One detail. Your call.</p><div className="inspector-difference"><span>Tax exception</span><strong>¥1,200</strong></div><div className="inspector-reviewer"><AgentPortrait kind="human" /><span>M. Tanaka<small>Qualified reviewer · Tokyo</small></span><span className="inspector-demo-approval">Approve<Icon name="check" /><svg className="inspector-cursor" viewBox="0 0 24 28" aria-hidden="true"><path d="M3 2v21l6-5 4 8 4-2-4-8 8-1Z" /></svg></span></div></> : <><span className="scene-kicker">Evidence filed</span><p className="inspector-headline">Every decision, preserved.</p><div className="inspector-evidence"><Icon name="shield" /><div><strong>reconciliation_report.csv</strong><span>Source matched · Approval attached</span></div><Icon name="check" /></div><div className="inspector-field"><span>Human approval</span><strong>Recorded<Icon name="check" /></strong></div><div className="inspector-field"><span>Verification</span><strong>Passed<Icon name="check" /></strong></div></>}
          </div>
        </div>
      </figure>
      <div className="hero-demo-controls"><div role="group" aria-label="Preview the work sequence">{["Agent work", "Human review", "Evidence"].map((label, index) => <button key={label} type="button" aria-label={`${String(index + 1).padStart(2, "0")} ${label}`} aria-pressed={displayedPhase === index} onClick={() => playback.select(index)}>{String(index + 1).padStart(2, "0")}<span>{label}</span></button>)}</div>{!reduced ? <button type="button" className="hero-demo-toggle" onClick={playback.toggle}>{paused ? "Play demo" : "Pause demo"}</button> : <span className="hero-demo-static">Work, from input to proof.</span>}</div>
    </div>
  );
}
