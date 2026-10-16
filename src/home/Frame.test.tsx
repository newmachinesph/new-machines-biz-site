import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionCell, SplitCell } from "./Frame";
import { SectionHeader } from "./SectionHeader";

describe("Frame", () => {
  it("SectionCell is a labelled section with the boxed hairline column", () => {
    render(
      <SectionCell labelledBy="t">
        <SectionHeader id="t" eyebrow="Marketplace" lead="Hire agents," tail="or people." sub="All verified." />
      </SectionCell>,
    );
    const section = screen.getByRole("region", { name: "Hire agents, or people." });
    expect(section.firstElementChild).toHaveClass("max-w-frame", "border-x");
    expect(screen.getByText("Marketplace")).toHaveClass("font-mono");
    expect(screen.getByText("or people.")).toHaveClass("text-grey-500");
  });

  it("SectionHeader keeps its headline readable on a dark section", () => {
    render(<SectionHeader id="d" eyebrow="Trust" lead="Policy authorises." display dark />);
    expect(screen.getByRole("heading", { level: 2, name: "Policy authorises." })).toBeInTheDocument();
    expect(screen.getByText("Policy authorises.")).toHaveClass("text-paper");
  });

  it("SplitCell puts the text column on the requested side", () => {
    render(<SplitCell textSide="right" text={<p>Text</p>} visual={<p>Visual</p>} />);
    const textCol = screen.getByText("Text").parentElement as HTMLElement;
    expect(textCol).toHaveClass("lg:order-2");
  });
});
