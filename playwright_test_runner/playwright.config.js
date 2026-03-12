const { defineConfig, devices } = require("@playwright/test");
const path = require("path");
const dotenv = require("dotenv");

// Load env from .env if present (the orchestrator manages actual env values)
dotenv.config({ path: path.resolve(__dirname, ".env") });

const baseURL =
  process.env.E2E_BASE_URL ||
  "https://the-internet.herokuapp.com"; // default target per work item

module.exports = defineConfig({
  testDir: path.join(__dirname, "playwright", "tests"),

  // Where Playwright stores test output artifacts (screenshots, traces, videos, etc.)
  outputDir: path.join(__dirname, "playwright", "test-results"),

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  // Helpful in CI; locally you can override via PWDEBUG=1 etc.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    // Console output (shows per-test status and timing in the terminal)
    ["list"],

    /**
     * HTML report (requested):
     * - Summary (total/passed/failed), timing, project/browser info are included by Playwright.
     * - Step details are shown where supported, and are richer when traces are available.
     */
    [
      "html",
      {
        // Save report in a top-level folder named exactly "playwright-report"
        outputFolder: path.join(__dirname, "playwright-report"),
        // Auto-open report on local runs; stay non-interactive in CI
        open: process.env.CI ? "never" : "on-failure",
      },
    ],

    // JUnit for CI systems that ingest XML reports
    ["junit", { outputFile: path.join(__dirname, "playwright", "junit.xml") }],
  ],

  use: {
    baseURL,

    /**
     * Artifacts that enrich the HTML report:
     * - Traces provide action-by-action details and timings ("steps") when supported.
     * - Screenshots/videos help contextualize failures.
     */
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    actionTimeout: 10_000,
    navigationTimeout: 20_000,

    // Reasonable default viewport
    viewport: { width: 1280, height: 720 },

    // Keep tests deterministic
    locale: "en-US",
    timezoneId: "UTC",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
