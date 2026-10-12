import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { DecisionRail, RAIL_NODES } from "./DecisionRail";

describe("DecisionRail", () => {
  it("preserves five receipt checks, the blocked state and the distinct lifecycle statuses", () => {
    const { container } = render(<DecisionRail />);
    expect(RAIL_NODES).toHaveLength(5);
    expect(container.querySelectorAll("[data-lit]")).toHaveLength(5);
    expect(screen.getByText("3 evidence files")).toBeInTheDocument();
    expect(container.querySelectorAll('[data-accent="blocked"]')).toHaveLength(1);
    expect(screen.getByText("Blocked never becomes approved.")).toBeInTheDocument();
    for (const s of ["Executed", "Verified", "Accepted", "Settlement eligible"]) expect(screen.getAllByText(s).length).toBeGreaterThan(0);
    expect(accentViolations(container)).toEqual([]);
  });
});
