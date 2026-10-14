import type { ReactNode } from "react";
import { Badge, type Status } from "@/design-system/components/Badge";
import { Card } from "@/design-system/components/Card";
import { Table, type Column } from "@/design-system/components/Table";
import { SectionCell, SplitCell } from "@/home/Frame";
import { SectionHeader } from "@/home/SectionHeader";
import { MARKETPLACE_COPY } from "./copy";
import { CHECK_ORDER, routeDraft, type CheckStatus, type DraftFact, type DraftStatus, type SupportDraftRun } from "./supportDraft";

const D = MARKETPLACE_COPY.listing.draftReview;

const DRAFT_BADGE: Record<DraftStatus, Status> = { ready: "verified", review: "waiting-for-human", blocked: "blocked" };
const CHECK_BADGE: Record<CheckStatus, Status> = { pass: "verified", warn: "waiting-for-human", could_not_check: "waiting-for-human", fail: "blocked" };
const ROUTES = ["ready", "review", "blocked"] as const satisfies readonly DraftStatus[];

const FACT_COLUMNS: readonly Column<DraftFact>[] = [
  { key: "claim", header: D.factColumns.claim },
  { key: "sourceRecord", header: D.factColumns.sourceRecord, mono: true },
];

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={className ? `draft-field ${className}` : "draft-field"}><span className="scene-kicker">{label}</span>{children}</div>;
}

/** The reviewer's view of one sample run: routing rules beside the first draft with its facts, checks and actions. */
export function DraftReview({ run }: { run: SupportDraftRun }) {
  const draft = run.drafts[0];
  // The badge follows the rules, not the stored label, so the sample can never show a status its checks don't earn.
  const status = routeDraft(draft.checks, draft.commitments);
  const checks = [...draft.checks].sort((a, b) => CHECK_ORDER.indexOf(a.check) - CHECK_ORDER.indexOf(b.check));
  return (
    <SectionCell labelledBy="draft-review-title" className="draft-review-section">
      <SplitCell
        textSide="left"
        text={
          <>
            <SectionHeader id="draft-review-title" eyebrow={D.eyebrow} lead={D.lead} tail={D.tail} sub={D.sub} />
            <div className="draft-routing" data-component="draftRouting">
              <span className="scene-kicker">{D.routingHeading}</span>
              <ul>{ROUTES.map((route) => <li key={route}><Badge status={DRAFT_BADGE[route]}>{D.routing[route].label}</Badge><span>{D.routing[route].rule}</span></li>)}</ul>
            </div>
          </>
        }
        visual={
          <Card className="draft-card" data-component="listingDraftReview">
            <header className="draft-card-head">
              <div><span className="scene-kicker">{`${D.cardLabel} · ${run.runId}`}</span><strong>{draft.conversation}</strong><span className="draft-card-meta">{`${draft.issueType} · ${draft.language}`}</span></div>
              <Badge status={DRAFT_BADGE[status]}>{D.routing[status].label}</Badge>
            </header>
            <p className="draft-status-reason">{draft.statusReason}</p>

            <Field label={D.customerAsk}><p>{draft.customerAsk}</p></Field>
            <div className="draft-reply-pair">
              <Field label={D.draftReply}><p className="draft-reply" lang={draft.language}>{draft.draftReply}</p></Field>
              {draft.backTranslationEn ? <Field label={D.backTranslation}><p className="draft-reply" lang="en">{draft.backTranslationEn}</p></Field> : null}
            </div>

            {draft.billingExplanation ? (
              <Field label={D.billing}>
                <p>{draft.billingExplanation.cause}</p>
                <span className="scene-kicker draft-subhead">{D.options}</span>
                <ul className="draft-list">{draft.billingExplanation.options.map((option) => <li key={option}>{option}</li>)}</ul>
              </Field>
            ) : null}

            <Field label={D.facts}><Table caption={D.factsCaption} columns={FACT_COLUMNS} rows={draft.factsUsed} rowKey={(row) => row.claim} /></Field>

            <Field label={D.commitments}>
              <ul className="draft-list">
                {draft.commitments.map((c) => <li key={c.commitment}>{c.commitment}<span className="draft-tags"><Badge>{c.policyAllowed ? D.withinPolicy : D.outsidePolicy}</Badge>{c.needsApproval ? <Badge>{D.needsApproval}</Badge> : null}</span></li>)}
              </ul>
            </Field>

            <Field label={D.checks}>
              <ol className="draft-checks" aria-label={D.checks}>
                {checks.map((c) => <li key={c.check}><strong>{D.checkNames[c.check]}</strong><Badge status={CHECK_BADGE[c.status]}>{D.checkStatus[c.status]}</Badge><span>{c.reason}</span></li>)}
              </ol>
            </Field>

            <Field label={D.reviewerActions}><ol className="draft-list draft-actions">{draft.reviewerActions.map((action) => <li key={action}>{action}</li>)}</ol></Field>

            <Field label={D.audit} className="draft-audit">
              <p>{[...run.audit.toolsCalled, ...run.audit.policiesReferenced].join(" · ")}</p>
              <p><time dateTime={run.audit.checkedAt}>{run.audit.checkedAt}</time></p>
            </Field>
            <p className="story-note draft-note">{D.note}</p>
          </Card>
        }
      />
    </SectionCell>
  );
}
