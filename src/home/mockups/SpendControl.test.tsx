import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { SpendControl } from "./SpendControl";

describe("SpendControl", () => {
  it("shows the cap, labelled usage chart, five agents and three spending rules in yen", () => {
    const { container } = render(<SpendControl />);
    expect(screen.getByText("Spending cap")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Synthetic daily spend over fourteen sample days" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getAllByText("on")).toHaveLength(3);
    expect(screen.getByText("¥86,245")).toBeInTheDocument();
    expect(screen.getByText("¥93,995")).toBeInTheDocument();
    expect(screen.getByText("¥118")).toBeInTheDocument();
    expect(container.textContent).toContain("¥");
    expect(container.textContent).not.toContain("$");
    expect(accentViolations(container)).toEqual([]);
  });
});
