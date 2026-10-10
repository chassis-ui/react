import { expect } from '@playwright/test'

import { runVisualRegressionSuite } from './visualSuite'

// Scoped to tree: `Tree.scss` (compiled into dist/style.css — see THEMING.md's "Component-scoped
// CSS") owns the whole surface of the component, which chassis-css has no partial for. The stories
// have no transition but the chevron's rotation, which `animations: 'disabled'` settles. The rows
// follow the tree's first render (react-aria-components builds the collection from the children,
// then renders it), so every story waits for its first row — the empty state's is the one holding
// the message — and `Default`'s play function expands and selects items after that: wait for the
// state it ends in.
runVisualRegressionSuite('tree visual regression', ['tree/'], {
  waitFor: async (page) => {
    await expect(page.locator('[role="row"]').first()).toBeVisible()
    if (page.url().includes('--default')) {
      await expect(page.locator('[role="row"][aria-expanded="true"]')).toHaveCount(2)
    }
  }
})
