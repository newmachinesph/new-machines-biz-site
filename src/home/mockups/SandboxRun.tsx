import Image from "next/image";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { MARKETPLACE_COPY } from "@/marketplace/copy";
import { checksPassed, countWord, lineDiffs, yen, RECOMMENDATION_FOR, SAMPLE_RUN, type RiskLevel } from "@/marketplace/invoiceMatcher";
import { Icon } from "../Icon";
import { AgentPortrait } from "./AgentPortrait";

const R = MARKETPLACE_COPY.listing.run;
const EXCEPTION = SAMPLE_RUN.exceptions[0];
const EXCEPTION_NOTE = `${countWord(checksPassed(SAMPLE_RUN))} checks passed. The warehouse count matches the receipt, but ${countWord(lineDiffs(SAMPLE_RUN.record).length).toLowerCase()} PO lines still carry the original quantities.`;
const recommendation = (risk: RiskLevel) => `${R.recommendation[RECOMMENDATION_FOR[risk]]} · ${R.risk[risk]}`;
/** One run on a real supplier document, redacted: Aster's warehouse receipt, where two PO lines need a decision.
 *  The amounts are the document's own yen, so the footer says so. */
const RECORD = SAMPLE_RUN.record;
const LINES = lineDiffs(RECORD);
const KIND = "Phone photo";

export function SandboxRun({ className }: { className?: string }) {
  const record = RECORD;
  const photo = record.photo!;
  return (
    <div className={cn("sandbox-comparison", className)}>
      <div className="comparison-body">
        <div className="invoice-preview invoice-photo">
          <div className="invoice-photo-frame"><Image key={photo.src} src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} sizes="(min-width: 768px) 360px, 90vw" /></div>
          <p className="invoice-file"><Icon name="file" /><span>{record.supplier} · {record.invoice.number}</span><span>{KIND} · redacted</span></p>
        </div>
        <div className="comparison-results">
          <div className="comparison-agent"><AgentPortrait kind="invoice" /><div><strong>Invoice matcher</strong><span>Run {SAMPLE_RUN.run_id} · {record.supplier} {record.invoice.number}</span></div></div>
          <div className="comparison-state"><Badge status="waiting-for-human">Needs human</Badge><h3>One detail needs a decision.</h3><p>{EXCEPTION_NOTE}</p><p className="comparison-recommendation">{R.recommends}: <strong>{recommendation(SAMPLE_RUN.risk_level)}</strong></p></div>
          <table className="field-comparison"><caption className="sr-only">Quantities on the purchase order, receiving report and invoice</caption><thead><tr><th scope="col">Lines that differ</th><th scope="col">PO</th><th scope="col">Received</th><th scope="col">Invoice</th></tr></thead><tbody>{LINES.map((line) => <tr key={line.item}><th scope="row">{line.item}</th><td data-accent={line.po !== line.invoice ? "human" : undefined}>{line.po}</td><td>{line.received}</td><td>{line.invoice}</td></tr>)}</tbody></table>
          <div className="difference-note" data-accent="human"><span>{yen(EXCEPTION.difference)} difference</span><p>{EXCEPTION.likely_causes[0].cause}. {R.suggestedAction}: {EXCEPTION.suggested_action} The agent cannot approve.</p></div>
          <div className="sandbox-result-footer"><Icon name="shield" /><span>No settlement until review</span></div>
        </div>
      </div>
      <div className="sandbox-comparison-footer"><span>{R.dataNote}</span><span>Illustrative preview · JPY</span></div>
    </div>
  );
}
