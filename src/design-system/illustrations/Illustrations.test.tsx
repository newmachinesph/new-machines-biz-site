import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HatchLine } from "./HatchLine";

describe("illustrations", () => {
  it("HatchLine is decorative, hatched before `active` and solid from it on", () => {
    const { container } = render(<HatchLine steps={5} active={3} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    const segments = [...container.querySelectorAll("[data-segment]")].map((r) => r.getAttribute("data-segment"));
    expect(segments).toEqual(["hatch", "hatch", "hatch", "solid", "solid"]);
  });

  it("HatchLine can fill from the start and stand vertically", () => {
    const { container } = render(<HatchLine steps={5} active={2} orientation="vertical" fill="before" />);
    const segments = [...container.querySelectorAll("[data-segment]")].map((r) => r.getAttribute("data-segment"));
    expect(segments).toEqual(["solid", "solid", "hatch", "hatch", "hatch"]);
    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 6 100");
  });
});
