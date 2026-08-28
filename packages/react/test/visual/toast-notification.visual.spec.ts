import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

// Storybook's build emits a manifest of every story (id/title/name) alongside the static site.
// Reading it here (rather than hardcoding a story list) means a new story added to Toast.tsx/
// Notification.tsx's *.stories.tsx files is automatically covered without also having to edit
// this file. This read happens at test-collection time, before Playwright's own `webServer`
// starts (which only serves, it doesn't build — see playwright.config.ts) — the manifest must
// already be on disk, which is why `pnpm test:visual` runs `build-storybook` first as a separate,
// prior step rather than folding it into `webServer`.
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

// Scoped to toast/notification (see the enterprise migration plan's Phase 10 — grouped here as
// the second-highest-value target: both are transition-heavy (fade/show CSS classes toggled by
// react-transition-group), no DOM markup change to catch a regression via a vitest snapshot). A
// future family gets its own *.visual.spec.ts with its own title-prefix filter, rather than
// widening this one.
const stories = Object.values(index.entries).filter(
  (entry) =>
    entry.type === 'story' &&
    (entry.title.startsWith('toast/') || entry.title.startsWith('notification/'))
)

test.describe('toast/notification visual regression', () => {
  for (const story of stories) {
    test(`${story.title} — ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
      // Unlike Popover/Tooltip (whose `Transition` `timeout.enter` is 0 — see
      // menu-popover-tooltip.visual.spec.ts), Toast mounts with internal state `false` and only
      // syncs to the story's `visible: true` arg in a `useEffect` *after* mount, so every one of
      // these stories genuinely animates through a real 250ms `entering` phase rather than
      // starting already-settled. `animations: 'disabled'` zeroes CSS transition/animation
      // duration, but react-transition-group's own `entering` → `entered` state change is
      // wall-clock-timer-driven (`setTimeout`), not CSS — so a screenshot taken before that timer
      // fires intermittently catches the mid-transition class instead of the final `show` one.
      // `useDismissibleTransition.getTransitionClass` applies `'show showing'` while entering/
      // exiting and only bare `'show'` once settled (see src/hooks/useDismissibleTransition.ts) —
      // a plain `.show` selector matches the entering class list too (it's just a substring
      // token), so it resolves at the *start* of the transition, not the end. `:not(.showing)`
      // is what actually waits for the settled state.
      await page.locator('.show:not(.showing)').first().waitFor()
      await expect(page).toHaveScreenshot(`${story.id}.png`, { animations: 'disabled' })
    })
  }
})
