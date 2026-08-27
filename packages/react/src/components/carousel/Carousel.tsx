import React, {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
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
   * The active slide's index, for controlled usage. Pair with `onSlide` or `onSlid` to feed the
   * new index back — they're the only way a controlled carousel's `activeIndex` gets updated.
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
   * Move to the previous/next slide with the Left/Right arrow keys while focus is inside the carousel.
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
      onSlid,
      onSlide,
      pause = 'hover',
      style,
      transition = 'scroll',
      ...rest
    },
    ref
  ) => {
    // `onSlide`/`onSlid` — not a dedicated `onChange` — are the only way a controlled
    // `activeIndex` gets fed back (see the CarouselProps `activeIndex` doc and carousel.mdx's
    // "Controlled usage" section). Missing both means every click/swipe/autoplay advance updates
    // internal state that `useControllableState` immediately discards (controlled mode always
    // mirrors the prop), so the carousel silently freezes instead of erroring.
    if (activeIndexProp !== undefined && !onSlide && !onSlid) {
      console.warn(
        'Carousel: `activeIndex` is set (controlled) but neither `onSlide` nor `onSlid` is — ' +
          'nothing feeds the new index back to your state, so the carousel will visually freeze ' +
          'on click/swipe/autoplay. Pass `onSlide` or `onSlid` and update `activeIndex` from it.'
      )
    }

    const carouselRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, carouselRef)

    const [viewportEl, setViewportEl] = useState<HTMLDivElement | null>(null)
    // Stable identity: this goes into `contextValue` and on to `useForkedRef` in `CarouselInner`,
    // whose memo is keyed on the refs array — a fresh closure every render would keep detaching
    // and reattaching the viewport ref instead of running once per mount.
    const registerViewport = useCallback((node: HTMLDivElement | null) => setViewportEl(node), [])

    const [activeIndex, setActiveIndex] = useControllableState(activeIndexProp, defaultActiveIndex)
    const activeIndexRef = useRef(activeIndex)
    useIsomorphicLayoutEffect(() => {
      activeIndexRef.current = activeIndex
    }, [activeIndex])

    const [itemCount, setItemCount] = useState(0)
    const itemCountRef = useRef(itemCount)
    useIsomorphicLayoutEffect(() => {
      itemCountRef.current = itemCount
    }, [itemCount])

    const [playing, setPlaying] = useState(autoplay)
    const [cycling, setCycling] = useState(false)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)

    const loopingRef = useRef(false)
    // True while a programmatic scroll-sync animation is in flight, so the IntersectionObserver
    // doesn't treat a slide passing through mid-scroll (e.g. slide 2 on the way from 1 to 3) as
    // the new active slide and hijack the navigation before it reaches its real target.
    const syncingScrollRef = useRef(false)
    // Set right before an `activeIndex` change originates from the IntersectionObserver (i.e. the
    // user physically scrolled/swiped there) so the scroll-sync effect below can skip it. Without
    // this, every threshold the observer crosses mid-gesture — before the browser's own
    // scroll-snap has actually settled the position — would make that effect "correct" the
    // still-in-progress native scroll, fighting the user's own touch/wheel input.
    const skipScrollSyncRef = useRef(false)
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
    const lastTransitionRef = useRef<CarouselSlideDetail>({
      from: activeIndex,
      to: activeIndex,
      direction: 'left'
    })
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

      viewportEl.addEventListener('scroll', handleScroll, { passive: true })
      return () => viewportEl.removeEventListener('scroll', handleScroll)
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
              onSlide?.(detail)
              skipScrollSyncRef.current = true
              setActiveIndexInternal(bestIndex)
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

    // `activeIndex` is the source of truth for which slide is active — applied directly to the
    // DOM here rather than through per-item props, so it stays correct even when there's no real
    // layout to scroll (SSR, jsdom tests). Fade mode's crossfade is driven entirely by this class.
    // The WAI-ARIA carousel pattern's per-slide `aria-roledescription`/positional `aria-label` are
    // applied the same imperative way, for the same reason — `CarouselItem` itself has no idea
    // where it sits among its siblings or how many there are.
    useIsomorphicLayoutEffect(() => {
      if (!viewportEl) return
      const nodes = getCarouselItems(viewportEl)
      for (const [index, node] of nodes.entries()) {
        node.classList.toggle('active', index === activeIndex)
        node.setAttribute('aria-roledescription', 'slide')
        node.setAttribute('aria-label', `${index + 1} of ${nodes.length}`)
      }
    }, [viewportEl, activeIndex, itemCount])

    // Best-effort visual sync: scrolls the real DOM position to match `activeIndex` after a
    // programmatic navigation. A user-driven drag/swipe goes the other way (observer above), which
    // sets `skipScrollSyncRef` so this effect no-ops for it instead of fighting a gesture that's
    // still physically in progress — see the ref's own comment for why that matters.
    useIsomorphicLayoutEffect(() => {
      if (skipScrollSyncRef.current) {
        skipScrollSyncRef.current = false
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

      // Cancel any previous scroll-sync still animating so it can't finish later and clobber
      // this newer target, and so `syncingScrollRef` isn't cleared early while this one runs.
      cancelScrollSyncRef.current?.()

      syncingScrollRef.current = true
      viewportEl.style.scrollSnapType = 'none'

      if (instant) {
        viewportEl.scrollTo({ left: viewportEl.scrollLeft + delta, behavior: 'instant' })
        viewportEl.style.scrollSnapType = ''
        syncingScrollRef.current = false
        cancelScrollSyncRef.current = null
      } else {
        deferOnSlidRef.current = true
        cancelScrollSyncRef.current = animateScrollTo(
          viewportEl,
          viewportEl.scrollLeft + delta,
          () => {
            viewportEl.style.scrollSnapType = ''
            syncingScrollRef.current = false
            cancelScrollSyncRef.current = null
            deferOnSlidRef.current = false
            onSlid?.(lastTransitionRef.current)
          }
        )
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportEl, activeIndex, itemCount, center, isFade])

    useEffect(() => {
      if (!mountedForSlidRef.current) {
        mountedForSlidRef.current = true
        return
      }
      if (deferOnSlidRef.current) return
      onSlid?.(lastTransitionRef.current)
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

    const scheduleAutoplay = (fromIndex: number = activeIndexRef.current) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      const nodes = viewportEl ? getCarouselItems(viewportEl) : []
      const attr = nodes[fromIndex]?.dataset.interval
      const ms = attr && !Number.isNaN(Number(attr)) ? Number(attr) : interval
      carouselRef.current?.style.setProperty('--cx-carousel-interval', `${ms}ms`)

      timeoutRef.current = setTimeout(() => {
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

        if (upcoming === null) {
          pauseCycle()
          return
        }

        scheduleAutoplay(upcoming)
      }, ms)
    }

    const startCycle = () => {
      scheduleAutoplay()
      setCycling(true)
    }

    const stopPlayingForGood = () => {
      setPlaying(false)
      pauseCycle()
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!keyboard) return
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      event.preventDefault()
      stopPlayingForGood()
      if (event.key === 'ArrowLeft') goPrev()
      else goNext()
    }

    const handleMouseEnter = () => {
      if (pause === 'hover') pauseCycle()
    }

    const handleMouseLeave = () => {
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
        <span role="status" className="visually-hidden">
          {liveMessage}
        </span>
      </div>
    )
  }
)

Carousel.displayName = 'Carousel'
