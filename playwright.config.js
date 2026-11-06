const { defineConfig, devices } = require("@playwright/test");
const path = require("node:path");

process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(".cache/ms-playwright");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4000",
    colorScheme: "light",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "python3 scripts/serve-preview.py",
    url: "http://127.0.0.1:4000",
    reuseExistingServer: true,
    timeout: 10000,
  },
});
