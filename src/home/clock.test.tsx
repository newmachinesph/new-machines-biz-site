import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatClock, zoneAbbr, type City } from "./clock";
import { HOME_COPY } from "./copy";
import { JapacStrip } from "./sections/JapacStrip";

const SYDNEY: City = { name: "Sydney", zone: "Australia/Sydney", abbr: "AEST/AEDT" };

describe("clock helpers", () => {
  it("formats 24h local time per zone", () => {
    const t = new Date("2026-10-11T00:00:00Z");
    expect(formatClock(t, "Asia/Tokyo")).toBe("09:00:00");
    expect(formatClock(t, "Asia/Singapore")).toBe("08:00:00");
    expect(formatClock(t, "Australia/Sydney")).toBe("11:00:00");
    expect(formatClock(t, "Asia/Seoul")).toBe("09:00:00");
  });

  it("resolves Sydney daylight time and leaves fixed zones alone", () => {
    expect(zoneAbbr(new Date("2026-10-11T00:00:00Z"), SYDNEY)).toBe("AEDT");
    expect(zoneAbbr(new Date("2026-06-11T00:00:00Z"), SYDNEY)).toBe("AEST");
    expect(zoneAbbr(new Date(), { name: "Tokyo", zone: "Asia/Tokyo", abbr: "JST" })).toBe("JST");
  });
});

describe("JapacStrip", () => {
  it("shows regional markets and lets the user select a geographic focus", () => {
    render(<JapacStrip />);
    expect(screen.getByRole("heading", { level: 2, name: HOME_COPY.japac.lead })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Focus Tokyo, Japan" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Focus Sydney, Australia" }));
    expect(screen.getByRole("button", { name: "Focus Sydney, Australia" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Focus Tokyo, Japan" })).toHaveAttribute("aria-pressed", "false");
    expect(document.querySelector("[data-clock]")).toBeNull();
    expect(screen.getByText(HOME_COPY.japac.languages)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/United States|\bUS\b/);
  });
});
