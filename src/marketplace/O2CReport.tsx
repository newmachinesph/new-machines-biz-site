import { Badge } from "@/design-system/components/Badge";
import { Card } from "@/design-system/components/Card";
import { Table, type Column } from "@/design-system/components/Table";
import { Icon } from "@/home/Icon";
import { MARKETPLACE_COPY } from "./copy";
import { O2C_KINDS, o2cTotals, peso, type O2CReportSample } from "./o2cSample";

const O = MARKETPLACE_COPY.listing.o2c;

type ReportRow = { order: string; customer: string; exception: string; amount: string; action: string; outcome: string };

const COLUMNS: readonly Column<ReportRow>[] = [
  { key: "order", header: O.columns.order, mono: true },
  { key: "customer", header: O.columns.customer },
  { key: "exception", header: O.columns.exception },
  { key: "amount", header: O.columns.amount, align: "right" },
  { key: "action", header: O.columns.action },
  { key: "outcome", header: O.columns.outcome },
];

/** The Order-to-Cash Exception Desk's deliverable on demo data: the facts the run page shows, then one row per exception. */
export function O2CReport({ report }: { report: O2CReportSample }) {
  const totals = o2cTotals(report.rows);
  const rows: ReportRow[] = report.rows.map((row) => ({
    order: row.orderId,
    customer: row.customer,
    exception: `${O.kinds[row.kind]}. ${row.note}`,
    amount: peso(row.amountMinor),
    action: row.action,
    outcome: O.outcomes[row.outcome],
  }));
  const facts: readonly { label: string; value: string }[] = [
    { label: O.exceptions, value: String(report.rows.length) },
    ...O2C_KINDS.map((kind) => ({ label: O.kinds[kind], value: `${totals[kind].count} · ${peso(totals[kind].amountMinor)}` })),
    { label: O.remindersDrafted, value: String(report.actions.remindersDrafted) },
    { label: O.financeNotes, value: String(report.actions.financeNotes) },
    { label: O.warehouseNotes, value: String(report.actions.warehouseNotes) },
  ];
  return (
    <div className="o2c-report" data-component="o2cReport">
      <Card className="o2c-summary">
        <div className="o2c-summary-head"><span className="scene-kicker">{report.business}</span><Badge>{O.badge}</Badge></div>
        <p>{report.summary}</p>
        <dl className="o2c-facts" aria-label={O.factsLabel}>
          {facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        </dl>
      </Card>
      <div>
        <Table caption={O.caption} columns={COLUMNS} rows={rows} rowKey={(row) => row.order} />
        <p className="table-scroll-hint" aria-hidden="true">{O.scrollHint}<Icon /></p>
      </div>
    </div>
  );
}
