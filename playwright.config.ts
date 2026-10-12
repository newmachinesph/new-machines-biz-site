import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";
const port = new URL(baseURL).port || "3000";

export default defineConfig({
  testDir: "tests/e2e",
  // {platform} keeps Windows and Linux baselines apart - font rasterisation differs.
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}-{platform}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  // reducedMotion: every Motion effect renders its static final state, so baselines are deterministic.
  use: { baseURL, trace: "retain-on-failure", reducedMotion: "reduce" },
  // Always serve the production build: a reused `next dev` would put its dev overlay in the baselines.
  webServer: { command: `pnpm build && pnpm exec next start -p ${port}`, url: baseURL, reuseExistingServer: false, timeout: 180_000 },
  projects: [
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
