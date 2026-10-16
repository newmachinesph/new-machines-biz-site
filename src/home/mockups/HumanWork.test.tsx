import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { ApprovalLog, ReviewerTask, ScopedPermissions } from "./HumanWork";

describe("human work vignettes", () => {
  it("records the review decision and supports resetting the local demo", async () => {
    const { container } = render(<ReviewerTask />);
    expect(screen.getByText("Review 3 exceptions")).toBeInTheDocument();
    expect(screen.getByText(/Tokyo · JST/)).toBeInTheDocument();
    expect(screen.getByText("Two PO lines differ by ¥87 from Aster Supply’s receipt. The agent has paused settlement for your review.")).toBeInTheDocument();
    const rows = screen.getAllByRole("row").slice(1).map((row) => [...row.children].map((cell) => cell.textContent));
    expect(rows).toEqual([["Interfolded Paper Towel Virgin Pulp", "64", "63", "63"], ["Jumbo Roll Tissue Virgin Pulp", "11", "12", "12"], ["Amount", "¥76,264", "—", "¥76,177"]]);
    expect(screen.getByText("Claimed by you")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Approve as is" }));
    expect(screen.getByText("Approved as is")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Reset review" }));
    await userEvent.click(screen.getByRole("button", { name: "Send back" }));
    expect(screen.getByText("Sent back with corrections")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });
  it("ScopedPermissions lists three scopes under a timed hold, with no amount limit", () => {
    const { container } = render(<ScopedPermissions />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Hold: 30 min")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/up to ¥|Expires in/);
  });
  it("ApprovalLog keeps five legible, stable audit records", () => {
    const { container } = render(<ApprovalLog />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(container.querySelector('[class*="blur-"]')).toBeNull();
    expect(screen.getByText("Append-only. Kept with the work.")).toBeInTheDocument();
  });
});
