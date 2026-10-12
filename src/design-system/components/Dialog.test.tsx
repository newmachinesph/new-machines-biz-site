import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("opens from its trigger, is labelled, and closes on Escape", async () => {
    render(
      <Dialog trigger={<Button>Install</Button>} title="Approve permissions" description="Read-only access to one sheet.">
        <p>Scopes</p>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Install" }));
    const dialog = await screen.findByRole("dialog", { name: "Approve permissions" });
    expect(dialog).toHaveAccessibleDescription("Read-only access to one sheet.");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
