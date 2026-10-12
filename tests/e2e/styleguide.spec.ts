import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("styleguide renders every section and passes axe", async ({ page }) => {
  await page.goto("/styleguide");
  for (const id of ["fonts", "colours", "shape", "logo", "components", "mockups"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  // TokenChips reads the computed tokens after hydration; toHaveAttribute waits for it.
  for (const name of ["machine", "human", "blocked", "grey-500"]) {
    const chip = page.locator(`#colours li[data-token="${name}"]`);
    await expect(chip, `${name} chip`).toHaveAttribute("data-ratio", /^\d/);
    const ratio = Number(await chip.getAttribute("data-ratio"));
    expect(ratio, `${name} contrast on paper`).toBeGreaterThanOrEqual(4.5);
  }
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  await expect(page).toHaveScreenshot("styleguide.png", { fullPage: true, maxDiffPixelRatio: 0.01 });
});
