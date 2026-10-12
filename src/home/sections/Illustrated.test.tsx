import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HOME_COPY } from "../copy";
import { Control } from "./Control";
import { HowItWorks } from "./HowItWorks";
import { HumanWork } from "./HumanWork";
import { Hire } from "./Hire";
import { Sandbox } from "./Sandbox";
import { Trust } from "./Trust";

describe("illustrated sections", () => {
  it("Hire opens with eyebrow + two-tone H2 and shows the marketplace on a demo stage", () => {
    render(<Hire />);
    expect(screen.getByText(HOME_COPY.hire.eyebrow)).toHaveClass("font-mono");
    expect(screen.getByRole("region", { name: `${HOME_COPY.hire.lead} ${HOME_COPY.hire.tail}` })).toBeInTheDocument();
    expect(screen.getAllByText("Trust Passport")).toHaveLength(4);
    expect(screen.queryByText("Demo data")).toBeNull();
  });

  it("Sandbox puts the text on the right", () => {
    render(<Sandbox />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.closest(".lg\\:order-2")).not.toBeNull();
    expect(screen.getByText("Exception case")).toBeInTheDocument();
  });

  it("Trust is the dark band with the display headline and one Blocked example", () => {
    const { container } = render(<Trust />);
    const region = screen.getByRole("region", { name: HOME_COPY.trust.lead });
    expect(region).toHaveClass("bg-ink");
    expect(container.querySelectorAll('[data-accent="blocked"]')).toHaveLength(1);
  });

  it("HumanWork shows the three vignettes", () => {
    render(<HumanWork />);
    expect(screen.getByText("Review 3 exceptions")).toBeInTheDocument();
    expect(screen.getByText("Scoped permissions")).toBeInTheDocument();
    expect(screen.getByText("Approval log")).toBeInTheDocument();
  });

  it("Control explains the spending rules and shows the spend panel", () => {
    render(<Control />);
    expect(screen.getByRole("region", { name: `${HOME_COPY.control.lead} ${HOME_COPY.control.tail}` })).toBeInTheDocument();
    expect(screen.getByText("Spending cap")).toBeInTheDocument();
  });

  it("HowItWorks links each stage to the relevant product section", () => {
    render(<HowItWorks />);
    expect(screen.getByRole("list").querySelectorAll("li")).toHaveLength(5);
    expect(screen.getByText("01")).toHaveClass("font-mono", "font-light");
    expect(screen.getByRole("link", { name: /Try in sandbox/ })).toHaveAttribute("href", "#sandbox");
    expect(screen.getByRole("link", { name: /Accept with evidence/ })).toHaveAttribute("href", "#trust");
  });
});
