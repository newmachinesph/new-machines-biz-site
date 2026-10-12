import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { accentViolations } from "./accentViolations";
import { MarketplaceGrid } from "./MarketplaceGrid";

describe("MarketplaceGrid", () => {
  it("shows six selectable specialists and filters the detail view with the directory", async () => {
    const { container } = render(<MarketplaceGrid />);
    const listingList = within(screen.getByRole("list", { name: "Example marketplace listings" }));
    expect(listingList.getAllByRole("listitem")).toHaveLength(6);
    expect(listingList.getAllByText("Trust Passport")).toHaveLength(4);
    expect(listingList.getAllByText("Not yet certified")).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: "Human work" }));
    expect(listingList.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Bilingual contract review" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "All talent" }));
    expect(listingList.getAllByRole("listitem")).toHaveLength(6);
    expect(accentViolations(container)).toEqual([]);
  });
});
