import { describe, expect, it } from "vitest";
import { RECOMMENDATION_FOR, riskFor, SAMPLE_RUN, type CheckStatus } from "./invoiceMatcher";

const withCheck = (check: string, status: CheckStatus) => ({
  ...SAMPLE_RUN,
  line_matches: SAMPLE_RUN.line_matches.map((l) => ({ ...l, status: "match" as const })),
  document_checks: SAMPLE_RUN.document_checks.map((c) => (c.check === check ? { ...c, status } : c)),
});

describe("invoice matcher routing", () => {
  it("keeps the sample run consistent with its own rules and arithmetic", () => {
    expect(SAMPLE_RUN.document_checks).toHaveLength(7);
    expect(riskFor(SAMPLE_RUN)).toBe(SAMPLE_RUN.risk_level);
    expect(RECOMMENDATION_FOR[SAMPLE_RUN.risk_level]).toBe(SAMPLE_RUN.recommendation);
    const [ops, software, tax] = SAMPLE_RUN.line_matches;
    expect(Math.round((ops.invoice + software.invoice) * 0.1)).toBe(tax.invoice);
    expect(Math.round((ops.po + software.po - 12_000) * 0.1)).toBe(tax.po);
    expect(tax.invoice - tax.po).toBe(SAMPLE_RUN.exceptions[0].difference);
  });

  it("is low only when everything passes", () => {
    expect(riskFor(withCheck("Supplier identity", "pass"))).toBe("low");
  });

  it("holds on any fail in identity, payment, legitimacy or the PO", () => {
    for (const check of ["Supplier identity", "Bank details unchanged", "No duplicate invoice", "PO matches database record"]) expect(riskFor(withCheck(check, "fail"))).toBe("high");
  });

  it("treats template and tampering warnings, could_not_check and new suppliers as at least medium", () => {
    expect(riskFor(withCheck("Template matches history", "warn"))).toBe("medium");
    expect(riskFor(withCheck("No tampering signals", "warn"))).toBe("medium");
    expect(riskFor(withCheck("Bank details unchanged", "could_not_check"))).toBe("medium");
    expect(riskFor({ ...withCheck("Supplier identity", "pass"), requires_onboarding: true })).toBe("medium");
  });
});
