import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { DEMO_LISTINGS, HOME_PACK_SLUGS } from "./data";
import { MarketplaceGrid } from "./MarketplaceGrid";

const PACKS = ["Order-to-Cash Exception Desk", "Order & Payment Reconciliation", "Refund Triage", "Support Inbox Triage", "Inbox Lead Tracker", "Weekly Expense Check"];

describe("MarketplaceGrid", () => {
  it("lists the six platform packs in the marketplace's order", () => {
    expect(HOME_PACK_SLUGS).toEqual(["order-to-cash-exception-desk", "order-payment-reconciliation", "refund-triage", "support-inbox-triage", "inbox-lead-tracker", "weekly-expense-check"]);
    expect(DEMO_LISTINGS.map((listing) => listing.title)).toEqual(PACKS);
    expect(DEMO_LISTINGS.every((listing) => listing.kind === "pack")).toBe(true);
    expect(DEMO_LISTINGS[1].hovered).toBe(true);
  });

  it("shows six certified packs and filters them by function", async () => {
    const { container } = render(<MarketplaceGrid />);
    const listingList = within(screen.getByRole("list", { name: "Platform Workflow Packs" }));
    expect(listingList.getAllByRole("listitem")).toHaveLength(6);
    expect(listingList.getAllByText("Certified")).toHaveLength(6);
    expect(container.textContent).not.toMatch(/Trust Passport|hire/i);
    expect(screen.getByRole("heading", { name: "Order & Payment Reconciliation" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Sales operations" }));
    expect(listingList.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Inbox Lead Tracker" })).toBeInTheDocument();
    expect(screen.getByText("Lead Agent")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Customer operations" }));
    expect(listingList.getAllByRole("listitem")).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: "All packs" }));
    expect(listingList.getAllByRole("listitem")).toHaveLength(6);
    await userEvent.click(screen.getByRole("button", { name: /Order-to-Cash Exception Desk/ }));
    expect(screen.getByText("Order-to-Cash Triage Agent")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gmail" })).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });
});
