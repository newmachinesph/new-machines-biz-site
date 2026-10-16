"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { MARKETPLACE_COPY } from "@/marketplace/copy";
import { checksPassed, countWord, lineComparisons, lineDiffs, yen, RECOMMENDATION_FOR, SAMPLE_BATCH, SAMPLE_RUN, type RiskLevel } from "@/marketplace/invoiceMatcher";
import { Icon } from "../Icon";
import { AgentPortrait } from "./AgentPortrait";

const R = MARKETPLACE_COPY.listing.run;
const EXCEPTION = SAMPLE_RUN.exceptions[0];
const EXCEPTION_NOTE = `${countWord(checksPassed(SAMPLE_RUN))} checks passed. The warehouse count matches the receipt, but ${countWord(lineDiffs(SAMPLE_RUN.record).length).toLowerCase()} PO lines still carry the original quantities.`;
const recommendation = (risk: RiskLevel) => `${R.recommendation[RECOMMENDATION_FOR[risk]]} · ${R.risk[risk]}`;
/** Each case is a real supplier document, redacted: the exception is Aster's warehouse receipt, the success Kumo's sales invoice. */
const CASES = {
  exception: { record: SAMPLE_RUN.record, lines: lineDiffs(SAMPLE_RUN.record), risk: SAMPLE_RUN.risk_level, kind: "Phone photo" },
  success: { record: SAMPLE_BATCH[1], lines: lineComparisons(SAMPLE_BATCH[1]), risk: "low", kind: "Photo" },
} as const;

export function SandboxRun({ className }: { className?: string }) {
  const [scenario, setScenario] = useState<"success" | "exception">("exception");
  const exception = scenario === "exception";
  const { record, lines, risk, kind } = CASES[scenario];
  const photo = record.photo!;
  return (
    <div className={cn("sandbox-comparison", className)}>
      <div className="scenario-switch" role="group" aria-label="Choose a sandbox scenario">
        <button type="button" aria-pressed={!exception} onClick={() => setScenario("success")} data-component="sandboxRunSuccessCase">Success case<span>01</span></button>
        <button type="button" aria-pressed={exception} onClick={() => setScenario("exception")} data-component="sandboxRunExceptionCase">Exception case<span>02</span></button>
      </div>
      <div className="comparison-body">
        <div className="invoice-preview invoice-photo">
          <div className="invoice-photo-frame"><Image key={photo.src} src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} sizes="(min-width: 768px) 360px, 90vw" /></div>
          <p className="invoice-file"><Icon name="file" /><span>{record.supplier} · {record.invoice.number}</span><span>{kind} · redacted</span></p>
        </div>
        <div className="comparison-results">
          <div className="comparison-agent"><AgentPortrait kind="invoice" /><div><strong>Invoice matcher</strong><span>Run {SAMPLE_RUN.run_id} · {record.supplier} {record.invoice.number}</span></div></div>
          <div className="comparison-state"><Badge status={exception ? "waiting-for-human" : "verified"}>{exception ? "Needs human" : "Verified"}</Badge><h3>{exception ? "One detail needs a decision." : "The numbers agree."}</h3><p>{exception ? EXCEPTION_NOTE : "PO, warehouse count and invoice agree on every line. The evidence is ready to inspect."}</p><p className="comparison-recommendation">{R.recommends}: <strong>{recommendation(risk)}</strong></p></div>
          <table className="field-comparison"><caption className="sr-only">Quantities on the purchase order, receiving report and invoice</caption><thead><tr><th scope="col">{exception ? "Lines that differ" : "Item"}</th><th scope="col">PO</th><th scope="col">Received</th><th scope="col">Invoice</th></tr></thead><tbody>{lines.map((line) => <tr key={line.item}><th scope="row">{line.item}</th><td data-accent={line.po !== line.invoice ? "human" : undefined}>{line.po}</td><td>{line.received}</td><td>{line.invoice}</td></tr>)}</tbody></table>
          {exception ? <div className="difference-note" data-accent="human"><span>{yen(EXCEPTION.difference)} difference</span><p>{EXCEPTION.likely_causes[0].cause}. {R.suggestedAction}: {EXCEPTION.suggested_action} The agent cannot approve.</p></div> : <div className="match-note"><Icon name="check" /><p>Matching complete: {yen(record.invoice.amount)}.<br /><span>No exceptions found.</span></p></div>}
          <div className="sandbox-result-footer"><Icon name="shield" /><span>{exception ? "No settlement until review" : "Evidence attached to the run"}</span></div>
        </div>
      </div>
      <div className="sandbox-comparison-footer"><span>{R.dataNote}</span><span>Illustrative preview</span></div>
    </div>
  );
}
