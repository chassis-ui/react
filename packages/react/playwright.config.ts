import { defineConfig, devices } from '@playwright/test'

// Visual regression tests against a built Storybook (see test/visual/). The spec file reads
// _storybook/index.json synchronously at collection time to enumerate stories, which needs
// to already exist on disk before Playwright even starts loading spec files — so building
// Storybook is a separate, prior step (the `test:visual` script: `build-storybook && playwright
// test`), not something this config's `webServer` does. `webServer` here only serves the
// already-built output.
export default defineConfig({
  testDir: './test/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:6006',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npx http-server ../../_storybook -p 6006 -s',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
})
