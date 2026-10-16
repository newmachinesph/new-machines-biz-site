import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const searchParams = vi.hoisted(() => ({ current: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => searchParams.current }));

import { WorkExplorer } from "./WorkExplorer";

const chapterOf = (team: string) => document.getElementById(`workflow-${team}`) as HTMLElement;
const recordName = (cell: Element) => { const copy = cell.cloneNode(true) as Element; copy.querySelector(".workflow-record-reason")?.remove(); return copy.textContent; };
const rowsOf = (chapter: HTMLElement) => [...chapter.querySelectorAll(".workflow-record-table tbody tr")].map((row) => [...row.querySelectorAll("td")].map((cell, i) => i === 0 ? recordName(cell) : cell.textContent));
const reasonsOf = (chapter: HTMLElement) => [...chapter.querySelectorAll(".workflow-record-table tbody tr")].map((row) => row.querySelector(".workflow-record-reason")?.textContent ?? null);
const visibleChapters = () => [...document.querySelectorAll<HTMLElement>(".workflow-chapter")].filter((chapter) => !chapter.hidden);
const calls = (chapter: HTMLElement) => [...chapter.querySelectorAll(".approval-calls li")].map((item) => item.textContent);

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
    expect(screen.queryByRole("heading", { name: "Every order, followed to cash." })).toBeNull();
    // The column, not the chapter: it is rendered before React shows the new chapter, so the scroll lands every time.
    expect(scroll).toHaveBeenCalledWith({ block: "start", behavior: "instant" });
    expect(scroll.mock.instances.at(-1)).toBe(document.querySelector(".workflow-chapters"));
    expect(document.querySelector(".workflow-selector")).toHaveStyle({ "--tab-index": "1" });
    expect(document.querySelector(".workflow-selection")).toBeInTheDocument();
  });

  it("names real packs and agents, and no named or assigned reviewer", () => {
    const { container } = render(<WorkExplorer />);
    for (const [team, pack] of [["finance", "Order-to-Cash Exception Desk"], ["sales", "Inbox Lead Tracker"], ["operations", "Weekly Expense Check"], ["support", "Support Inbox Triage"]]) {
      expect(chapterOf(team).querySelector(".workflow-canvas-toolbar")).toHaveTextContent(pack);
      expect(chapterOf(team).querySelector(".workflow-description .micro-label")).toHaveTextContent(pack);
    }
    expect(container.textContent).not.toMatch(/Assigned reviewer|M\. Tanaka|S\. Lim|J\. Park|A\. Sato|Invoice matcher|Lead qualifier|Vendor intake|Support reply drafter|\bhire/i);
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
    expect(within(support).getByText("A customer was charged ₱1,280.00 twice for the October invoice and asks for a refund. The draft confirms the double charge. Is it right to send?")).toBeInTheDocument();
    expect(within(support).getByText("The agent sorts and drafts. A reviewer checks complaints and refund requests; nothing is sent from here.")).toBeInTheDocument();
    expect(within(support).getByText("Send complaints and refunds to a person")).toBeInTheDocument();
    expect(within(support).getByText("From your team or the network")).toBeInTheDocument();
    // Tab order only reaches the visible chapter: from the sidebar link, the next stop is inside the Support chapter.
    screen.getByRole("link", { name: "Find your next pack" }).focus();
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

  it("adds the inbox's real enquiries to the leads sheet only after your approval", async () => {
    const user = userEvent.setup();
    render(<WorkExplorer />);
    await user.click(screen.getByRole("button", { name: "02 Sales" }));
    const chapter = chapterOf("sales");
    const sales = within(chapter);
    expect(sales.getByText("Not a lead")).toHaveAttribute("data-excluded", "true");
    expect(rowsOf(chapter)).toEqual([["Aster Labs · bulk order", "This month", "Add row"], ["Meridian · price list", "Next week", "Add row"], ["Newsletter signup", "—", "Not a lead"]]);
    expect(reasonsOf(chapter)).toEqual([null, null, "Sorted as not an enquiry"]);
    expect(calls(chapter)).toEqual(["Google SheetsAppend a rowCalls × 2"]);
    expect(sales.getByText("What you are approving")).toBeInTheDocument();
    await user.click(sales.getByRole("button", { name: "Run demo" }));
    expect(await sales.findByRole("button", { name: "Awaiting your approval" }, { timeout: 2000 })).toBeDisabled();
    expect(await sales.findByText("Approved by you · Every write counted", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(sales.getByText("Approved by you: Add rows to your leads sheet")).toBeInTheDocument();
    expect(rowsOf(chapter)).toEqual([["Aster Labs · bulk order", "This month", "Added"], ["Meridian · price list", "Next week", "Added"], ["Newsletter signup", "—", "Not a lead"]]);
  });

  it("shows the expense flags for review, and records the reviewer's verdict on each", async () => {
    searchParams.current = new URLSearchParams("workflow=operations");
    const user = userEvent.setup();
    render(<WorkExplorer />);
    const operations = chapterOf("operations");
    expect(rowsOf(operations)).toEqual([["Taxi · client visit", "₱486.00", "Ready"], ["Team lunch", "₱6,240.00", "Review"], ["Design software", "₱2,950.00", "Review"]]);
    expect(reasonsOf(operations)).toEqual([null, "₱1,240.00 over the meal limit", "Possible duplicate of a 7 October charge"]);
    await user.click(within(operations).getByRole("button", { name: "Run demo" }));
    await within(operations).findByText("Verdict recorded with the work", {}, { timeout: 6000 });
    expect(rowsOf(operations)).toEqual([["Taxi · client visit", "₱486.00", "Categorised"], ["Team lunch", "₱6,240.00", "Accepted"], ["Design software", "₱2,950.00", "Duplicate"]]);
    expect(operations.querySelector(".workflow-result")).toHaveTextContent("Human approved");
  });

  it("follows every order across four systems, counts every write in one approval and lists what it holds back", async () => {
    const user = userEvent.setup();
    render(<WorkExplorer />);
    const finance = chapterOf("finance");
    const desk = within(finance);
    expect([...finance.querySelectorAll(".task-systems > span")].map((system) => system.textContent)).toEqual(["Store", "Ledger", "Warehouse", "Sales app"]);
    expect(desk.getByText("Kalumpang Demo Supply Co.")).toBeInTheDocument();
    expect(rowsOf(finance)).toEqual([
      ["SO-2041 · Bakawan Bakeshop", "₱48,600.00", "Reminder"],
      ["SO-2044 · Dalisay Hardware", "₱31,250.00", "Reminder"],
      ["SO-2047 · Liwayway Catering", "₱27,900.00", "Warehouse note"],
      ["SO-2052 · Malaya Grocery", "₱12,350.00", "Finance note"],
      ["SO-2058 · Tala Eatery", "₱9,480.00", "Finance note"],
      ["SO-2063 · Sampaguita Café", "₱3,200.00", "Listed only"],
    ]);
    expect(desk.getByText("Listed only")).toHaveAttribute("data-excluded", "true");
    expect(calls(finance)).toEqual(["GmailSave a reminder draftCalls × 2", "LedgerPost a finance note · sandbox onlyCalls × 2", "WarehousePost a warehouse note · sandbox onlyCalls × 1"]);
    expect(desk.getByText("Also covered by this approval")).toBeInTheDocument();
    expect(desk.getByText("Save reminder drafts and post notes")).toBeInTheDocument();
    expect(desk.getByText("None until you approve")).toBeInTheDocument();
    expect(desk.getByText("Interactive demo · Illustrative demo data, Kalumpang Demo Supply Co. · No real actions or charges")).toBeInTheDocument();
    await user.click(desk.getByRole("button", { name: "Run demo" }));
    await desk.findByText("Approved by you · Every write counted", {}, { timeout: 4000 });
    expect(rowsOf(finance).map((row) => row[2])).toEqual(["Drafted", "Drafted", "Noted", "Noted", "Noted", "Listed only"]);
    expect(desk.getByText("5, all after your approval")).toBeInTheDocument();
    expect(desk.getByText("Work receipt · Verified")).toBeInTheDocument();
    expect(finance.querySelector(".workflow-result")).toHaveTextContent("Verified · Human approved · 5 writes counted · Work receipt ready");
  });
});
