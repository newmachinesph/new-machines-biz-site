import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const searchParams = vi.hoisted(() => ({ current: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => searchParams.current }));

import { WorkExplorer } from "./WorkExplorer";

const chapterOf = (team: string) => document.getElementById(`workflow-${team}`) as HTMLElement;
const recordName = (cell: Element) => { const copy = cell.cloneNode(true) as Element; copy.querySelector(".workflow-record-reason")?.remove(); return copy.textContent; };
const rowsOf = (chapter: HTMLElement) => within(chapter).getAllByRole("row").slice(1).map((row) => [...row.querySelectorAll("td")].map((cell, i) => i === 0 ? recordName(cell) : cell.textContent));
const reasonsOf = (chapter: HTMLElement) => [...chapter.querySelectorAll("tbody tr")].map((row) => row.querySelector(".workflow-record-reason")?.textContent ?? null);
const visibleChapters = () => [...document.querySelectorAll<HTMLElement>(".workflow-chapter")].filter((chapter) => !chapter.hidden);

afterEach(() => { searchParams.current = new URLSearchParams(); vi.restoreAllMocks(); });

describe("WorkExplorer", () => {
  it("shows one chapter at a time and the team buttons switch it, scrolling the chapters column", async () => {
    const scroll = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
    render(<WorkExplorer />);
    expect(visibleChapters().map((chapter) => chapter.id)).toEqual(["workflow-finance"]);
    expect(chapterOf("finance")).toHaveAttribute("data-active", "true");
    expect(chapterOf("sales")).toHaveAttribute("data-active", "false");
    expect(chapterOf("sales").hidden).toBe(true);
    const sales = screen.getByRole("button", { name: "02 Sales" });
    expect(sales).toHaveAttribute("aria-pressed", "false");
    expect(sales).toHaveAttribute("aria-controls", "workflow-sales");
    await userEvent.click(sales);
    expect(visibleChapters().map((chapter) => chapter.id)).toEqual(["workflow-sales"]);
    expect(chapterOf("sales")).toHaveAttribute("data-active", "true");
    expect(chapterOf("finance").hidden).toBe(true);
    expect(sales).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "01 Finance" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("heading", { name: "More conversations. Less preparation." })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Close the books. Open up your time." })).toBeNull();
    // The column, not the chapter: it is rendered before React shows the new chapter, so the scroll lands every time.
    expect(scroll).toHaveBeenCalledWith({ block: "start", behavior: "instant" });
    expect(scroll.mock.instances.at(-1)).toBe(document.querySelector(".workflow-chapters"));
    expect(document.querySelector(".workflow-selector")).toHaveStyle({ "--tab-index": "1" });
    expect(document.querySelector(".workflow-selection")).toBeInTheDocument();
  });

  it("switches with the keyboard and resets a chapter's demo when its team is selected again", async () => {
    const user = userEvent.setup();
    render(<WorkExplorer />);
    await user.click(screen.getByRole("button", { name: "04 Support" }));
    const support = chapterOf("support");
    expect(support.hidden).toBe(false);
    await user.click(within(support).getByRole("button", { name: "Run demo" }));
    expect(within(support).getByRole("button", { name: "Running…" })).toBeDisabled();
    expect(within(support).getByText("Agent working on synthetic data…")).toBeInTheDocument();
    expect(within(support).getByText("Yamada-sama was charged ¥12,800 twice for the October invoice. Approve the refund so the reply can go out?")).toBeInTheDocument();
    expect(within(support).getByText("The agent drafts the replies. A. Sato decides what gets sent.")).toBeInTheDocument();
    expect(within(support).getByText("Run six checks")).toBeInTheDocument();
    // Tab order only reaches the visible chapter: from the sidebar link, the next stop is inside the Support chapter.
    screen.getByRole("link", { name: "Find your next agent" }).focus();
    await user.tab();
    expect(document.activeElement?.closest(".workflow-chapter")).toBe(support);
    // Keyboard selection of another team, then back again: the Support demo starts over.
    screen.getByRole("button", { name: "03 Operations" }).focus();
    await user.keyboard("{Enter}");
    expect(chapterOf("operations").hidden).toBe(false);
    expect(support.hidden).toBe(true);
    expect(document.querySelector(".workflow-selector")).toHaveAttribute("data-keyboard", "true");
    screen.getByRole("button", { name: "04 Support" }).focus();
    await user.keyboard(" ");
    expect(chapterOf("support").hidden).toBe(false);
    expect(within(chapterOf("support")).getByRole("button", { name: "Run demo" })).toBeEnabled();
  });

  it("selects the team named by ?workflow= in the URL", () => {
    searchParams.current = new URLSearchParams("workflow=operations");
    render(<WorkExplorer />);
    expect(visibleChapters().map((chapter) => chapter.id)).toEqual(["workflow-operations"]);
    expect(screen.getByRole("button", { name: "03 Operations" })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the lead qualifier's shortlist with an exclusion and the review it needs", async () => {
    const user = userEvent.setup();
    render(<WorkExplorer />);
    await user.click(screen.getByRole("button", { name: "02 Sales" }));
    const sales = within(chapterOf("sales"));
    expect(sales.getByText("Excluded")).toHaveAttribute("data-excluded", "true");
    expect(sales.getByText("Review")).toHaveAttribute("data-review", "true");
    expect(reasonsOf(chapterOf("sales"))).toEqual([null, "Enterprise tier, about 1,400 employees", "Existing customer with an owner. Routed to them, not a new lead."]);
    expect(sales.getByText("Meridian scored 88 but is enterprise tier, with about 1,400 employees. Is it worth the enterprise sales cycle?")).toBeInTheDocument();
    expect(sales.getByText("The agent researches and scores. S. Lim decides who gets contacted.")).toBeInTheDocument();
    expect(sales.queryByText(/outreach brief/i)).toBeNull();
    expect(sales.getByText("Flagged by the agent")).toBeInTheDocument();
    await user.click(sales.getByRole("button", { name: "Run demo" }));
    expect(await sales.findByRole("button", { name: "Awaiting S. Lim" }, { timeout: 2000 })).toBeDisabled();
    // The visitor does not approve: S. Lim's typed decision is submitted and recorded.
    expect(await sales.findByText("Submitted by S. Lim · Decision recorded", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(sales.getByText("S. Lim submitted: Worth it. Strong fit across Tokyo, Singapore and Seoul. Approve Meridian and route it to the enterprise team.")).toBeInTheDocument();
    expect(rowsOf(chapterOf("sales"))).toEqual([["Aster Labs", "92", "Sent to owner"], ["Meridian", "88", "Approved"], ["Kanso Studio", "—", "Excluded"]]);
  });

  it("shows the vendor register as ready, review and blocked, and records the reviewer's call on each", async () => {
    searchParams.current = new URLSearchParams("workflow=operations");
    const user = userEvent.setup();
    render(<WorkExplorer />);
    const operations = chapterOf("operations");
    const states = () => rowsOf(operations);
    expect(states()).toEqual([["Aster Supply", "4 / 4", "Ready"], ["Meridian", "3 / 4", "Review"], ["Kanso Studio", "4 / 4", "Blocked"]]);
    expect(reasonsOf(operations)).toEqual([null, "Tax certificate missing. Request drafted.", "Bank account name differs from the legal entity"]);
    expect(within(operations).getByText("Kanso Studio’s bank account is in a different name from its legal entity. Hold it until a callback confirms the account?")).toBeInTheDocument();
    await user.click(within(operations).getByRole("button", { name: "Run demo" }));
    await within(operations).findByText("Submitted by J. Park · Decision recorded", {}, { timeout: 4000 });
    expect(states()).toEqual([["Aster Supply", "4 / 4", "Onboarded"], ["Meridian", "3 / 4", "Request sent"], ["Kanso Studio", "4 / 4", "On hold"]]);
  });

  it("shows the invoice matcher's approve and review recommendations on the real batch, and records the reviewer's call", async () => {
    const user = userEvent.setup();
    render(<WorkExplorer />);
    const finance = chapterOf("finance");
    const states = () => rowsOf(finance);
    const highlighted = () => [...finance.querySelectorAll(".workflow-record-state")].map((state) => state.getAttribute("data-review"));
    expect(states()).toEqual([["014592", "¥28,000", "Approve"], ["028222", "¥29,505", "Approve"], ["030679", "¥76,177", "Review"]]);
    expect(highlighted()).toEqual(["false", "false", "true"]);
    expect(reasonsOf(finance)).toEqual([null, null, "Two PO lines differ from the receipt"]);
    expect(within(finance).getByText("Receipt 030679: two PO quantities differ from what was received. Revise the PO and approve the invoice?")).toBeInTheDocument();
    expect(within(finance).getByText("Match PO, receipt and invoice")).toBeInTheDocument();
    expect(within(finance).getByText("Interactive demo · Real invoices, names and dates changed · No real actions or charges")).toBeInTheDocument();
    expect(within(finance).getByRole("button", { name: "Aster Supply 030679, show the source document" })).toHaveAttribute("data-component", "financeInvoicePhoto");
    await user.click(within(finance).getByRole("button", { name: "Run demo" }));
    await within(finance).findByText("Submitted by M. Tanaka · Decision recorded", {}, { timeout: 4000 });
    expect(states()).toEqual([["014592", "¥28,000", "Approved"], ["028222", "¥29,505", "Approved"], ["030679", "¥76,177", "Approved"]]);
  });
});
