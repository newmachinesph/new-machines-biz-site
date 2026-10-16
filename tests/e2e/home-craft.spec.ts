import { mkdir, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("connectors meet card edges and stay outside every card through responsive changes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "explicit responsive sizes");
  test.setTimeout(60000);
  const dir = ".design/home-craft/screenshots";
  await mkdir(dir, { recursive: true });
  const measurements = [];
  for (const width of [375, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: width === 768 ? 1024 : 900 });
    await page.goto("/#integrations");
    await page.evaluate(() => document.fonts.ready);
    const scene = page.locator(".connected-work");
    await scene.scrollIntoViewIfNeeded();
    const heights = [];
    for (const [index, name] of ["01 Context", "02 Agent work", "03 Approval", "04 Evidence"].entries()) {
      await page.getByRole("button", { name, exact: true }).click();
      await expect(scene).toHaveAttribute("data-phase", String(index));
      heights.push((await scene.boundingBox())!.height);
      measurements.push({ width, phase: index, layout: await scene.evaluate((element) => [...element.querySelectorAll(".connected-agent, .connected-action > p, .connected-fields > span, .brief-proof, .connected-output")].map((child) => ({ className: child.className, text: child.textContent?.slice(0, 40), height: child.getBoundingClientRect().height }))) });
      if (width >= 1024) {
        // One route per source (Gmail, Drive, Sheets, custom MCP server) plus the evidence route.
        await expect(scene.locator(".route-track")).toHaveCount(5);
        const routes = await scene.evaluate((element) => {
          const cards = [...element.querySelectorAll(".context-source, .connected-agent, .connected-output")].map((card) => card.getBoundingClientRect());
          const sources = [...element.querySelectorAll(".context-source")].map((card) => card.getBoundingClientRect());
          const agent = element.querySelector(".connected-agent")!.getBoundingClientRect();
          const output = element.querySelector(".connected-output")!.getBoundingClientRect();
          return [...element.querySelectorAll<SVGPathElement>(".route-track")].map((path, i) => {
            const matrix = path.getScreenCTM()!;
            const total = path.getTotalLength();
            const start = path.getPointAtLength(0).matrixTransform(matrix);
            const end = path.getPointAtLength(total).matrixTransform(matrix);
            const expectedStart = i < sources.length ? { x: sources[i].right, y: sources[i].top + sources[i].height / 2 } : { x: agent.right, y: agent.top + agent.height / 2 };
            const expectedEnd = i < sources.length ? { x: agent.left, y: agent.top + agent.height / 2 } : { x: output.left, y: output.top + output.height / 2 };
            const crossesCard = Array.from({ length: 31 }, (_, pointIndex) => path.getPointAtLength(total * pointIndex / 30).matrixTransform(matrix)).some((point) => cards.some((card) => point.x > card.left + .75 && point.x < card.right - .75 && point.y > card.top + .75 && point.y < card.bottom - .75));
            return { startError: Math.hypot(start.x - expectedStart.x, start.y - expectedStart.y), endError: Math.hypot(end.x - expectedEnd.x, end.y - expectedEnd.y), crossesCard };
          });
        });
        for (const route of routes) {
          expect(route.startError).toBeLessThan(.75);
          expect(route.endError).toBeLessThan(.75);
          expect(route.crossesCard).toBe(false);
        }
        measurements.push({ width, phase: index, routes });
      } else {
        await expect(scene.locator(".connected-routes")).toHaveCount(0);
      }
      if (width === 1280 || index === 3) await scene.screenshot({ path: `${dir}/connected-${width}-phase-${index}.png` });
    }
    await writeFile(dir + "/connector-measurements.json", JSON.stringify(measurements, null, 2));
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.locator("#integrations").screenshot({ path: `${dir}/integrations-${width}.png`, style: ".site-header { visibility: hidden; }" });
    await page.locator("#hero").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "02 Human review", exact: true }).click();
    await expect(page.locator(".ledger-record")).toContainText("¥87 needs a decision");
    await expect(page.locator(".ledger-exception")).toHaveText(/Aster Supply.*030679.*¥76,264.*Paper towel · 64.*129 units.*Paper towel · 63.*¥76,177.*Paper towel · 63/);
    await page.locator("#hero").screenshot({ path: `${dir}/hero-${width}.png`, style: ".site-header { visibility: hidden; }" });
    await page.getByRole("button", { name: "03 Evidence", exact: true }).click();
    await expect(page.locator(".ledger-record")).toContainText("Source values preserved");
    for (const id of ["trust", "control", "close"]) {
      const section = page.locator("#" + id);
      await section.scrollIntoViewIfNeeded();
      await section.screenshot({ path: `${dir}/${id}-${width}.png`, style: ".site-header { visibility: hidden; }" });
    }
    const receiptBounds = await page.locator(".work-receipt").evaluate((element) => {
      const card = element.getBoundingClientRect(), region = element.closest("section")!.getBoundingClientRect();
      return { top: card.top - region.top, bottom: region.bottom - card.bottom };
    });
    measurements.push({ width, receiptBounds });
    await writeFile(dir + "/connector-measurements.json", JSON.stringify(measurements, null, 2));
    expect(receiptBounds.top).toBeGreaterThanOrEqual(12);
    expect(receiptBounds.bottom).toBeGreaterThanOrEqual(12);
  }
  await writeFile(dir + "/connector-measurements.json", JSON.stringify(measurements, null, 2));
});

test("brief and source checks develop during playback, then approval stays attached", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#integrations");
  const scene = page.locator(".connected-work");
  await scene.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "01 Context", exact: true }).click();
  await expect(scene.locator(".brief-content")).toHaveAttribute("data-ready", "false");
  await page.getByRole("button", { name: "Play connected work", exact: true }).click();
  if (page.viewportSize()!.width >= 1024) {
    await expect.poll(() => scene.locator(".route-flow-input").first().evaluate((element) => getComputedStyle(element).animationName)).toBe("route-transfer");
  }
  await expect(scene).toHaveAttribute("data-phase", "1", { timeout: 4000 });
  await expect(scene.locator(".brief-content")).toHaveAttribute("data-ready", "true");
  await expect(scene).toHaveAttribute("data-phase", "2", { timeout: 4000 });
  await expect(scene.locator(".output-status")).toHaveText("Awaiting review");
  await expect(scene).toHaveAttribute("data-phase", "3", { timeout: 4000 });
  await expect(scene.locator(".brief-citations > span")).toHaveCount(3);
  await expect(scene.locator(".brief-proof")).toContainText("3 sources · Human approved");
});
