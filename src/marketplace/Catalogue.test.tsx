import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { accentViolations } from "@/home/mockups/accentViolations";
import { Catalogue, CatalogueFromUrl } from "./Catalogue";
import { filtersFromParams, filtersToQuery, DEFAULT_FILTERS } from "./filters";

const url = vi.hoisted(() => ({ params: new URLSearchParams() }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => url.params,
}));

const cards = () => within(screen.getByRole("list", { name: "Marketplace listings" })).getAllByRole("listitem");
const search = () => screen.getByRole("searchbox", { name: "Search listings" });
const pressed = (name: string) => expect(screen.getByRole("button", { name })).toHaveAttribute("aria-pressed", "true");

describe("Catalogue", () => {
  let replaceState: MockInstance<History["replaceState"]>;
  beforeEach(() => {
    url.params = new URLSearchParams();
    replaceState = vi.spyOn(window.history, "replaceState");
    replaceState.mockClear();
  });

  it("filters by kind and certification, searches, and mirrors every change to the URL", async () => {
    const { container } = render(<Catalogue />);
    expect(cards()).toHaveLength(12);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getByText("12 listings")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Human work" }));
    expect(cards()).toHaveLength(3);
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace?kind=human");
    expect(cards().every((card) => card.textContent?.includes("Human work"))).toBe(true);
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "All talent" }));
    expect(cards()).toHaveLength(12);
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace");

    await userEvent.click(screen.getByRole("button", { name: "Trust Passport only" }));
    expect(cards()).toHaveLength(8);
    pressed("Trust Passport only");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace?certified=1");
    await userEvent.click(screen.getByRole("button", { name: "Trust Passport only" }));
    expect(cards()).toHaveLength(12);

    await userEvent.type(search(), "invoice");
    expect(cards()).toHaveLength(1);
    expect(screen.getByText("1 listing")).toBeInTheDocument();
    expect(cards()[0]).toHaveTextContent("Invoice matcher");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace?q=invoice");

    await userEvent.click(screen.getByRole("button", { name: "Human work" }));
    expect(screen.queryByRole("list", { name: "Marketplace listings" })).toBeNull();
    expect(screen.getByText("No listings match.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace?kind=human&q=invoice");

    await userEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(cards()).toHaveLength(12);
    expect(search()).toHaveValue("");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace");

    await userEvent.click(screen.getByRole("button", { name: "Workflow packs" }));
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(cards()).toHaveLength(12);
    pressed("All talent");

    expect(screen.getAllByRole("link", { name: /View listing/ })[0]).toHaveAttribute("href", "/marketplace/invoice-matcher");
    expect(accentViolations(container)).toEqual([]);
  });

  it("treats a blank query as absent", async () => {
    render(<Catalogue />);
    await userEvent.type(search(), "   ");
    expect(cards()).toHaveLength(12);
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace");
    expect(filtersToQuery({ ...DEFAULT_FILTERS, q: " \t " })).toBe("");
    expect(filtersFromParams(new URLSearchParams("q=+")).q).toBe("");
  });

  it("follows the URL when something else changes it, without writing the URL back", () => {
    const view = render(<Catalogue initial={{ ...DEFAULT_FILTERS, kind: "human" }} />);
    expect(cards()).toHaveLength(3);
    pressed("Human work");
    view.rerender(<Catalogue initial={DEFAULT_FILTERS} />);
    expect(cards()).toHaveLength(12);
    pressed("All talent");
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("keeps what was typed while the URL catches up with its own writes", async () => {
    const view = render(<Catalogue initial={DEFAULT_FILTERS} />);
    await userEvent.type(search(), "in");
    expect(replaceState).toHaveBeenCalledTimes(2);
    const count = cards().length;
    view.rerender(<Catalogue initial={{ ...DEFAULT_FILTERS, q: "i" }} />);
    expect(search()).toHaveValue("in");
    expect(cards()).toHaveLength(count);
    view.rerender(<Catalogue initial={{ ...DEFAULT_FILTERS, q: "in" }} />);
    expect(search()).toHaveValue("in");
    expect(cards()).toHaveLength(count);
    expect(replaceState).toHaveBeenCalledTimes(2);
  });

  it("reads its first state from the URL, ignores unknown kinds and follows later URL changes", () => {
    url.params = new URLSearchParams("kind=pack&certified=1&q=tax");
    const first = render(<CatalogueFromUrl />);
    expect(cards()).toHaveLength(1);
    expect(cards()[0]).toHaveTextContent("Quarterly tax pack");
    pressed("Workflow packs");
    expect(search()).toHaveValue("tax");
    expect(replaceState).not.toHaveBeenCalled();
    first.unmount();

    url.params = new URLSearchParams("kind=robot");
    render(<CatalogueFromUrl />);
    expect(cards()).toHaveLength(12);
    pressed("All talent");
    expect(filtersFromParams(null)).toEqual(DEFAULT_FILTERS);
  });

  it("resets when the URL loses its search params (nav link, back/forward)", () => {
    url.params = new URLSearchParams("kind=human");
    const view = render(<CatalogueFromUrl />);
    expect(cards()).toHaveLength(3);
    url.params = new URLSearchParams();
    view.rerender(<CatalogueFromUrl />);
    expect(cards()).toHaveLength(12);
    pressed("All talent");
    expect(replaceState).not.toHaveBeenCalled();
  });
});
