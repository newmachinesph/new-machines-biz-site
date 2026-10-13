import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders variants as buttons with accessible names", () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost" size="sm">Ghost</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Primary" })).toHaveClass("bg-ink");
    expect(screen.getByRole("button", { name: "Secondary" })).toHaveClass("border-ink");
    expect(screen.getByRole("button", { name: "Ghost" })).toHaveClass("h-8");
  });

  it("is disabled and busy while loading", () => {
    render(<Button loading>Save</Button>);
    const b = screen.getByRole("button", { name: /save/i });
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
  });

  it("renders as a link with asChild", () => {
    // A plain <a> is the point: asChild must style any element, not only next/link.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    render(<Button asChild><a href="/marketplace">Browse</a></Button>);
    expect(screen.getByRole("link", { name: "Browse" })).toHaveClass("bg-ink");
  });

  it("merges its own props with the child's when asChild", async () => {
    const onClick = vi.fn();
    render(
      <Button asChild className="extra" onClick={onClick}>
        <a href="/x" data-own="kept">Go</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("data-own", "kept");
    expect(link).toHaveClass("extra");
    expect(link).not.toHaveAttribute("type");
    link.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("marks a disabled asChild link as aria-disabled and unfocusable", () => {
    render(<Button asChild disabled><a href="/x">Go</a></Button>);
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
  });
});
