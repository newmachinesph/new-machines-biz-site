/** The Support reply drafter's output, as the reviewer UI receives it. Synthetic data only. */

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
  summary: "One billing draft needs your approval: the customer was charged twice and the duplicate refund needs sign-off.",
  drafts: [
    {
      conversation: "conv_5531 · Billing exception",
      issueType: "billing",
      language: "ja",
      status: "review",
      statusReason: "The refund needs approval in the billing system before this reply is sent.",
      customerAsk: "Refund the second ¥12,800 charge for the October invoice.",
      draftReply:
        "山田様\n\nお問い合わせいただき、誠にありがとうございます。\n10月3日に10月分のご請求（¥12,800）が2回計上されていることを確認いたしました。2回目の計上は、決済処理の再試行によるものでございます。\n重複分の¥12,800につきましては、返金の手続きを進めております。手続きが完了しましたら、改めてご連絡いたします。\nご不便をおかけし、誠に申し訳ございません。",
      backTranslationEn:
        "Dear Yamada-sama,\n\nThank you for contacting us.\nWe have confirmed that the October invoice (¥12,800) was charged twice on 3 October. The second charge was caused by a retry of the payment process.\nWe are processing a refund of the duplicate ¥12,800 and will contact you again once it is complete.\nWe sincerely apologise for the inconvenience.",
      billingExplanation: {
        cause: "Charged twice on 3 Oct: the first attempt was reported as failed, and the retry also settled.",
        options: ["Refund the duplicate ¥12,800 to the card on file (needs approval)", "Credit ¥12,800 to the November invoice (needs approval)"],
      },
      factsUsed: [
        { claim: "October invoice is ¥12,800", sourceRecord: "invoices/INV-4410" },
        { claim: "Two charges of ¥12,800 on 3 Oct", sourceRecord: "payments/pay_7Q21, pay_7Q22" },
        { claim: "Second charge is a retry of the first", sourceRecord: "payments/pay_7Q22.retry_of" },
        { claim: "Message came from the registered email", sourceRecord: "accounts/acc_2207.email" },
      ],
      commitments: [{ commitment: "Refund the duplicate ¥12,800", policyAllowed: true, needsApproval: true }],
      checks: [
        { check: "identity", status: "pass", reason: "Sent from the registered email address." },
        { check: "policy", status: "warn", reason: "Duplicate-charge refunds are allowed but need approval." },
        { check: "accuracy", status: "pass", reason: "Amount, date and cause match the payment records." },
        { check: "tone", status: "pass", reason: "Consistent 敬語; apologises without admitting further liability." },
        { check: "privacy", status: "pass", reason: "No card number or other customers’ data in the reply." },
        { check: "escalation", status: "pass", reason: "No dispute, legal, regulator or repeat-contact triggers." },
      ],
      reviewerActions: ["Approve the ¥12,800 refund in the billing system", "Send the reply once the refund is approved"],
    },
  ],
  audit: {
    toolsCalled: ["accounts.find", "invoices.find", "payments.find", "kb.search"],
    policiesReferenced: ["refund-policy v4", "identity-verification v2", "brand-voice ja v3"],
    checkedAt: "2026-10-11T09:31:40+09:00",
  },
};

const SAMPLE_RUNS: Readonly<Record<string, SupportDraftRun>> = { "support-reply-drafter": SUPPORT_SAMPLE_RUN };

/** The sample reviewer view for a listing, if it has one. */
export function sampleRunFor(slug: string): SupportDraftRun | undefined {
  return SAMPLE_RUNS[slug];
}
