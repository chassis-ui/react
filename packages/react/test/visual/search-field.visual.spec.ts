import { expect } from '@playwright/test'

import { runVisualRegressionSuite } from './visualSuite'

// Scoped to search-field: `SearchField.scss` (compiled into dist/style.css — see THEMING.md's
// "Component-scoped CSS") hides the browser's own clear button and colors the field's. The stories
// set their locale and have no transitions, so `animations: 'disabled'` is enough, but `Default`'s
// play function types into the field after the page loads: wait for the value it ends with.
runVisualRegressionSuite('search-field visual regression', ['search-field/'], {
  waitFor: async (page) => {
    if (page.url().includes('--default')) {
      await expect(page.locator('input[type="search"]')).toHaveValue('react')
    }
  }
})
