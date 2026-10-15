import { lineTotal, yen, type LineItem, type ReceivedItem } from "@/marketplace/invoiceMatcher";

type SourceDocumentProps =
  | { kind: "po"; number: string; lines: readonly LineItem[]; diffs: ReadonlySet<string> }
  | { kind: "received"; number: string; lines: readonly ReceivedItem[]; diffs: ReadonlySet<string> };

const TITLE = { po: "Purchase order", received: "Receiving report" } as const;

/** The buyer's own record behind an invoice, rendered from its lines: items whose quantities disagree across the three documents are marked. */
export function SourceDocument(props: SourceDocumentProps) {
  const { kind, number, diffs } = props;
  return (
    <table className="source-document" data-kind={kind}>
      <caption><span className="source-document-title"><span>{TITLE[kind]}</span>{" "}<span>{number}</span></span></caption>
      <thead><tr><th scope="col">Item</th><th scope="col">Qty</th>{props.kind === "po" ? <th scope="col">Price</th> : null}</tr></thead>
      <tbody>
        {props.kind === "po"
          ? props.lines.map((line) => <tr key={line.item} data-diff={diffs.has(line.item) || undefined}><th scope="row">{line.item}</th><td>{line.quantity}</td><td>{yen(line.price)}</td></tr>)
          : props.lines.map((line) => <tr key={line.item} data-diff={diffs.has(line.item) || undefined}><th scope="row">{line.item}</th><td>{line.quantity}</td></tr>)}
      </tbody>
      {props.kind === "po" ? <tfoot><tr><th scope="row" colSpan={2}>Total</th><td>{yen(lineTotal(props.lines))}</td></tr></tfoot> : null}
    </table>
  );
}
