import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { accentViolations } from "./accentViolations";
import { CYCLE_MS, HeroDashboard } from "./HeroDashboard";

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => false,
}));

describe("HeroDashboard", () => {
  afterEach(() => vi.useRealTimers());

  it("shows sidebar, counters, runs table and evidence, with accents only on chips", () => {
    const { container } = render(<HeroDashboard />);
    expect(screen.getByText("Marketplace")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(7);
    expect(screen.getByText("Invoices matched")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });

  it("cycles the first row's status every 2.4s and the counters follow", () => {
    vi.useFakeTimers();
    render(<HeroDashboard />);
    const table = within(screen.getByRole("table"));
    const counter = (label: string) =>
      screen.getAllByText(label).find((el) => !el.closest("table"))?.parentElement?.querySelector("p")?.textContent;
    const firstRow = () => within(screen.getAllByRole("row")[1]);

    expect(table.getAllByText("Running")).toHaveLength(2);
    expect(counter("Running")).toBe("2");
    expect(counter("Waiting for human")).toBe("2");

    act(() => vi.advanceTimersByTime(CYCLE_MS));
    expect(firstRow().getByText("Waiting for human")).toBeInTheDocument();
    expect(table.getAllByText("Waiting for human")).toHaveLength(3);
    expect(counter("Running")).toBe("1");
    expect(counter("Waiting for human")).toBe("3");

    act(() => vi.advanceTimersByTime(CYCLE_MS));
    expect(firstRow().getByText("Verified")).toBeInTheDocument();
    expect(table.getAllByText("Verified")).toHaveLength(3);
    expect(counter("Verified")).toBe("3");

    act(() => vi.advanceTimersByTime(CYCLE_MS));
    expect(firstRow().getByText("Running")).toBeInTheDocument();
    expect(counter("Running")).toBe("2");
  });
});
