import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { accentViolations } from "@/home/mockups/accentViolations";
import { ListingDetail } from "./ListingDetail";
import { findListing } from "./listings";

const toolNames = (container: HTMLElement) => within(container.querySelector<HTMLElement>(".detail-apps")!).getAllByRole("img").map((img) => img.getAttribute("alt"));

describe("ListingDetail", () => {
  it("renders a certified pack with its scope, steps, evidence, tools and related listings", () => {
    const listing = findListing("month-end-close-pack")!;
    const { container } = render(<ListingDetail listing={listing} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Month-end close pack");
    expect(screen.getByRole("link", { name: "All listings" })).toHaveAttribute("href", "/marketplace");
    expect(screen.getByRole("link", { name: "Try this pack" })).toHaveAttribute("href", "/#work-explorer");
    expect(screen.getByRole("link", { name: "See it in the sandbox" })).toHaveAttribute("href", "/#sandbox");
    expect(screen.getByText("Trust Passport")).toHaveAttribute("data-status", "verified");
    expect(screen.getByText("¥48,000 / month")).toBeInTheDocument();
    const reviewer = within(container.querySelector<HTMLElement>(".listing-reviewer")!);
    expect(reviewer.getByText("Assigned reviewer")).toBeInTheDocument();
    expect(reviewer.getByText("M. Tanaka")).toBeInTheDocument();
    expect(reviewer.getByText("Finance reviewer · Tokyo")).toBeInTheDocument();
    expect(container.querySelector(".listing-reviewer .portrait-human img")).not.toBeNull();
    for (const item of listing.scope) expect(screen.getByText(item)).toBeInTheDocument();
    expect(toolNames(container)).toEqual(listing.tools.map((tool) => tool.name));
    expect(container.querySelectorAll(".work-guide li")).toHaveLength(5);
    expect(container.querySelectorAll(".work-guide li .guide-step")).toHaveLength(5);
    expect(screen.getByText("01")).toHaveClass("font-mono", "font-light");
    expect(screen.getByText("Read inputs").nextElementSibling).toHaveTextContent("The specialist reads only the files and records in its scope.");
    expect(screen.getByRole("table", { name: "Sample approval log · synthetic data" })).toBeInTheDocument();
    expect(screen.getByText("Synthetic data · No real actions or charges")).toBeInTheDocument();
    const related = within(screen.getByRole("list", { name: "Related listings" })).getAllByRole("link");
    expect(related).toHaveLength(3);
    for (const link of related) expect(link).not.toHaveAttribute("href", `/marketplace/${listing.slug}`);
    expect(related[0]).toHaveAttribute("href", "/marketplace/quarterly-tax-pack");
    expect(within(screen.getByRole("list", { name: "Related listings" })).getAllByRole("heading", { level: 3 })).toHaveLength(3);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/United States|\bUS\b|U\.S\./);
    expect(accentViolations(container)).toEqual([]);
  });

  it("renders an uncertified human listing with an initials avatar for a reviewer without a photograph", () => {
    const listing = findListing("payroll-exception-review")!;
    const { container } = render(<ListingDetail listing={listing} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Payroll exception review");
    expect(screen.getByRole("link", { name: "Request this reviewer" })).toHaveAttribute("href", "/#work-explorer");
    expect(screen.getByText("Not yet certified")).not.toHaveAttribute("data-status");
    expect(screen.queryByText("Trust Passport")).toBeNull();
    const reviewer = within(container.querySelector<HTMLElement>(".listing-reviewer")!);
    expect(reviewer.getByText("J. Park")).toBeInTheDocument();
    expect(reviewer.getByText("Operations reviewer · Seoul")).toBeInTheDocument();
    expect(reviewer.getByText("JP")).toHaveClass("review-avatar");
    expect(container.querySelector(".listing-reviewer img")).toBeNull();
    const related = within(screen.getByRole("list", { name: "Related listings" })).getAllByRole("link");
    expect(related.map((link) => link.getAttribute("href"))).toEqual(["/marketplace/bilingual-contract-review", "/marketplace/bilingual-support-review", "/marketplace/invoice-matcher"]);
    expect(accentViolations(container)).toEqual([]);
  });

  it("omits the reviewer line for an agent and labels the CTA for it", () => {
    const { container } = render(<ListingDetail listing={findListing("invoice-matcher")!} />);
    expect(container.querySelector(".listing-reviewer")).toBeNull();
    expect(screen.queryByText("Assigned reviewer")).toBeNull();
    expect(screen.getByRole("link", { name: "Try this agent" })).toBeInTheDocument();
    expect(screen.getByText("Trust Passport")).toBeInTheDocument();
    expect(toolNames(container)).toEqual(["Google Drive", "Google Sheets", "freee"]);
    expect(container.querySelector('[data-component="listingDraftReview"]')).toBeNull();
  });

  it("shows the support reply drafter's reviewer view: routing, the draft, its facts and six checks", () => {
    const { container } = render(<ListingDetail listing={findListing("support-reply-drafter")!} />);
    const routing = within(container.querySelector<HTMLElement>('[data-component="draftRouting"]')!);
    expect(routing.getByText("Ready")).toHaveAttribute("data-status", "verified");
    expect(routing.getByText("Review")).toHaveAttribute("data-status", "waiting-for-human");
    expect(routing.getByText("Blocked")).toHaveAttribute("data-status", "blocked");
    const card = container.querySelector<HTMLElement>('[data-component="listingDraftReview"]')!;
    const draft = within(card);
    expect(card.querySelector(".draft-card-head [data-status]")).toHaveTextContent("Review");
    expect(card.querySelector('.draft-reply[lang="ja"]')).toHaveTextContent("返金");
    expect(card.querySelector('.draft-reply[lang="en"]')).toHaveTextContent("refund of the duplicate ¥12,800");
    expect(draft.getByRole("table", { name: "Facts used in the draft and their source records" })).toBeInTheDocument();
    expect(draft.getByText("payments/pay_7Q21, pay_7Q22")).toBeInTheDocument();
    const checks = within(draft.getByRole("list", { name: "Checks" })).getAllByRole("listitem");
    expect(checks.map((item) => item.querySelector("strong")?.textContent)).toEqual(["Identity", "Policy", "Factual accuracy", "Tone", "Privacy", "Escalation"]);
    expect(checks[1].querySelector("[data-status]")).toHaveTextContent("Warn");
    expect(draft.getByText("Approve the ¥12,800 refund in the billing system")).toBeInTheDocument();
    expect(draft.getByText("Needs approval")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });
});
