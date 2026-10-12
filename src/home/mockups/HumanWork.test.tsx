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
    await userEvent.click(screen.getByRole("button", { name: "Approve review" }));
    expect(screen.getByText("Review approved")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Reset review" }));
    await userEvent.click(screen.getByRole("button", { name: "Reject review" }));
    expect(screen.getByText("Review rejected")).toBeInTheDocument();
    expect(accentViolations(container)).toEqual([]);
  });
  it("ScopedPermissions lists three scopes", () => {
    render(<ScopedPermissions />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
  it("ApprovalLog keeps five legible, stable audit records", () => {
    const { container } = render(<ApprovalLog />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(container.querySelector('[class*="blur-"]')).toBeNull();
    expect(screen.getByText("Append-only. Kept with the work.")).toBeInTheDocument();
  });
});
