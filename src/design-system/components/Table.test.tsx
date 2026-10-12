import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table } from "./Table";

describe("Table", () => {
  it("renders semantic headers, aligns numbers right and IDs in mono", () => {
    render(
      <Table
        caption="Recent runs"
        columns={[
          { key: "id", header: "Run", mono: true },
          { key: "cost", header: "Cost", align: "right" },
        ]}
        rows={[{ id: "run_001", cost: "$1.20" }]}
      />,
    );
    expect(screen.getByRole("table", { name: "Recent runs" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Cost" })).toHaveClass("text-right");
    expect(screen.getByText("run_001")).toHaveClass("font-mono");
  });
});
