import { defineConfig } from "@playwright/test";
const productionURL = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: "./tests/e2e", fullyParallel: false, workers: 1, timeout: 30000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: productionURL || "http://localhost:3000", browserName: "chromium", channel: "msedge", headless: true, reducedMotion: "reduce" },
  webServer: productionURL ? undefined : { command: "npm run start", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120000 },
});
