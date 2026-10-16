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
    expect(cards()).toHaveLength(14);
    expect(within(screen.getByRole("list", { name: "Marketplace listings" })).getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(screen.getByText("14 listings")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Human work" })).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Agents" }));
    expect(cards()).toHaveLength(6);
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace?kind=agent");
    expect(cards().every((card) => card.textContent?.includes("AI agent"))).toBe(true);
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(cards()).toHaveLength(14);
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace");

    await userEvent.click(screen.getByRole("button", { name: "Certified only" }));
    expect(cards()).toHaveLength(14);
    pressed("Certified only");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace?certified=1");
    await userEvent.click(screen.getByRole("button", { name: "Certified only" }));
    expect(cards()).toHaveLength(14);

    await userEvent.type(search(), "calendar");
    expect(cards()).toHaveLength(1);
    expect(screen.getByText("1 listing")).toBeInTheDocument();
    expect(cards()[0]).toHaveTextContent("Meeting Follow-ups");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace?q=calendar");

    await userEvent.click(screen.getByRole("button", { name: "Agents" }));
    expect(screen.queryByRole("list", { name: "Marketplace listings" })).toBeNull();
    expect(screen.getByText("No listings match.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace?kind=agent&q=calendar");

    await userEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(cards()).toHaveLength(14);
    expect(search()).toHaveValue("");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace");

    await userEvent.click(screen.getByRole("button", { name: "Packs" }));
    expect(cards()).toHaveLength(8);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(cards()).toHaveLength(14);
    pressed("All");

    expect(screen.getAllByRole("link", { name: /View listing/ })[0]).toHaveAttribute("href", "/marketplace/order-to-cash-exception-desk");
    expect(accentViolations(container)).toEqual([]);
  });

  it("searches the apps, function and agents behind each listing", async () => {
    render(<Catalogue />);
    await userEvent.type(search(), "finance operations");
    expect(cards().map((card) => card.querySelector("h2")?.textContent)).toEqual(["Order-to-Cash Exception Desk", "Order & Payment Reconciliation", "Weekly Expense Check", "Overdue Invoice Follow-up"]);
    await userEvent.clear(search());
    await userEvent.type(search(), "over mcp");
    expect(cards().map((card) => card.querySelector("h2")?.textContent)).toEqual(["Order-to-Cash Exception Desk", "Order-to-Cash Triage Agent"]);
  });

  it("explains where listings come from and how prices work", () => {
    render(<Catalogue />);
    const sources = within(screen.getByRole("heading", { name: "Where listings come from" }).parentElement!);
    expect(sources.getAllByRole("listitem").map((item) => item.querySelector("strong")?.textContent)).toEqual(["New Machines Labs", "Built by your team", "From other workspaces"]);
    expect(sources.getByText(/Prices are estimates per run in US dollars/)).toHaveTextContent("no money moves");
  });

  it("treats a blank query as absent", async () => {
    render(<Catalogue />);
    await userEvent.type(search(), "   ");
    expect(cards()).toHaveLength(14);
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/marketplace");
    expect(filtersToQuery({ ...DEFAULT_FILTERS, q: " \t " })).toBe("");
    expect(filtersFromParams(new URLSearchParams("q=+")).q).toBe("");
  });

  it("follows the URL when something else changes it, without writing the URL back", () => {
    const view = render(<Catalogue initial={{ ...DEFAULT_FILTERS, kind: "agent" }} />);
    expect(cards()).toHaveLength(6);
    pressed("Agents");
    view.rerender(<Catalogue initial={DEFAULT_FILTERS} />);
    expect(cards()).toHaveLength(14);
    pressed("All");
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
    url.params = new URLSearchParams("kind=pack&certified=1&q=calendar");
    const first = render(<CatalogueFromUrl />);
    expect(cards()).toHaveLength(1);
    expect(cards()[0]).toHaveTextContent("Meeting Follow-ups");
    pressed("Packs");
    pressed("Certified only");
    expect(search()).toHaveValue("calendar");
    expect(replaceState).not.toHaveBeenCalled();
    first.unmount();

    url.params = new URLSearchParams("kind=robot");
    render(<CatalogueFromUrl />);
    expect(cards()).toHaveLength(14);
    pressed("All");
    expect(filtersFromParams(null)).toEqual(DEFAULT_FILTERS);
  });

  it("resets when the URL loses its search params (nav link, back/forward)", () => {
    url.params = new URLSearchParams("kind=agent");
    const view = render(<CatalogueFromUrl />);
    expect(cards()).toHaveLength(6);
    url.params = new URLSearchParams();
    view.rerender(<CatalogueFromUrl />);
    expect(cards()).toHaveLength(14);
    pressed("All");
    expect(replaceState).not.toHaveBeenCalled();
  });
});
