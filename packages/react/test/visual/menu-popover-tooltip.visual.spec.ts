import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

// Storybook's build emits a manifest of every story (id/title/name) alongside the static site.
// Reading it here (rather than hardcoding a story list) means a new story added to Menu.tsx/
// Popover.tsx/Tooltip.tsx's *.stories.tsx files is automatically covered without also having to
// edit this file. This read happens at test-collection time, before Playwright's own `webServer`
// starts (which only serves, it doesn't build — see playwright.config.ts) — the manifest must
// already be on disk, which is why `pnpm test:visual` runs `build-storybook` first as a separate,
// prior step rather than folding it into `webServer`.
interface StoryIndexEntry {
  id: string
  name: string
  title: string
  type: string
}

const indexPath = path.join(process.cwd(), '_storybook/index.json')
const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as {
  entries: Record<string, StoryIndexEntry>
}

// Scoped to menu/popover/tooltip (see the enterprise migration plan's Phase 10 — grouped here as
// the highest-value first target: pure CSS-driven positioning, no DOM markup change to catch a
// regression via a vitest snapshot). A future family gets its own *.visual.spec.ts with its own
// title-prefix filter, rather than widening this one.
const stories = Object.values(index.entries).filter(
  (entry) =>
    entry.type === 'story' &&
    (entry.title.startsWith('menu/') ||
      entry.title.startsWith('popover/') ||
      entry.title.startsWith('tooltip/'))
)

test.describe('menu/popover/tooltip visual regression', () => {
  for (const story of stories) {
    test(`${story.title} — ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
      await expect(page).toHaveScreenshot(`${story.id}.png`, { animations: 'disabled' })
    })
  }
})
