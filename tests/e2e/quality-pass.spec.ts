import { mkdir, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("review every homepage section at mobile, tablet and desktop widths", async ({ page }, testInfo) => {
  test.setTimeout(60000);
  test.skip(testInfo.project.name !== "desktop", "this review sets each viewport explicitly");
  const directory = ".design/home-quality-pass/screenshots";
  await mkdir(directory, { recursive: true });
  await page.clock.setFixedTime(new Date("2026-10-11T00:00:00Z"));
  const sections = ["hero", "customers", "work-explorer", "hire", "sandbox", "trust", "human", "control", "integrations", "customer-stories", "japac", "how", "faq", "close"];
  const measurements = [];
  for (const viewport of [{ width: 320, height: 812 }, { width: 375, height: 812 }, { width: 414, height: 896 }, { width: 768, height: 1024 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    await page.locator("header").screenshot({ path: `${directory}/after-nav-${viewport.width}.png` });
    for (const id of sections) {
      const region = page.locator(`#${id}`);
      await region.scrollIntoViewIfNeeded();
      await expect.poll(() => region.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      if (id === "japac") await expect(region.locator(".regional-globe")).toHaveAttribute("data-ready", "true", { timeout: 15000 });
      await region.screenshot({ path: `${directory}/after-${id}-${viewport.width}.png`, style: ".site-header { visibility: hidden; }" });
    }
    await page.locator("footer").screenshot({ path: `${directory}/after-footer-${viewport.width}.png`, style: ".site-header { visibility: hidden; }" });
    const scene = await page.locator(".story-grid").evaluate((element) => {
      const art = element.querySelector(".finance-art")!.getBoundingClientRect();
      const sheet = element.querySelector(".story-sheet")!.getBoundingClientRect();
      const names = [...element.querySelectorAll(".research-account-row strong")].map((name) => name.getBoundingClientRect().left);
      // Each card shares the same inset before its decorative translation.
      const insets = [...element.querySelectorAll(".research-account-row")].map((card) => card.querySelector("strong")!.getBoundingClientRect().left - card.getBoundingClientRect().left);
      return { topInset: sheet.top - art.top, bottomInset: art.bottom - sheet.bottom, leftInset: sheet.left - art.left, rightInset: art.right - sheet.right, nameInsets: insets, nameEdges: names };
    });
    expect(scene.topInset).toBeGreaterThanOrEqual(8);
    expect(scene.bottomInset).toBeGreaterThanOrEqual(8);
    expect(scene.leftInset).toBeGreaterThanOrEqual(8);
    expect(scene.rightInset).toBeGreaterThanOrEqual(8);
    expect(Math.max(...scene.nameInsets) - Math.min(...scene.nameInsets)).toBeLessThanOrEqual(0.5);
    measurements.push({ width: viewport.width, financeScene: scene });
  }
  await writeFile(`${directory}/measurements.json`, JSON.stringify(measurements, null, 2));
});

test("workflow stories select the matching demo and keep review separate from verification", async ({ page }) => {
  await page.goto("/#customer-stories");
  await page.locator(".story-sales").click();
  await expect(page.getByRole("button", { name: "02 Sales", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "More conversations. Less preparation." })).toBeInViewport();
  await page.locator(".workflow-chapter[data-active=true]").getByRole("button", { name: "Run demo", exact: true }).click();
  await expect(page.locator(".workflow-chapter[data-active=true] .task-specialist")).toContainText("Needs review");
  await expect(page.locator(".workflow-chapter[data-active=true] .task-specialist")).not.toContainText("Verified");
  await expect(page.locator(".workflow-chapter[data-active=true] .task-specialist")).toContainText("Verified", { timeout: 10_000 });
  await page.locator(".story-finance").click();
  await expect(page.getByRole("button", { name: "01 Finance", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".workflow-chapter[data-active=true]").getByRole("button", { name: "Run demo", exact: true })).toBeEnabled();
});
