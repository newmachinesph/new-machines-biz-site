import { describe, expect, it } from "vitest";
import { checksPassed, lineDiffs, lineTotal, RECOMMENDATION_FOR, riskFor, SAMPLE_BATCH, SAMPLE_RUN, type CheckStatus } from "./invoiceMatcher";

const withCheck = (check: string, status: CheckStatus) => ({
  ...SAMPLE_RUN,
  record: SAMPLE_BATCH[1],
  document_checks: SAMPLE_RUN.document_checks.map((c) => (c.check === check ? { ...c, status } : c)),
});

describe("invoice matcher routing", () => {
  it("keeps the sample run consistent with its own rules and arithmetic", () => {
    expect(SAMPLE_RUN.document_checks).toHaveLength(7);
    expect(riskFor(SAMPLE_RUN)).toBe(SAMPLE_RUN.risk_level);
    expect(RECOMMENDATION_FOR[SAMPLE_RUN.risk_level]).toBe(SAMPLE_RUN.recommendation);
    expect(SAMPLE_RUN.record).toBe(SAMPLE_BATCH[0]);
    expect(SAMPLE_RUN.record.purchase_order.amount - SAMPLE_RUN.record.invoice.amount).toBe(SAMPLE_RUN.exceptions[0].difference);
    expect(SAMPLE_RUN.exceptions[0].difference).toBe(87);
    expect(checksPassed(SAMPLE_RUN)).toBe(7);
    expect(checksPassed({ document_checks: SAMPLE_RUN.document_checks.map((c, i) => (i === 0 ? { ...c, status: "warn" as const } : c)) })).toBe(6);
  });

  it("derives every batch amount from its items, and only the Aster PO disagrees", () => {
    expect(SAMPLE_BATCH.map((record) => [record.invoice.number, record.invoice.amount, record.purchase_order.amount])).toEqual([["030679", 76_177, 76_264], ["014592", 28_000, 28_000], ["028222", 29_505, 29_505]]);
    for (const record of SAMPLE_BATCH) {
      expect(record.invoice.amount).toBe(lineTotal(record.invoice.items));
      expect(record.purchase_order.amount).toBe(lineTotal(record.purchase_order.items));
    }
    expect(lineDiffs(SAMPLE_BATCH[0])).toEqual([
      { item: "Interfolded Paper Towel Virgin Pulp", invoice: 63, po: 64, received: 63, status: "exception" },
      { item: "Jumbo Roll Tissue Virgin Pulp", invoice: 12, po: 11, received: 12, status: "exception" },
    ]);
    expect(SAMPLE_BATCH.slice(1).map(lineDiffs)).toEqual([[], []]);
    expect(SAMPLE_BATCH.map((record) => riskFor({ ...SAMPLE_RUN, record }))).toEqual(["medium", "low", "low"]);
    expect(SAMPLE_BATCH.map((record) => RECOMMENDATION_FOR[riskFor({ ...SAMPLE_RUN, record })])).toEqual(SAMPLE_BATCH.map((record) => record.recommendation));
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
