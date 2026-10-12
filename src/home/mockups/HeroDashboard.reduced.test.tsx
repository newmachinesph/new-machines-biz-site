import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { accentViolations } from "./accentViolations";
import { CYCLE_MS, HeroDashboard } from "./HeroDashboard";

describe("HeroDashboard under reduced motion", () => {
  afterEach(() => vi.useRealTimers());

  it("stays static and keeps accents on chips only", () => {
    vi.useFakeTimers();
    const { container } = render(<HeroDashboard />);
    act(() => vi.advanceTimersByTime(CYCLE_MS * 2));
    expect(within(screen.getAllByRole("row")[1]).getByText("Running")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });
});
