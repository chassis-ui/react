import { defineConfig, devices } from '@playwright/test'

// Runs tests/ against this app, built and served as a consumer would deploy it. `next start`
// needs a build to exist: `pnpm smoke:test` from the repo root builds the library and the app
// first. See README.md.
//
// The `development` project runs the same tests against `next dev`. That is where issue #37
// shows: only a dev server has the browser still loading a client module while React reads the
// payload that references it, which is when an element arrives as a lazy node.
const PRODUCTION = 4330
const DEVELOPMENT = 4331

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { trace: 'retain-on-failure' },
  webServer: [
    {
      command: `next start -p ${PRODUCTION}`,
      url: `http://localhost:${PRODUCTION}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000
    },
    {
      command: `next dev -p ${DEVELOPMENT}`,
      url: `http://localhost:${DEVELOPMENT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000
    }
  ],
  projects: [
    {
      name: 'production',
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PRODUCTION}` }
    },
    {
      name: 'development',
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${DEVELOPMENT}` }
    }
  ]
})
