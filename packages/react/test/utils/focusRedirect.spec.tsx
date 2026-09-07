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

  // Regression test: the second call used to capture the already-suppressed `none` as the value
  // to restore, so the blur handler wrote `none` back and the element never got its ring again —
  // reachable by clicking twice at the same disabled end of an `ends="stop"` carousel. The guard
  // lives in `suppressFocusRing`, which this now delegates to.
  test('a repeated pointer-triggered redirect before blur still restores the original styles', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    el.style.outline = '2px solid red'
    el.style.boxShadow = '0 0 0 2px red'

    focusRedirect(el, true)
    focusRedirect(el, true)
    el.blur()

    expect(el.style.outline).toBe('2px solid red')
    expect(el.style.boxShadow).toBe('0 0 0 2px red')

    document.body.removeChild(el)
  })

  // The suppression set is shared with the global `pointerdown` listener, so a press that
  // suppresses an element and a redirect that lands back on that same element can't stack. The
  // redirect still has to move focus, even though it skips the (already done) ring work.
  test('still focuses an element the global pointerdown listener already suppressed', () => {
    const el = document.createElement('button')
    const other = document.createElement('button')
    document.body.append(other, el)
    other.focus()
    el.style.outline = '2px solid red'

    // Dispatched directly rather than through Testing Library's `fireEvent`: importing from
    // `@testing-library/react` pulls this whole file into the testing-library lint rules, which
    // then flag the `document.activeElement` reads every test here depends on.
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    focusRedirect(el, true)

    expect(document.activeElement).toBe(el)
    expect(el.style.outline).toBe('none')

    el.blur()
    expect(el.style.outline).toBe('2px solid red')

    document.body.removeChild(el)
    document.body.removeChild(other)
  })
})
