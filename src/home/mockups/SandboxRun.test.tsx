import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { SandboxRun } from "./SandboxRun";

describe("SandboxRun", () => {
  it("shows the tax difference, and verifies the matching success case when selected", async () => {
    const { container } = render(<SandboxRun />);
    expect(screen.getByText("¥1,200 difference")).toBeInTheDocument();
    expect(screen.getByText("Needs human")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Synthetic supplier invoice" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Success case/ }));
    expect(screen.getByText("Verified").closest("[data-status]")).toHaveClass("bg-ink");
    expect(screen.queryByText("¥1,200 difference")).toBeNull();
    expect(screen.getByText("The numbers agree.")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });
});
