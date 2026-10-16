import { mkdir, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("company logos scroll continuously on every screen without visible playback controls", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#customers");
  const reel = page.locator(".logo-reel"), track = reel.locator(".roster-track");
  await reel.scrollIntoViewIfNeeded();
  await expect(reel).toHaveAttribute("data-reel-playing", "true");
  await expect(reel.getByRole("button")).toHaveCount(0);
  await expect(reel.getByRole("img")).toHaveCount(16);
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("running");
  const start = (await track.boundingBox())!.x;
  await expect.poll(async () => Math.abs((await track.boundingBox())!.x - start)).toBeGreaterThan(8);
  const seam = await reel.evaluate((element) => {
    const original = element.querySelector(".roster-primary")!.getBoundingClientRect();
    const duplicate = element.querySelector(".roster-duplicate")!.getBoundingClientRect();
    return { gap: duplicate.left - original.right, widthDifference: duplicate.width - original.width };
  });
  expect(Math.abs(seam.gap)).toBeLessThan(.5);
  expect(Math.abs(seam.widthDifference)).toBeLessThan(.5);
  const directory = ".design/logo-reel/screenshots";
  await mkdir(directory, { recursive: true });
  await page.locator("#customers").screenshot({ path: `${directory}/logos-${testInfo.project.name}.png`, animations: "allow", style: ".site-header { visibility: hidden; }" });
  await reel.locator(".roster-window").focus();
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("paused");
  await reel.locator(".roster-window").evaluate((element) => (element as HTMLElement).blur());
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("running");
  await page.locator("#close").scrollIntoViewIfNeeded();
  await expect(reel).toHaveAttribute("data-reel-playing", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await reel.scrollIntoViewIfNeeded();
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  await expect(reel.locator(".roster-duplicate")).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("connected work plays, pauses, holds offscreen and offers manual stages", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#integrations");
  const scene = page.locator(".connected-work");
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-playing", "true");
  const start = await scene.getAttribute("data-phase");
  await expect.poll(() => scene.getAttribute("data-phase"), { timeout: 6500 }).not.toBe(start);
  await page.getByRole("button", { name: "Pause connected work", exact: true }).click();
  await expect(scene).toHaveAttribute("data-playing", "false");
  const stopped = await scene.getAttribute("data-phase");
  await page.waitForTimeout(3100);
  await expect(scene).toHaveAttribute("data-phase", stopped!);
  await page.getByRole("button", { name: "03 Review", exact: true }).click();
  await expect(scene).toContainText("Every decision goes to a person.");
  await expect(scene.locator(".connected-fields")).toContainText("Needs review");
  await page.getByRole("button", { name: "04 Evidence", exact: true }).click();
  await expect(scene.locator(".output-status")).toHaveText("Verified");
  await page.getByRole("button", { name: "Play connected work", exact: true }).click();
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-playing", "false");
  const offscreen = await scene.getAttribute("data-phase");
  await page.waitForTimeout(4100);
  await expect(scene).toHaveAttribute("data-phase", offscreen!);
});

test("reduced motion has static useful outcomes and manual controls still work", async ({ page }) => {
  await page.goto("/#integrations");
  const scene = page.locator(".connected-work");
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-phase", "3");
  await expect(scene).toHaveAttribute("data-playing", "false");
  await expect(page.getByRole("button", { name: "Pause connected work" })).toHaveCount(0);
  await page.getByRole("button", { name: "01 Context", exact: true }).click();
  await expect(scene).toHaveAttribute("data-phase", "0");
  await expect(scene).toContainText("The right context, together.");
  await page.locator(".story-sales").scrollIntoViewIfNeeded();
  await expect(page.locator(".account-research")).toHaveAttribute("data-research-phase", "3");
  await expect(page.locator(".account-outreach")).toHaveClass(/outreach-ready/);
});

test("enquiries become leads-sheet rows and the cap preview pauses before a charge", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#customer-stories");
  await page.locator(".story-sales").scrollIntoViewIfNeeded();
  await expect(page.locator(".account-research")).toHaveAttribute("data-research-phase", "3", { timeout: 7000 });
  await expect(page.locator(".account-outreach")).toContainText("You approve the rows.");
  await expect(page.locator(".account-fit")).toHaveText(["This month", "Next week", "—"]);
  await page.getByRole("button", { name: "Preview cap reached", exact: true }).click();
  await expect(page.locator(".cap-preview-event")).toContainText("$310.00");
  await expect(page.locator(".settlement-rule")).toContainText("Run stopped");
  await page.getByRole("button", { name: "Reset cap preview", exact: true }).click();
  await expect(page.locator(".cap-preview-event")).toHaveCount(0);
  await expect(page.locator(".settlement-rule")).toContainText("Eligible");
});

test("capture responsive motion scenes and verify the important geometry", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "viewports are reviewed explicitly");
  test.setTimeout(60000);
  const dir = ".design/home-motion/screenshots";
  await mkdir(dir, { recursive: true });
  const measurements = [];
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: width === 768 ? 1024 : 812 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    for (const id of ["hero", "customers", "work-explorer", "control", "integrations", "customer-stories", "human"]) {
      const region = page.locator("#" + id);
      await region.scrollIntoViewIfNeeded();
      await expect.poll(() => region.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      await region.screenshot({ path: dir + "/" + id + "-" + width + ".png", style: ".site-header { visibility: hidden; }" });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    const logoBounds = await page.locator(".integration-grid .integration-tool").evaluateAll((tools) => tools.map((tool) => {
      const tile = tool.getBoundingClientRect(), logo = tool.querySelector("img")!.getBoundingClientRect();
      return { left: logo.left - tile.left, right: tile.right - logo.right };
    }));
    for (const logo of logoBounds) { expect(logo.left).toBeGreaterThanOrEqual(8); expect(logo.right).toBeGreaterThanOrEqual(8); }
    const box = await page.locator(".workflow-selection").evaluate((element) => element.getBoundingClientRect().toJSON());
    const selected = await page.locator(".workflow-selector button[aria-pressed=true]").boundingBox();
    expect(Math.abs(box.x - selected!.x)).toBeLessThan(2);
    expect(Math.abs(box.width - selected!.width)).toBeLessThan(2);
    const bounds = await page.locator(".account-outreach").evaluate((element) => {
      const card = element.getBoundingClientRect(), art = element.closest(".story-art")!.getBoundingClientRect();
      return { left: card.left - art.left, right: art.right - card.right, bottom: art.bottom - card.bottom };
    });
    expect(bounds.left).toBeGreaterThan(8);
    expect(bounds.right).toBeGreaterThan(8);
    expect(bounds.bottom).toBeGreaterThan(8);
    measurements.push({ width, pageHeight: await page.evaluate(() => document.documentElement.scrollHeight), selection: box, briefBounds: bounds });
  }
  await writeFile(dir + "/measurements.json", JSON.stringify(measurements, null, 2));
});

test("record real motion and verify that editorial entrances animate", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "one recording at the desktop viewport");
  test.setTimeout(35000);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator("#integrations").scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => document.getAnimations().some((animation) => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    return target instanceof HTMLElement && target.matches(".section-opener > div:first-child");
  })), { timeout: 1500, intervals: [20, 40, 80] }).toBe(true);
  const scene = page.locator(".connected-work");
  await scene.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "01 Context", exact: true }).click();
  await page.getByRole("button", { name: "Play connected work", exact: true }).click();
  const dir = ".design/home-motion/recording";
  await mkdir(dir, { recursive: true });
  const frames: { file: string; time: number; phase: string | null }[] = [], phases = new Set();
  const started = Date.now();
  while (Date.now() - started < 12200) {
    const phase = await scene.getAttribute("data-phase");
    phases.add(phase);
    const file = "frame-" + String(frames.length).padStart(3, "0") + ".png";
    await scene.screenshot({ path: dir + "/" + file, animations: "allow" });
    frames.push({ file, time: Date.now() - started, phase });
    await page.waitForTimeout(400);
  }
  expect([...phases].sort()).toEqual(["0", "1", "2", "3"]);
  await writeFile(dir + "/frames.json", JSON.stringify(frames, null, 2));
});
