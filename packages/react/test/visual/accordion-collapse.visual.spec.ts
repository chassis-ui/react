import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

// See calendar-datepicker.visual.spec.ts / toast-notification.visual.spec.ts for why this reads
// Storybook's build manifest instead of hardcoding a story list.
interface StoryIndexEntry {
  id: string
  name: string
  title: string
  type: string
}

// `storybook:build` writes to the repo root's `_storybook/` (`storybook build -o ../../_storybook`,
// run with cwd=packages/react — see that script and playwright.config.ts's `webServer`), two
// levels up from this file's own `process.cwd()`.
const indexPath = path.join(process.cwd(), '../../_storybook/index.json')
const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as {
  entries: Record<string, StoryIndexEntry>
}

// Scoped to accordion/collapse (see the enterprise migration plan's Phase 10 — the third
// candidate group: native <details>/CSSTransition-driven open-close state, no DOM markup change
// to catch a regression via a vitest snapshot). A future family gets its own
// *.visual.spec.ts with its own title-prefix filter, rather than widening this one.
const stories = Object.values(index.entries).filter(
  (entry) =>
    entry.type === 'story' &&
    (entry.title.startsWith('accordion/') || entry.title.startsWith('collapse/'))
)

test.describe('accordion/collapse visual regression', () => {
  for (const story of stories) {
    test(`${story.title} — ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
      // Neither family has a post-mount timer to wait out here (see the comments in
      // Accordion.stories.tsx / Collapse.stories.tsx for why) — both render their final state on
      // first paint, so `animations: 'disabled'` alone is enough, same treatment as
      // calendar/datepicker's static stories.
      await expect(page).toHaveScreenshot(`${story.id}.png`, { animations: 'disabled' })
    })
  }
})
