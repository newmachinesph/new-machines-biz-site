import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, STATUS_LABEL } from "./Badge";

describe("Badge", () => {
  it("renders a neutral badge", () => {
    render(<Badge>Demo</Badge>);
    expect(screen.getByText("Demo")).toHaveClass("bg-grey-100");
  });

  it.each(Object.keys(STATUS_LABEL) as (keyof typeof STATUS_LABEL)[])(
    "status %s shows an icon and a text label",
    (status) => {
      const { container } = render(<Badge status={status} />);
      expect(screen.getByText(STATUS_LABEL[status])).toBeInTheDocument();
      expect(container.querySelector("svg[aria-hidden='true']")).not.toBeNull();
    },
  );

  it("blocked uses the blocked colour and verified is solid ink", () => {
    const { rerender } = render(<Badge status="blocked" />);
    expect(screen.getByText(STATUS_LABEL.blocked).closest("span")).toHaveClass("text-blocked");
    rerender(<Badge status="verified" />);
    expect(screen.getByText(STATUS_LABEL.verified).closest("span")).toHaveClass("bg-ink");
  });
});
