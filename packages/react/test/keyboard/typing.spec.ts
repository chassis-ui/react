import { expect, test, type Page } from '@playwright/test'

import { waitForStoryRender } from '../visual/visualSuite'

// Types with real key events into the fields of a built Storybook and reads back what they hold
// (RD25). `userEvent`, in the jsdom specs and in every story's `play` function, dispatches its
// events from JavaScript, and for such an event the browser runs nothing between one listener and
// the next. For a real keystroke it runs the render a listener asked for before it calls the next
// listener. A field that asked for a render from a listener on itself got it before React had read
// the edit, the render wrote the old value back, and an empty field lost the first character typed
// into it: every other test passed.

async function typeInto(page: Page, storyId: string, field: string, text: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`)
  await waitForStoryRender(page)
  const control = page.locator(`#storybook-root ${field}`).first()
  await control.fill('')
  await control.click()
  await page.keyboard.type(text, { delay: 30 })
  return control
}

const fields: { name: string; storyId: string; field: string; text?: string }[] = [
  { name: 'TextInput', storyId: 'text-input-textinput--with-form-field', field: 'input' },
  { name: 'Textarea', storyId: 'textarea-textarea--with-form-field', field: 'textarea' },
  { name: 'ChipInput', storyId: 'chip-input-chipinput--with-form-field', field: 'input' },
  { name: 'FloatingInput', storyId: 'floating-input-floatinginput--default', field: 'input' },
  { name: 'SearchField', storyId: 'search-field-searchfield--default', field: 'input' },
  { name: 'NumberField', storyId: 'number-field-numberfield--default', field: 'input', text: '123' }
]

test.describe('typing into an empty field', () => {
  for (const { name, storyId, field, text = 'abc' } of fields) {
    test(`${name} keeps every key`, async ({ page }) => {
      const control = await typeInto(page, storyId, field, text)
      await expect(control).toHaveValue(text)
    })
  }

  // The first character turns the field from invalid to valid, a render it asks for itself.
  test('a required field of a validated Form keeps every key', async ({ page }) => {
    await page.goto('/iframe.html?id=form-form--validated&viewMode=story')
    await waitForStoryRender(page)
    const city = page.getByRole('textbox', { name: 'City' })
    await city.fill('')
    await city.click()
    await page.keyboard.type('abc', { delay: 30 })
    await expect(city).toHaveValue('abc')
    await expect(city).not.toHaveAttribute('aria-invalid', 'true')
  })

  // A field marked by a submit it held back loses the mark with the first character. No story
  // has a required field outside a validated form, so the email field is made required here.
  test('a field held back by a submit keeps every key', async ({ page }) => {
    await page.goto('/iframe.html?id=form-form--default&viewMode=story')
    await waitForStoryRender(page)
    const email = page.getByRole('textbox', { name: 'Email address' })
    await email.evaluate((control: HTMLInputElement) => {
      control.required = true
      control.value = ''
    })
    await page.getByRole('button', { name: /submit/i }).click()
    await email.click()
    await page.keyboard.type('abc', { delay: 30 })
    await expect(email).toHaveValue('abc')
  })
})
