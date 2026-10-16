import { mkdir, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("the Three.js globe loads, focuses a market and replaces the clocks", async ({ page }, testInfo) => {
  await page.goto("/#japac");
  const globe = page.locator(".regional-globe");
  await expect(globe).toHaveAttribute("data-ready", "true", { timeout: 15000 });
  const relativeSydneyPosition = () => page.locator(".globe-city-label").filter({ hasText: "Sydney" }).evaluate((label) => label.getBoundingClientRect().top - document.querySelector(".globe-canvas")!.getBoundingClientRect().top);
  const before = await relativeSydneyPosition();
  await page.getByRole("button", { name: "Focus Sydney, Australia" }).click();
  await expect(page.getByRole("button", { name: "Focus Sydney, Australia" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(relativeSydneyPosition).toBeLessThan(before - 20);
  await expect(page.locator("[data-clock]")).toHaveCount(0);
  await page.getByRole("button", { name: "Focus Manila, Philippines" }).click();
  await expect(page.getByRole("button", { name: "Focus Manila, Philippines" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".globe-city-label").filter({ hasText: "Manila" })).toHaveCount(1);
  await expect(page.locator("#japac")).not.toContainText(/Beijing|New Clark City|Melbourne/);
  await expect(page.getByRole("group", { name: "Explore a JAPAC market" }).getByRole("button")).toHaveCount(6);
  for (const [city, country] of [["Bengaluru", "India"], ["Singapore", "Singapore"], ["Seoul", "South Korea"]]) {
    const button = page.getByRole("button", { name: `Focus ${city}, ${country}` });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => page.locator(".globe-city-label").filter({ hasText: city }).evaluate((label) => {
      const bounds = label.getBoundingClientRect(), canvas = document.querySelector(".globe-canvas")!.getBoundingClientRect();
      return Math.hypot(bounds.left - canvas.left - canvas.width / 2, bounds.top - canvas.top - canvas.height / 2);
    })).toBeLessThan(115);
  }
  await page.getByRole("button", { name: "Focus Tokyo, Japan" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(await page.locator(".globe-canvas").evaluate((canvas) => (canvas as HTMLCanvasElement).width)).toBeGreaterThan(200);
  await mkdir(".design/japac-globe/screenshots", { recursive: true });
  await page.locator("#japac").screenshot({ path: `.design/japac-globe/screenshots/globe-${testInfo.project.name}.png`, style: ".site-header { visibility: hidden; }" });
});

test("six hub labels and the city selector keep their spacing across screen sizes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "explicit responsive viewports");
  const directory = ".design/japac-hubs/screenshots";
  await mkdir(directory, { recursive: true });
  const measurements = [];
  for (const width of [320, 375, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#japac");
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".globe-stage").scrollIntoViewIfNeeded();
    await expect(page.locator(".regional-globe")).toHaveAttribute("data-ready", "true", { timeout: 15000 });
    await page.getByRole("button", { name: "Focus Tokyo, Japan" }).click();
    await expect.poll(() => page.locator(".globe-city-label").evaluateAll((labels) => labels.every((label) => Number(getComputedStyle(label).opacity) > .5))).toBe(true);
    await expect.poll(() => page.locator(".globe-city-label").evaluateAll((labels) => labels.flatMap((label) => {
      const bounds = label.getBoundingClientRect(), stage = label.closest(".globe-stage")!.getBoundingClientRect();
      const fits = bounds.left >= stage.left && bounds.right <= stage.right && bounds.top >= stage.top && bounds.bottom <= stage.bottom;
      return fits ? [] : [{ city: label.textContent, width: innerWidth, left: bounds.left - stage.left, top: bounds.top - stage.top, right: stage.right - bounds.right, bottom: stage.bottom - bounds.bottom }];
    }))).toEqual([]);
    await expect.poll(() => page.locator(".globe-canvas").evaluate((element) => {
      const canvas = element as HTMLCanvasElement, gl = canvas.getContext("webgl2");
      if (!gl) return 0;
      const pixel = new Uint8Array(4);
      gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      return { alpha: pixel[3], lost: gl.isContextLost(), error: gl.getError(), width: canvas.width, height: canvas.height };
    })).toMatchObject({ alpha: 255, lost: false, error: 0 });
    const layout = await page.locator(".regional-globe").evaluate((globe) => {
      const stage = globe.querySelector(".globe-stage")!.getBoundingClientRect();
      const labels = [...globe.querySelectorAll(".globe-city-label")].map((label) => {
        const box = label.getBoundingClientRect();
        return { city: label.textContent, left: box.left - stage.left, top: box.top - stage.top, right: stage.right - box.right, bottom: stage.bottom - box.bottom, box: box.toJSON() };
      });
      const overlaps = labels.flatMap((label, i) => labels.slice(i + 1).filter((other) => label.box.left < other.box.right && label.box.right > other.box.left && label.box.top < other.box.bottom && label.box.bottom > other.box.top).map((other) => [label.city, other.city]));
      const controls = [...globe.querySelectorAll(".globe-controls button")].map((button) => button.getBoundingClientRect().toJSON());
      return { labels, overlaps, controls };
    });
    measurements.push({ width, layout });
    await writeFile(directory + "/measurements.json", JSON.stringify(measurements, null, 2));
    await page.locator("#japac").screenshot({ path: `${directory}/hubs-${width}.png`, style: ".site-header { visibility: hidden; }" });
    expect(layout.overlaps).toEqual([]);
    expect(layout.labels.every((label) => Math.min(label.left, label.top, label.right, label.bottom) >= 0)).toBe(true);
    const columns = width >= 768 ? 3 : 2;
    expect(Math.max(...layout.controls.map((control) => control.height)) - Math.min(...layout.controls.map((control) => control.height))).toBeLessThan(.5);
    for (let i = 0; i < layout.controls.length; i++) {
      expect(layout.controls[i].height).toBeGreaterThanOrEqual(44);
      expect(Math.abs(layout.controls[i].x - layout.controls[i % columns].x)).toBeLessThan(.5);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  }
});

test("the hero sequence supports explicit stages and pausing the automatic demo", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#hero");
  await page.getByRole("button", { name: "02 Human review", exact: true }).click();
  await expect(page.locator(".hero-run-inspector")).toContainText("One detail. Your call.");
  await expect(page.getByRole("button", { name: "Play demo", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "03 Evidence", exact: true }).click();
  await expect(page.locator(".hero-run-inspector")).toContainText("Source matched · Approval attached");
  await page.getByRole("button", { name: "Play demo", exact: true }).click();
  await expect(page.locator(".hero-live-product")).toHaveAttribute("data-phase", "0", { timeout: 6500 });
  await page.getByRole("button", { name: "Pause demo", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play demo", exact: true })).toBeVisible();
  await mkdir(".design/japac-globe/screenshots", { recursive: true });
  await page.locator(".hero-live-product").screenshot({ path: `.design/japac-globe/screenshots/hero-${testInfo.project.name}.png`, style: ".site-header { visibility: hidden; }" });
});

test("the globe has a map fallback and the finance art uses photography", async ({ page }) => {
  await page.route("**/globe/land-points.bin", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/#japac");
  const fallback = page.locator(".globe-fallback");
  await expect(fallback).toBeVisible();
  expect(await fallback.evaluate((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await expect(page.locator(".regional-globe")).toHaveAttribute("data-ready", "false");
  expect(await page.locator(".finance-art").evaluate((art) => getComputedStyle(art).backgroundImage)).toBe("none");
  await expect(page.locator(".story-photograph")).toHaveCount(1);
  await expect(page.getByRole("img", { name: "Sunlight and shadow in a concrete passage in Shiga, Japan" })).toHaveCount(1);
  await expect(page.getByRole("img", { name: "Portrait of a smiling woman" })).toHaveCount(0);
  const integrations = page.locator(".integration-grid");
  await integrations.scrollIntoViewIfNeeded();
  await expect(integrations.locator("img")).toHaveCount(8);
  await expect.poll(() => integrations.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0 && image.getAttribute("src")?.includes("official.svg")))).toBe(true);
  await page.getByRole("link", { name: "Connected tools", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your tools. A shared workforce." })).toBeInViewport();
});
