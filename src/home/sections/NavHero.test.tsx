import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HOME_COPY } from "../copy";
import { Hero } from "./Hero";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("has the logo link, primary actions and a menu dialog with the links", async () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "New Machines" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: HOME_COPY.nav.getStarted })).toHaveAttribute("href", HOME_COPY.nav.appUrl);
    expect(HOME_COPY.nav.appUrl).toMatch(/^https:\/\//);
    await userEvent.click(screen.getByRole("button", { name: HOME_COPY.nav.menu }));
    const dialog = await screen.findByRole("dialog", { name: HOME_COPY.nav.menu });
    expect(dialog).toHaveTextContent("Marketplace");
  });
});

describe("Hero", () => {
  it("has the two-tone display headline, both CTAs and the dashboard on a demo stage", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(`${HOME_COPY.hero.lead} ${HOME_COPY.hero.tail}`);
    expect(screen.getByRole("link", { name: HOME_COPY.hero.primary.label })).toHaveAttribute("href", "/marketplace");
    expect(screen.getByRole("link", { name: HOME_COPY.hero.secondary.label })).toBeInTheDocument();
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.queryByText("Demo data")).toBeNull();
  });
});
