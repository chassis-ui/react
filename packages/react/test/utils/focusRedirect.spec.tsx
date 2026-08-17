import { focusRedirect } from '../../src/utils/focusRedirect'

describe('focusRedirect', () => {
  test('does nothing when passed null', () => {
    expect(() => focusRedirect(null, false)).not.toThrow()
  })

  test('focuses the element directly and leaves its outline alone when not pointer-triggered', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    el.style.outline = '2px solid red'

    focusRedirect(el, false)

    expect(document.activeElement).toBe(el)
    expect(el.style.outline).toBe('2px solid red')

    document.body.removeChild(el)
  })

  test('forwards focus options through to the underlying focus() call', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    const focusSpy = vi.spyOn(el, 'focus')

    focusRedirect(el, false, { preventScroll: true })

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })

    document.body.removeChild(el)
  })

  test('suppresses outline/box-shadow for a pointer-triggered redirect, restoring both on blur', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    el.style.outline = '2px solid red'
    el.style.boxShadow = '0 0 0 2px red'

    focusRedirect(el, true)

    expect(document.activeElement).toBe(el)
    expect(el.style.outline).toBe('none')
    expect(el.style.boxShadow).toBe('none')

    el.blur()

    expect(el.style.outline).toBe('2px solid red')
    expect(el.style.boxShadow).toBe('0 0 0 2px red')

    document.body.removeChild(el)
  })
})
