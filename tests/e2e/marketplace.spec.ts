import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Fixed clock and a hydration-error listener before navigation; overflow and axe checks after. */
async function auditPage(page: Page) {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error" && /hydration|hydrated/i.test(message.text())) hydrationErrors.push(message.text()); });
  await page.clock.setFixedTime(new Date("2026-10-11T00:00:00Z"));
  return async () => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    expect(hydrationErrors).toEqual([]);
  };
}

test("marketplace catalogue renders twelve listings, has no horizontal scroll, and passes axe", async ({ page }) => {
  const audit = await auditPage(page);
  await page.goto("/marketplace");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The right fit.");
  await expect(page.locator(".listing-card")).toHaveCount(12);
  await expect(page.getByText("United States")).toHaveCount(0);
  await expect(page.locator('nav[aria-label="Primary"] a[aria-current="page"]')).toHaveAttribute("href", "/marketplace");
  await audit();
  await expect(page).toHaveScreenshot("marketplace.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("marketplace filters and search live in the URL and survive a reload", async ({ page }) => {
  const audit = await auditPage(page);
  await page.goto("/marketplace");
  await expect(page.locator(".listing-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Human work", exact: true }).click();
  await expect(page.locator(".listing-card")).toHaveCount(3);
  await expect(page).toHaveURL(/\/marketplace\?kind=human$/);
  await page.reload();
  await expect(page.locator(".listing-card")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "Human work", exact: true })).toHaveAttribute("aria-pressed", "true");
  await audit();
  await page.getByRole("button", { name: "All talent", exact: true }).click();
  await expect(page.locator(".listing-card")).toHaveCount(12);
  await page.getByRole("searchbox", { name: "Search listings" }).fill("invoice");
  await expect(page.locator(".listing-card")).toHaveCount(1);
  await expect(page).toHaveURL(/\/marketplace\?q=invoice$/);
  await page.getByRole("button", { name: "Trust Passport only", exact: true }).click();
  await expect(page).toHaveURL(/\/marketplace\?certified=1&q=invoice$/);
  await page.getByRole("button", { name: "Human work", exact: true }).click();
  await expect(page.getByText("No listings match.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.locator(".listing-card")).toHaveCount(12);
  await expect(page).toHaveURL(/\/marketplace$/);
  await page.getByRole("button", { name: "Workflow packs", exact: true }).click();
  await expect(page.locator(".listing-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.locator(".listing-card")).toHaveCount(12);
  await page.locator(".listing-card").first().click();
  await expect(page).toHaveURL(/\/marketplace\/invoice-matcher$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Invoice matcher");
  await page.getByRole("link", { name: "All listings" }).click();
  await expect(page).toHaveURL(/\/marketplace$/);
});

test("the controls follow the URL when a link navigates back to the plain catalogue", async ({ page }) => {
  const audit = await auditPage(page);
  await page.goto("/marketplace?kind=human");
  await expect(page.locator(".listing-card")).toHaveCount(3);
  await page.locator("footer").getByRole("link", { name: "Marketplace", exact: true }).click();
  await expect(page).toHaveURL(/\/marketplace$/);
  await expect(page.locator(".listing-card")).toHaveCount(12);
  await expect(page.getByRole("button", { name: "All talent", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.goBack();
  await expect(page).toHaveURL(/\/marketplace\?kind=human$/);
  await expect(page.locator(".listing-card")).toHaveCount(3);
  await audit();
});

test("on desktop the toolbar and a complete first row of cards fit a short viewport", async ({ page }) => {
  const width = page.viewportSize()?.width ?? 0;
  test.skip(width < 1024, "Desktop-only layout: below 1024 the catalogue is a scrolling column.");
  // A short desktop window: the search typed, the toolbar scrolled to the top, the first row must still end above the fold.
  // 420 is a regression bound, not the fold (640 - 120 sticky nav = 520): the old cards measured 489px at 1024 / 467px
  // at 1440 from toolbar top to first-card bottom, the compact ones 382 / 360, so 420 leaves ~40px headroom at 1024.
  await page.setViewportSize({ width, height: 640 });
  await page.goto("/marketplace");
  await expect(page.locator(".listing-card")).toHaveCount(12);
  await page.getByRole("searchbox", { name: "Search listings" }).fill("a");
  // The inline Clear only renders once hydration has landed and the toolbar is in its search-active state.
  await expect(page.getByRole("button", { name: "Clear", exact: true })).toBeVisible();
  const toolbar = page.locator(".catalogue-toolbar");
  await toolbar.evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
  const toolbarBox = await toolbar.boundingBox();
  const firstCard = page.locator(".listing-card").first();
  const cardBox = await firstCard.boundingBox();
  if (!toolbarBox || !cardBox) throw new Error("Toolbar or first card has no bounding box.");
  expect(cardBox.y + cardBox.height - toolbarBox.y).toBeLessThanOrEqual(420);
  await expect(firstCard.locator(".listing-card-foot")).toBeInViewport({ ratio: 1 });
});

test("listing page shows the pack with its steps and passport, and passes axe", async ({ page }) => {
  const audit = await auditPage(page);
  await page.goto("/marketplace/month-end-close-pack");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Month-end close pack");
  await expect(page.locator(".work-guide li")).toHaveCount(5);
  await expect(page.locator(".listing-meta")).toContainText("Trust Passport");
  await expect(page.getByRole("list", { name: "Related listings" }).locator(".listing-card")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Try this pack" })).toHaveAttribute("href", "/#work-explorer");
  await audit();
  await expect(page).toHaveScreenshot("listing.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("unknown listings return 404", async ({ page }) => {
  const response = await page.goto("/marketplace/does-not-exist");
  expect(response?.status()).toBe(404);
});
