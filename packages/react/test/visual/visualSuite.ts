import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test, type Page } from '@playwright/test'

// Storybook's build emits a manifest of every story (id/title/name) alongside the static site.
// Reading it here (rather than hardcoding a story list) means a new story on an already-covered
// component is picked up automatically. This read happens at test-collection time, before
// Playwright's own `webServer` starts (which only serves, it doesn't build — see
// playwright.config.ts) — the manifest must already be on disk, which is why `pnpm test:visual`
// runs `build-storybook` first as a separate, prior step rather than folding it into `webServer`.
interface StoryIndexEntry {
  id: string
  name: string
  title: string
  type: string
}

// `storybook:build` writes to the repo root's `_storybook/` (`storybook build -o ../../_storybook`,
// run with cwd=packages/react — see that script and playwright.config.ts's `webServer`), two
// levels up from this file's own `process.cwd()`.
function getStories(titlePrefixes: string[]): StoryIndexEntry[] {
  const indexPath = path.join(process.cwd(), '../../_storybook/index.json')
  const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as {
    entries: Record<string, StoryIndexEntry>
  }
  return Object.values(index.entries).filter(
    (entry) =>
      entry.type === 'story' && titlePrefixes.some((prefix) => entry.title.startsWith(prefix))
  )
}

/**
 * Registers a `test.describe` block that screenshots every Storybook story whose title starts
 * with one of `titlePrefixes`. Each family gets its own `*.visual.spec.ts` calling this once with
 * its own prefix list, rather than a widened shared spec — see AGENTS.md's Visual regression
 * section for why families stay split.
 *
 * `waitFor`, when given, runs after navigation and before the screenshot — for a family like
 * toast/notification whose settled state isn't reachable through `animations: 'disabled'` alone
 * (see toast-notification.visual.spec.ts for why).
 */
export function runVisualRegressionSuite(
  describeName: string,
  titlePrefixes: string[],
  options?: { waitFor?: (page: Page) => Promise<void> }
): void {
  const stories = getStories(titlePrefixes)

  test.describe(describeName, () => {
    for (const story of stories) {
      test(`${story.title} — ${story.name}`, async ({ page }) => {
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
        await options?.waitFor?.(page)
        await expect(page).toHaveScreenshot(`${story.id}.png`, { animations: 'disabled' })
      })
    }
  })
}
