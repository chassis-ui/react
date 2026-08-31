// Internal helpers shared by the carousel family. Not exported from the component's public
// barrel (see CONVENTIONS.md's helper-module carve-out).

export const ITEM_SELECTOR = '.carousel-item:not(.carousel-item-clone)'

export function getCarouselItems(viewport: HTMLElement): HTMLElement[] {
  return Array.from(viewport.querySelectorAll<HTMLElement>(`:scope > ${ITEM_SELECTOR}`))
}

export function isRTL(element: Element): boolean {
  return getComputedStyle(element).direction === 'rtl'
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function isElementVisible(element: Element | null): boolean {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right > 0
  )
}

// Horizontal distance to scroll `viewport` so `target` rests where the active slide belongs —
// centered when `center` is set, otherwise flush with the scroll-padding (peek) offset, which is
// exactly where scroll-snap settles. Scrolling the viewport itself (rather than
// `target.scrollIntoView()`) keeps an off-screen carousel from yanking the whole page to itself.
export function scrollDeltaFor(
  viewport: HTMLElement,
  target: HTMLElement,
  center: boolean
): number {
  const viewportRect = viewport.getBoundingClientRect()
  const rect = target.getBoundingClientRect()

  if (center) {
    return rect.left + rect.width / 2 - (viewportRect.left + viewportRect.width / 2)
  }

  const padStart = Number.parseFloat(getComputedStyle(viewport).scrollPaddingInlineStart) || 0

  return isRTL(viewport)
    ? rect.right - (viewportRect.right - padStart)
    : rect.left - (viewportRect.left + padStart)
}

export function isViewportScrollable(viewport: HTMLElement): boolean {
  return viewport.scrollWidth - viewport.clientWidth > 0
}

const SCROLL_DURATION_MS = 300
// Safety net above the animation's own duration, in case `requestAnimationFrame` stalls (a
// backgrounded tab, a frozen/suspended webview) and never drives the animation to completion.
// `setTimeout` still fires in that situation — throttled, but not indefinitely suspended the way
// rAF can be — so this guarantees the scroll lands on target and callers relying on completion to
// release a lock (e.g. re-enabling the IntersectionObserver) can never get stuck forever.
const SCROLL_SAFETY_MS = SCROLL_DURATION_MS + 200

const easeInOutCubic = (progress: number) =>
  progress < 0.5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2

// Animates `viewport.scrollLeft` to `targetLeft` by stepping the position by hand each frame,
// resolving deterministically once the animation completes — not by waiting on the `scrollend`
// event or a fixed timeout as the *primary* signal. Both of those only approximate when a native
// `scrollTo({behavior:'smooth'})` actually finishes, and firing early restores CSS scroll-snap
// mid-flight, which snaps the track back to the nearest point instead of the intended one rather
// than letting it arrive. Using `behavior: 'instant'` for every step keeps this animation from
// fighting the viewport's own CSS `scroll-behavior: smooth`. Returns a canceller so a caller that
// starts a newer scroll before this one finishes can stop it instead of both fighting over the
// position.
export function animateScrollTo(
  viewport: HTMLElement,
  targetLeft: number,
  onSettled: () => void
): () => void {
  if (prefersReducedMotion() || typeof requestAnimationFrame === 'undefined') {
    viewport.scrollTo({ left: targetLeft, behavior: 'instant' })
    onSettled()
    return () => {}
  }

  const startLeft = viewport.scrollLeft
  const distance = targetLeft - startLeft
  let startTime: number | null = null
  let frame: number | null = null
  let done = false

  const finish = () => {
    if (done) return
    done = true
    if (frame !== null) cancelAnimationFrame(frame)
    clearTimeout(safetyTimer)
    viewport.scrollTo({ left: targetLeft, behavior: 'instant' })
    onSettled()
  }

  const step = (now: number) => {
    if (done) return
    if (startTime === null) startTime = now

    const progress = Math.min((now - startTime) / SCROLL_DURATION_MS, 1)
    viewport.scrollTo({
      left: startLeft + distance * easeInOutCubic(progress),
      behavior: 'instant'
    })

    if (progress < 1) {
      frame = requestAnimationFrame(step)
      return
    }

    finish()
  }

  const safetyTimer = setTimeout(finish, SCROLL_SAFETY_MS)
  frame = requestAnimationFrame(step)

  return () => {
    if (done) return
    done = true
    if (frame !== null) cancelAnimationFrame(frame)
    clearTimeout(safetyTimer)
  }
}

export function normalizeIndex(index: number, length: number, wraps: boolean): number | null {
  if (Number.isNaN(index) || length === 0) return null
  if (index < 0) return wraps ? length - 1 : null
  if (index > length - 1) return wraps ? 0 : null
  return index
}

export type CarouselDirection = 'left' | 'right'

export function directionBetween(from: number, to: number, rtl: boolean): CarouselDirection {
  const isNext = to > from
  if (rtl) return isNext ? 'right' : 'left'
  return isNext ? 'left' : 'right'
}

export function loopDirection(isNext: boolean, rtl: boolean): CarouselDirection {
  if (rtl) return isNext ? 'right' : 'left'
  return isNext ? 'left' : 'right'
}

// Seamless looping only reads right for the plain single-slide scroll layout — multi-item, peek,
// centered, and variable-width layouts fall back to a `wrap` jump instead (see `canLoop`).
export function canLoop(
  carouselElement: HTMLElement,
  itemCount: number,
  isFade: boolean,
  center: boolean,
  auto: boolean
): boolean {
  if (isFade || itemCount < 2 || center || auto) return false

  const styles = getComputedStyle(carouselElement)
  const num = (name: string) => Number.parseFloat(styles.getPropertyValue(name)) || 0

  return (num('--cx-carousel-items') || 1) === 1 && num('--cx-carousel-items-peek') === 0
}
