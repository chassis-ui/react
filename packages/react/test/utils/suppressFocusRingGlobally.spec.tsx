import { fireEvent } from '@testing-library/react'

import { install } from '../../src/utils/suppressFocusRingGlobally'

// Whether a focused element matches `:focus-visible` is the browser's decision, and jsdom's is not
// a browser's: each element here is told what to answer. `add` makes one that matches, the case
// the module exists for (an element focused by script during a press); `focusVisible: false` is
// what a browser answers for its own focus on a press. smoke-tests/nextjs-app-router checks that
// with a real pointer.
describe('suppressFocusRingGlobally', () => {
  const add = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    { outline = '2px solid red', focusVisible = true } = {}
  ) => {
    const el = document.createElement(tag)
    if (outline) el.style.outline = outline
    vi.spyOn(el as HTMLElement, 'matches').mockImplementation((selector) =>
      selector === ':focus-visible'
        ? focusVisible
        : HTMLElement.prototype.matches.call(el, selector)
    )
    document.body.appendChild(el)
    return el
  }

  afterEach(() => {
    // A key press ends every suppression and forgets the pressed element.
    fireEvent.keyDown(document.body)
    document.body.innerHTML = ''
  })

  test('leaves a pressed element alone until it takes focus', () => {
    const button = add('button', { outline: '' })

    fireEvent.pointerDown(button)

    expect(button).not.toHaveAttribute('style')
  })

  test('leaves a pressed element alone when it takes focus without :focus-visible', () => {
    const button = add('button', { outline: '', focusVisible: false })

    fireEvent.pointerDown(button)
    button.focus()

    expect(button).toHaveFocus()
    expect(button).not.toHaveAttribute('style')
  })

  test('suppresses the outline of the pressed element when it takes focus, and restores it on blur', () => {
    const button = add('button')

    fireEvent.pointerDown(button)
    button.focus()
    expect(button.style.outline).toBe('none')

    button.blur()
    expect(button.style.outline).toBe('2px solid red')
  })

  test('leaves no style attribute behind on an element that had none', () => {
    const button = add('button', { outline: '' })

    fireEvent.pointerDown(button)
    button.focus()
    expect(button.style.outline).toBe('none')

    button.blur()
    expect(button).not.toHaveAttribute('style')
  })

  test('restores the outline when a key is pressed, while the element is still in focus', () => {
    const button = add('button')

    fireEvent.pointerDown(button)
    button.focus()
    fireEvent.keyDown(button, { key: 'Enter' })

    expect(button).toHaveFocus()
    expect(button.style.outline).toBe('2px solid red')
  })

  test('suppresses the focusable ancestor of what the press landed on', () => {
    const button = add('button')
    const icon = document.createElement('span')
    button.appendChild(icon)

    fireEvent.pointerDown(icon)
    button.focus()

    expect(button.style.outline).toBe('none')
  })

  test('leaves an element focused without a press alone', () => {
    const button = add('button')

    button.focus()

    expect(button.style.outline).toBe('2px solid red')
  })

  test('leaves an element other than the pressed one alone', () => {
    const pressed = add('button')
    const other = add('button')

    fireEvent.pointerDown(pressed)
    other.focus()

    expect(other.style.outline).toBe('2px solid red')
    expect(pressed.style.outline).toBe('2px solid red')
  })

  test('leaves an element focused after a key press alone, though it was pressed before', () => {
    const button = add('button')

    fireEvent.pointerDown(button)
    fireEvent.keyDown(document.body, { key: 'Tab' })
    button.focus()

    expect(button.style.outline).toBe('2px solid red')
  })

  test('leaves a text field alone: a press shows its ring in every browser', () => {
    const input = add('input')
    const textarea = add('textarea')

    fireEvent.pointerDown(input)
    input.focus()
    fireEvent.pointerDown(textarea)
    textarea.focus()

    expect(input.style.outline).toBe('2px solid red')
    expect(textarea.style.outline).toBe('2px solid red')
  })

  test('still suppresses an input that takes no text', () => {
    const checkbox = add('input')
    checkbox.type = 'checkbox'

    fireEvent.pointerDown(checkbox)
    checkbox.focus()

    expect(checkbox.style.outline).toBe('none')
  })

  test("leaves a .form-input element's outline untouched — chassis-css always rings it, click or keyboard", () => {
    const select = add('select')
    select.className = 'form-input'

    fireEvent.pointerDown(select)
    select.focus()

    expect(select.style.outline).toBe('2px solid red')
  })

  test('ignores a press that does not land on a focusable element', () => {
    const div = add('div')
    div.tabIndex = -1
    const inner = add('div')

    fireEvent.pointerDown(inner)
    div.focus()

    expect(div.style.outline).toBe('2px solid red')
  })

  test('ignores a pointerdown whose target is not an Element (e.g. dispatched on document itself)', () => {
    expect(() => fireEvent.pointerDown(document)).not.toThrow()
  })

  test('a repeated press before blur does not overwrite the saved outline', () => {
    const button = add('button')

    fireEvent.pointerDown(button)
    button.focus()
    fireEvent.pointerDown(button)
    fireEvent.focusIn(button)
    button.blur()

    expect(button.style.outline).toBe('2px solid red')
  })

  test('restores an element removed while in focus at the next press', () => {
    const button = add('button')
    const other = add('button')

    fireEvent.pointerDown(button)
    button.focus()
    expect(button.style.outline).toBe('none')
    // jsdom fires no blur for a removed element either.
    button.remove()
    fireEvent.pointerDown(other)

    expect(button.style.outline).toBe('2px solid red')
  })

  test('install() is idempotent — calling it again does not attach a second listener', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

    // The module already installed itself once on import (that's what every test above relies
    // on) — this call is the redundant one the guard exists for.
    install()

    expect(addEventListenerSpy).not.toHaveBeenCalled()

    addEventListenerSpy.mockRestore()
  })

  // A hot reload, or two copies of the package in one bundle. Each evaluation used to hold its
  // own listeners and its own record of what it had suppressed: the second saved the `none` the
  // first had set, and restored that last.
  describe('evaluated a second time', () => {
    const evaluateAgain = async () => {
      vi.resetModules()
      return import('../../src/utils/suppressFocusRingGlobally')
    }

    test('installs no second set of listeners', async () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      await evaluateAgain()

      expect(addEventListenerSpy).not.toHaveBeenCalled()
      addEventListenerSpy.mockRestore()
    })

    test('restores the outline of a pressed element on blur', async () => {
      await evaluateAgain()
      const button = add('button')

      fireEvent.pointerDown(button)
      button.focus()
      expect(button.style.outline).toBe('none')

      button.blur()
      expect(button.style.outline).toBe('2px solid red')
    })

    test("shares what is suppressed with the first evaluation's listeners", async () => {
      const second = await evaluateAgain()
      const button = add('button')

      // The first evaluation's listener suppresses it; the second's `suppressFocusRing` (a
      // `focusRedirect` from the other copy) is asked for the same element before it blurs.
      fireEvent.pointerDown(button)
      button.focus()
      second.suppressFocusRing(button)
      button.blur()

      expect(button.style.outline).toBe('2px solid red')
    })
  })
})
