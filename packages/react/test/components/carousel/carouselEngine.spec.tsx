import {
  animateScrollTo,
  canLoop,
  directionBetween,
  getCarouselItems,
  isElementVisible,
  isRTL,
  isViewportScrollable,
  loopDirection,
  normalizeIndex,
  scrollDeltaFor
} from '../../../src/components/carousel/carouselEngine'

describe('getCarouselItems', () => {
  test('returns direct-child items and excludes clones', () => {
    const viewport = document.createElement('div')
    viewport.innerHTML = `
      <div class="carousel-item">A</div>
      <div class="carousel-item carousel-item-clone">clone</div>
      <div class="carousel-item">B</div>
    `
    const items = getCarouselItems(viewport)
    expect(items.map((item) => item.textContent)).toEqual(['A', 'B'])
  })
})

describe('isRTL', () => {
  test('reflects the computed direction', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    expect(isRTL(element)).toBe(false)
    element.style.direction = 'rtl'
    expect(isRTL(element)).toBe(true)
  })
})

describe('isElementVisible', () => {
  test('returns false for a null element', () => {
    expect(isElementVisible(null)).toBe(false)
  })

  test('returns true when the rect intersects the viewport', () => {
    const element = document.createElement('div')
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 10,
      left: 0,
      right: 10
    } as DOMRect)
    expect(isElementVisible(element)).toBe(true)
  })

  test('returns false when the rect is entirely off-screen', () => {
    const element = document.createElement('div')
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      top: -100,
      bottom: -10,
      left: 0,
      right: 10
    } as DOMRect)
    expect(isElementVisible(element)).toBe(false)
  })
})

describe('scrollDeltaFor', () => {
  const rect = (left: number, width: number) => ({ left, right: left + width, width }) as DOMRect

  test('centers the target within the viewport when center is true', () => {
    const viewport = document.createElement('div')
    const target = document.createElement('div')
    vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue(rect(0, 300))
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(300, 100))
    expect(scrollDeltaFor(viewport, target, true)).toBe(350 - 150)
  })

  test('aligns to the scroll-padding start in LTR when center is false', () => {
    const viewport = document.createElement('div')
    const target = document.createElement('div')
    document.body.appendChild(viewport)
    vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue(rect(0, 300))
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(300, 100))
    expect(scrollDeltaFor(viewport, target, false)).toBe(300)
  })

  test('aligns to the trailing edge in RTL when center is false', () => {
    const viewport = document.createElement('div')
    const target = document.createElement('div')
    document.body.appendChild(viewport)
    viewport.style.direction = 'rtl'
    vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue(rect(0, 300))
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(300, 100))
    expect(scrollDeltaFor(viewport, target, false)).toBe(400 - 300)
  })
})

describe('isViewportScrollable', () => {
  test('is true when scrollWidth exceeds clientWidth', () => {
    const viewport = document.createElement('div')
    Object.defineProperty(viewport, 'scrollWidth', { value: 300, configurable: true })
    Object.defineProperty(viewport, 'clientWidth', { value: 100, configurable: true })
    expect(isViewportScrollable(viewport)).toBe(true)
  })

  test('is false when scrollWidth does not exceed clientWidth', () => {
    const viewport = document.createElement('div')
    Object.defineProperty(viewport, 'scrollWidth', { value: 100, configurable: true })
    Object.defineProperty(viewport, 'clientWidth', { value: 100, configurable: true })
    expect(isViewportScrollable(viewport)).toBe(false)
  })
})

describe('animateScrollTo', () => {
  test('scrolls instantly and settles immediately when reduced motion is preferred', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true } as MediaQueryList)
    const viewport = document.createElement('div')
    const scrollTo = vi.fn()
    viewport.scrollTo = scrollTo
    const onSettled = vi.fn()

    const cancel = animateScrollTo(viewport, 100, onSettled)
    expect(scrollTo).toHaveBeenCalledWith({ left: 100, behavior: 'instant' })
    expect(onSettled).toHaveBeenCalledTimes(1)
    expect(() => cancel()).not.toThrow()
    vi.restoreAllMocks()
  })

  test('steps via requestAnimationFrame and settles once at completion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList)
    vi.useFakeTimers()
    const viewport = document.createElement('div')
    viewport.scrollTo = vi.fn()
    const onSettled = vi.fn()

    animateScrollTo(viewport, 100, onSettled)
    // Drive every queued rAF frame forward via the fake-timer-backed scheduler.
    vi.runAllTimers()
    expect(onSettled).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  test('a cancelled animation never calls onSettled', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList)
    vi.useFakeTimers()
    const viewport = document.createElement('div')
    viewport.scrollTo = vi.fn()
    const onSettled = vi.fn()

    const cancel = animateScrollTo(viewport, 100, onSettled)
    cancel()
    vi.runAllTimers()
    expect(onSettled).not.toHaveBeenCalled()

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  test('calling cancel after settling is a no-op', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList)
    vi.useFakeTimers()
    const viewport = document.createElement('div')
    viewport.scrollTo = vi.fn()
    const onSettled = vi.fn()

    const cancel = animateScrollTo(viewport, 100, onSettled)
    vi.runAllTimers()
    expect(onSettled).toHaveBeenCalledTimes(1)
    expect(() => cancel()).not.toThrow()
    expect(onSettled).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
    vi.restoreAllMocks()
  })
})

describe('normalizeIndex', () => {
  test('returns null for NaN or an empty list', () => {
    expect(normalizeIndex(Number.NaN, 3, true)).toBeNull()
    expect(normalizeIndex(0, 0, true)).toBeNull()
  })

  test('wraps a negative index when wraps is true, otherwise returns null', () => {
    expect(normalizeIndex(-1, 3, true)).toBe(2)
    expect(normalizeIndex(-1, 3, false)).toBeNull()
  })

  test('wraps an overflowing index when wraps is true, otherwise returns null', () => {
    expect(normalizeIndex(3, 3, true)).toBe(0)
    expect(normalizeIndex(3, 3, false)).toBeNull()
  })

  test('returns the index unchanged when already in range', () => {
    expect(normalizeIndex(1, 3, true)).toBe(1)
  })
})

describe('directionBetween', () => {
  test('LTR: moving forward is left, backward is right', () => {
    expect(directionBetween(0, 1, false)).toBe('left')
    expect(directionBetween(1, 0, false)).toBe('right')
  })

  test('RTL: moving forward is right, backward is left', () => {
    expect(directionBetween(0, 1, true)).toBe('right')
    expect(directionBetween(1, 0, true)).toBe('left')
  })
})

describe('loopDirection', () => {
  test('LTR: next is left, prev is right', () => {
    expect(loopDirection(true, false)).toBe('left')
    expect(loopDirection(false, false)).toBe('right')
  })

  test('RTL: next is right, prev is left', () => {
    expect(loopDirection(true, true)).toBe('right')
    expect(loopDirection(false, true)).toBe('left')
  })
})

describe('canLoop', () => {
  const styledElement = (styles: Record<string, string>) => {
    const element = document.createElement('div')
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (name: string) => styles[name] ?? ''
    } as CSSStyleDeclaration)
    return element
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('is false for fade, fewer than 2 items, centered, or autoplay layouts', () => {
    const element = styledElement({})
    expect(canLoop(element, 1, false, false, false)).toBe(false)
    expect(canLoop(element, 3, true, false, false)).toBe(false)
    expect(canLoop(element, 3, false, true, false)).toBe(false)
    expect(canLoop(element, 3, false, false, true)).toBe(false)
  })

  test('is true for a single-item, non-peeking layout', () => {
    const element = styledElement({ '--cx-carousel-items': '1', '--cx-carousel-items-peek': '0' })
    expect(canLoop(element, 3, false, false, false)).toBe(true)
  })

  test('is false when multiple items are visible or the layout peeks', () => {
    const multiItem = styledElement({ '--cx-carousel-items': '2' })
    expect(canLoop(multiItem, 3, false, false, false)).toBe(false)

    const peeking = styledElement({ '--cx-carousel-items': '1', '--cx-carousel-items-peek': '20' })
    expect(canLoop(peeking, 3, false, false, false)).toBe(false)
  })
})
