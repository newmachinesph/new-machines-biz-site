import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { SandboxRun } from "./SandboxRun";

describe("SandboxRun", () => {
  it("shows the quantity difference, and verifies the matching success case when selected", async () => {
    const { container } = render(<SandboxRun />);
    expect(screen.getByText("¥87 difference")).toBeInTheDocument();
    expect(screen.getByText("Needs human")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /warehouse receipt 030679.*redacted/ })).toHaveAttribute("src", expect.stringContaining("aster-030679.jpg"));
    const rows = () => screen.getAllByRole("row").slice(1).map((row) => [...row.children].map((cell) => cell.textContent));
    expect(rows()).toEqual([["Interfolded Paper Towel Virgin Pulp", "64", "63", "63"], ["Jumbo Roll Tissue Virgin Pulp", "11", "12", "12"]]);
    await userEvent.click(screen.getByRole("button", { name: /Success case/ }));
    expect(screen.getByText("Verified").closest("[data-status]")).toHaveClass("bg-ink");
    expect(screen.queryByText("¥87 difference")).toBeNull();
    expect(screen.getByRole("img", { name: /Kumo Racks sales invoice 014592.*redacted/ })).toHaveAttribute("src", expect.stringContaining("kumo-014592.jpg"));
    expect(rows()).toEqual([["Metal Rack", "4", "4", "4"]]);
    expect(screen.getByText("The numbers agree.")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });

  it("recommends review for the exception, with the diagnosed cause and the suggested correction", async () => {
    render(<SandboxRun />);
    expect(screen.getByText("Review · Medium risk")).toBeInTheDocument();
    expect(screen.getByText(/PO not revised after a quantity change at dispatch\. Suggested action: Revise the PO to 63 paper towels and 12 jumbo rolls, then approve ¥76,177/)).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Quantities on the purchase order, receiving report and invoice" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Success case/ }));
    expect(screen.getByText("Approve · Low risk")).toBeInTheDocument();
  });
});
