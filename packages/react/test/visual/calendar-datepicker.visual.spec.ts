import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

// Storybook's build emits a manifest of every story (id/title/name) alongside the static site.
// Reading it here (rather than hardcoding a story list) means a new story added to Calendar.tsx/
// RangeCalendar.tsx/DatePicker.tsx/DateRangePicker.tsx's *.stories.tsx files is automatically
// covered without also having to edit this file. This read happens at test-collection time,
// before Playwright's own `webServer` starts (which only serves, it doesn't build — see
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
const indexPath = path.join(process.cwd(), '../../_storybook/index.json')
const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as {
  entries: Record<string, StoryIndexEntry>
}

// Scoped to the calendar/datepicker family for now (see the enterprise migration plan's Phase 4
// visual-regression item — Phase 2 touched this family's CSS output directly, and snapshot tests
// alone don't catch a visual regression there). A future family gets its own *.visual.spec.ts
// with its own title-prefix filter, rather than widening this one.
const stories = Object.values(index.entries).filter(
  (entry) =>
    entry.type === 'story' &&
    (entry.title.startsWith('calendar/') || entry.title.startsWith('datepicker/'))
)

test.describe('calendar/datepicker visual regression', () => {
  for (const story of stories) {
    test(`${story.title} — ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
      await expect(page).toHaveScreenshot(`${story.id}.png`, { animations: 'disabled' })
    })
  }
})
