import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { AVAILABLE_CONNECTORS, AVAILABLE_LABEL, CATEGORIES, CONNECTORS, MCP_ICON, availableSummary } from "../integrationCatalog";
import { IntegrationDirectory as Directory, formatCount } from "./IntegrationDirectory";

const IntegrationDirectory = () => <Directory titleId="connectors-title" />;
/** "Show all" mounts every tile in jsdom, which is slow while the whole suite runs in parallel. */
const SHOW_ALL_TIMEOUT = 30_000;

const tiles = () => [...document.querySelectorAll<HTMLLIElement>(".connector-grid li")];
const shown = () => tiles().map((item) => item.querySelector("strong")?.textContent);
const liveCount = () => document.querySelector("[aria-live=polite]")?.textContent;
const tile = (name: string) => tiles().find((item) => item.querySelector("strong")?.textContent === name) as HTMLElement;

describe("catalog data", () => {
  it("holds the full catalog with a unique slug, a real category and a logo file for every tool", () => {
    expect(CONNECTORS.length).toBeGreaterThan(1000);
    expect(new Set(CONNECTORS.map((connector) => connector.slug)).size).toBe(CONNECTORS.length);
    expect(new Set(CONNECTORS.map((connector) => connector.name.toLowerCase())).size).toBe(CONNECTORS.length);
    expect(CONNECTORS.every((connector) => (CATEGORIES as readonly string[]).includes(connector.category))).toBe(true);
    const missing = CONNECTORS.filter((connector) => !existsSync(resolve(process.cwd(), "public", connector.logo.slice(1)))).map((connector) => connector.slug);
    expect(missing).toEqual([]);
    expect(CONNECTORS.some((connector) => /Microsoft|Amazon Web Services|\bAWS\b|GitHub/.test(connector.name))).toBe(false);
  });

  it("marks the imported connectors and the MCP server as available today", () => {
    expect(AVAILABLE_CONNECTORS.map((connector) => connector.name)).toEqual(["Gmail", "Google Calendar", "Google Docs", "Google Sheets", "Shopify", "Stripe", "Your MCP server"]);
    expect(AVAILABLE_CONNECTORS.at(-1)?.slug).toBe(MCP_ICON);
    expect(availableSummary()).toBe("Gmail, Google Calendar, Google Docs, Google Sheets, Shopify, Stripe and your own MCP server");
    expect(formatCount(1537)).toBe("1,537");
  });
});

describe("IntegrationDirectory", () => {
  it("counts the whole catalog and renders the first twenty tiles until Show all", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    expect(screen.getByText(`${formatCount(CONNECTORS.length)} business tools`)).toBeInTheDocument();
    expect(shown()).toEqual(CONNECTORS.slice(0, 20).map((connector) => connector.name));
    expect(document.querySelectorAll(".connector-grid img")).toHaveLength(20);
    const showAll = screen.getByRole("button", { name: `Show all ${formatCount(CONNECTORS.length)} connectors` });
    expect(showAll).toHaveAttribute("aria-expanded", "false");
    await user.click(showAll);
    expect(shown()).toHaveLength(CONNECTORS.length);
    expect(screen.getByRole("button", { name: "Show fewer" })).toHaveAttribute("aria-expanded", "true");
  }, SHOW_ALL_TIMEOUT);

  it("filters by category and announces the count", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    const filters = screen.getByRole("group", { name: "Filter connectors by category" });
    const support = within(filters).getByRole("button", { name: "Customer support" });
    await user.click(support);
    expect(support).toHaveAttribute("aria-pressed", "true");
    expect(within(filters).getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    const expected = CONNECTORS.filter((connector) => connector.category === "Customer support").map((connector) => connector.name);
    expect(expected.length).toBeGreaterThan(20);
    expect(shown()).toEqual(expected.slice(0, 20));
    expect(liveCount()).toBe(`${expected.length} connectors`);
    await user.click(screen.getByRole("button", { name: `Show all ${expected.length} connectors` }));
    expect(shown()).toEqual(expected);
    await user.click(within(filters).getByRole("button", { name: "People & HR" }));
    expect(shown()).toEqual(CONNECTORS.filter((connector) => connector.category === "People & HR").map((connector) => connector.name));
  });

  it("filters to what is available today and shows the status on every tile", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    expect(tile("Gmail").querySelector(".connector-status")).toHaveTextContent(AVAILABLE_LABEL);
    expect(tile("Gmail")).toHaveAttribute("data-available");
    expect(tile("Slack").querySelector(".connector-status")).toHaveTextContent("On request");
    expect(tile("Slack")).not.toHaveAttribute("data-available");
    await user.click(screen.getByRole("button", { name: AVAILABLE_LABEL }));
    expect(shown()).toEqual(AVAILABLE_CONNECTORS.map((connector) => connector.name));
    expect(liveCount()).toBe("7 connectors");
    expect(screen.queryByRole("button", { name: /Show all/ })).toBeNull();
    expect(screen.getByText(`${AVAILABLE_LABEL}: ${availableSummary()}. The rest connect through our integration layer on request.`)).toBeInTheDocument();
  });

  it("searches name and category case-insensitively, combines with the category, and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    const search = screen.getByRole("searchbox", { name: "Search connectors" });
    expect(search).toHaveAttribute("data-component", "integrationSearch");
    await user.type(search, "GOOGLE S");
    expect(shown()).toEqual(expect.arrayContaining(["Google Sheets", "Google Slides"]));
    expect(shown().every((name) => name?.toLowerCase().includes("google s"))).toBe(true);
    await user.click(screen.getByRole("button", { name: "Productivity & docs" }));
    expect(shown()).toContain("Google Sheets");
    expect(shown().every((name) => CONNECTORS.find((connector) => connector.name === name)?.category === "Productivity & docs")).toBe(true);
    await user.click(screen.getByRole("button", { name: "All" }));
    await user.clear(search);
    await user.type(search, "people & hr");
    expect(shown()).toHaveLength(20);
    expect(liveCount()).toBe(`${CONNECTORS.filter((connector) => connector.category === "People & HR").length} connectors`);
    expect(shown().every((name) => CONNECTORS.find((connector) => connector.name === name)?.category === "People & HR")).toBe(true);
    await user.clear(search);
    await user.type(search, "zzzz");
    expect(shown()).toEqual([]);
    expect(screen.getByText("No connector matches “zzzz”.")).toBeInTheDocument();
    expect(liveCount()).toBe("0 connectors");
  });

  it("gives every visible tile its own lazy, fixed-size logo", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    await user.click(screen.getByRole("button", { name: /Show all/ }));
    const images = [...document.querySelectorAll<HTMLImageElement>(".connector-grid img")];
    expect(images).toHaveLength(CONNECTORS.length);
    expect(images.every((image) => image.getAttribute("src")?.startsWith("/brands/connectors/") && image.getAttribute("loading") === "lazy" && image.getAttribute("width") === "20" && image.getAttribute("height") === "20" && image.getAttribute("alt") === "")).toBe(true);
    expect(tile("Stripe").querySelector("img")).toHaveAttribute("src", "/brands/connectors/stripe.svg");
    expect(tile("Your MCP server").querySelector("img")).toHaveAttribute("src", `/brands/connectors/${MCP_ICON}.svg`);
  }, SHOW_ALL_TIMEOUT);
});
