import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselIndicators,
  CarouselInner,
  CarouselItem,
  CarouselPlayPause,
  I18nProvider
} from '../../../src/index'

const ThreeItemCarousel = (props: Partial<React.ComponentProps<typeof Carousel>> = {}) => (
  <Carousel {...props}>
    <CarouselControlPrev />
    <CarouselControlNext />
    <CarouselIndicators />
    <CarouselInner>
      <CarouselItem>Item-1</CarouselItem>
      <CarouselItem>Item-2</CarouselItem>
      <CarouselItem>Item-3</CarouselItem>
    </CarouselInner>
  </Carousel>
)

const ITEM_WIDTH = 300

// jsdom lays nothing out for real, so the scroll-sync effect's `isViewportScrollable` check
// (scrollWidth > clientWidth) and its `scrollDeltaFor` geometry both read as zero and the effect
// no-ops - which is why the class-toggling tests above never exercise it. These two regression
// tests need that geometry present from the very first mount (matching a real browser's layout),
// not patched in after - patching a specific node only after `render()` would miss the mount's
// own layout effect and make the *next* effect run look like the initial sync instead of the
// first real navigation. Patching the prototype before `render()` covers every node as it's
// created, including during mount.
function installCarouselGeometry() {
  const proto = HTMLElement.prototype
  const originalGetBoundingClientRect = proto.getBoundingClientRect
  const originalScrollWidth = Object.getOwnPropertyDescriptor(proto, 'scrollWidth')
  const originalClientWidth = Object.getOwnPropertyDescriptor(proto, 'clientWidth')
  const originalScrollLeft = Object.getOwnPropertyDescriptor(proto, 'scrollLeft')
  const originalScrollTo = proto.scrollTo
  const scrollLeftByNode = new WeakMap<HTMLElement, number>()

  const isInner = (el: HTMLElement) => el.classList.contains('carousel-inner')
  const isRealItem = (el: HTMLElement) =>
    el.classList.contains('carousel-item') && !el.classList.contains('carousel-item-clone')

  Object.defineProperty(proto, 'scrollWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return isInner(this) ? ITEM_WIDTH * 3 : 0
    }
  })
  Object.defineProperty(proto, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return isInner(this) ? ITEM_WIDTH : 0
    }
  })
  Object.defineProperty(proto, 'scrollLeft', {
    configurable: true,
    get(this: HTMLElement) {
      return scrollLeftByNode.get(this) ?? 0
    },
    set(this: HTMLElement, value: number) {
      scrollLeftByNode.set(this, value)
    }
  })
  proto.scrollTo = function (this: HTMLElement, opts?: ScrollToOptions | number) {
    if (opts && typeof opts === 'object' && opts.left != null) scrollLeftByNode.set(this, opts.left)
  } as typeof proto.scrollTo
  proto.getBoundingClientRect = function (this: HTMLElement) {
    if (isInner(this)) return { left: 0, right: ITEM_WIDTH, width: ITEM_WIDTH } as DOMRect
    if (isRealItem(this)) {
      // eslint-disable-next-line testing-library/no-node-access
      const siblings = Array.from(this.parentElement?.children ?? []).filter(
        (node): node is HTMLElement => node instanceof HTMLElement && isRealItem(node)
      )
      const index = siblings.indexOf(this)
      return {
        left: index * ITEM_WIDTH,
        right: (index + 1) * ITEM_WIDTH,
        width: ITEM_WIDTH
      } as DOMRect
    }
    return originalGetBoundingClientRect.call(this)
  }

  return function uninstall() {
    proto.getBoundingClientRect = originalGetBoundingClientRect
    proto.scrollTo = originalScrollTo
    if (originalScrollWidth) Object.defineProperty(proto, 'scrollWidth', originalScrollWidth)
    else delete (proto as { scrollWidth?: unknown }).scrollWidth
    if (originalClientWidth) Object.defineProperty(proto, 'clientWidth', originalClientWidth)
    else delete (proto as { clientWidth?: unknown }).clientWidth
    if (originalScrollLeft) Object.defineProperty(proto, 'scrollLeft', originalScrollLeft)
    else delete (proto as { scrollLeft?: unknown }).scrollLeft
  }
}

class FakeIntersectionObserver {
  static last: FakeIntersectionObserver
  callback: IntersectionObserverCallback
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    FakeIntersectionObserver.last = this
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Swaps in a controllable `IntersectionObserver` stub so tests can deliver entries by hand,
// simulating what the browser would report during a real user-driven scroll/swipe.
function installFakeIntersectionObserver() {
  const original = global.IntersectionObserver
  // @ts-expect-error - minimal stub, not a full IntersectionObserver implementation
  global.IntersectionObserver = FakeIntersectionObserver
  return {
    deliver: (entries: Partial<IntersectionObserverEntry>[]) =>
      act(() => {
        FakeIntersectionObserver.last.callback(
          entries as IntersectionObserverEntry[],
          FakeIntersectionObserver.last as never
        )
      }),
    uninstall: () => {
      global.IntersectionObserver = original
    }
  }
}

describe('Carousel', () => {
  describe('rendering', () => {
    test('renders the carousel wrapper and inner scroll track', () => {
      // The .carousel wrapper and .carousel-inner track are plain divs with no role of their
      // own - no accessible query reaches them directly.
      const { container } = render(<ThreeItemCarousel />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const carousel = container.querySelector('.carousel') as HTMLElement
      expect(carousel).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(carousel.querySelector('.carousel-inner')).toBeInTheDocument()
    })

    test('renders each item with the base class', () => {
      render(<ThreeItemCarousel />)
      expect(screen.getByText('Item-1')).toHaveClass('carousel-item')
      expect(screen.getByText('Item-2')).toHaveClass('carousel-item')
      expect(screen.getByText('Item-3')).toHaveClass('carousel-item')
    })

    test('renders labeled previous/next controls with decorative icons', () => {
      render(<ThreeItemCarousel />)
      const next = screen.getByRole('button', { name: 'Next slide' })
      const prev = screen.getByRole('button', { name: 'Previous slide' })
      // The icon is aria-hidden and decorative - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(next.firstChild).toHaveClass('directional-icon')
      // eslint-disable-next-line testing-library/no-node-access
      expect(prev.firstChild).toHaveClass('directional-icon')
    })

    test('renders one indicator per item, marking the active one', () => {
      render(<ThreeItemCarousel />)
      const indicators = screen.getAllByRole('button', { name: /^Slide \d$/ })
      expect(indicators).toHaveLength(3)
      expect(indicators[0]).toHaveClass('active')
      expect(indicators[0]).toHaveAttribute('aria-current', 'true')
      expect(indicators[1]).not.toHaveClass('active')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<ThreeItemCarousel />)
      expect(container).toMatchSnapshot()
    })
  })

  describe('indicator navigation', () => {
    test('clicking an indicator advances and returning to the first restores the original active item', async () => {
      render(<ThreeItemCarousel />)
      const item1 = screen.getByText('Item-1')
      const item2 = screen.getByText('Item-2')

      expect(item1).toHaveClass('active')
      expect(item2).not.toHaveClass('active')

      fireEvent.click(screen.getByRole('button', { name: 'Slide 2' }))
      await waitFor(() => expect(item2).toHaveClass('active'))
      expect(item1).not.toHaveClass('active')

      fireEvent.click(screen.getByRole('button', { name: 'Slide 1' }))
      await waitFor(() => expect(item1).toHaveClass('active'))
      expect(item2).not.toHaveClass('active')
    })
  })

  describe('control button navigation', () => {
    test('Next/Previous buttons move the active item forward and back', async () => {
      render(<ThreeItemCarousel />)
      const item1 = screen.getByText('Item-1')
      const item2 = screen.getByText('Item-2')

      expect(item1).toHaveClass('active')

      fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
      await waitFor(() => expect(item2).toHaveClass('active'))
      expect(item1).not.toHaveClass('active')

      fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
      await waitFor(() => expect(item1).toHaveClass('active'))
      expect(item2).not.toHaveClass('active')
    })

    test('wrapping past the last item with ends="wrap" returns to the first', async () => {
      render(
        <Carousel ends="wrap">
          <CarouselControlNext />
          <CarouselInner>
            <CarouselItem>Item-1</CarouselItem>
            <CarouselItem>Item-2</CarouselItem>
          </CarouselInner>
        </Carousel>
      )
      const item1 = screen.getByText('Item-1')
      const next = screen.getByRole('button', { name: 'Next slide' })

      fireEvent.click(next)
      await waitFor(() => expect(item1).not.toHaveClass('active'))
      fireEvent.click(next)
      await waitFor(() => expect(item1).toHaveClass('active'))
    })

    test('ends="stop" disables the previous control on the first slide', () => {
      render(
        <Carousel ends="stop">
          <CarouselControlPrev />
          <CarouselControlNext />
          <CarouselInner>
            <CarouselItem>Item-1</CarouselItem>
            <CarouselItem>Item-2</CarouselItem>
          </CarouselInner>
        </Carousel>
      )
      expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled()
    })

    test('an elastic overscroll bounce at the start edge does not enable the previous control under ends="stop"', () => {
      const uninstallGeometry = installCarouselGeometry()
      try {
        render(
          <Carousel ends="stop">
            <CarouselControlPrev />
            <CarouselControlNext />
            <CarouselInner>
              <CarouselItem>Item-1</CarouselItem>
              <CarouselItem>Item-2</CarouselItem>
              <CarouselItem>Item-3</CarouselItem>
            </CarouselInner>
          </Carousel>
        )
        // eslint-disable-next-line testing-library/no-node-access
        const inner = document.querySelector('.carousel-inner') as HTMLElement
        const prev = screen.getByRole('button', { name: 'Previous slide' })
        expect(prev).toBeDisabled()

        // iOS Safari/macOS trackpad rubber-banding can dip `scrollLeft` slightly negative when
        // the user swipes past the start edge, even while still resting on the first slide.
        inner.scrollLeft = -20
        fireEvent.scroll(inner)

        expect(prev).toBeDisabled()
      } finally {
        uninstallGeometry()
      }
    })

    test('suppresses the focus-ring outline and forwards a caller onPointerDown on press', () => {
      const onPointerDown = vi.fn()
      render(
        <Carousel>
          <CarouselControlPrev onPointerDown={onPointerDown} style={{ outline: '2px solid red' }} />
          <CarouselControlNext onPointerDown={onPointerDown} style={{ outline: '2px solid red' }} />
          <CarouselInner>
            <CarouselItem>Item-1</CarouselItem>
            <CarouselItem>Item-2</CarouselItem>
          </CarouselInner>
        </Carousel>
      )
      const prev = screen.getByRole('button', { name: 'Previous slide' })
      const next = screen.getByRole('button', { name: 'Next slide' })

      fireEvent.pointerDown(prev)
      expect(prev.style.outline).toBe('none')
      fireEvent.pointerDown(next)
      expect(next.style.outline).toBe('none')

      expect(onPointerDown).toHaveBeenCalledTimes(2)
    })
  })

  describe('play/pause control', () => {
    test('reflects autoplay state and toggles on click', () => {
      render(
        <Carousel autoplay>
          <CarouselPlayPause />
          <CarouselInner>
            <CarouselItem>Item-1</CarouselItem>
            <CarouselItem>Item-2</CarouselItem>
          </CarouselInner>
        </Carousel>
      )

      const toggle = screen.getByRole('button', { name: 'Pause' })
      fireEvent.click(toggle)
      expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    })

    test('suppresses the focus-ring outline and forwards a caller onPointerDown on press', () => {
      const onPointerDown = vi.fn()
      render(
        <Carousel autoplay>
          <CarouselPlayPause onPointerDown={onPointerDown} style={{ outline: '2px solid red' }} />
          <CarouselInner>
            <CarouselItem>Item-1</CarouselItem>
            <CarouselItem>Item-2</CarouselItem>
          </CarouselInner>
        </Carousel>
      )

      const toggle = screen.getByRole('button', { name: 'Pause' })
      fireEvent.pointerDown(toggle)

      expect(toggle.style.outline).toBe('none')
      expect(onPointerDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Carousel ref={ref}>
          <CarouselInner>
            <CarouselItem>Item-1</CarouselItem>
          </CarouselInner>
        </Carousel>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ThreeItemCarousel />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('RTL locale', () => {
    // The prev/next controls carry no hardcoded left/right classing of their own (chassis-css's
    // own `[dir=rtl]` rules flip the icon glyphs), so under an RTL locale the component should
    // render and navigate identically.
    test('renders and navigates the same way as under LTR', async () => {
      render(
        <I18nProvider locale="ar-SA">
          <ThreeItemCarousel />
        </I18nProvider>
      )
      const item1 = screen.getByText('Item-1')
      const item2 = screen.getByText('Item-2')
      expect(item1).toHaveClass('active')

      fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
      await waitFor(() => expect(item2).toHaveClass('active'))
      expect(item1).not.toHaveClass('active')
    })
  })

  describe('scroll synchronization', () => {
    test('the first user-triggered navigation animates instead of snapping instantly', () => {
      const uninstallGeometry = installCarouselGeometry()
      vi.useFakeTimers()
      try {
        render(<ThreeItemCarousel />)
        // eslint-disable-next-line testing-library/no-node-access
        const inner = document.querySelector('.carousel-inner') as HTMLElement

        fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
        // An instant jump would already show at the target synchronously, right after the click's
        // layout effect runs. An animated one is still queued on the first requestAnimationFrame.
        expect(inner.scrollLeft).toBe(0)

        act(() => vi.runAllTimers())
        expect(inner.scrollLeft).toBe(ITEM_WIDTH)
      } finally {
        vi.useRealTimers()
        uninstallGeometry()
      }
    })

    test('a stale visibility entry delivered mid-animation does not revert the newly active slide', () => {
      const uninstallGeometry = installCarouselGeometry()
      vi.useFakeTimers()
      const { deliver, uninstall: uninstallObserver } = installFakeIntersectionObserver()

      try {
        render(<ThreeItemCarousel defaultActiveIndex={1} />)
        // Mounting triggers a second scroll-sync pass once `itemCount` updates from its initial 0
        // to the real count - flush that settle before the real test sequence below so it starts
        // from a clean (non-syncing) state.
        act(() => vi.runAllTimers())
        // eslint-disable-next-line testing-library/no-node-access
        const items = Array.from(document.querySelectorAll('.carousel-item')) as HTMLElement[]

        // Browser currently reports the second slide (the mounted active one) fully visible.
        deliver([{ target: items[1], isIntersecting: true, intersectionRatio: 1 }])

        fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
        // Mid-animation: the outgoing slide reports leaving view. Before the fix this entry was
        // dropped outright instead of being recorded, leaving its ratio stuck at the stale 1.0
        // above.
        deliver([{ target: items[1], isIntersecting: false, intersectionRatio: 0 }])

        act(() => vi.runAllTimers())

        // Settle: the browser reports the new slide fully visible.
        deliver([{ target: items[2], isIntersecting: true, intersectionRatio: 1 }])

        expect(screen.getByText('Item-3')).toHaveClass('active')
        expect(screen.getByText('Item-2')).not.toHaveClass('active')
      } finally {
        uninstallObserver()
        vi.useRealTimers()
        uninstallGeometry()
      }
    })

    test('a user-driven slide change reported by the observer does not fight the in-progress scroll', () => {
      const uninstallGeometry = installCarouselGeometry()
      vi.useFakeTimers()
      const { deliver, uninstall: uninstallObserver } = installFakeIntersectionObserver()

      try {
        render(<ThreeItemCarousel />)
        // Settle the mount pass first (see the note in the test above).
        act(() => vi.runAllTimers())
        // eslint-disable-next-line testing-library/no-node-access
        const inner = document.querySelector('.carousel-inner') as HTMLElement
        // eslint-disable-next-line testing-library/no-node-access
        const items = Array.from(document.querySelectorAll('.carousel-item')) as HTMLElement[]
        const scrollLeftBeforeSwipe = inner.scrollLeft

        // A real swipe/wheel scroll would have already moved `scrollLeft` by the time the browser
        // reports this - the observer is what tells React the active slide changed, not the other
        // way around. Nothing here simulates that native scroll on purpose: the point of this test
        // is that the component itself must not be the one moving `scrollLeft` in response.
        deliver([
          { target: items[0], isIntersecting: false, intersectionRatio: 0 },
          { target: items[1], isIntersecting: true, intersectionRatio: 1 }
        ])
        expect(screen.getByText('Item-2')).toHaveClass('active')

        // Flush any timers a (buggy) corrective scroll-sync would have scheduled.
        act(() => vi.runAllTimers())

        // The scroll-sync effect exists for programmatic navigation (buttons, indicators,
        // autoplay); it must stay out of the way here, or it fights the native scroll-snap
        // machinery that's still settling the user's own gesture - which is what made swipe/wheel
        // navigation feel choppy before this was fixed.
        expect(inner.scrollLeft).toBe(scrollLeftBeforeSwipe)
      } finally {
        uninstallObserver()
        vi.useRealTimers()
        uninstallGeometry()
      }
    })
  })
})
