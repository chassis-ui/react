import { fireEvent } from '@testing-library/react'

import { install } from '../../src/utils/suppressFocusRingGlobally'

describe('suppressFocusRingGlobally', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('suppresses the outline on pointerdown for a focusable element and restores it on blur', () => {
    const button = document.createElement('button')
    button.style.outline = '2px solid red'
    document.body.appendChild(button)

    fireEvent.pointerDown(button)
    expect(button.style.outline).toBe('none')

    fireEvent.blur(button)
    expect(button.style.outline).toBe('2px solid red')
  })

  test('suppresses the outline when the pointerdown lands on a child of a focusable element', () => {
    const button = document.createElement('button')
    button.style.outline = '2px solid red'
    const icon = document.createElement('span')
    button.appendChild(icon)
    document.body.appendChild(button)

    fireEvent.pointerDown(icon)
    expect(button.style.outline).toBe('none')
  })

  test('ignores a pointerdown that does not land on a focusable element', () => {
    const div = document.createElement('div')
    div.style.outline = '2px solid red'
    document.body.appendChild(div)

    fireEvent.pointerDown(div)
    expect(div.style.outline).toBe('2px solid red')
  })

  test('ignores a pointerdown whose target is not an Element (e.g. dispatched on document itself)', () => {
    expect(() => fireEvent.pointerDown(document)).not.toThrow()
  })

  test('guards against a repeated pointerdown before blur overwriting the saved outline', () => {
    const button = document.createElement('button')
    button.style.outline = '2px solid red'
    document.body.appendChild(button)

    fireEvent.pointerDown(button)
    fireEvent.pointerDown(button)
    fireEvent.blur(button)

    expect(button.style.outline).toBe('2px solid red')
  })

  test("leaves a .form-input element's outline untouched — chassis-css always rings it, click or keyboard", () => {
    const input = document.createElement('input')
    input.className = 'form-input'
    input.style.outline = '2px solid red'
    document.body.appendChild(input)

    fireEvent.pointerDown(input)
    expect(input.style.outline).toBe('2px solid red')
  })

  test('install() is idempotent — calling it again does not attach a second listener', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

    // The module already installed itself once on import (that's what every test above relies
    // on) — this call is the redundant one the guard exists for.
    install()

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('pointerdown', expect.any(Function), true)

    addEventListenerSpy.mockRestore()
  })
})
