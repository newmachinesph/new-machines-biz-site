import { describe, expect, it } from "vitest";
import { CHECK_ORDER, routeDraft, sampleRunFor, SUPPORT_SAMPLE_RUN, type DraftCheck } from "./supportDraft";

const allPass: DraftCheck[] = CHECK_ORDER.map((check) => ({ check, status: "pass", reason: "" }));
const withCheck = (check: DraftCheck["check"], status: DraftCheck["status"]) => allPass.map((c) => (c.check === check ? { ...c, status } : c));

describe("routeDraft", () => {
  it("is ready only when every check passes and nothing needs approval", () => {
    expect(routeDraft(allPass, [])).toBe("ready");
    expect(routeDraft(allPass, [{ commitment: "Replacement", policyAllowed: true, needsApproval: false }])).toBe("ready");
  });

  it("sends a warning, an unchecked fact or an approval to review", () => {
    expect(routeDraft(withCheck("tone", "warn"), [])).toBe("review");
    expect(routeDraft(withCheck("accuracy", "could_not_check"), [])).toBe("review");
    expect(routeDraft(withCheck("identity", "fail"), [])).toBe("review");
    expect(routeDraft(allPass, [{ commitment: "Refund", policyAllowed: true, needsApproval: true }])).toBe("review");
  });

  it("blocks a policy or privacy failure", () => {
    expect(routeDraft(withCheck("policy", "fail"), [])).toBe("blocked");
    expect(routeDraft(withCheck("privacy", "fail"), [])).toBe("blocked");
  });
});

describe("SUPPORT_SAMPLE_RUN", () => {
  it("stores the status its checks and commitments earn", () => {
    for (const draft of SUPPORT_SAMPLE_RUN.drafts) expect(routeDraft(draft.checks, draft.commitments)).toBe(draft.status);
  });

  it("runs all six checks, back-translates non-English replies and cites every fact", () => {
    for (const draft of SUPPORT_SAMPLE_RUN.drafts) {
      expect(draft.checks.map((c) => c.check)).toEqual(CHECK_ORDER);
      if (draft.language !== "en") expect(draft.backTranslationEn).toBeTruthy();
      for (const fact of draft.factsUsed) expect(fact.sourceRecord).toMatch(/^[a-z]+\//);
    }
  });

  it("is only attached to the support reply drafter listing", () => {
    expect(sampleRunFor("support-reply-drafter")).toBe(SUPPORT_SAMPLE_RUN);
    expect(sampleRunFor("invoice-matcher")).toBeUndefined();
  });
});
