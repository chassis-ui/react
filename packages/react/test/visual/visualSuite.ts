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
 *
 * `viewports`, keyed by story id, sizes the page before navigation. A story's own
 * `globals.viewport` sizes the Storybook vitest addon's browser, but not this suite's, which loads
 * the story's iframe directly at the project's 1280×720.
 *
 * `fullPage` takes the whole page instead of the viewport, for an overview story taller than it,
 * once the story's render has finished: until Storybook shows the story it holds the page at the
 * viewport's height, and a first capture taken then never matches the next one.
 */
export function runVisualRegressionSuite(
  describeName: string,
  titlePrefixes: string[],
  options?: {
    waitFor?: (page: Page) => Promise<void>
    viewports?: Record<string, { width: number; height: number }>
    fullPage?: boolean
  }
): void {
  const stories = getStories(titlePrefixes)

  test.describe(describeName, () => {
    for (const story of stories) {
      test(`${story.title} — ${story.name}`, async ({ page }) => {
        const viewport = options?.viewports?.[story.id]
        if (viewport) await page.setViewportSize(viewport)
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
        if (options?.fullPage) await waitForStoryRender(page)
        await options?.waitFor?.(page)
        await expect(page).toHaveScreenshot(`${story.id}.png`, {
          animations: 'disabled',
          fullPage: options?.fullPage
        })
      })
    }
  })
}

/**
 * Waits until the story's render is finished, its `play` function included, then two animation
 * frames. A story whose `play` function changes the page ends in the state it was written to
 * leave, which a screenshot taken while it runs catches halfway; and a component that measures
 * itself (`DataGrid`'s scroll cues, `NavOverflow`'s items) settles a frame or two after React's
 * commit.
 */
export async function waitForStoryRender(page: Page): Promise<void> {
  await page.waitForFunction(
    () =>
      (window as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } })
        .__STORYBOOK_PREVIEW__?.currentRender?.phase === 'finished'
  )
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
  )
}
