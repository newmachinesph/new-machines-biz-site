import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SAMPLE_RUN } from "@/marketplace/invoiceMatcher";
import { HeroLedger } from "./HeroLedger";
import { HeroProduct } from "./HeroProduct";

// The hero's clock only runs in view and with motion allowed; jsdom has neither, so let it play.
vi.mock("motion/react", () => ({ useInView: () => true, useReducedMotion: () => false }));

const ASTER_ALT = "Aster Supply warehouse receipt 030679, photographed; supplier and personal details redacted";
const phase = () => document.querySelector(".hero-live-product")?.getAttribute("data-phase");

afterEach(() => vi.useRealTimers());

describe("HeroProduct previews", () => {
  it("shows the redacted source photo when the 030679 receipt is focused", async () => {
    render(<HeroLedger phase={1} />);
    const trigger = screen.getByRole("button", { name: "Aster Supply 030679, show the source document" });
    expect(trigger).toHaveAttribute("data-component", "ledgerInvoicePhoto");
    act(() => trigger.focus());
    const photo = await screen.findByRole("img", { name: ASTER_ALT });
    expect(photo).toHaveAttribute("src", expect.stringContaining("aster-030679.jpg"));
  });

  it("tells the reviewer that AI hid the sensitive details", async () => {
    render(<HeroLedger phase={1} />);
    act(() => screen.getByRole("button", { name: "Aster Supply 030679, show the source document" }).focus());
    expect(await screen.findByText("AI hid supplier and personal details before review.")).toBeInTheDocument();
  });

  it("shows the PO and receiving report beside the receipt, marking the lines that differ", async () => {
    render(<HeroLedger phase={1} />);
    act(() => screen.getByRole("button", { name: "Aster Supply 030679, show the source document" }).focus());
    const po = await screen.findByRole("table", { name: "Purchase order PO-4417" });
    const received = screen.getByRole("table", { name: "Receiving report RR-0918" });
    const towels = (table: HTMLElement) => within(table).getByRole("row", { name: /Interfolded Paper Towel/ });
    expect(within(towels(po)).getByText("64")).toBeInTheDocument();
    expect(within(towels(received)).getByText("63")).toBeInTheDocument();
    expect(within(po).getByText("¥76,264")).toBeInTheDocument();
    expect([towels(po), towels(received)].every((row) => row.hasAttribute("data-diff"))).toBe(true);
    expect(within(po).getByRole("row", { name: /Bathroom Tissue/ })).not.toHaveAttribute("data-diff");
  });

  it("toggles on Enter, Space or a screen reader's click, and describes what it shows", () => {
    render(<HeroLedger phase={1} />);
    const trigger = screen.getByRole("button", { name: "Aster Supply 030679, show the source document" });
    expect(trigger).toHaveAccessibleDescription(ASTER_ALT);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger, { detail: 0 });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("img", { name: ASTER_ALT })).toBeInTheDocument();
    fireEvent.click(trigger, { detail: 0 });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("lists every document check when the inspector's checks row is focused", async () => {
    render(<HeroProduct />);
    await userEvent.click(screen.getByRole("button", { name: "01 Agent work" }));
    const trigger = screen.getByRole("button", { name: /Document checks: 7 of 7 passed/ });
    expect(trigger).toHaveAttribute("data-component", "inspectorDocumentChecks");
    expect(trigger).toHaveAccessibleDescription(/^7 of 7 checks passed: Supplier identity, /);
    act(() => trigger.focus());
    expect(await screen.findByText("Supplier identity")).toBeInTheDocument();
    for (const { check } of SAMPLE_RUN.document_checks) expect(screen.getByText(check)).toBeInTheDocument();
    expect(screen.getAllByText("Read from document")).toHaveLength(2);
    expect(screen.getAllByText("Verified in database")).toHaveLength(5);
  });

  it("holds the autoplay while a preview is open, then resumes", () => {
    vi.useFakeTimers();
    render(<HeroProduct />);
    expect(phase()).toBe("0");
    const trigger = screen.getByRole("button", { name: /Document checks/ });
    fireEvent.click(trigger, { detail: 0 });
    expect(screen.getByText("Supplier identity")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(12_000));
    expect(phase()).toBe("0");
    expect(screen.getByText("Supplier identity")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pause demo" })).toBeInTheDocument();
    fireEvent.click(trigger, { detail: 0 });
    act(() => vi.advanceTimersByTime(4_000));
    expect(phase()).toBe("1");
  });
});
