import type { ReactNode } from "react";
import { Badge, type Status } from "@/design-system/components/Badge";
import { Card } from "@/design-system/components/Card";
import { Table, type Column } from "@/design-system/components/Table";
import { Icon } from "@/home/Icon";
import { MARKETPLACE_COPY } from "./copy";
import { APPEARANCE_CHECKS, type CheckStatus, type InvoiceMatchRun, type LineMatch, type RiskLevel } from "./invoiceMatcher";

const R = MARKETPLACE_COPY.listing.run;

const CHECK_BADGE: Record<CheckStatus, Status | undefined> = { pass: "verified", warn: "waiting-for-human", fail: "blocked", could_not_check: undefined };
const RISK_BADGE: Record<RiskLevel, Status> = { low: "verified", medium: "waiting-for-human", high: "blocked" };
const LINE_BADGE: Record<LineMatch["status"], Status> = { match: "verified", exception: "waiting-for-human" };

const yen = (n: number) => `¥${n.toLocaleString("en-US")}`;

type LineRow = { line: string; invoice: string; po: string; received: string; status: ReactNode };
const LINE_COLUMNS: readonly Column<LineRow>[] = [
  { key: "line", header: R.lines.line },
  { key: "invoice", header: R.lines.invoice, align: "right" },
  { key: "po", header: R.lines.po, align: "right" },
  { key: "received", header: R.lines.received, align: "right" },
  { key: "status", header: R.lines.status, align: "right" },
];

/** The reviewer's view of one Invoice matcher run: verdict first, then every check, the three-way match and the diagnosis. */
export function MatchReport({ run }: { run: InvoiceMatchRun }) {
  const lineRows: LineRow[] = run.line_matches.map((l) => ({
    line: l.line,
    invoice: yen(l.invoice),
    po: yen(l.po),
    received: l.received === null ? "—" : yen(l.received),
    status: <Badge status={LINE_BADGE[l.status]}>{R.lineStatus[l.status]}</Badge>,
  }));
  return (
    <div className="match-report" data-component="matchReport">
      <Card className="match-verdict">
        <div className="match-verdict-head">
          <span className="scene-kicker">{`${R.runLabel} ${run.run_id}`}</span>
          <Badge status={RISK_BADGE[run.risk_level]}>{R.risk[run.risk_level]}</Badge>
        </div>
        <p className="match-recommendation"><span>{R.recommends}</span><strong>{R.recommendation[run.recommendation]}</strong></p>
        <p className="match-summary">{run.summary}</p>
        <dl className="match-verdict-meta">
          <div><dt>{R.notify}</dt><dd>{run.notify.map((who) => R.notifyWho[who]).join(", ")}</dd></div>
          <div><dt>{R.onboarding}</dt><dd>{run.requires_onboarding ? R.onboardingRequired : R.onboardingNotRequired}</dd></div>
        </dl>
        <p className="match-human-note"><Icon name="shield" />{R.humanDecides}</p>
      </Card>

      <Card className="match-checks">
        <span className="scene-kicker">{R.checksHeading}</span>
        <ul>
          {run.document_checks.map((c) => (
            <li key={c.check}>
              <Badge status={CHECK_BADGE[c.status]}>{R.checkStatus[c.status]}</Badge>
              <div><strong>{c.check}</strong><p>{c.reason}</p></div>
              <span className="match-basis">{APPEARANCE_CHECKS.has(c.check) ? R.basis.document : R.basis.database}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="match-lines">
        <span className="scene-kicker">{R.lines.heading}</span>
        <Table caption={R.lines.caption} columns={LINE_COLUMNS} rows={lineRows} rowKey={(row) => row.line} />
      </div>

      {run.exceptions.map((ex) => (
        <Card key={ex.line} className="match-exception">
          <div className="match-exception-head">
            <span className="scene-kicker">{`${R.exception} · ${ex.line}`}</span>
            <strong>{yen(ex.difference)}</strong>
          </div>
          <ol className="match-causes" aria-label={R.causesLabel}>
            {ex.likely_causes.map((cause) => (
              <li key={cause.cause}>
                <span className="match-likelihood" data-likelihood={cause.likelihood}>{R.likelihood[cause.likelihood]}</span>
                <div><strong>{cause.cause}</strong><p>{cause.evidence}</p></div>
              </li>
            ))}
          </ol>
          <p className="match-action"><span className="scene-kicker">{R.suggestedAction}</span>{ex.suggested_action}</p>
        </Card>
      ))}

      <Card className="match-audit">
        <span className="scene-kicker">{R.audit.heading}</span>
        <dl>
          <div><dt>{R.audit.sources}</dt><dd>{run.audit.data_sources_checked.join(" · ")}</dd></div>
          <div><dt>{R.audit.tools}</dt><dd className="font-mono">{run.audit.tools_called.join(" · ")}</dd></div>
          <div><dt>{R.audit.checkedAt}</dt><dd className="font-mono">{run.audit.checked_at}</dd></div>
        </dl>
      </Card>
    </div>
  );
}
