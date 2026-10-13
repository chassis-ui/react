import React, {
  Children,
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'

import { useControllableState, useForkedRef, useIsomorphicLayoutEffect } from '../../hooks'
import { focusRedirect } from '../../utils/focusRedirect'
import { consumePointerClick } from '../../utils/pointerInteraction'
import { CarouselContext, CarouselContextProps, CarouselEnds } from './context'
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
  prefersReducedMotion,
  scrollDeltaFor
} from './carouselEngine'
import { devWarning } from '../../utils/devWarning'
import { executeAfterTransition, getTransitionDuration } from '../../utils/dialogTransition'
import { isElementOfType } from '../../utils/lazyElement'
import { CarouselInner } from './CarouselInner'
import { readSlides } from './slides'
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden'

export type { CarouselEnds }
export type CarouselTransition = 'scroll' | 'fade'

export interface CarouselSlideDetail {
  /**
   * Direction of travel, mirrored in RTL.
   */
  direction: 'left' | 'right'
  /**
   * Index of the outgoing slide.
   */
  from: number
  /**
   * Index of the incoming slide.
   */
  to: number
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The active slide's index, for controlled usage. Pair with `onSlide` to feed the new index
   * back: it is the only way a controlled carousel's `activeIndex` gets updated. `onSlid` can't
   * do that, as it reports a slide that has arrived, which a controlled carousel doesn't leave
   * for until `activeIndex` names it.
   */
  activeIndex?: number
  /**
   * Let each CarouselItem size itself instead of dividing the track evenly; snap points still land on every slide.
   */
  auto?: boolean
  /**
   * Cycle through slides automatically on mount.
   */
  autoplay?: boolean
  /**
   * Snap the active slide to the center of the viewport instead of its start.
   */
  center?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The active slide's index, for uncontrolled usage.
   */
  defaultActiveIndex?: number
  /**
   * Behavior at the first/last slide. `loop` continues seamlessly past the ends for a single-slide layout, falling back to `wrap` for multi-item, peek, centered, or variable-width layouts, and under reduced motion. `wrap` jumps from the last slide back to the first, and vice versa. `stop` hard-stops and disables the previous/next controls at each end.
   */
  ends?: CarouselEnds
  /**
   * Milliseconds to wait before automatically advancing to the next slide. Override per slide with CarouselItem's own `interval` prop.
   */
  interval?: number
  /**
   * Number of whole slides visible per view, applied as the `--cx-carousel-items` custom property.
   */
  items?: number
  /**
   * Space between slides, applied as the `--cx-carousel-items-gap` custom property.
   */
  itemsGap?: string
  /**
   * How much of the neighboring slides to reveal, applied as the `--cx-carousel-items-peek` custom property.
   */
  itemsPeek?: string
  /**
   * Move to the previous/next slide with the Left/Right arrow keys while focus is inside the
   * carousel. The keys follow the slides: in a right-to-left layout the next slide is to the
   * left, and Left Arrow moves to it.
   */
  keyboard?: boolean
  /**
   * Callback fired once a slide transition completes.
   */
  onSlid?: (detail: CarouselSlideDetail) => void
  /**
   * Callback fired when a slide transition begins.
   */
  onSlide?: (detail: CarouselSlideDetail) => void
  /**
   * Pause autoplay on `mouseenter`, resuming on `mouseleave`. Set to `false` to disable pause-on-hover.
   */
  pause?: 'hover' | false
  /**
   * Replace the scroll transition with a crossfade.
   */
  transition?: CarouselTransition
}

const ACTIVE_RATIO_TOLERANCE = 0.05
// How long the track must have stopped scrolling for a swipe to be over. `scrollend` would say so
// outright, but not every supported browser has it, and it can come before the observer's last
// report of the same frame.
const SWIPE_SETTLE_MS = 150

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      activeIndex: activeIndexProp,
      auto,
      autoplay = false,
      center,
      className,
      defaultActiveIndex = 0,
      ends = 'loop',
      interval = 5000,
      items,
      itemsGap,
      itemsPeek,
      keyboard = true,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onSlid,
      onSlide,
      pause = 'hover',
      style,
      transition = 'scroll',
      ...rest
    },
    ref
  ) => {
    // `onSlide`, not a dedicated `onChange`, is the only way a controlled `activeIndex` gets fed
    // back (see the CarouselProps `activeIndex` doc and carousel.mdx's "Controlled usage"
    // section). Without it every click, swipe and autoplay advance is a request nobody hears, and
    // the carousel silently freezes instead of erroring. `onSlid` is no substitute: it reports a
    // slide that has arrived, and a controlled carousel only leaves for one once `activeIndex`
    // names it. This warning and the docs offered `onSlid` too, and a carousel fed from it alone
    // never moved.
    devWarning(
      activeIndexProp !== undefined && !onSlide,
      'Carousel: `activeIndex` is set (controlled) without `onSlide`: nothing feeds the new ' +
        'index back to your state, so the carousel will visually freeze on click/swipe/autoplay. ' +
        'Pass `onSlide` and update `activeIndex` from it. `onSlid` cannot do this: it fires once ' +
        'a slide has arrived, which under a controlled `activeIndex` only happens after the ' +
        'prop has changed.'
    )

    const carouselRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, carouselRef)

    const [viewportEl, setViewportEl] = useState<HTMLDivElement | null>(null)
    // Stable identity: this goes into `contextValue` and on to `useForkedRef` in `CarouselInner`,
    // whose memo is keyed on the refs array — a fresh closure every render would keep detaching
    // and reattaching the viewport ref instead of running once per mount.
    const registerViewport = useCallback((node: HTMLDivElement | null) => setViewportEl(node), [])

    const isControlled = activeIndexProp !== undefined
    const [activeIndex, setActiveIndex] = useControllableState(activeIndexProp, defaultActiveIndex)
    const activeIndexRef = useRef(activeIndex)
    // The index of the last commit, which `activeIndexRef` may run ahead of (see
    // `setActiveIndexInternal`).
    const committedIndexRef = useRef(activeIndex)
    // The step last asked for, until `activeIndex` changes: then the step that happened, which
    // `onSlid` reports.
    const lastTransitionRef = useRef<CarouselSlideDetail>({
      from: activeIndex,
      to: activeIndex,
      direction: 'left'
    })
    useIsomorphicLayoutEffect(() => {
      const from = committedIndexRef.current
      activeIndexRef.current = activeIndex
      committedIndexRef.current = activeIndex
      if (from === activeIndex) return
      // The parent of a controlled carousel can choose a slide nobody asked for, or answer a
      // request with another slide. `onSlid` then reported the last request as it stood, an
      // earlier step. A request that was followed is kept whole: it has the direction that was
      // asked for, which the two indexes of a step that wrapped round would give the other way.
      const asked = lastTransitionRef.current
      if (asked.from === from && asked.to === activeIndex) return
      lastTransitionRef.current = {
        from,
        to: activeIndex,
        direction: directionBetween(from, activeIndex, viewportEl ? isRTL(viewportEl) : false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex])

    // A timer, an observer and a running animation outlive the render that started them. The
    // callbacks they report to are read from here, so they are the latest render's.
    const onSlideRef = useRef(onSlide)
    const onSlidRef = useRef(onSlid)
    useIsomorphicLayoutEffect(() => {
      onSlideRef.current = onSlide
      onSlidRef.current = onSlid
    })

    // Counted from the DOM once the viewport is mounted (the layout effect below), which never
    // happens on the server: `CarouselIndicators` rendered an empty list there. The first render
    // counts the slides written inside `CarouselInner` instead.
    const [itemCount, setItemCount] = useState(() => countSlides(children))
    const itemCountRef = useRef(itemCount)
    useIsomorphicLayoutEffect(() => {
      itemCountRef.current = itemCount
    }, [itemCount])

    const [playing, setPlaying] = useState(autoplay)
    const [cycling, setCycling] = useState(false)
    // From the same index math as the layout effect below, so the server's HTML disables the
    // right end control. With no slides counted yet, neither end is known.
    const [atStart, setAtStart] = useState(activeIndex <= 0)
    const [atEnd, setAtEnd] = useState(
      itemCount > 0 && activeIndex >= itemCount - Math.max(1, items ?? 1)
    )

    const loopingRef = useRef(false)
    // True while a programmatic scroll-sync animation is in flight, so the IntersectionObserver
    // doesn't treat a slide passing through mid-scroll (e.g. slide 2 on the way from 1 to 3) as
    // the new active slide and hijack the navigation before it reaches its real target.
    const syncingScrollRef = useRef(false)
    // The slide the IntersectionObserver last asked for (i.e. the user physically scrolled/swiped
    // there), so the scroll-sync effect below can skip the change to it. Without this, every
    // threshold the observer crosses mid-gesture — before the browser's own scroll-snap has
    // actually settled the position — would make that effect "correct" the still-in-progress
    // native scroll, fighting the user's own touch/wheel input. It names the slide, and isn't a
    // plain flag, because the parent of a controlled carousel may not follow: a flag stayed set
    // then, and the next step that was followed, to any slide, didn't scroll. `settleSwipe`
    // clears the mark of a swipe nobody followed.
    const swipedToRef = useRef<number | null>(null)
    const swipeSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const touchingRef = useRef(false)
    const cancelScrollSyncRef = useRef<(() => void) | null>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const visibilityRef = useRef(new Map<Element, number>())
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const scrollSyncedRef = useRef(false)
    const mountedForSlidRef = useRef(false)
    const mountedForLiveRegionRef = useRef(false)
    const [liveMessage, setLiveMessage] = useState('')
    // Set while the scroll-sync effect below owns firing `onSlid` for the in-flight
    // `animateScrollTo` animation, so the generic effect doesn't fire it early — before the slide
    // has actually finished sliding into place.
    const deferOnSlidRef = useRef(false)
    const prevControlsRef = useRef<Set<HTMLButtonElement>>(new Set())
    const nextControlsRef = useRef<Set<HTMLButtonElement>>(new Set())

    const isFade = transition === 'fade'
    const itemsVisible = Math.max(1, items ?? 1)
    const wraps = ends !== 'stop'

    const setActiveIndexInternal = (next: number) => {
      // Update the ref synchronously, not just via the layout effect below — that effect only
      // runs after React re-renders and commits, so two `next()` calls fired back-to-back in the
      // same tick (a fast double-click, or any rapid programmatic call) would both read the same
      // stale `activeIndexRef.current` and target the same index instead of advancing twice.
      activeIndexRef.current = next
      setActiveIndex(next)
      // A controlled carousel only asks. A parent that leaves `activeIndex` where it is renders
      // nothing, so no effect would put the ref back and every later step would start from a
      // slide that isn't shown. The ref runs ahead for the rest of this tick, which is all the
      // back-to-back calls above need, and is the prop's again after it.
      if (isControlled) {
        queueMicrotask(() => {
          activeIndexRef.current = committedIndexRef.current
        })
      }
    }

    // Moves the track by `delta` with scroll-snap off, which would pull it to the nearest slide
    // on the way, and with the observer told not to act on the slides that pass.
    const animateTrackBy = (viewport: HTMLDivElement, delta: number, onArrived?: () => void) => {
      // Cancel any previous scroll-sync still animating so it can't finish later and clobber
      // this newer target, and so `syncingScrollRef` isn't cleared early while this one runs.
      cancelScrollSyncRef.current?.()
      syncingScrollRef.current = true
      viewport.style.scrollSnapType = 'none'
      cancelScrollSyncRef.current = animateScrollTo(viewport, viewport.scrollLeft + delta, () => {
        viewport.style.scrollSnapType = ''
        syncingScrollRef.current = false
        cancelScrollSyncRef.current = null
        onArrived?.()
      })
    }

    // (Re)starts the wait for a swipe to come to rest. Refs only: the observer and the scroll
    // listener that call it belong to an earlier render.
    const awaitSwipeSettle = () => {
      if (swipeSettleTimerRef.current) clearTimeout(swipeSettleTimerRef.current)
      swipeSettleTimerRef.current = setTimeout(() => settleSwipeRef.current(), SWIPE_SETTLE_MS)
    }

    // Index math alone (not real geometry) drives `atStart`/`atEnd` so end-control state and
    // navigation clamping are correct even before layout exists (SSR, jsdom tests). The scroll
    // listener below refines it further for peek/variable-width layouts, where a whole number of
    // "visible items" can't be derived from `items` alone.
    useIsomorphicLayoutEffect(() => {
      const maxIndex = Math.max(0, itemCount - itemsVisible)
      setAtStart(activeIndex <= 0)
      setAtEnd(activeIndex >= maxIndex)
    }, [activeIndex, itemCount, itemsVisible])

    useEffect(() => {
      if (!viewportEl) return undefined

      const handleScroll = () => {
        // Still moving: a swipe waiting for its answer isn't over yet.
        if (swipedToRef.current !== null) awaitSwipeSettle()
        if (loopingRef.current || !isViewportScrollable(viewportEl)) return
        const maxScroll = viewportEl.scrollWidth - viewportEl.clientWidth
        // Elastic overscroll (iOS Safari/macOS trackpad rubber-banding) can push `scrollLeft`
        // slightly past either edge mid-gesture. Clamp to the real [0, maxScroll] range (mirrored
        // for RTL's negative `scrollLeft` convention) before the RTL-normalizing `abs()` below, so
        // a bounce at the start edge doesn't briefly read as "away from start" - which flickered
        // `ends="stop"` controls enabled while still at the first/last slide.
        const rawScrollLeft = viewportEl.scrollLeft
        const clampedScrollLeft = isRTL(viewportEl)
          ? Math.max(-maxScroll, Math.min(0, rawScrollLeft))
          : Math.max(0, Math.min(maxScroll, rawScrollLeft))
        const scrollLeft = Math.abs(clampedScrollLeft)
        setAtStart(scrollLeft <= 1)
        setAtEnd(scrollLeft >= maxScroll - 1)
      }

      // A finger resting on the track mid-swipe stops the scroll events too.
      const handleTouchStart = () => {
        touchingRef.current = true
      }
      const handleTouchEnd = (event: TouchEvent) => {
        touchingRef.current = event.touches.length > 0
      }

      viewportEl.addEventListener('scroll', handleScroll, { passive: true })
      viewportEl.addEventListener('touchstart', handleTouchStart, { passive: true })
      viewportEl.addEventListener('touchend', handleTouchEnd)
      viewportEl.addEventListener('touchcancel', handleTouchEnd)
      return () => {
        viewportEl.removeEventListener('scroll', handleScroll)
        viewportEl.removeEventListener('touchstart', handleTouchStart)
        viewportEl.removeEventListener('touchend', handleTouchEnd)
        viewportEl.removeEventListener('touchcancel', handleTouchEnd)
      }
    }, [viewportEl])

    // A layout effect, not a plain effect: `itemCount` must be measured before paint so the
    // atStart/atEnd layout effect above (which runs first, in declaration order) sees the real
    // count once React re-renders to flush this effect's `setItemCount` — otherwise the first
    // paint briefly shows `atEnd=true` (itemCount still 0) even on a carousel with many slides.
    useIsomorphicLayoutEffect(() => {
      if (!viewportEl) return undefined

      const syncItems = () => {
        const nodes = getCarouselItems(viewportEl)
        setItemCount(nodes.length)

        observerRef.current?.disconnect()
        observerRef.current = null
        visibilityRef.current = new Map()

        if (isFade || typeof IntersectionObserver === 'undefined') return

        observerRef.current = new IntersectionObserver(
          (entries) => {
            // Always merge entries so `visibilityRef` tracks reality even mid-animation —
            // dropping them here would leave the outgoing slide's last-known ratio stale (e.g.
            // still 1.0 from before the scroll started), which the comparison below would then
            // wrongly treat as still the most-visible slide once the animation completes. Only
            // acting on the result is guarded, so a slide passing through mid-programmatic-scroll
            // can't hijack the navigation before it reaches its real target.
            for (const entry of entries) {
              visibilityRef.current.set(
                entry.target,
                entry.isIntersecting ? entry.intersectionRatio : 0
              )
            }

            if (loopingRef.current || syncingScrollRef.current) return

            const currentNodes = getCarouselItems(viewportEl)
            const ratios = currentNodes.map((node) => visibilityRef.current.get(node) ?? 0)
            const maxRatio = Math.max(0, ...ratios)
            let bestIndex = activeIndexRef.current

            if (maxRatio > 0) {
              const found = ratios.findIndex((ratio) => ratio >= maxRatio - ACTIVE_RATIO_TOLERANCE)
              if (found !== -1) bestIndex = found
            }

            if (bestIndex !== activeIndexRef.current) {
              const from = activeIndexRef.current
              const detail = {
                from,
                to: bestIndex,
                direction: directionBetween(from, bestIndex, isRTL(viewportEl))
              }
              lastTransitionRef.current = detail
              onSlideRef.current?.(detail)
              swipedToRef.current = bestIndex
              setActiveIndexInternal(bestIndex)
              awaitSwipeSettle()
            }
          },
          { root: viewportEl, threshold: [0, 0.25, 0.5, 0.75, 1] }
        )

        for (const node of nodes) observerRef.current.observe(node)
      }

      syncItems()
      const mutationObserver = new MutationObserver(syncItems)
      mutationObserver.observe(viewportEl, { childList: true })

      return () => {
        mutationObserver.disconnect()
        observerRef.current?.disconnect()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportEl, isFade])

    // `activeIndex` is the source of truth for which slide is active, and fade mode's crossfade is
    // driven entirely by the `active` class. `CarouselItem` renders it, and the WAI-ARIA carousel
    // pattern's per-slide `role`/`aria-roledescription`/positional `aria-label`, when
    // `CarouselInner` can tell it its position (see `slides.tsx`), so the server's HTML has them.
    // This applies the same to the DOM, which also covers slides rendered by your own components.
    useIsomorphicLayoutEffect(() => {
      if (!viewportEl) return
      const nodes = getCarouselItems(viewportEl)
      for (const [index, node] of nodes.entries()) {
        node.classList.toggle('active', index === activeIndex)
        // A `group`, as the pattern has it: `aria-label` isn't allowed on an element with no role.
        if (!node.hasAttribute('role')) node.setAttribute('role', 'group')
        node.setAttribute('aria-roledescription', 'slide')
        node.setAttribute('aria-label', `${index + 1} of ${nodes.length}`)
      }
    }, [viewportEl, activeIndex, itemCount])

    // Best-effort visual sync: scrolls the real DOM position to match `activeIndex` after a
    // programmatic navigation. A user-driven drag/swipe goes the other way (observer above), which
    // sets `swipedToRef` so this effect no-ops for it instead of fighting a gesture that's
    // still physically in progress — see the ref's own comment for why that matters.
    useIsomorphicLayoutEffect(() => {
      if (swipedToRef.current === activeIndex) {
        swipedToRef.current = null
        return
      }
      if (!viewportEl || loopingRef.current || isFade) return
      const nodes = getCarouselItems(viewportEl)
      const target = nodes[activeIndex]
      if (!target || !isViewportScrollable(viewportEl)) return

      // Marked as soon as this effect has a real viewport to sync against — on mount, even if
      // there's nothing to scroll (delta below is ~0). Otherwise the mount pass never sets it
      // (it returns early below without scrolling), and the *first real navigation* ends up
      // mistaken for the initial sync and forced instant instead of animated.
      const instant = !scrollSyncedRef.current
      scrollSyncedRef.current = true

      const delta = scrollDeltaFor(viewportEl, target, !!center)
      if (Math.abs(delta) < 1) return

      if (instant) {
        // Cancel any previous scroll-sync still animating so it can't finish later and clobber
        // this newer target, and so `syncingScrollRef` isn't cleared early while this one runs.
        cancelScrollSyncRef.current?.()
        syncingScrollRef.current = true
        viewportEl.style.scrollSnapType = 'none'
        viewportEl.scrollTo({ left: viewportEl.scrollLeft + delta, behavior: 'instant' })
        viewportEl.style.scrollSnapType = ''
        syncingScrollRef.current = false
        cancelScrollSyncRef.current = null
      } else {
        deferOnSlidRef.current = true
        animateTrackBy(viewportEl, delta, () => {
          deferOnSlidRef.current = false
          onSlidRef.current?.(lastTransitionRef.current)
        })
      }
    }, [viewportEl, activeIndex, itemCount, center, isFade])

    // A swipe is a request like any other, made after the track has moved. When the parent of a
    // controlled carousel doesn't follow it, the track is put back on the active slide: it stayed
    // on the slide the user had swiped to, with `activeIndex`, the indicators and the slide
    // marked `active` all naming another. Not before the swipe has come to rest, since a scroll
    // from here would fight the gesture (see `swipedToRef`): that is a pause in the track's
    // scroll events with no finger on it. An uncontrolled carousel has followed by then, and so
    // has a parent that does: the mark is gone and there is nothing to do.
    const settleSwipe = () => {
      swipeSettleTimerRef.current = null
      if (swipedToRef.current === null) return
      if (touchingRef.current) {
        awaitSwipeSettle()
        return
      }
      swipedToRef.current = null
      if (!viewportEl || loopingRef.current || syncingScrollRef.current || isFade) return
      const target = getCarouselItems(viewportEl)[committedIndexRef.current]
      if (!target) return
      const delta = scrollDeltaFor(viewportEl, target, !!center)
      if (Math.abs(delta) >= 1) animateTrackBy(viewportEl, delta)
    }
    // The timer outlives the render that set it, as the autoplay timer does.
    const settleSwipeRef = useRef(settleSwipe)
    useIsomorphicLayoutEffect(() => {
      settleSwipeRef.current = settleSwipe
    })

    useEffect(() => {
      if (!mountedForSlidRef.current) {
        mountedForSlidRef.current = true
        return
      }
      if (deferOnSlidRef.current) return
      const detail = lastTransitionRef.current
      // A crossfade is over when the incoming slide's opacity transition is: `onSlid` used to
      // fire on the commit `onSlide` did. It waits on the element's own transition, so a themed
      // duration is followed, and one that has none (reduced motion) doesn't wait. The cleanup
      // drops a fade another step overtook, as a scroll overtaken mid-flight reports nothing.
      const incoming = isFade && viewportEl ? getCarouselItems(viewportEl)[activeIndex] : undefined
      if (incoming) {
        return executeAfterTransition(
          incoming,
          () => onSlidRef.current?.(detail),
          getTransitionDuration(incoming) > 0
        )
      }
      onSlid?.(detail)
      return undefined
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex])

    // Announces the active slide's position to assistive tech, per the WAI-ARIA carousel pattern.
    // Gated the same way as the `onSlid` effect above so mounting with a non-zero
    // `defaultActiveIndex`/`activeIndex` doesn't announce anything before the user has interacted.
    useEffect(() => {
      if (!mountedForLiveRegionRef.current) {
        mountedForLiveRegionRef.current = true
        return
      }
      setLiveMessage(`Slide ${activeIndex + 1} of ${itemCount}`)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex])

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (swipeSettleTimerRef.current) clearTimeout(swipeSettleTimerRef.current)
        observerRef.current?.disconnect()
        cancelScrollSyncRef.current?.()
      }
    }, [])

    const performLoopTransition = (isNext: boolean) => {
      const viewport = viewportEl
      if (!viewport) return

      // Drop any in-flight regular scroll-sync (e.g. a fast second navigation crossing the loop
      // boundary) so its stale onSettled can't fire mid-loop or after this transition completes.
      cancelScrollSyncRef.current?.()
      syncingScrollRef.current = false

      const nodes = getCarouselItems(viewport)
      const last = nodes.length - 1
      const from = activeIndexRef.current
      const to = isNext ? 0 : last
      const direction = loopDirection(isNext, isRTL(viewport))

      onSlide?.({ from, to, direction })
      // Now, not only in `finish`: a controlled parent follows `onSlide` while the loop still
      // runs, and the step that happened is matched against this one.
      lastTransitionRef.current = { from, to, direction }
      loopingRef.current = true

      const finish = () => {
        lastTransitionRef.current = { from, to, direction }
        setActiveIndexInternal(to)
        loopingRef.current = false
      }

      const source = isNext ? nodes[0] : nodes[last]
      const fromItem = nodes[from]
      const toItem = nodes[to]

      if (!isViewportScrollable(viewport) || !source || !fromItem || !toItem) {
        finish()
        return
      }

      const clone = source.cloneNode(true) as HTMLElement
      clone.classList.add('carousel-item-clone')
      clone.classList.remove('active')
      clone.removeAttribute('id')
      for (const node of Array.from(clone.querySelectorAll('[id]'))) node.removeAttribute('id')
      clone.setAttribute('aria-hidden', 'true')
      clone.setAttribute('inert', '')

      viewport.style.scrollSnapType = 'none'

      if (isNext) {
        viewport.append(clone)
      } else {
        viewport.prepend(clone)
        // Prepending shifts the real slides right; realign instantly so the insertion doesn't
        // flash. `scrollTo(..., 'instant')` rather than a raw `scrollLeft +=` — the compound
        // assignment's read/write isn't reliably observed by the browser right after a DOM
        // mutation changes `scrollWidth` (see the matching note by the final jump below).
        viewport.scrollTo({
          left: viewport.scrollLeft + scrollDeltaFor(viewport, fromItem, !!center),
          behavior: 'instant'
        })
      }

      const targetDelta = scrollDeltaFor(viewport, clone, !!center)
      animateScrollTo(viewport, viewport.scrollLeft + targetDelta, () => {
        clone.remove()

        // `clone.remove()` shrinks `scrollWidth`, and the browser clamps `scrollLeft` to the new
        // max as a side effect — sometimes before a subsequent `scrollLeft +=` on the same tick
        // observes it, landing short of the real target. `scrollTo(..., 'instant')` with the full
        // absolute target doesn't have that race.
        const finalDelta = scrollDeltaFor(viewport, toItem, !!center)
        viewport.scrollTo({ left: viewport.scrollLeft + finalDelta, behavior: 'instant' })

        viewport.style.scrollSnapType = ''
        finish()
      })
    }

    const navigate = (rawTarget: number) => {
      if (loopingRef.current) return
      const length = itemCountRef.current
      if (length === 0) return

      const effectiveLast = Math.max(0, length - itemsVisible)

      if (
        ends === 'loop' &&
        !isFade &&
        !prefersReducedMotion() &&
        carouselRef.current &&
        canLoop(carouselRef.current, length, isFade, !!center, !!auto)
      ) {
        if (rawTarget > effectiveLast) {
          performLoopTransition(true)
          return
        }
        if (rawTarget < 0) {
          performLoopTransition(false)
          return
        }
      }

      const target = normalizeIndex(rawTarget, effectiveLast + 1, wraps)
      const from = activeIndexRef.current
      if (target === null || target === from) return

      // This step is the carousel's own, and scrolls: a swipe still waiting for its answer no
      // longer says where the track should be.
      swipedToRef.current = null

      // `rawTarget`, not the post-wrap `target`, so a wrap-around still reports the direction the
      // caller actually asked for (e.g. Next wrapping last -> 0 stays "next", not "previous").
      const direction = directionBetween(from, rawTarget, viewportEl ? isRTL(viewportEl) : false)
      onSlide?.({ from, to: target, direction })
      lastTransitionRef.current = { from, to: target, direction }
      setActiveIndexInternal(target)
    }

    const goNext = () => navigate(activeIndexRef.current + 1)
    const goPrev = () => navigate(activeIndexRef.current - 1)
    const goTo = (index: number) => navigate(index)

    const pauseCycle = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      setCycling(false)
    }

    // What the autoplay timer does when it fires. The timer is set in one render and fires in a
    // later one, and each tick used to run the closure of the render that started the cycle:
    // its `interval`, `ends`, `items`, `transition` and `onSlide`, whatever they had become.
    const autoplayTickRef = useRef<(fromIndex: number) => void>(() => undefined)

    const scheduleAutoplay = (fromIndex: number = activeIndexRef.current) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      const nodes = viewportEl ? getCarouselItems(viewportEl) : []
      const attr = nodes[fromIndex]?.dataset.interval
      const ms = attr && !Number.isNaN(Number(attr)) ? Number(attr) : interval
      carouselRef.current?.style.setProperty('--cx-carousel-interval', `${ms}ms`)

      timeoutRef.current = setTimeout(() => autoplayTickRef.current(fromIndex), ms)
    }

    const stopPlayingForGood = () => {
      setPlaying(false)
      pauseCycle()
    }

    const autoplayTick = (fromIndex: number) => {
      const length = itemCountRef.current
      const effectiveLast = Math.max(0, length - itemsVisible)
      const upcoming = normalizeIndex(activeIndexRef.current + 1, effectiveLast + 1, wraps)
      const canAdvance =
        typeof document === 'undefined' ||
        (document.visibilityState === 'visible' && isElementVisible(carouselRef.current))

      if (!canAdvance) {
        scheduleAutoplay(fromIndex)
        return
      }

      goNext()

      // Nothing after the last slide of `ends="stop"`: autoplay is over, not paused, and
      // `CarouselPlayPause` says so. Left `playing`, it still read "Pause", and took one click to
      // stop what had stopped and another to start again.
      if (upcoming === null) {
        stopPlayingForGood()
        return
      }

      scheduleAutoplay(upcoming)
    }
    useIsomorphicLayoutEffect(() => {
      autoplayTickRef.current = autoplayTick
    })

    const startCycle = () => {
      scheduleAutoplay()
      setCycling(true)
    }

    const togglePlayPause = () => {
      if (playing) {
        stopPlayingForGood()
        return
      }
      setPlaying(true)
      startCycle()
    }

    useEffect(() => {
      if (!viewportEl) return undefined
      if (playing) startCycle()
      return () => pauseCycle()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportEl])

    // Under `ends="stop"` autoplay is over when it arrives at the last slide. It used to wait one
    // more interval there, for the tick that finds nothing to go to, with the indicator's
    // progress filling and `CarouselPlayPause` reading "Pause" all the while. An effect and not a
    // line of the tick, so that the slide is the one being shown: a controlled parent may not
    // follow the tick, or may move there by itself. Only a cycle that is running ends, so Play
    // on the last slide still starts one.
    useEffect(() => {
      if (!timeoutRef.current || wraps || itemCount === 0) return
      if (activeIndex >= Math.max(0, itemCount - itemsVisible)) stopPlayingForGood()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, itemCount, itemsVisible, wraps])

    // A new `interval` applies to the slide being shown, not from the one after it. A slide's own
    // `interval` still wins, in `scheduleAutoplay`.
    useEffect(() => {
      if (timeoutRef.current) scheduleAutoplay()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval])

    useEffect(() => {
      if (!viewportEl) return undefined
      const handlePointerDown = () => stopPlayingForGood()
      viewportEl.addEventListener('pointerdown', handlePointerDown)
      return () => viewportEl.removeEventListener('pointerdown', handlePointerDown)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportEl])

    // a11y: when a control at a disabled end is focused, move focus to the opposite control (if
    // it stays enabled) or the viewport, so focus never lands on nothing.
    useEffect(() => {
      if (ends !== 'stop') return
      const focused = document.activeElement as HTMLButtonElement | null
      const focusedIsPrev = atStart && !!focused && prevControlsRef.current.has(focused)
      const focusedIsNext = atEnd && !!focused && nextControlsRef.current.has(focused)
      if (!focusedIsPrev && !focusedIsNext) return

      const oppositeSet = focusedIsPrev ? nextControlsRef.current : prevControlsRef.current
      const oppositeStaysEnabled = focusedIsPrev ? !atEnd : !atStart
      const fallback = oppositeStaysEnabled ? Array.from(oppositeSet)[0] : null
      // `focused` is the control whose click (if any) just drove this redirect — `consumePointerClick`
      // reads (and clears) the pointer-vs-keyboard mark left on it, if `CarouselControlPrev`/
      // `CarouselControlNext` left one, so a stale mark from an earlier, unrelated interaction can't
      // leak into this one. See `focusRedirect`'s own comment for why this distinction matters
      // (Safari-only: a script-focused element still shows a ring there, unlike Chromium/Firefox).
      const viaPointer = consumePointerClick(focused)

      if (fallback) {
        focusRedirect(fallback, viaPointer, { preventScroll: true })
        return
      }

      if (viewportEl) {
        if (!viewportEl.hasAttribute('tabindex')) viewportEl.setAttribute('tabindex', '-1')
        focusRedirect(viewportEl, viaPointer, { preventScroll: true })
      }
    }, [atStart, atEnd, ends, viewportEl])

    // Stable identity for the same reason as `registerViewport` above — the controls' own
    // registration effect depends on it.
    const registerControl = useCallback((kind: 'prev' | 'next', element: HTMLButtonElement) => {
      const set = kind === 'prev' ? prevControlsRef.current : nextControlsRef.current
      set.add(element)
      return () => {
        set.delete(element)
      }
    }, [])

    // Compose rather than let a caller's handler silently replace the carousel's own — same rule
    // `CarouselControlButton`/`CarouselPlayPause` follow for `onClick`. These three sit on the
    // root element, so before this they were simply overwritten by the `{...rest}` spread below:
    // passing `onKeyDown` turned off arrow-key navigation and passing `onMouseEnter`/
    // `onMouseLeave` turned off pause-on-hover, both silently.
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (!keyboard) return
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      event.preventDefault()
      stopPlayingForGood()
      // The key that points where the next slide is: to the right, or to the left in a
      // right-to-left layout, as `directionBetween` reports the direction of travel.
      const nextKey = isRTL(event.currentTarget) ? 'ArrowLeft' : 'ArrowRight'
      if (event.key === nextKey) goNext()
      else goPrev()
    }

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(event)
      if (pause === 'hover') pauseCycle()
    }

    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(event)
      if (pause === 'hover' && playing) startCycle()
    }

    const contextValue: CarouselContextProps = {
      activeIndex,
      atEnd,
      atStart,
      ends,
      itemCount,
      itemsVisible,
      next: () => {
        stopPlayingForGood()
        goNext()
      },
      playing,
      prev: () => {
        stopPlayingForGood()
        goPrev()
      },
      registerControl,
      registerViewport,
      to: (index: number) => {
        stopPlayingForGood()
        goTo(index)
      },
      togglePlayPause
    }

    const _className = classNames(
      'carousel',
      {
        'carousel-fade': isFade,
        'carousel-center': center,
        'carousel-auto': auto,
        'carousel-playing': cycling
      },
      className
    )

    const _style = {
      ...style,
      ...(items != null && { '--cx-carousel-items': items }),
      ...(itemsGap != null && { '--cx-carousel-items-gap': itemsGap }),
      ...(itemsPeek != null && { '--cx-carousel-items-peek': itemsPeek })
    } as CSSProperties

    return (
      <div
        role="region"
        aria-roledescription="carousel"
        className={_className}
        style={_style}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
        ref={forkedRef}
      >
        <CarouselContext.Provider value={contextValue}>{children}</CarouselContext.Provider>
        <VisuallyHidden role="status">{liveMessage}</VisuallyHidden>
      </div>
    )
  }
)

Carousel.displayName = 'Carousel'

// The slides of the first `CarouselInner` found in `children` (see `slides.tsx`), or 0 when they
// can't be told from here: they are then counted from the DOM once the carousel has mounted.
function countSlides(children: ReactNode): number {
  for (const child of Children.toArray(children)) {
    if (isElementOfType<{ children?: ReactNode }>(child, CarouselInner)) {
      const { nodes, positioned } = readSlides(child.props.children)
      return positioned ? nodes.length : 0
    }
    if (!isValidElement<{ children?: ReactNode }>(child)) continue
    const count = countSlides(child.props.children)
    if (count > 0) return count
  }
  return 0
}
