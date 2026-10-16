import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { SandboxRun } from "./SandboxRun";

describe("SandboxRun", () => {
  it("shows the one exception run on the redacted receipt, labelled illustrative and in yen", () => {
    const { container } = render(<SandboxRun />);
    expect(screen.getByText("¥87 difference")).toBeInTheDocument();
    expect(screen.getByText("Needs human")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /warehouse receipt 030679.*redacted/ })).toHaveAttribute("src", expect.stringContaining("aster-030679.jpg"));
    const rows = screen.getAllByRole("row").slice(1).map((row) => [...row.children].map((cell) => cell.textContent));
    expect(rows).toEqual([["Interfolded Paper Towel Virgin Pulp", "64", "63", "63"], ["Jumbo Roll Tissue Virgin Pulp", "11", "12", "12"]]);
    expect(screen.queryByRole("button", { name: /Success case|Exception case/ })).toBeNull();
    expect(screen.getAllByText(/Illustrative preview/)).toHaveLength(1);
    expect(screen.getByText("Illustrative preview · JPY")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });

  it("recommends review for the exception, with the diagnosed cause and the suggested correction", () => {
    render(<SandboxRun />);
    expect(screen.getByText("Review · Medium risk")).toBeInTheDocument();
    expect(screen.getByText(/PO not revised after a quantity change at dispatch\. Suggested action: Revise the PO to 63 paper towels and 12 jumbo rolls, then approve ¥76,177/)).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Quantities on the purchase order, receiving report and invoice" })).toBeInTheDocument();
  });
});
