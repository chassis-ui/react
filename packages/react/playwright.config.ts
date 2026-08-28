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
  // Playwright's own default (`{testFileName}-snapshots/`, a sibling of the spec file) scatters
  // one baseline folder per family alongside the specs. Collecting them all under a single
  // `__snapshots__/` instead — still one subfolder per spec file, to keep families from colliding
  // on story-id filenames — matches this repo's existing `__snapshots__/` convention for vitest's
  // own DOM snapshots (see e.g. test/components/button/__snapshots__/). No `{testFileDir}` segment
  // here (unlike Playwright's own default template) — every *.visual.spec.ts lives directly at
  // this testDir's root, so that token always resolves empty; keeping it in would still work most
  // of the time (it'd just collapse to a double slash), but omitting `{snapshotDir}` entirely does
  // NOT degrade gracefully: with `{testFileDir}` empty, a template that starts with a bare
  // `__snapshots__` after it collapses to an absolute path (`/__snapshots__/...`) instead of one
  // relative to `snapshotDir`. Anchoring explicitly on `{snapshotDir}` avoids that trap.
  snapshotPathTemplate:
    '{snapshotDir}/__snapshots__/{testFileName}/{arg}{-projectName}{-platform}{ext}',
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
