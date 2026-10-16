import { checksPassed, countWord, lineDiffs, yen, SAMPLE_BATCH, SAMPLE_RUN, type ReceivedItem } from "@/marketplace/invoiceMatcher";
import { Icon } from "../Icon";
import { InvoicePhotoPreview } from "./InvoicePhotoPreview";

const EXCEPTION = SAMPLE_RUN.exceptions[0];
const CHECKED = `${countWord(checksPassed(SAMPLE_RUN))} checks passed. Matching three ways.`;
const DIFFERING = `${countWord(lineDiffs(SAMPLE_RUN.record).length)} PO lines differ; the count matches the receipt`;
/** Short labels for the compact item lists; the match report keeps the full names. */
const SHORT: Record<string, string> = { "Bathroom Tissue Virgin Pulp": "Bath tissue", "Interfolded Paper Towel Virgin Pulp": "Paper towel", "Jumbo Roll Tissue Virgin Pulp": "Jumbo roll", "Quarter Folded Table Napkin Virgin Pulp": "Napkin" };
const itemCount = (lines: readonly ReceivedItem[]) => `${lines.length} ${lines.length === 1 ? "item" : "items"}`;
const units = (lines: readonly ReceivedItem[]) => lines.reduce((sum, line) => sum + line.quantity, 0);
const ROWS = SAMPLE_BATCH.map((record) => ({ record, diffs: new Set(lineDiffs(record).map((line) => line.item)) }));
/** The record line's message per phase. All three render stacked so the line keeps the height of its tallest message and the page never shifts between phases. */
const RECORDS = [
  { symbol: "file", title: CHECKED, detail: "Comparing PO, receipt and invoice…", check: "arrow" },
  { symbol: "file", title: `${yen(EXCEPTION.difference)} needs a decision`, detail: DIFFERING, check: "arrow" },
  { symbol: "shield", title: "Verdict: approve as is.", detail: "M. Tanaka (illustrative) · Source values preserved", check: "check" },
] as const;

function Items({ lines, diffs }: { lines: readonly ReceivedItem[]; diffs: ReadonlySet<string> }) {
  return <ul className="ledger-items">{lines.map((line) => <li key={line.item} data-diff={diffs.has(line.item) || undefined}>{SHORT[line.item] ?? line.item} · {line.quantity}</li>)}</ul>;
}

/** Columns follow the procurement flow: ordered, received, billed. The same source documents remain visible as the work moves to review and proof: clean rows collapse, the exception keeps its items. */
export function HeroLedger({ phase, onPreviewOpenChange }: { phase: number; onPreviewOpenChange?: (open: boolean) => void }) {
  return (
    <div className="hero-ledger" data-ledger-phase={phase}>
      <div className="ledger-toolbar"><span><Icon name="file" />Invoice review</span><span>Finance / NM-2291</span></div>
      <div className="ledger-paper">
        <div className="ledger-supplier"><strong>Supplier invoices</strong><span>{SAMPLE_BATCH.length} invoices · Oct 2026</span></div>
        <div className="ledger-heading"><span className="scene-kicker">Illustrative · Bill to Sumnora · JPY</span><p className="ledger-headline">The details<br />make the difference.</p><span className="ledger-source-label"><Icon name="file" />supplier_invoices.csv</span></div>
        <table className="ledger-lines">
          <thead><tr><th scope="col">Supplier</th><th scope="col">PO</th><th scope="col">Received</th><th scope="col">Invoice</th><th scope="col"><span className="sr-only">Review status</span></th></tr></thead>
          <tbody>{ROWS.map(({ record, diffs }) => {
            const exception = diffs.size > 0;
            const { invoice, purchase_order, received } = record;
            return <tr key={invoice.number} className={exception ? "ledger-exception" : "ledger-match"}>
              <th scope="row"><InvoicePhotoPreview record={record} dataComponent="ledgerInvoicePhoto" className="ledger-invoice-trigger" onOpenChange={onPreviewOpenChange}>{record.supplier}<span className="ledger-number">{invoice.number}<Icon name="file" /></span></InvoicePhotoPreview></th>
              <td data-label="PO"><strong>{yen(purchase_order.amount)}</strong>{exception ? <Items lines={purchase_order.items} diffs={diffs} /> : <span className="ledger-items-note">{itemCount(purchase_order.items)}</span>}</td>
              <td data-label="Received"><strong>{units(received.items)} units</strong>{exception ? <Items lines={received.items} diffs={diffs} /> : <span className="ledger-items-note">{itemCount(received.items)}</span>}</td>
              <td data-label="Invoice"><strong>{yen(invoice.amount)}</strong>{exception ? <Items lines={invoice.items} diffs={diffs} /> : <span className="ledger-items-note">all match</span>}</td>
              <td><span className="ledger-line-status"><Icon name={exception && phase < 2 ? "shield" : "check"} /></span></td>
            </tr>;
          })}</tbody>
        </table>
        <p className="ledger-hint">Hover or tap an invoice for its source document</p>
        <div className="ledger-record"><span className="ledger-record-symbol"><Icon name={RECORDS[phase].symbol} /></span><div className="ledger-record-text">{RECORDS.map((record, index) => <div key={record.title} aria-hidden={index !== phase || undefined}><strong>{record.title}</strong><span>{record.detail}</span></div>)}</div><span className="ledger-record-check"><Icon name={RECORDS[phase].check} /></span></div>
      </div>
    </div>
  );
}
