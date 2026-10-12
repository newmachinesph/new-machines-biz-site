import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  it("switches panels with arrow keys", async () => {
    render(
      <Tabs
        defaultValue="agents"
        items={[
          { value: "agents", label: "Agents", content: <p>Agent list</p> },
          { value: "packs", label: "Packs", content: <p>Pack list</p> },
        ]}
      />,
    );
    const first = screen.getByRole("tab", { name: "Agents" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Packs" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Pack list")).toBeVisible();
  });
});
