import { mkdir, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("smaller trust phrases and the explorer sidebar remain readable while scrolling", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "explicit responsive viewports");
  test.setTimeout(60000);
  const dir = ".design/scroll-polish/screenshots";
  await mkdir(dir, { recursive: true });
  const measurements = [];
  for (const width of [320, 375, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#trust");
    await page.evaluate(() => document.fonts.ready);
    const phrases = await page.locator(".trust-clause").evaluateAll((clauses) => clauses.map((clause) => {
      const range = document.createRange(); range.selectNodeContents(clause);
      const bounds = clause.getBoundingClientRect();
      return { text: clause.textContent, lines: range.getClientRects().length, fits: clause.scrollWidth <= bounds.width + .5, fontSize: parseFloat(getComputedStyle(clause).fontSize) };
    }));
    expect(phrases).toHaveLength(3);
    expect(phrases.every((phrase) => phrase.fits && phrase.lines === 1 && phrase.fontSize <= 30)).toBe(true);
    await page.locator("#trust").screenshot({ path: `${dir}/trust-${width}.png`, style: ".site-header { visibility: hidden; }" });
    await page.getByRole("button", { name: "02 Sales", exact: true }).click();
    await expect(page.locator("#workflow-sales")).toHaveAttribute("data-active", "true");
    const sidebar = page.locator(".workflow-sidebar");
    const before = (await sidebar.boundingBox())!;
    await page.evaluate(() => window.scrollBy({ top: 220, behavior: "instant" }));
    const after = (await sidebar.boundingBox())!;
    expect(Math.abs(after.y - before.y)).toBeLessThan(1);
    // The bound is the 76px sticky nav: the announcement bar scrolls away, so the sidebar must never slide under the nav.
    expect(after.y).toBeGreaterThanOrEqual(76);
    await page.screenshot({ path: `${dir}/sticky-sales-${width}.png` });
    await page.getByRole("button", { name: "03 Operations", exact: true }).click();
    await expect(page.locator("#workflow-operations")).toHaveAttribute("data-active", "true");
    const active = page.locator("#workflow-operations");
    await active.getByRole("button", { name: "Run demo", exact: true }).click();
    await expect(active.locator(".workflow-result")).toContainText("Reviewer verdict recorded", { timeout: 10_000 });
    // Chapters are shown one at a time (the inactive ones are hidden), so the team button is the way to reach Support.
    await page.getByRole("button", { name: "04 Support", exact: true }).click();
    await expect(page.getByRole("button", { name: "04 Support", exact: true })).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    measurements.push({ width, phrases, before, after });
  }
  await writeFile(dir + "/measurements.json", JSON.stringify(measurements, null, 2));
});
