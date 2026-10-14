import { Badge } from "@/design-system/components/Badge";
import { Card } from "@/design-system/components/Card";
import { Icon } from "@/home/Icon";
import { MARKETPLACE_COPY } from "./copy";
import type { CheckStatus, QualifierAccount, QualifierRun } from "./leadQualifierSample";

const Q = MARKETPLACE_COPY.listing.qualifier;

/** Warnings wait for a person (human accent); failures are blocked. Every chip carries its label, so colour is never the only cue. */
const CHECK_ACCENT: Record<CheckStatus, "human" | "blocked" | undefined> = { pass: undefined, warn: "human", fail: "blocked", could_not_check: "human" };

function StatusBadge({ status }: { status: QualifierAccount["status"] }) {
  return status === "review" ? <Badge status="waiting-for-human">{Q.status.review}</Badge> : <Badge>{Q.status.ready}</Badge>;
}

function AccountReport({ account, open }: { account: QualifierAccount; open: boolean }) {
  const { criteria, checks, intent_signals: intent } = account;
  return (
    <details className="qualifier-account" open={open} data-status={account.status}>
      <summary>
        <span className="qualifier-account-name"><strong>{account.account}</strong><span>{account.domain}</span></span>
        <span className="qualifier-score"><strong>{account.fit_score}</strong><span>{Q.outOf}</span></span>
        <span className="qualifier-confidence">{Q.confidence[account.confidence]}</span>
        <StatusBadge status={account.status} />
        <Icon name="plus" />
      </summary>
      {account.review_reason ? <p className="qualifier-reason" data-accent="human"><span className="scene-kicker">{Q.whyReview}</span>{account.review_reason}</p> : null}
      <div className="qualifier-account-body">
        <table className="qualifier-criteria">
          <caption className="sr-only">{`${account.account}: ${Q.criteriaCaption}`}</caption>
          <thead><tr><th scope="col">{Q.columns.criterion}</th><th scope="col">{Q.columns.score}</th><th scope="col">{Q.columns.evidence}</th></tr></thead>
          <tbody>
            {criteria.map((c) => (
              <tr key={c.criterion} data-could-not-check={c.could_not_check ? "true" : undefined}>
                <th scope="row">{c.criterion}</th>
                <td className="qualifier-criterion-score">{c.score}<span>{` / ${c.max}`}</span></td>
                <td>
                  <p>{c.evidence}</p>
                  <span className="qualifier-source">
                    {c.could_not_check ? <span className="qualifier-chip" data-check="could_not_check" data-accent="human">{Q.check.could_not_check}</span> : <><span className="qualifier-chip" data-verified={c.verified}>{c.verified ? Q.verified : Q.inferred}</span>{`${c.source} · ${c.source_date}`}</>}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="qualifier-side">
          <div>
            <span className="scene-kicker">{Q.checksHeading}</span>
            <ul className="qualifier-checks">
              {checks.map((c) => (
                <li key={c.check}>
                  <span className="qualifier-chip" data-check={c.status} data-accent={CHECK_ACCENT[c.status]}>{Q.check[c.status]}</span>
                  <div><strong>{c.check}</strong><span>{c.reason}</span></div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="scene-kicker">{Q.intentHeading}</span>
            {intent.length ? (
              <ul className="qualifier-intent">{intent.map((s) => <li key={s.signal}><strong>{s.signal}</strong><span>{`${s.source} · ${s.date}`}</span></li>)}</ul>
            ) : <p className="qualifier-muted">{Q.noIntent}</p>}
            <p className="qualifier-muted">{Q.intentNote}</p>
          </div>
          <div><span className="scene-kicker">{Q.fitNotes}</span><p>{account.fit_notes}</p></div>
          <div><span className="scene-kicker">{Q.nextAction}</span><p>{account.suggested_next_action}</p></div>
        </div>
      </div>
    </details>
  );
}

/** One run of the Lead qualifier, rendered from its JSON output: shortlist with evidence, excluded accounts with reasons, and the audit trail. */
export function QualifierReport({ run }: { run: QualifierRun }) {
  const ready = run.shortlist.filter((a) => a.status === "ready").length;
  const review = run.shortlist.length - ready;
  return (
    <div className="qualifier-report" data-component="qualifierReport">
      <Card className="qualifier-summary">
        <span className="scene-kicker">{`${run.run_id} · ${run.audit.checked_at}`}</span>
        <p>{run.summary}</p>
        <dl className="qualifier-counts">
          <div><dt>{Q.status.ready}</dt><dd>{ready}</dd></div>
          <div data-accent="human"><dt>{Q.status.review}</dt><dd>{review}</dd></div>
          <div><dt>{Q.status.excluded}</dt><dd>{run.excluded.length}</dd></div>
        </dl>
        <p className="qualifier-guardrail"><Icon name="shield" />{Q.guardrail}</p>
      </Card>

      <div>
        <span className="scene-kicker">{Q.shortlistHeading}</span>
        <ul className="qualifier-shortlist" aria-label={Q.shortlistHeading}>
          {run.shortlist.map((account, i) => <li key={account.domain}><AccountReport account={account} open={i === 0} /></li>)}
        </ul>
      </div>

      <div className="qualifier-footer">
        <Card className="qualifier-excluded">
          <span className="scene-kicker">{Q.excludedHeading}</span>
          <ul aria-label={Q.excludedHeading}>
            {run.excluded.map((e) => <li key={e.account}><span className="qualifier-chip" data-check="fail" data-accent="blocked">{Q.status.excluded}</span><div><strong>{e.account}</strong><span>{e.reason}</span></div></li>)}
          </ul>
        </Card>
        <Card className="qualifier-audit">
          <span className="scene-kicker">{Q.auditHeading}</span>
          <dl>
            <div><dt>{Q.audit.tools}</dt><dd className="font-mono">{run.audit.tools_called.join(", ")}</dd></div>
            <div><dt>{Q.audit.sources}</dt><dd>{run.audit.sources_checked.join(", ")}</dd></div>
            <div><dt>{Q.audit.checkedAt}</dt><dd>{run.audit.checked_at}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
