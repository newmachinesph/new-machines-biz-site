import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/design-system/components/Badge";
import { accentViolations } from "./accentViolations";
import { MockupStage } from "./MockupStage";
import { Avatar, Glyph, Toggle } from "./parts";

describe("MockupStage", () => {
  it("is a figure without a default watermark and with a bottom fade", () => {
    const { container } = render(<MockupStage className="h-64"><p>Window</p></MockupStage>);
    expect(screen.getByRole("figure")).toHaveClass("overflow-hidden", "bg-grey-50", "h-64");
    expect(container.querySelector("figcaption")).toBeNull();
    expect(container.querySelector("[data-fade]")).toHaveClass("from-paper");
  });

  it("fades to ink on the dark band", () => {
    const { container } = render(<MockupStage dark><p>Window</p></MockupStage>);
    expect(container.querySelector("[data-fade]")).toHaveClass("from-ink");
  });
});

describe("accentViolations", () => {
  it("accepts accent utilities only under a matching data-accent", () => {
    const { container } = render(
      <div>
        <Badge status="running" />
        <Badge status="waiting-for-human" />
        <Badge status="blocked" />
        <Avatar initials="MT" tone="human" />
        <Glyph tone="machine" />
        <Toggle label="Pause at cap" on />
      </div>,
    );
    expect(accentViolations(container)).toEqual([]);
  });

  it("reports a stray accent class", () => {
    const { container } = render(<p className="text-machine">oops</p>);
    expect(accentViolations(container)).toHaveLength(1);
  });
});
