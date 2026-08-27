import { executeAfterTransition, getTransitionDuration } from '../../src/utils/dialogTransition'

describe('getTransitionDuration', () => {
  test('returns 0 when the element has no transition-duration or transition-delay', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    expect(getTransitionDuration(element)).toBe(0)
  })

  test('converts duration + delay from seconds to milliseconds', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      transitionDuration: '0.3s',
      transitionDelay: '0.1s'
    } as CSSStyleDeclaration)
    expect(getTransitionDuration(element)).toBe(400)
    vi.restoreAllMocks()
  })
})

describe('executeAfterTransition', () => {
  test('calls the callback synchronously and returns a no-op cleanup when not animated', () => {
    const element = document.createElement('div')
    const callback = vi.fn()
    const cleanup = executeAfterTransition(element, callback, false)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(() => cleanup()).not.toThrow()
  })

  test('ignores transitionend events from other targets', () => {
    vi.useFakeTimers()
    const element = document.createElement('div')
    const other = document.createElement('span')
    document.body.append(element, other)
    const callback = vi.fn()
    executeAfterTransition(element, callback, true)

    other.dispatchEvent(new Event('transitionend', { bubbles: false }))
    expect(callback).not.toHaveBeenCalled()

    element.dispatchEvent(new Event('transitionend'))
    expect(callback).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  test('falls back to the safety timeout when transitionend never fires', () => {
    vi.useFakeTimers()
    const element = document.createElement('div')
    document.body.appendChild(element)
    const callback = vi.fn()
    executeAfterTransition(element, callback, true)

    vi.runAllTimers()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  test('only invokes the callback once even if both the event and timer would fire', () => {
    vi.useFakeTimers()
    const element = document.createElement('div')
    document.body.appendChild(element)
    const callback = vi.fn()
    executeAfterTransition(element, callback, true)

    element.dispatchEvent(new Event('transitionend'))
    vi.runAllTimers()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  test('cleanup prevents the callback from firing later', () => {
    vi.useFakeTimers()
    const element = document.createElement('div')
    document.body.appendChild(element)
    const callback = vi.fn()
    const cleanup = executeAfterTransition(element, callback, true)

    cleanup()
    element.dispatchEvent(new Event('transitionend'))
    vi.runAllTimers()
    expect(callback).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
