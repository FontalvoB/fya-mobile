import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90000,
  workers: 1,
  use: {
    baseURL: process.env.FYA_BASE_URL || "http://localhost:8081",
    viewport: { width: 390, height: 844 },
    channel: "chrome",
    headless: true,
    screenshot: "only-on-failure",
  },
  reporter: "list",
});
