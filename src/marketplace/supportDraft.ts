/** The Support reply drafter's output, as the reviewer UI receives it. Synthetic data only, in yen (a Japanese
 *  customer). The pack reads Gmail and Google Sheets only, so every fact cites one of those. */

export type CheckStatus = "pass" | "warn" | "fail" | "could_not_check";
export type DraftStatus = "ready" | "review" | "blocked";
export type CheckName = "identity" | "policy" | "accuracy" | "tone" | "privacy" | "escalation";

export type DraftCheck = Readonly<{ check: CheckName; status: CheckStatus; reason: string }>;
export type DraftFact = Readonly<{ claim: string; sourceRecord: string }>;
export type DraftCommitment = Readonly<{ commitment: string; policyAllowed: boolean; needsApproval: boolean }>;

export type SupportDraft = Readonly<{
  conversation: string;
  issueType: "delivery" | "account access" | "billing" | "product" | "complaint" | "other";
  /** BCP 47 tag, so the reply can carry `lang`. */
  language: string;
  status: DraftStatus;
  statusReason: string;
  customerAsk: string;
  draftReply: string;
  /** Present whenever the reply is not in English. */
  backTranslationEn?: string;
  /** Billing exceptions only: the cause from the records and the policy-allowed options. */
  billingExplanation?: Readonly<{ cause: string; options: readonly string[] }>;
  factsUsed: readonly DraftFact[];
  commitments: readonly DraftCommitment[];
  checks: readonly DraftCheck[];
  reviewerActions: readonly string[];
}>;

export type SupportDraftRun = Readonly<{
  runId: string;
  summary: string;
  drafts: readonly SupportDraft[];
  audit: Readonly<{ toolsCalled: readonly string[]; policiesReferenced: readonly string[]; checkedAt: string }>;
}>;

/** The six checks, in the order the agent runs them. */
export const CHECK_ORDER: readonly CheckName[] = ["identity", "policy", "accuracy", "tone", "privacy", "escalation"];

/**
 * The routing rules: any policy or privacy `fail` blocks the draft; any other non-pass, or any commitment that needs
 * approval or falls outside policy, sends it to review; otherwise it is ready.
 */
export function routeDraft(checks: readonly DraftCheck[], commitments: readonly DraftCommitment[]): DraftStatus {
  if (checks.some((c) => c.status === "fail" && (c.check === "policy" || c.check === "privacy"))) return "blocked";
  if (checks.some((c) => c.status !== "pass")) return "review";
  if (commitments.some((c) => c.needsApproval || !c.policyAllowed)) return "review";
  return "ready";
}

export const SUPPORT_SAMPLE_RUN: SupportDraftRun = {
  runId: "run_01HX4QG3",
  summary: "One refund request needs a person: the customer reports a double charge, and refund requests always go to a reviewer.",
  drafts: [
    {
      conversation: "conv_5531 · Refund request",
      issueType: "billing",
      language: "ja",
      status: "review",
      statusReason: "Refund requests go to a person. The pack reads only Gmail and your support sheet, so the charge itself is checked outside it.",
      customerAsk: "Refund the second ¥12,800 charge for the October invoice.",
      draftReply:
        "山田様\n\nお問い合わせいただき、誠にありがとうございます。\n10月3日に10月分のご請求（¥12,800）が2回計上されたとのご連絡を承りました。現在、担当部署にて確認を進めております。重複して計上されていた場合は、返金の手続きをいたします。\n確認が完了しましたら、改めてご連絡いたします。\nご不便をおかけし、誠に申し訳ございません。",
      backTranslationEn:
        "Dear Yamada-sama,\n\nThank you for contacting us.\nWe have received your report that the October invoice (¥12,800) was charged twice on 3 October. Our billing team is now checking it. If the charge was duplicated, we will process a refund.\nWe will contact you again once the check is complete.\nWe sincerely apologise for the inconvenience.",
      factsUsed: [
        { claim: "Customer reports two charges of ¥12,800 on 3 Oct", sourceRecord: "gmail/msg_18c4f2" },
        { claim: "Sender matches the customer on an earlier case", sourceRecord: "sheets/support-cases#row-112" },
      ],
      commitments: [{ commitment: "Check the charge and refund any duplicate", policyAllowed: true, needsApproval: true }],
      checks: [
        { check: "identity", status: "pass", reason: "Sender matches the customer on an earlier case in your support sheet." },
        { check: "policy", status: "warn", reason: "Refund requests always go to a person." },
        { check: "accuracy", status: "could_not_check", reason: "Payment records are outside this pack. The reply promises a check, not a refund." },
        { check: "tone", status: "pass", reason: "Consistent 敬語; apologises without admitting further liability." },
        { check: "privacy", status: "pass", reason: "No card number or other customers’ data in the reply." },
        { check: "escalation", status: "pass", reason: "No dispute, legal, regulator or repeat-contact triggers." },
      ],
      reviewerActions: ["Confirm the two charges in your billing system", "Send the reply, then log the case for the refunds team"],
    },
  ],
  audit: {
    toolsCalled: ["Gmail: read message", "Google Sheets: read cases", "Google Sheets: log case"],
    policiesReferenced: ["refund-policy v4", "brand-voice ja v3"],
    checkedAt: "2026-10-11T09:31:40+09:00",
  },
};

/** Shown as an illustrative sample on the Support Inbox Triage listing; it is not that pack's exact output. */
const SAMPLE_RUNS: Readonly<Record<string, SupportDraftRun>> = { "support-inbox-triage": SUPPORT_SAMPLE_RUN };

/** The illustrative reviewer view for a listing, if it has one. */
export function sampleRunFor(slug: string): SupportDraftRun | undefined {
  return SAMPLE_RUNS[slug];
}
