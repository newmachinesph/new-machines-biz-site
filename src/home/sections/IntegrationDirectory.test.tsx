import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CONNECTORS } from "../integrationCatalog";
import { IntegrationDirectory as Directory, monogram } from "./IntegrationDirectory";

const IntegrationDirectory = () => <Directory titleId="connectors-title" />;

const shown = () => [...document.querySelectorAll<HTMLLIElement>(".connector-grid li")].filter((item) => !item.hidden).map((item) => item.querySelector("strong")?.textContent);
const liveCount = () => document.querySelector("[aria-live=polite]")?.textContent;

describe("IntegrationDirectory", () => {
  it("server-renders every connector and shows the first twenty until Show all", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    expect(document.querySelectorAll(".connector-grid li")).toHaveLength(CONNECTORS.length);
    expect(screen.getByText(`${CONNECTORS.length} business tools`)).toBeInTheDocument();
    expect(shown()).toHaveLength(20);
    const showAll = screen.getByRole("button", { name: `Show all ${CONNECTORS.length} connectors` });
    expect(showAll).toHaveAttribute("aria-expanded", "false");
    await user.click(showAll);
    expect(shown()).toHaveLength(CONNECTORS.length);
    expect(screen.getByRole("button", { name: "Show fewer" })).toHaveAttribute("aria-expanded", "true");
  });

  it("filters by category and announces the count", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    const filters = screen.getByRole("group", { name: "Filter connectors by category" });
    const support = within(filters).getByRole("button", { name: "Customer support" });
    await user.click(support);
    expect(support).toHaveAttribute("aria-pressed", "true");
    expect(within(filters).getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(shown()).toEqual(["Zendesk", "Intercom", "Freshdesk", "Sprig"]);
    expect(liveCount()).toBe("4 connectors");
    expect(screen.queryByRole("button", { name: /Show all/ })).toBeNull();
  });

  it("searches case-insensitively, combines with the category, and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    const search = screen.getByRole("searchbox", { name: "Search connectors" });
    expect(search).toHaveAttribute("data-component", "integrationSearch");
    await user.type(search, "GOOGLE S");
    expect(shown()).toEqual(["Google Search Console", "Google Sheets", "Google Slides"]);
    await user.click(screen.getByRole("button", { name: "Productivity & docs" }));
    expect(shown()).toEqual(["Google Sheets", "Google Slides"]);
    await user.clear(search);
    await user.type(search, "zzz");
    expect(shown()).toEqual([]);
    expect(screen.getByText("No connector matches “zzz”.")).toBeInTheDocument();
    expect(liveCount()).toBe("0 connectors");
  });

  it("uses a synced mark when there is one and initials otherwise, loading marks only for visible tiles", async () => {
    const user = userEvent.setup();
    render(<IntegrationDirectory />);
    const item0 = (name: string) => [...document.querySelectorAll(".connector-grid li")].find((li) => li.querySelector("strong")?.textContent === name) as HTMLElement;
    expect(item0("Stripe").hidden).toBe(true);
    expect(item0("Stripe").querySelector("img")).toBeNull();
    await user.click(screen.getByRole("button", { name: /Show all/ }));
    const item = (name: string) => [...document.querySelectorAll(".connector-grid li")].find((li) => li.querySelector("strong")?.textContent === name) as HTMLElement;
    expect(item("Stripe").querySelector("img")).toHaveAttribute("src", expect.stringContaining("stripe.svg"));
    expect(item("Sigma Computing").querySelector("img")).toBeNull();
    expect(item("Sigma Computing").querySelector(".connector-mark")).toHaveTextContent("SC");
    expect(monogram("Salesforce")).toBe("S");
  });
});
