import { expect, test, type Page } from '@playwright/test'

// Every route under app/rsc/ is a Server Component that composes library components directly,
// with a client component of the app's own in the subtree. Each test loads one, checks what the
// server sent before any script ran, then checks the page after hydration, and fails on anything
// the browser reports.

// What the server rendered, parsed without running scripts.
async function serverMarkup(page: Page, path: string) {
  const response = await page.request.get(path)
  expect(response.status()).toBe(200)
  const html = await response.text()
  return html.slice(html.indexOf('<main>'), html.indexOf('</main>'))
}

async function open(page: Page, path: string) {
  const problems: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => problems.push(`uncaught: ${error.message}`))
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  return problems
}

test('asChild renders the child element', async ({ page }) => {
  const server = await serverMarkup(page, '/rsc/as-child')
  expect(server).toContain('<a href="/feed.xml" aria-label="Feed" class="button primary link">')
  expect(server).not.toContain('<button')

  const problems = await open(page, '/rsc/as-child')
  await expect(page.getByRole('link', { name: 'Feed' })).toHaveClass('button primary link')
  const disabled = page.getByRole('link', { name: 'Disabled link' })
  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  await expect(disabled).toHaveAttribute('tabindex', '-1')
  // Inside <main>: the dev server adds a button of its own to the page.
  await expect(page.getByRole('main').getByRole('button')).toHaveCount(0)
  expect(problems).toEqual([])
})

test('Tooltip shows on its trigger', async ({ page }) => {
  const problems = await open(page, '/rsc/tooltip')
  // Moved onto the trigger in steps, as a hand moves a pointer: react-aria shows a tooltip on
  // hover only once it has seen the pointer move, which `hover()`'s single jump doesn't give it.
  const trigger = page.getByRole('button', { name: /Tooltip trigger/ })
  const box = (await trigger.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 60)
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 })
  await expect(page.getByRole('tooltip')).toHaveText('Tip text')
  expect(problems).toEqual([])
})

test('Popover opens from its trigger', async ({ page }) => {
  const problems = await open(page, '/rsc/popover')
  await page.getByRole('button', { name: /Popover trigger/ }).click()
  await expect(page.getByRole('dialog', { name: 'Popover title' })).toContainText('Popover body')
  expect(problems).toEqual([])
})

test('Tabs renders its tabs and switches panels', async ({ page }) => {
  const server = await serverMarkup(page, '/rsc/tabs')
  expect(server).toMatch(/role="tab"[^>]*>First</)
  expect(server).toContain('First panel')

  const problems = await open(page, '/rsc/tabs')
  await expect(page.getByRole('tab')).toHaveText(['First', 'Second'])
  await expect(page.getByRole('tabpanel')).toContainText('First panel')
  await page.getByRole('tab', { name: 'Second' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Second panel')
  expect(problems).toEqual([])
})

test('List picks its root element from its items', async ({ page }) => {
  const server = await serverMarkup(page, '/rsc/list')
  expect(server).not.toMatch(/<ul[^>]*><a/)

  const problems = await open(page, '/rsc/list')
  for (const id of ['with-component', 'with-as-child']) {
    const list = page.getByTestId(id)
    await expect(list).toHaveJSProperty('tagName', 'DIV')
    await expect(list.getByRole('link')).toHaveClass(/list-item list-action/)
    await expect(list.locator('> :not(a)')).toHaveJSProperty('tagName', 'DIV')
  }
  const plain = page.getByTestId('plain')
  await expect(plain).toHaveJSProperty('tagName', 'UL')
  await expect(plain.getByRole('listitem')).toContainText('Only item')
  expect(problems).toEqual([])
})

test('Stepper picks its root element from its steps', async ({ page }) => {
  const server = await serverMarkup(page, '/rsc/stepper')
  expect(server).not.toMatch(/<ol[^>]*><a/)

  const problems = await open(page, '/rsc/stepper')
  const stepper = page.getByTestId('with-link')
  await expect(stepper).toHaveJSProperty('tagName', 'DIV')
  await expect(stepper.getByRole('link', { name: /Cart/ })).toHaveClass(/stepper-item/)
  await expect(stepper.getByText('Payment')).toHaveJSProperty('tagName', 'DIV')
  await expect(page.getByTestId('plain')).toHaveJSProperty('tagName', 'OL')
  expect(problems).toEqual([])
})

test('Combobox lists its items and groups', async ({ page }) => {
  const problems = await open(page, '/rsc/combobox')
  await page.getByRole('combobox', { name: 'Fruit' }).click()
  await expect(page.getByRole('option')).toHaveText([/Apple/, 'Cherry', 'Plum'])
  await expect(page.getByRole('listbox')).toContainText('Stone fruit')
  await page.getByRole('option', { name: 'Cherry' }).click()
  await expect(page.getByRole('combobox', { name: 'Fruit' })).toHaveValue('Cherry')
  expect(problems).toEqual([])
})

test('StaticTable renders in place of Table', async ({ page }) => {
  const server = await serverMarkup(page, '/rsc/static-table')
  expect(server).toContain('<table class="table hoverable striped">')

  const problems = await open(page, '/rsc/static-table')
  await expect(page.getByRole('table', { name: 'Users' })).toBeVisible()
  await expect(page.getByRole('columnheader')).toHaveText(['Name', 'Profile'])
  await expect(page.getByRole('row', { name: /Mark/ }).getByRole('link')).toHaveText('@mark')
  expect(problems).toEqual([])
})

test('Autocomplete lists its items and groups', async ({ page }) => {
  const problems = await open(page, '/rsc/autocomplete')
  await page.getByRole('button', { name: /Fruit|Select a fruit/ }).click()
  await expect(page.getByRole('option')).toHaveText([/Apple/, 'Cherry', 'Plum'])
  await expect(page.getByRole('listbox')).toContainText('Stone fruit')
  expect(problems).toEqual([])
})

test('DataGrid renders its static columns and rows', async ({ page }) => {
  const problems = await open(page, '/rsc/datagrid')
  await expect(page.getByRole('grid', { name: 'People' })).toBeVisible()
  await expect(page.getByRole('columnheader')).toHaveText(['Name', 'Role'])
  await expect(page.getByRole('rowheader')).toHaveText('Mark')
  await expect(page.getByRole('gridcell')).toContainText('Engineer')
  expect(problems).toEqual([])
})

test('Toast shows, settles and closes', async ({ page }) => {
  const problems = await open(page, '/rsc/toast')
  const toast = page.getByRole('status')
  await expect(toast).toContainText('Toast message')
  await expect(toast).toHaveClass(/\bshow\b/)
  await expect(toast).not.toHaveClass(/\bshowing\b/)
  await toast.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('status')).toHaveCount(0)
  expect(problems).toEqual([])
})

test('Notification shows, settles and closes', async ({ page }) => {
  const problems = await open(page, '/rsc/notification')
  const notification = page.getByRole('status')
  await expect(notification).toContainText('Notification text')
  await expect(notification).toHaveClass(/\bshow\b/)
  await expect(notification).not.toHaveClass(/\bshowing\b/)
  await notification.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('status')).toHaveCount(0)
  expect(problems).toEqual([])
})

test('Collapse renders open', async ({ page }) => {
  const server = await serverMarkup(page, '/rsc/collapse')
  expect(server).toContain('class="collapse show"')
  expect(server).toContain('Collapse content')

  const problems = await open(page, '/rsc/collapse')
  await expect(page.getByText('Collapse content')).toBeVisible()
  await expect(page.getByText('Collapse content')).toHaveClass('collapse show')
  expect(problems).toEqual([])
})

test('NavOverflow collapses a Nav of router links and a TabList', async ({ page }) => {
  // The server can't know what fits: every item is in its HTML, and none is hidden.
  const server = await serverMarkup(page, '/rsc/nav-overflow')
  expect(server).toContain('href="/rsc/nav-overflow?page=settings"')
  expect(server).toMatch(/role="tab"[^>]*>Attachments</)
  expect(server).not.toContain('data-cx-nav-overflow')

  const problems = await open(page, '/rsc/nav-overflow')
  const nav = page.getByRole('navigation', { name: 'Pages' })
  await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Settings' })).toBeHidden()
  await nav.getByRole('button', { name: 'More' }).click()
  const settings = nav.getByRole('menuitem', { name: 'Settings' })
  await expect(settings).toBeVisible()
  await expect(settings).toHaveAttribute('href', '/rsc/nav-overflow?page=settings')
  await page.keyboard.press('Escape')

  const tablist = page.getByRole('tablist', { name: 'Sections' })
  await expect(tablist.getByRole('tab', { name: 'Overview' })).toBeVisible()
  await expect(tablist.getByRole('tab', { name: 'Attachments' })).toBeHidden()
  await tablist.getByRole('tab', { name: 'More' }).click()
  await page.getByRole('menuitem', { name: 'Attachments' }).click()
  const attachments = tablist.getByRole('tab', { name: 'Attachments' })
  await expect(attachments).toBeVisible()
  await expect(attachments).toHaveAttribute('aria-selected', 'true')
  await expect(attachments).toBeFocused()
  await expect(page.getByRole('tabpanel')).toContainText('Attachments panel')
  expect(problems).toEqual([])
})

test('Scrollspy marks the section being read, for router links too', async ({ page }) => {
  // The server has no scroll position: no link is marked in its HTML.
  const server = await serverMarkup(page, '/rsc/scrollspy')
  expect(server).toContain('href="#options"')
  expect(server).not.toContain('aria-current')

  const problems = await open(page, '/rsc/scrollspy')
  const nav = page.getByRole('navigation', { name: 'Sections' })
  await expect(nav.getByRole('link', { name: 'Intro' })).toHaveAttribute('aria-current', 'true')

  // A router link given with `asChild`.
  await page.evaluate(() => document.getElementById('usage')?.scrollIntoView())
  await expect(nav.getByRole('link', { name: 'Usage' })).toHaveAttribute('aria-current', 'true')
  await expect(nav.getByRole('link', { name: 'Intro' })).not.toHaveAttribute('aria-current')

  await page.evaluate(() => document.getElementById('options')?.scrollIntoView())
  await expect(nav.getByRole('link', { name: 'Options' })).toHaveAttribute('aria-current', 'true')
  expect(problems).toEqual([])
})
