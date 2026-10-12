import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HOME_COPY as C } from "./copy";
import { HomePage } from "./HomePage";
import { accentViolations } from "./mockups/accentViolations";

describe("HomePage", () => {
  it("renders the sections in order, in the JAPAC register, with disciplined colour", () => {
    const { container } = render(<HomePage />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.id);
    expect(headings).toEqual([
      "customers-title", "explorer-title", "hire-title", "sandbox-title",
      "trust-title", "human-title", "control-title", "integrations-title",
      "stories-title", "japac-title", "how-title", "faq-title", "close-title",
    ]);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/United States|\bUS\b|U\.S\./);
    expect(text).not.toMatch(/\d+%\s+(faster|more)|\d+x faster|trusted by/i);
    expect(screen.queryByText("Demo data")).toBeNull();
    expect(container.querySelectorAll('[data-accent="blocked"]')).toHaveLength(1);
    expect(accentViolations(container)).toEqual([]);
    expect(container.querySelectorAll("main > section")).toHaveLength(14);
    expect(screen.getByRole("heading", { name: C.japac.lead })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Fictional companies imagined for Japan and Asia-Pacific" }).querySelectorAll("li")).toHaveLength(16);
    expect(screen.getByText("Fictional companies, imagined for the work ahead.")).toBeInTheDocument();
    expect(screen.queryByText(/Illustrative customer roster/)).toBeNull();
  });
});
