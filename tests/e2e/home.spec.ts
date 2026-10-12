import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home renders the JAPAC redesign, has no horizontal scroll, and passes axe", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error" && /hydration|hydrated/i.test(message.text())) hydrationErrors.push(message.text()); });
  await page.clock.setFixedTime(new Date("2026-10-11T00:00:00Z"));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("A new kind of workforce.");
  await expect(page.getByRole("heading", { name: "Built for Japan. Ready for everywhere." })).toBeVisible();
  await expect(page.getByRole("group", { name: "Explore a JAPAC market" })).toContainText("Tokyo");
  await expect(page.getByText("United States")).toHaveCount(0);
  await expect(page.getByText(/Microsoft|Amazon Web Services|\bAWS\b|GitHub/)).toHaveCount(0);
  await expect(page.getByText("Demo data", { exact: true })).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const h1Size = await page.getByRole("heading", { level: 1 }).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  if (page.viewportSize()!.width >= 1440) expect(h1Size).toBeGreaterThanOrEqual(56);
  const headingFonts = await page.locator(".marketing-home h1, .marketing-home h2").evaluateAll((headings) => {
    const reference = getComputedStyle(document.querySelector("#human-title")!).fontFamily;
    return headings.map((heading) => ({ font: getComputedStyle(heading).fontFamily, reference }));
  });
  expect(headingFonts.every(({ font, reference }) => font === reference && !/Michroma/i.test(font))).toBe(true);
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  expect(hydrationErrors).toEqual([]);
  await expect(page).toHaveScreenshot("home.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test("mobile menu opens the navigation dialog", async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 1024, "menu button only exists below lg");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toContainText("Marketplace");
});

test("workflow demo requires review, verifies the outcome, and resets when teams change", async ({ page }) => {
  await page.goto("/#work-explorer");
  await page.getByRole("button", { name: "02 Sales", exact: true }).click();
  await expect(page.getByRole("heading", { name: "More conversations. Less preparation." })).toBeVisible();
  await page.locator(".workflow-chapter[data-active=true]").getByRole("button", { name: "Run demo", exact: true }).click();
  await expect(page.locator(".workflow-chapter[data-active=true]").getByRole("button", { name: "Approve demo outcome", exact: true })).toBeVisible();
  await expect(page.locator(".workflow-chapter[data-active=true]").getByRole("button", { name: "Awaiting review", exact: true })).toBeDisabled();
  await page.locator(".workflow-chapter[data-active=true]").getByRole("button", { name: "Approve demo outcome", exact: true }).click();
  await expect(page.locator(".workflow-chapter[data-active=true] .workflow-result")).toContainText("Qualified account shortlist");
  await expect(page.locator(".workflow-chapter[data-active=true] .workflow-result")).toContainText("Human approved");
  await page.locator(".workflow-chapter[data-active=true]").getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: "04 Support", exact: true }).click();
  await expect(page.locator(".workflow-chapter[data-active=true]").getByRole("button", { name: "Run demo", exact: true })).toBeEnabled();
  await expect(page.locator(".workflow-chapter[data-active=true] .workflow-review")).toContainText("A. Sato");
  await page.locator("summary").filter({ hasText: "How do I know the work was actually done?" }).click();
  await expect(page.locator(".faq-list details[open]")).toContainText("Execution and verification are separate steps.");
});

test("product scenes keep measured alignment and the fictional company logos load", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.locator(".talent-directory").scrollIntoViewIfNeeded();
  if (page.viewportSize()!.width < 480) {
    const filters = await page.locator(".directory-filters button").evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().toJSON()));
    expect(Math.abs(filters[0].y - filters[1].y)).toBeLessThan(.5);
    expect(Math.abs(filters[2].y - filters[3].y)).toBeLessThan(.5);
    expect(Math.abs(filters[0].x - filters[2].x)).toBeLessThan(.5);
    expect(Math.abs(filters[1].x - filters[3].x)).toBeLessThan(.5);
    expect(filters.every((filter) => filter.height >= 44)).toBe(true);
  }
  const listingGeometry = await page.locator(".talent-row").evaluateAll((rows) => rows.map((row) => {
    const title = row.querySelector(".talent-row-copy > strong")!.getBoundingClientRect();
    const meta = row.querySelector(".talent-row-copy > span")!.getBoundingClientRect();
    return { titleLeft: title.left, metadataLeft: meta.left, rowHeight: row.getBoundingClientRect().height };
  }));
  const titleSpread = Math.max(...listingGeometry.map((row) => row.titleLeft)) - Math.min(...listingGeometry.map((row) => row.titleLeft));
  const metadataSpread = Math.max(...listingGeometry.map((row) => row.metadataLeft)) - Math.min(...listingGeometry.map((row) => row.metadataLeft));
  expect(titleSpread).toBeLessThanOrEqual(0.5);
  expect(metadataSpread).toBeLessThanOrEqual(0.5);
  expect(Math.max(...listingGeometry.map((row) => row.rowHeight)) - Math.min(...listingGeometry.map((row) => row.rowHeight))).toBeLessThanOrEqual(0.5);
  await page.getByRole("button", { name: "Human work", exact: true }).click();
  await expect(page.locator(".talent-detail h4")).toHaveText("Bilingual contract review");
  await page.getByRole("button", { name: "All talent", exact: true }).click();
  await page.locator(".scenario-switch").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Success case/ }).click();
  await expect(page.locator(".comparison-state")).toContainText("The numbers agree.");
  await page.getByRole("button", { name: /Exception case/ }).click();
  await expect(page.locator(".comparison-state")).toContainText("Needs human");
  await page.getByRole("button", { name: "Approve review", exact: true }).click();
  await expect(page.locator(".review-decision-record")).toContainText("Review approved");
  await page.getByRole("button", { name: "Reset review", exact: true }).click();
  await page.locator(".roster-primary").scrollIntoViewIfNeeded();
  await expect(page.locator(".roster-primary .japac-brand-logo")).toHaveCount(16);
  await expect.poll(() => page.locator(".roster-primary .japac-brand-logo").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.locator("footer").scrollIntoViewIfNeeded();
  const footerGeometry = await page.locator(".footer-lockup").evaluate((svg) => {
    const box = (svg as SVGGraphicsElement).getBBox();
    const point = (svg as SVGSVGElement).createSVGPoint();
    point.x = box.x;
    point.y = box.y;
    const rendered = point.matrixTransform((svg as SVGGraphicsElement).getScreenCTM()!);
    const textLeft = document.querySelector(".footer-tagline")!.getBoundingClientRect().left;
    return { artworkLeft: rendered.x, textLeft, difference: Math.abs(rendered.x - textLeft), sourceBounds: { x: box.x, y: box.y, width: box.width, height: box.height } };
  });
  expect(footerGeometry.difference).toBeLessThanOrEqual(0.5);
  await expect(page.locator("footer")).not.toContainText("newmachin.es");
  await expect(page.locator(".footer-wordmark")).toHaveCount(0);
  await testInfo.attach("layout-measurements.json", { body: JSON.stringify({ viewport: page.viewportSize(), listingGeometry, titleSpread, metadataSpread, footerGeometry }, null, 2), contentType: "application/json" });
});
