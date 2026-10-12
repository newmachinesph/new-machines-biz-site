import { mkdir } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("motorsport accent stays proportioned, below the actions and out of the accessibility tree", async ({ page }, testInfo) => {
  await page.goto("/#close");
  await expect(page).toHaveTitle(/^New Machines - /);
  expect(await page.title()).not.toMatch(/[\u2013\u2014]/);
  const car = page.locator(".motorsport-car");
  await car.scrollIntoViewIfNeeded();
  await expect.poll(() => car.evaluate((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
  const geometry = await car.evaluate((image) => {
    const bounds = image.getBoundingClientRect();
    const actions = [...document.querySelectorAll(".closing-content a")].map((action) => action.getBoundingClientRect().bottom);
    return { width: bounds.width, height: bounds.height, top: bounds.top, actionBottom: Math.max(...actions), hidden: image.closest('[aria-hidden="true"]') !== null };
  });
  expect(geometry.width / geometry.height).toBeCloseTo(1600 / 610, 2);
  expect(geometry.width).toBeLessThanOrEqual(208);
  expect(geometry.top - geometry.actionBottom).toBeGreaterThanOrEqual(32);
  expect(geometry.hidden).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  await mkdir(".design/motorsport-experiment/screenshots", { recursive: true });
  await page.locator(".closing-section").screenshot({ path: `.design/motorsport-experiment/screenshots/closing-${testInfo.project.name}.png` });
});
