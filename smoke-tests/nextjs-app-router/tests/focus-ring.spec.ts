import { expect, test } from '@playwright/test'

// The library installs document-level listeners that hide a keyboard focus ring where a pointer
// press would show one (packages/react/src/utils/suppressFocusRingGlobally.ts). They once set an
// inline `outline` on every pressed link and button. Whether a pressed element matches
// `:focus-visible` is the browser's decision, so this needs a real pointer: the library's own
// specs run in jsdom, and its story tests press with synthetic events.

test('a pressed Button gets no inline style, and a key press shows its ring', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const button = page.getByRole('button', { name: 'hook-using button (forwardRef)' })

  await button.click()
  await expect(button).toBeFocused()
  await expect(button).not.toHaveAttribute('style')
  await expect(button).toHaveCSS('outline-style', 'none')

  await page.keyboard.press('Shift')
  await expect(button).not.toHaveAttribute('style')
  await expect(button).toHaveCSS('outline-style', 'solid')
})
