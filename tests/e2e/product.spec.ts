import { expect, test } from "@playwright/test";

// /product "Runs and receipts" uses its own classes. A shared-CSS rename once left the evidence cards unstyled:
// the icon, title and run id each fell onto separate lines and the log table was squeezed into one grid column.
test("product evidence cards keep icon, text and check on one row", async ({ page }) => {
  await page.goto("/product");
  const evidence = page.locator('[data-component="productEvidence"]');
  await evidence.scrollIntoViewIfNeeded();

  const cards = evidence.locator(".product-evidence-file");
  await expect(cards).not.toHaveCount(0);
  for (const card of await cards.all()) {
    const rows = await card.evaluate((element) => {
      const tops = [...element.children].map((child) => {
        const box = child.getBoundingClientRect();
        return box.top + box.height / 2;
      });
      return Math.max(...tops) - Math.min(...tops);
    });
    // Icon, text block and check share one vertical centre line.
    expect(rows).toBeLessThanOrEqual(2);
    const display = await card.evaluate((element) => getComputedStyle(element).display);
    expect(display).toBe("flex");
  }

  // The approval log is never narrower than its readable minimum; on a phone it scrolls instead of clipping.
  const table = evidence.locator("table");
  const tableWidth = await table.evaluate((element) => element.getBoundingClientRect().width);
  expect(tableWidth).toBeGreaterThanOrEqual(560);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  // The cards and the table's scroll wrapper stay inside the viewport (a grid item must not grow to the table's width).
  const viewport = page.viewportSize()!;
  for (const box of [await cards.first().boundingBox(), await evidence.locator('[role="region"]').boundingBox()]) {
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  }
});
