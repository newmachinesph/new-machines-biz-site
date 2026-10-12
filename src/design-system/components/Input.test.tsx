import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("links label, hint and error to the control", () => {
    render(<Input label="Organization" hint="Shown to reviewers" error="Required" />);
    const input = screen.getByLabelText("Organization");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const described = input.getAttribute("aria-describedby") ?? "";
    expect(screen.getByText("Shown to reviewers").id).toBeTruthy();
    expect(described).toContain(screen.getByText("Shown to reviewers").id);
    expect(described).toContain(screen.getByText("Required").id);
  });
});
