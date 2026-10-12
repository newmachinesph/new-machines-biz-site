import { ExampleBrand } from "../ExampleBrand";
import { Icon } from "../Icon";

const LINES = [
  { item: "Operations services", invoice: "¥960,000", order: "¥960,000" },
  { item: "Software", invoice: "¥207,273", order: "¥207,273" },
  { item: "Consumption tax", invoice: "¥116,727", order: "¥115,527" },
];

/** The same source document remains visible as the work moves to review and proof. */
export function HeroLedger({ phase }: { phase: number }) {
  return (
    <div className="hero-ledger" data-ledger-phase={phase}>
      <div className="ledger-toolbar"><span><Icon name="file" />Invoice review</span><span>Finance / NM-2291</span></div>
      <div className="ledger-paper">
        <div className="ledger-supplier"><ExampleBrand name="aster-supply" /><strong>Aster Supply</strong><span>INV-2291</span></div>
        <div className="ledger-heading"><span className="scene-kicker">Bill to Sumnora · JPY</span><p className="ledger-headline">The details<br />make the difference.</p><span className="ledger-source-label"><Icon name="file" />supplier_invoices.csv</span></div>
        <table className="ledger-lines">
          <thead><tr><th scope="col">Line item</th><th scope="col">Invoice</th><th scope="col">PO</th><th scope="col"><span className="sr-only">Review status</span></th></tr></thead>
          <tbody>{LINES.map((line, index) => <tr key={line.item} className={index === 2 ? "ledger-exception" : "ledger-match"}>
            <th scope="row">{line.item}</th><td>{line.invoice}</td><td>{line.order}</td><td><span className="ledger-line-status"><Icon name={index === 2 && phase < 2 ? "shield" : "check"} /></span></td>
          </tr>)}</tbody>
          <tfoot><tr><th scope="row">Total</th><td>¥1,284,000</td><td>¥1,282,800</td><td /></tr></tfoot>
        </table>
        <div className="ledger-record"><span className="ledger-record-symbol"><Icon name={phase === 2 ? "shield" : "file"} /></span><div><strong>{phase === 0 ? "Comparing source records" : phase === 1 ? "¥1,200 needs a decision" : "Adjustment approved. Record attached."}</strong><span>{phase === 2 ? "M. Tanaka · Source values preserved" : "Two matched lines. One tax exception."}</span></div><span className="ledger-record-check"><Icon name={phase === 2 ? "check" : "arrow"} /></span></div>
      </div>
    </div>
  );
}
