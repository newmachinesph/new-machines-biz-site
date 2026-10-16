import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { SpendControl } from "./SpendControl";

describe("SpendControl", () => {
  it("shows the monthly cap, labelled usage chart, five packs and three spending rules in US dollars", async () => {
    const { container } = render(<SpendControl />);
    expect(screen.getByText("Monthly cap")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Synthetic daily spend over fourteen sample days" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getAllByText("on")).toHaveLength(3);
    for (const rule of ["Stop at cap", "Approve every write", "Verify before charge"]) expect(screen.getByText(rule)).toBeInTheDocument();
    expect(screen.getByText("$106.70")).toBeInTheDocument();
    expect(screen.getByText("$73.54")).toBeInTheDocument();
    expect(screen.getByText("$0.72")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/¥|over ¥|threshold/);
    await userEvent.click(screen.getByRole("button", { name: "Preview cap reached" }));
    expect(screen.getByText("Run stopped")).toBeInTheDocument();
    expect(container.querySelector(".cap-preview-event")).toHaveTextContent("$180.24 used + $129.76 more = $310.00. The run stops before it passes your $300.00 cap");
    expect(accentViolations(container)).toEqual([]);
  });
});
