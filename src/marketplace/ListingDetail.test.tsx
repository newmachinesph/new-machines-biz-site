import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { accentViolations } from "@/home/mockups/accentViolations";
import { ListingDetail } from "./ListingDetail";
import { LEAD_QUALIFIER_SAMPLE, QUALIFIER_CHECKS, QUALIFIER_RUBRIC } from "./leadQualifierSample";
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
  });

  it("shows the lead qualifier's sample run: evidence per criterion, intent apart from fit, every check, and the exclusions", () => {
    const { container } = render(<ListingDetail listing={findListing("lead-qualifier")!} />);
    const report = within(container.querySelector<HTMLElement>("[data-component=qualifierReport]")!);
    expect(report.getByText("Recommends only. Never contacts an account, sends email or changes the CRM.")).toBeInTheDocument();
    expect(toolNames(container)).not.toContain("Gmail");
    const accounts = container.querySelectorAll<HTMLDetailsElement>(".qualifier-account");
    expect(accounts).toHaveLength(3);
    expect([...accounts].map((a) => a.open)).toEqual([true, false, false]);
    const meridian = within(accounts[0]);
    expect(meridian.getByText("Review")).toHaveAttribute("data-status", "waiting-for-human");
    expect(meridian.getByText(/Enterprise tier/)).toBeInTheDocument();
    expect(meridian.getAllByRole("row")).toHaveLength(6);
    expect(meridian.getByText("Timing only. Not counted in the fit score.")).toBeInTheDocument();
    expect(within(accounts[1]).getByText("Ready")).not.toHaveAttribute("data-status");
    expect(within(accounts[2]).getAllByText("Could not check")).toHaveLength(1);
    expect(within(accounts[2]).getByText("Warn")).toHaveAttribute("data-accent", "human");
    expect(within(accounts[2]).getByText("No intent signals found.")).toBeInTheDocument();
    const excluded = within(report.getByRole("list", { name: "Excluded" })).getAllByRole("listitem");
    expect(excluded.map((li) => li.querySelector("strong")?.textContent)).toEqual(["Kanso Studio", "Toki Electric", "Sora Freight"]);
    expect(report.getByText("crm.search_accounts, crm.check_suppression, web.fetch")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });

  it("keeps the sample run consistent with its own rules", () => {
    expect(QUALIFIER_RUBRIC.reduce((sum, c) => sum + c.weight, 0)).toBe(100);
    for (const account of LEAD_QUALIFIER_SAMPLE.shortlist) {
      expect(account.criteria.map((c) => [c.criterion, c.max])).toEqual(QUALIFIER_RUBRIC.map((c) => [c.criterion, c.weight]));
      expect(account.criteria.reduce((sum, c) => sum + c.score, 0)).toBe(account.fit_score);
      for (const c of account.criteria) if (c.could_not_check) expect(c.score).toBe(0);
      expect(account.checks.map((c) => c.check)).toEqual([...QUALIFIER_CHECKS]);
      expect(account.checks.some((c) => c.status === "fail")).toBe(false);
      if (account.status === "review") expect(account.review_reason).not.toBe("");
      else expect(account.checks.every((c) => c.status === "pass")).toBe(true);
      expect(account.domain).toMatch(/\.example$/);
    }
  });

  it("shows the invoice matcher's sample run: verdict, seven checks, three-way match and a diagnosed exception", () => {
    const { container } = render(<ListingDetail listing={findListing("invoice-matcher")!} />);
    const report = within(container.querySelector<HTMLElement>("[data-component='matchReport']")!);
    expect(report.getByText("Run NM-2291")).toBeInTheDocument();
    expect(report.getByText("Medium risk")).toHaveAttribute("data-status", "waiting-for-human");
    expect(report.getByText("Review")).toBeInTheDocument();
    expect(report.getByText(/A person clicks Approve/)).toBeInTheDocument();
    expect(container.querySelectorAll(".match-checks li")).toHaveLength(7);
    expect(report.getAllByText("Pass")).toHaveLength(7);
    expect(report.getAllByText("Read from document")).toHaveLength(2);
    expect(report.getAllByText("Verified in database")).toHaveLength(5);
    const lines = within(report.getByRole("region", { name: /Three-way match|Invoice, purchase order and receiving report/ }));
    expect(lines.getByText("¥116,727")).toBeInTheDocument();
    expect(lines.getByText("¥115,527")).toBeInTheDocument();
    expect(lines.getByText("Exception")).toHaveAttribute("data-status", "waiting-for-human");
    expect(report.getByText("¥1,200")).toBeInTheDocument();
    const causes = within(report.getByRole("list", { name: "Likely causes, most likely first" })).getAllByRole("listitem");
    expect(causes[0]).toHaveTextContent("PO tax not recalculated after a line revision");
    expect(causes[0]).toHaveTextContent("High");
    expect(report.getByText(/Correct the PO tax to ¥116,727/)).toBeInTheDocument();
    expect(report.getByText("2026-10-11T09:14:02+09:00")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });

  it("shows the sample run only on the invoice matcher", () => {
    const { container } = render(<ListingDetail listing={findListing("lead-qualifier")!} />);
    expect(container.querySelector("[data-component='matchReport']")).toBeNull();
  });
});
