import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Mark } from "./Mark";
import { Lockup } from "./Lockup";

describe("logo components", () => {
  it("Mark renders an accessible svg that follows currentColor", () => {
    const { container } = render(<Mark className="h-6" />);
    const svg = screen.getByRole("img", { name: "New Machines" });
    expect(svg).toHaveClass("h-6");
    expect(container.innerHTML).toContain("currentColor");
    expect(container.innerHTML).not.toMatch(/#111111|#0e0e10|#e6e6ea/i);
    expect(container.querySelector("rect[width='100%']")).toBeNull();
  });

  it("is decorative when given an empty title", () => {
    const { container } = render(<Mark title="" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("is built from flush polygons only, so repeated instances never collide", () => {
    const { container } = render(<><Mark /><Mark /><Lockup /></>);
    expect(container.querySelectorAll("[id], clipPath, line, defs")).toHaveLength(0);
    expect(container.querySelectorAll("svg > polygon").length).toBeGreaterThan(10);
  });
});
