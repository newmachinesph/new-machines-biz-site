import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HOME_COPY } from "@/home/copy";
import { accentViolations } from "@/home/mockups/accentViolations";
import { ListingDetail } from "./ListingDetail";
import { findListing } from "./listings";
import { O2C_SAMPLE, o2cTotals, peso } from "./o2cSample";

const toolNames = (container: HTMLElement) => within(container.querySelector<HTMLElement>(".detail-apps")!).getAllByRole("img").map((img) => img.getAttribute("alt"));
const facts = (container: HTMLElement) =>
  Object.fromEntries([...container.querySelectorAll(".listing-facts > div")].map((row) => [row.querySelector("dt")!.textContent, row.querySelector("dd")!.textContent]));

describe("ListingDetail", () => {
  it("renders a certified pack with its outcome, facts, steps, evidence, tools and related listings", () => {
    const listing = findListing("order-payment-reconciliation")!;
    const { container } = render(<ListingDetail listing={listing} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Order & Payment Reconciliation");
    expect(screen.getByRole("link", { name: "All listings" })).toHaveAttribute("href", "/marketplace");
    expect(screen.getByRole("link", { name: "Add in the app" })).toHaveAttribute("href", HOME_COPY.nav.appUrl);
    expect(screen.getByRole("link", { name: "See a preview" })).toHaveAttribute("href", "/#work-explorer");
    expect(screen.getByText("Certified")).toHaveAttribute("data-status", "verified");
    expect(container.querySelector(".listing-meta .listing-price")).toHaveTextContent("About $0.60–$2.40 / run");
    expect(screen.getByText("New Machines Labs, version 1.0.0")).toBeInTheDocument();
    expect(container.querySelector(".listing-reviewer")).toBeNull();
    expect(facts(container)).toMatchObject({
      "Who does the work": "Finance Agent, Operations Agent",
      "Who reviews": "A reviewer from your team, or the New Machines reviewer network if you allow it. The network sees a redacted copy.",
      "What it costs": "About $0.60 to $2.40 of AI work per run, plus up to $7.50 of reviewer time when a mismatch needs a person.",
      "Risk class": "Medium",
      Function: "Finance operations",
      "Processed in": "Mumbai (asia-south1)",
    });
    for (const item of listing.scope) expect(screen.getByText(item)).toBeInTheDocument();
    expect(toolNames(container)).toEqual(["Shopify", "Stripe", "Google Sheets"]);
    expect(container.querySelectorAll(".work-guide li")).toHaveLength(5);
    expect(screen.getByText("01")).toHaveClass("font-mono", "font-light");
    expect(screen.getByText("Check policy").nextElementSibling).toHaveTextContent("Every app action is checked: reads run, writes wait for your approval.");
    const evidence = within(screen.getByRole("list", { name: "What the evidence page shows" })).getAllByRole("listitem");
    expect(evidence.map((item) => item.querySelector("strong")?.textContent)).toEqual(["Work receipt", "What changed outside New Machines", "Approvals", "What is still open"]);
    const related = within(screen.getByRole("list", { name: "Related listings" })).getAllByRole("link");
    expect(related.map((link) => link.getAttribute("href"))).toEqual(["/marketplace/order-to-cash-exception-desk", "/marketplace/refund-triage", "/marketplace/support-inbox-triage"]);
    expect(within(screen.getByRole("list", { name: "Related listings" })).getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(container.querySelector("[data-component='o2cReport']")).toBeNull();
    expect(container.querySelector("[data-component='listingDraftReview']")).toBeNull();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/Trust Passport|Assigned reviewer|¥/);
    expect(accentViolations(container)).toEqual([]);
  });

  it("says when a pack has no reviewer step", () => {
    const { container } = render(<ListingDetail listing={findListing("inbox-lead-tracker")!} />);
    expect(facts(container)).toMatchObject({
      "Who does the work": "Lead Agent, A separate decision model",
      "Where a person comes in": "No reviewer. You approve the rows before anything is added to your sheet.",
      "Who reviews": "No reviewer step. You approve before anything is written.",
      "Risk class": "Low",
    });
  });

  it("shows the Order-to-Cash deliverable on labelled demo data, with totals that add up", () => {
    const { container } = render(<ListingDetail listing={findListing("order-to-cash-exception-desk")!} />);
    expect(toolNames(container)).toEqual(["Business app (read-only, over MCP)", "Gmail"]);
    const report = within(container.querySelector<HTMLElement>("[data-component='o2cReport']")!);
    expect(report.getByText("Kalumpang Demo Supply Co.")).toBeInTheDocument();
    expect(report.getByText("Demo data")).toBeInTheDocument();
    const totals = Object.fromEntries([...container.querySelectorAll(".o2c-facts > div")].map((row) => [row.querySelector("dt")!.textContent, row.querySelector("dd")!.textContent]));
    expect(totals).toEqual({
      Exceptions: "6",
      "Payment pending confirmation": "1 · ₱62,000.00",
      "Shipped, not paid": "3 · ₱263,450.00",
      "Paid, not shipped": "1 · ₱34,900.00",
      "Disputed invoice": "1 · ₱21,600.00",
      "Reminders drafted": "2",
      "Finance notes": "2",
      "Warehouse notes": "1",
    });
    const table = within(report.getByRole("region", { name: "Exception desk report, one row per exception · demo data" }));
    expect(table.getAllByRole("row")).toHaveLength(O2C_SAMPLE.rows.length + 1);
    expect(table.getByText("SO-DEMO-1058").closest("tr")).toHaveTextContent("Listed only");
    expect(screen.getByText(/Demo data for a fictional business\. Nothing is sent and no money moves/)).toBeInTheDocument();
    expect(container.querySelector("[data-component='listingDraftReview']")).toBeNull();
    expect(accentViolations(container)).toEqual([]);
  });

  it("keeps the demo report consistent with its own actions", () => {
    const rows = O2C_SAMPLE.rows;
    expect(rows.filter((row) => row.outcome === "drafted")).toHaveLength(O2C_SAMPLE.actions.remindersDrafted);
    expect(rows.filter((row) => row.action.startsWith("Flag for finance"))).toHaveLength(O2C_SAMPLE.actions.financeNotes);
    expect(rows.filter((row) => row.action === "Note for the warehouse")).toHaveLength(O2C_SAMPLE.actions.warehouseNotes);
    for (const row of rows) {
      expect(row.orderId).toMatch(/^SO-DEMO-\d{4}$/);
      expect(row.customer).toMatch(/ Demo /);
    }
    const shipped = rows.filter((row) => row.kind === "shipped_not_paid").map((row) => row.amountMinor);
    const drafted = rows.filter((row) => row.outcome === "drafted").map((row) => row.amountMinor);
    expect(Math.min(...drafted)).toBeGreaterThan(Math.max(...shipped.filter((amount) => !drafted.includes(amount))));
    expect(o2cTotals(rows).shipped_not_paid.count).toBe(3);
    expect(peso(14_850_000)).toBe("₱148,500.00");
  });

  it("labels the support sample as illustrative", () => {
    const { container } = render(<ListingDetail listing={findListing("support-inbox-triage")!} />);
    const section = container.querySelector<HTMLElement>(".draft-review-section")!;
    expect(within(section).getByText("Illustrative sample")).toBeInTheDocument();
    expect(within(section).getByText(/It is not this pack’s exact output|It is not this pack's exact output/)).toBeInTheDocument();
    const card = container.querySelector<HTMLElement>('[data-component="listingDraftReview"]')!;
    const checks = within(within(card).getByRole("list", { name: "Checks" })).getAllByRole("listitem");
    expect(checks).toHaveLength(6);
    expect(screen.getByText("Illustrative sample · Synthetic data · No replies sent, no refunds issued")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });

  it("renders a platform agent: the packs it works in, no price of its own, and its own CTA", () => {
    const { container } = render(<ListingDetail listing={findListing("retail-agent")!} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Retail Agent");
    expect(screen.getByRole("link", { name: "Use it in the app" })).toHaveAttribute("href", HOME_COPY.nav.appUrl);
    expect(container.querySelector(".listing-meta .listing-price")).toHaveTextContent("Free in your packs");
    expect(screen.getByText("New Machines Labs, version 1.1.0")).toBeInTheDocument();
    expect(facts(container)).toMatchObject({
      "Works in": "Not in a ready-made pack yet. Add it to your own pack in the Developer Studio.",
      Model: "Reasoning model",
    });
    expect(toolNames(container)).toEqual(["Shopify"]);
    const related = within(screen.getByRole("list", { name: "Related listings" })).getAllByRole("link");
    expect(related.map((link) => link.getAttribute("href"))).toEqual(["/marketplace/order-to-cash-triage-agent", "/marketplace/finance-agent", "/marketplace/support-agent"]);
    expect(accentViolations(container)).toEqual([]);
  });
});
