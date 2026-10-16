"use client";

import { useScenePlayback } from "../motion/useScenePlayback";
import { Mark } from "@/design-system/logo/Mark";
import { Badge } from "@/design-system/components/Badge";
import { PreviewCard } from "@/design-system/components/PreviewCard";
import { MARKETPLACE_COPY } from "@/marketplace/copy";
import { APPEARANCE_CHECKS, checksPassed, yen, SAMPLE_RUN } from "@/marketplace/invoiceMatcher";
import { Icon } from "../Icon";
import { AgentPortrait } from "./AgentPortrait";
import { HeroLedger } from "./HeroLedger";

const DURATIONS = [3800, 3800, 3800] as const;
const CHECKS_PASSED = checksPassed(SAMPLE_RUN);
const CHECKS_SUMMARY = `${CHECKS_PASSED} of ${SAMPLE_RUN.document_checks.length} checks passed: ${SAMPLE_RUN.document_checks.map((c) => c.check).join(", ")}.`;
const EXCEPTION = SAMPLE_RUN.exceptions[0];
const R = MARKETPLACE_COPY.listing.run;

/** Which checks ran on receipt 030679, each with its reason and whether it was verified in a database or read from the document. */
function DocumentChecks() {
  return <><span className="scene-kicker">Document checks · {SAMPLE_RUN.record.supplier} {SAMPLE_RUN.record.invoice.number}</span><ul>{SAMPLE_RUN.document_checks.map((c) => <li key={c.check}><Icon name={c.status === "pass" ? "check" : "shield"} /><div><span className="sr-only">{R.checkStatus[c.status]}: </span><strong>{c.check}</strong><p>{c.reason}</p><span className="document-check-basis">{APPEARANCE_CHECKS.has(c.check) ? R.basis.document : R.basis.database}</span></div></li>)}</ul></>;
}

export function HeroProduct() {
  const playback = useScenePlayback(DURATIONS);
  const { ref: region, phase: displayedPhase, reduced, paused } = playback;
  return (
    <div ref={region} className="hero-product hero-live-product" data-phase={displayedPhase} data-playing={playback.playing}>
      <div className="workspace-bar"><div><Mark className="h-3" title="" /><span>Sumnora workspace</span><span className="workspace-divider">/</span><span className="text-grey-500">Overview</span></div><span className="workspace-live"><span /> Workforce active</span></div>
      <figure className="hero-live-scene" aria-label="Animated workforce demo">
        <HeroLedger phase={displayedPhase} onPreviewOpenChange={playback.hold} />
        <div className="hero-run-inspector">
          <div className="inspector-title"><AgentPortrait kind="invoice" /><div><strong>Invoice matcher</strong><span>Illustrative sample / Sandbox</span></div><Badge status={displayedPhase === 0 ? "running" : displayedPhase === 1 ? "waiting-for-human" : "verified"} /></div>
          <div className="inspector-body" key={displayedPhase}>
            {displayedPhase === 0 ? <><span className="scene-kicker">Agent working</span><p className="inspector-headline">Checking the documents.</p><div className="inspector-file"><Icon name="file" /><span>supplier_invoices.csv</span><span className="matching-indicator" /></div><PreviewCard className="document-checks-card" description={CHECKS_SUMMARY} onOpenChange={playback.hold} trigger={<button type="button" className="inspector-field inspector-checks-trigger" data-component="inspectorDocumentChecks" aria-label={`Document checks: ${CHECKS_PASSED} of ${SAMPLE_RUN.document_checks.length} passed, show which`}><span>Document checks</span><strong>{CHECKS_PASSED} / {SAMPLE_RUN.document_checks.length} passed<Icon name="check" /></strong></button>}><DocumentChecks /></PreviewCard><div className="inspector-field"><span>Three-way match</span><strong>Checking…<span className="inspector-scanning" /></strong></div></> : displayedPhase === 1 ? <><span className="scene-kicker">Human judgment</span><p className="inspector-headline">One detail. Your call.</p><div className="inspector-difference"><div><span>Quantity exception</span><small>{EXCEPTION.likely_causes[0].cause}</small></div><strong>{yen(EXCEPTION.difference)}</strong></div><div className="inspector-field"><span>Recommendation</span><strong>{R.recommendation[SAMPLE_RUN.recommendation]}</strong></div><div className="inspector-reviewer"><AgentPortrait kind="human" /><span>M. Tanaka<small>Qualified reviewer · Tokyo</small></span><span className="inspector-demo-approval">Approve<Icon name="check" /><svg className="inspector-cursor" viewBox="0 0 24 28" aria-hidden="true"><path d="M3 2v21l6-5 4 8 4-2-4-8 8-1Z" /></svg></span></div></> : <><span className="scene-kicker">Evidence filed</span><p className="inspector-headline">Every decision, preserved.</p><div className="inspector-evidence"><Icon name="shield" /><div><strong>match_report_{SAMPLE_RUN.run_id}.json</strong><span>Source matched · Approval attached</span></div><Icon name="check" /></div><div className="inspector-field"><span>Human approval</span><strong>Recorded<Icon name="check" /></strong></div><div className="inspector-field"><span>Audit log</span><strong>{SAMPLE_RUN.audit.data_sources_checked.length} sources checked<Icon name="check" /></strong></div></>}
          </div>
        </div>
      </figure>
      <div className="hero-demo-controls"><div role="group" aria-label="Preview the work sequence">{["Agent work", "Human review", "Evidence"].map((label, index) => <button key={label} type="button" aria-label={`${String(index + 1).padStart(2, "0")} ${label}`} aria-pressed={displayedPhase === index} onClick={() => playback.select(index)}>{String(index + 1).padStart(2, "0")}<span>{label}</span></button>)}</div>{!reduced ? <button type="button" className="hero-demo-toggle" onClick={playback.toggle}>{paused ? "Play demo" : "Pause demo"}</button> : <span className="hero-demo-static">Work, from input to proof.</span>}</div>
    </div>
  );
}
