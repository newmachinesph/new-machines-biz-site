import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const searchParams = vi.hoisted(() => ({ current: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => searchParams.current }));

import { WorkExplorer } from "./WorkExplorer";

const chapterOf = (team: string) => document.getElementById(`workflow-${team}`) as HTMLElement;
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
    expect(within(support).getByText("Approve a refund reply for a double charge")).toBeInTheDocument();
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
    expect(sales.getByText("Enterprise tier: confirm fit before outreach")).toBeInTheDocument();
    expect(sales.queryByText(/outreach brief/i)).toBeNull();
  });

  it("shows the vendor register as ready, review and blocked, and records the reviewer's call on each", async () => {
    searchParams.current = new URLSearchParams("workflow=operations");
    const user = userEvent.setup();
    render(<WorkExplorer />);
    const operations = chapterOf("operations");
    const states = () => within(operations).getAllByRole("row").slice(1).map((row) => [...row.querySelectorAll("td")].map((cell) => cell.textContent));
    expect(states()).toEqual([["Aster Supply", "4 / 4", "Ready"], ["Meridian", "3 / 4", "Review"], ["Kanso Studio", "4 / 4", "Blocked"]]);
    expect(within(operations).getByText("Hold a supplier whose bank account name differs from its legal entity")).toBeInTheDocument();
    await user.click(within(operations).getByRole("button", { name: "Run demo" }));
    await user.click(await within(operations).findByRole("button", { name: "Approve demo outcome" }, { timeout: 2000 }));
    expect(states()).toEqual([["Aster Supply", "4 / 4", "Ready"], ["Meridian", "3 / 4", "Request sent"], ["Kanso Studio", "4 / 4", "On hold"]]);
  });
});
