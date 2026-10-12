import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(__dirname, "tokens.css"), "utf8");

describe("tokens.css", () => {
  it.each([
    "--font-sans", "--font-mono", "--font-display",
    "--color-ink", "--color-paper", "--color-grey-50", "--color-grey-900",
    "--color-machine", "--color-machine-soft", "--color-human", "--color-human-soft",
    "--color-blocked", "--color-blocked-soft",
    "--radius-sm", "--radius-md", "--radius-lg", "--shadow-sm", "--shadow-md",
    "--container-page", "--container-prose",
  ])("defines %s", (name) => {
    expect(css).toContain(`${name}:`);
  });

  it("uses Tailwind v4 theme blocks", () => {
    expect(css).toMatch(/@import "tailwindcss";/);
    expect(css).toMatch(/@theme inline \{/);
  });
});
