import { mkdir } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("capture the product-scene design review at its required breakpoints", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the review explicitly sets all three viewport sizes");
  const directory = ".design/home-product-scenes/screenshots";
  await mkdir(directory, { recursive: true });
  await page.clock.setFixedTime(new Date("2026-10-11T00:00:00Z"));
  for (const viewport of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
    await page.screenshot({ path: `${directory}/review-homepage-${viewport.width}.png`, fullPage: true });
  }
  for (const [name, selector] of [
    ["marketplace", ".talent-directory"],
    ["sandbox", ".sandbox-comparison"],
    ["trust", ".work-receipt"],
    ["reviewer", ".human-work-layout"],
    ["spend", ".spend-workspace"],
    ["workflow", ".task-preview"],
    ["japac", ".customers-section"],
    ["footer", "footer"],
  ]) {
    const region = page.locator(selector);
    await region.scrollIntoViewIfNeeded();
    await expect.poll(() => region.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await region.screenshot({ path: `${directory}/review-${name}-desktop-1280.png` });
  }
});
