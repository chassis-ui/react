import * as React from 'react'
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  Link,
  List,
  ListItem,
  Menu,
  MenuItem,
  MenuList,
  MenuToggle,
  Nav,
  NavItem,
  NavLink,
  Scrollspy,
  useScrollspy
} from '../../../src/index'

// jsdom lays nothing out and has no `IntersectionObserver`. Each section's top is given here, in
// page coordinates, and `scrollTo` moves every section up by the scroll position, then lets the
// observers report. Roots (the viewport, or an element) are 400px tall, so with the default
// `rootMargin` of `-25%` at the bottom the activation line is at 300px.
let tops: Record<string, number> = {}
let scrollPosition = 0

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = []
  targets = new Set<Element>()

  constructor(
    public callback: IntersectionObserverCallback,
    public options: IntersectionObserverInit = {}
  ) {
    IntersectionObserverMock.instances.push(this)
  }

  observe(target: Element) {
    this.targets.add(target)
  }

  unobserve(target: Element) {
    this.targets.delete(target)
  }

  disconnect() {
    this.targets.clear()
  }
}

// Scrolls to `position` and has every observer report, as a browser does when a section crosses
// the line.
function scrollTo(position: number) {
  scrollPosition = position
  act(() => {
    IntersectionObserverMock.instances.forEach((observer) => {
      if (observer.targets.size) {
        observer.callback([], observer as unknown as IntersectionObserver)
      }
    })
  })
}

const observed = () =>
  IntersectionObserverMock.instances.flatMap((observer) => [...observer.targets].map((t) => t.id))

const nextFrame = () => act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

beforeEach(() => {
  tops = { one: 0, two: 500, three: 1000, four: 1500 }
  scrollPosition = 0
  IntersectionObserverMock.instances = []
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const known = this.id in tops
    // A section that isn't rendered has no box, as under `display: none`.
    const size = known && !(this as HTMLElement).hidden ? 100 : 0
    const top = known ? (tops[this.id] as number) - scrollPosition : 0
    return {
      top,
      bottom: top + size,
      left: 0,
      right: size,
      height: size,
      width: size,
      x: 0,
      y: top,
      toJSON: () => ({})
    } as DOMRect
  })
  vi.spyOn(Element.prototype, 'clientHeight', 'get').mockReturnValue(400)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const Sections = ({ ids = ['one', 'two', 'three', 'four'] }: { ids?: string[] }) => (
  <>
    {ids.map((id) => (
      <section key={id} id={id} aria-label={`Section ${id}`} />
    ))}
  </>
)

const SpyNav = (props: Partial<React.ComponentProps<typeof Scrollspy>>) => (
  <>
    <Scrollspy {...props}>
      <Nav>
        <NavItem href="#one">One</NavItem>
        <NavItem href="#two">Two</NavItem>
        <NavItem href="#three">Three</NavItem>
        <NavItem href="#four">Four</NavItem>
      </Nav>
    </Scrollspy>
    <Sections />
  </>
)

const link = (name: string) => screen.getByRole('link', { name })

const current = () =>
  screen
    .queryAllByRole('link')
    .filter((element) => element.getAttribute('aria-current') === 'true')
    .map((element) => element.textContent)

describe('Scrollspy', () => {
  describe('the active section', () => {
    test('marks nothing before the first observation', () => {
      render(<SpyNav />)
      expect(current()).toEqual([])
      expect(link('One')).not.toHaveClass('active')
    })

    test('marks the link to the last section whose top passed the line', () => {
      render(<SpyNav />)
      scrollTo(0)
      expect(current()).toEqual(['One'])
      expect(link('One')).toHaveClass('nav-link', 'active')
      expect(link('Two')).not.toHaveClass('active')

      // Two's top is at 250, above the line at 300.
      scrollTo(250)
      expect(current()).toEqual(['Two'])
      expect(link('One')).not.toHaveClass('active')
      expect(link('One')).not.toHaveAttribute('aria-current')

      // Two's top is at 350, below it again.
      scrollTo(150)
      expect(current()).toEqual(['One'])
    })

    test('keeps the first section active while its top is in view at the top', () => {
      // One and two have both passed the line at 300 before anything scrolled.
      tops = { one: 0, two: 200, three: 1000, four: 1500 }
      render(<SpyNav />)
      scrollTo(0)
      expect(current()).toEqual(['One'])
      scrollTo(10)
      expect(current()).toEqual(['Two'])
    })

    test("measures the top from rootMargin's top length", () => {
      tops = { one: 40, two: 200, three: 1000, four: 1500 }
      render(<SpyNav rootMargin="-50px 0px -25%" />)
      // One's top is above the zone, which starts at 50.
      scrollTo(0)
      expect(current()).toEqual(['Two'])
    })

    test('follows the scroll while the first section is active from its start', async () => {
      // One holds the others, so it never lies wholly inside the zone, and leaving its start
      // reports no intersection.
      tops = { one: 0, two: 100, three: 200, four: 1500 }
      render(<SpyNav />)
      scrollTo(0)
      expect(current()).toEqual(['One'])
      scrollPosition = 50
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })
      await nextFrame()
      expect(current()).toEqual(['Three'])
    })

    test('stops following the scroll once past the start', async () => {
      tops = { one: 0, two: 100, three: 200, four: 1500 }
      render(<SpyNav />)
      scrollTo(50)
      expect(current()).toEqual(['Three'])
      // Nothing reports the move back: the scroll listener is gone.
      scrollPosition = 0
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })
      await nextFrame()
      expect(current()).toEqual(['Three'])
    })

    test('keeps a section active while it is read, after its top left the root', () => {
      render(<SpyNav />)
      // Three is at -200, four at 300: not past the line yet.
      scrollTo(1200)
      expect(current()).toEqual(['Three'])
    })

    test('marks nothing while every section is below the line', () => {
      tops = { one: 600, two: 900, three: 1200, four: 1500 }
      render(<SpyNav />)
      scrollTo(0)
      expect(current()).toEqual([])
      scrollTo(400)
      expect(current()).toEqual(['One'])
    })

    test('reads the sections in document order, whatever the order of the links', () => {
      render(
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#two">Two</NavItem>
              <NavItem href="#one">One</NavItem>
            </Nav>
          </Scrollspy>
          <Sections ids={['one', 'two']} />
        </>
      )
      scrollTo(300)
      expect(current()).toEqual(['Two'])
    })

    test('skips a section that is not rendered', () => {
      render(
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#one">One</NavItem>
              <NavItem href="#two">Two</NavItem>
            </Nav>
          </Scrollspy>
          <section id="one" aria-label="One" />
          <section id="two" aria-label="Two" hidden />
        </>
      )
      scrollTo(600)
      expect(current()).toEqual(['One'])
    })

    test('marks every link to the active section', () => {
      render(
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#one">One</NavItem>
            </Nav>
            <Link href="#one">Back to one</Link>
          </Scrollspy>
          <Sections ids={['one']} />
        </>
      )
      scrollTo(0)
      expect(current()).toEqual(['One', 'Back to one'])
    })

    test('reports a change to onActiveChange', () => {
      const onActiveChange = vi.fn()
      tops = { one: 400, two: 800, three: 1200, four: 1600 }
      render(<SpyNav onActiveChange={onActiveChange} />)
      scrollTo(0)
      expect(onActiveChange).not.toHaveBeenCalled()
      scrollTo(200)
      expect(onActiveChange).toHaveBeenLastCalledWith('one')
      scrollTo(210)
      expect(onActiveChange).toHaveBeenCalledTimes(1)
      scrollTo(600)
      expect(onActiveChange).toHaveBeenLastCalledWith('two')
      scrollTo(0)
      expect(onActiveChange).toHaveBeenLastCalledWith(null)
      expect(onActiveChange).toHaveBeenCalledTimes(3)
    })

    test('measures again at the end of a scroll, which no intersection reports', () => {
      render(<SpyNav />)
      scrollTo(0)
      scrollPosition = 1100
      act(() => {
        window.dispatchEvent(new Event('scrollend'))
      })
      expect(current()).toEqual(['Three'])
    })

    test('an active link given as a prop stays the current page', () => {
      render(
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#one" active>
                One
              </NavItem>
              <NavItem href="#two">Two</NavItem>
            </Nav>
          </Scrollspy>
          <Sections ids={['one', 'two']} />
        </>
      )
      scrollTo(300)
      expect(link('One')).toHaveAttribute('aria-current', 'page')
      expect(link('Two')).toHaveAttribute('aria-current', 'true')
    })
  })

  describe('the links', () => {
    test('marks a ListItem', () => {
      render(
        <>
          <Scrollspy>
            <List>
              <ListItem href="#one">One</ListItem>
              <ListItem href="#two">Two</ListItem>
            </List>
          </Scrollspy>
          <Sections ids={['one', 'two']} />
        </>
      )
      scrollTo(300)
      expect(link('Two')).toHaveClass('list-item', 'list-action', 'active')
      expect(link('Two')).toHaveAttribute('aria-current', 'true')
      expect(link('One')).not.toHaveClass('active')
    })

    test('marks a link given with asChild, whose href only the element has', () => {
      render(
        <>
          <Scrollspy>
            <Nav component="nav">
              <NavLink asChild>
                <a href="#one">One</a>
              </NavLink>
              <NavLink asChild>
                <a href="#two">Two</a>
              </NavLink>
            </Nav>
          </Scrollspy>
          <Sections ids={['one', 'two']} />
        </>
      )
      scrollTo(300)
      expect(current()).toEqual(['Two'])
    })

    test('ignores a link to another page', () => {
      render(
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#one">One</NavItem>
              <NavItem href="/elsewhere#two">Two</NavItem>
            </Nav>
          </Scrollspy>
          <Sections ids={['one', 'two']} />
        </>
      )
      expect(observed()).toEqual(['one'])
      scrollTo(300)
      expect(current()).toEqual(['One'])
    })

    test.each([
      ['on the component', (href: string) => <NavItem href={href}>Target</NavItem>],
      [
        'on the asChild element',
        (href: string) => (
          <NavLink asChild>
            <a href={href}>Target</a>
          </NavLink>
        )
      ]
    ])('follows a link whose href changes, %s', async (_, target) => {
      const page = (href: string) => (
        <>
          <Scrollspy>
            <Nav component="nav">{target(href)}</Nav>
          </Scrollspy>
          <Sections />
        </>
      )
      const { rerender } = render(page('#one'))
      scrollTo(0)
      expect(current()).toEqual(['Target'])
      rerender(page('#four'))
      // The attribute is read after it changed in the DOM.
      await waitFor(() => expect(observed()).toEqual(['four']))
      scrollTo(0)
      expect(current()).toEqual([])
      scrollTo(1300)
      expect(current()).toEqual(['Target'])
    })

    test('leaves a disabled link out, as the plugin does', () => {
      render(
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#one" disabled>
                One
              </NavItem>
              <NavItem href="#two">Two</NavItem>
            </Nav>
          </Scrollspy>
          <Sections ids={['one', 'two']} />
        </>
      )
      expect(observed()).toEqual(['two'])
      scrollTo(0)
      expect(link('One')).not.toHaveClass('active')
      expect(current()).toEqual([])
    })

    test('ignores an href a URL cannot be made of', () => {
      render(
        <>
          <Scrollspy>
            <Link href="http://#one">Broken</Link>
            <Link href="#one">One</Link>
          </Scrollspy>
          <Sections ids={['one']} />
        </>
      )
      scrollTo(0)
      expect(current()).toEqual(['One'])
    })

    test('unmarks a link that leaves the Scrollspy', () => {
      const { rerender } = render(<SpyNav />)
      scrollTo(0)
      rerender(
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#two">Two</NavItem>
            </Nav>
          </Scrollspy>
          <Sections />
        </>
      )
      expect(observed()).toEqual(['two'])
      scrollTo(0)
      expect(current()).toEqual([])
    })

    test('forwards the ref a link is given', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Scrollspy>
          <NavLink href="#one" ref={ref}>
            One
          </NavLink>
        </Scrollspy>
      )
      expect(ref.current).toBe(link('One'))
    })

    test('leaves a link outside a Scrollspy as it was', () => {
      render(
        <>
          <SpyNav />
          <NavLink href="#one">Outside</NavLink>
        </>
      )
      scrollTo(0)
      expect(link('Outside')).not.toHaveClass('active')
      expect(link('Outside')).not.toHaveAttribute('aria-current')
    })
  })

  describe('nested navigation', () => {
    test('marks the link a nested nav follows, without aria-current', () => {
      render(
        <>
          <Scrollspy>
            <Nav component="nav" aria-label="Sections">
              <NavLink href="#one">One</NavLink>
              <Nav component="nav" aria-label="One's sections">
                <NavLink href="#two">One, first</NavLink>
                <NavLink href="#three">One, second</NavLink>
              </Nav>
              <NavLink href="#four">Four</NavLink>
            </Nav>
          </Scrollspy>
          <Sections />
        </>
      )
      scrollTo(800)
      expect(current()).toEqual(['One, second'])
      expect(link('One')).toHaveClass('active')
      expect(link('One')).not.toHaveAttribute('aria-current')
      expect(link('One, first')).not.toHaveClass('active')

      scrollTo(1300)
      expect(link('One')).not.toHaveClass('active')
      expect(current()).toEqual(['Four'])
    })

    test('marks the toggle of the menu an item is in', () => {
      render(
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#one">One</NavItem>
              <Menu component="li" className="nav-item">
                <MenuToggle component={NavLink}>More</MenuToggle>
                <MenuList>
                  <MenuItem href="#two">Two</MenuItem>
                </MenuList>
              </Menu>
            </Nav>
          </Scrollspy>
          <Sections ids={['one', 'two']} />
        </>
      )
      const toggle = screen.getByRole('button', { name: 'More' })
      scrollTo(0)
      expect(toggle).not.toHaveClass('active')

      scrollTo(300)
      const item = screen.getByRole('menuitem', { name: 'Two', hidden: true })
      expect(item).toHaveClass('menu-item', 'active')
      expect(item).toHaveAttribute('aria-current', 'true')
      expect(toggle).toHaveClass('active')
      expect(toggle).not.toHaveAttribute('aria-current')
    })
  })

  describe('the sections', () => {
    test('observes within root, with rootMargin', () => {
      const root = React.createRef<HTMLDivElement>()
      render(
        <>
          <Scrollspy root={root} rootMargin="0px 0px -50%">
            <Nav>
              <NavItem href="#one">One</NavItem>
              <NavItem href="#two">Two</NavItem>
            </Nav>
          </Scrollspy>
          <div data-testid="root" ref={root}>
            <section id="one" aria-label="One" />
          </div>
          <section id="two" aria-label="Two" />
        </>
      )
      const [observer] = IntersectionObserverMock.instances
      expect(observer?.options).toEqual({
        root: screen.getByTestId('root'),
        rootMargin: '0px 0px -50%',
        threshold: [0, 1]
      })
      // Two is outside the root.
      expect(observed()).toEqual(['one'])
      // The line is at 200.
      tops = { one: 150 }
      scrollTo(0)
      expect(current()).toEqual(['One'])
      tops = { one: 250 }
      scrollTo(0)
      expect(current()).toEqual([])
    })

    test('observes in a root whose element mounts after the Scrollspy', async () => {
      const root = React.createRef<HTMLDivElement>()
      const Page = ({ box }: { box: boolean }) => (
        <>
          <Scrollspy root={root}>
            <NavLink href="#one">One</NavLink>
          </Scrollspy>
          {box && (
            <div data-testid="root" ref={root}>
              <section id="one" aria-label="One" />
            </div>
          )}
        </>
      )
      const { rerender } = render(<Page box={false} />)
      rerender(<Page box />)
      await nextFrame()
      const observer =
        IntersectionObserverMock.instances[IntersectionObserverMock.instances.length - 1]
      expect(observer?.options.root).toBe(screen.getByTestId('root'))
      expect(observed()).toEqual(['one'])
    })

    test('observes in a root whose element is replaced', async () => {
      const root = React.createRef<HTMLDivElement>()
      const Page = ({ id }: { id: string }) => (
        <>
          <Scrollspy root={root}>
            <NavLink href="#one">One</NavLink>
          </Scrollspy>
          <div key={id} data-testid={id} ref={root}>
            <section id="one" aria-label="One" />
          </div>
        </>
      )
      const { rerender } = render(<Page id="first" />)
      rerender(<Page id="second" />)
      await nextFrame()
      const observer =
        IntersectionObserverMock.instances[IntersectionObserverMock.instances.length - 1]
      expect(observer?.options.root).toBe(screen.getByTestId('second'))
      expect(observed()).toEqual(['one'])
      scrollTo(0)
      expect(current()).toEqual(['One'])
    })

    test('observes a section rendered after the links', async () => {
      const { rerender } = render(
        <>
          <SpyNav />
        </>
      )
      rerender(<SpyNav />)
      expect(observed()).toEqual(['one', 'two', 'three', 'four'])

      const Late = ({ show }: { show: boolean }) => (
        <>
          <Scrollspy>
            <Nav>
              <NavItem href="#late">Late</NavItem>
            </Nav>
          </Scrollspy>
          {show && <section id="late" aria-label="Late" />}
        </>
      )
      tops = { late: 0 }
      rerender(<Late show={false} />)
      expect(observed()).toEqual([])
      rerender(<Late show />)
      await nextFrame()
      expect(observed()).toEqual(['late'])
      expect(current()).toEqual(['Late'])
    })

    test('stops observing when it unmounts', () => {
      const { unmount } = render(<SpyNav />)
      expect(observed()).toHaveLength(4)
      unmount()
      expect(observed()).toEqual([])
    })

    test('marks nothing without IntersectionObserver', () => {
      vi.stubGlobal('IntersectionObserver', undefined)
      render(<SpyNav />)
      expect(current()).toEqual([])
    })
  })

  describe('smoothScroll', () => {
    let scrollTarget: ReturnType<typeof vi.fn>

    beforeEach(() => {
      scrollTarget = vi.fn()
      vi.stubGlobal('scrollTo', scrollTarget)
      vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query }))
    })

    test('scrolls the viewport to the section, without changing the address', () => {
      render(<SpyNav smoothScroll />)
      const notPrevented = fireEvent.click(link('Three'))
      expect(notPrevented).toBe(false)
      expect(scrollTarget).toHaveBeenCalledWith({ top: 1000, behavior: 'smooth' })
    })

    test("scrolls root to the section, less its scroll-margin-top and root's scroll-padding-top", () => {
      const root = React.createRef<HTMLDivElement>()
      const rootScrollTo = vi.fn()
      render(
        <>
          <Scrollspy root={root} smoothScroll>
            <Nav>
              <NavItem href="#two">Two</NavItem>
            </Nav>
          </Scrollspy>
          <div data-testid="root" ref={root} style={{ scrollPaddingTop: '20px' }}>
            <section id="two" aria-label="Two" style={{ scrollMarginTop: '16px' }} />
          </div>
        </>
      )
      Object.assign(screen.getByTestId('root'), { scrollTo: rootScrollTo, scrollTop: 100 })
      scrollPosition = 100
      fireEvent.click(link('Two'))
      // The section is 400 below the root's top, and the root is scrolled by 100.
      expect(rootScrollTo).toHaveBeenCalledWith({ top: 464, behavior: 'smooth' })
      expect(scrollTarget).not.toHaveBeenCalled()
    })

    test('jumps when the reader asks for reduced motion', () => {
      vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }))
      render(<SpyNav smoothScroll />)
      fireEvent.click(link('Two'))
      expect(scrollTarget).toHaveBeenCalledWith({ top: 500, behavior: 'auto' })
    })

    test('leaves the click alone without smoothScroll', () => {
      render(<SpyNav />)
      expect(fireEvent.click(link('Two'))).toBe(true)
      expect(scrollTarget).not.toHaveBeenCalled()
    })

    test("leaves the click alone when the link's own onClick prevented it", () => {
      render(
        <>
          <Scrollspy smoothScroll>
            <NavLink href="#two" onClick={(event) => event.preventDefault()}>
              Two
            </NavLink>
          </Scrollspy>
          <Sections />
        </>
      )
      fireEvent.click(link('Two'))
      expect(scrollTarget).not.toHaveBeenCalled()
    })

    test('calls the link’s own onClick first', () => {
      const onClick = vi.fn()
      render(
        <>
          <Scrollspy smoothScroll>
            <NavLink href="#two" onClick={onClick}>
              Two
            </NavLink>
          </Scrollspy>
          <Sections />
        </>
      )
      fireEvent.click(link('Two'))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(scrollTarget).toHaveBeenCalledTimes(1)
    })

    test('leaves a click with a modifier key to the browser', () => {
      render(<SpyNav smoothScroll />)
      expect(fireEvent.click(link('Two'), { metaKey: true })).toBe(true)
      expect(fireEvent.click(link('Two'), { button: 1 })).toBe(true)
      expect(scrollTarget).not.toHaveBeenCalled()
    })

    test('leaves a link to a missing section alone', () => {
      render(
        <Scrollspy smoothScroll>
          <NavLink href="#nowhere">Nowhere</NavLink>
        </Scrollspy>
      )
      expect(fireEvent.click(link('Nowhere'))).toBe(true)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with a section active', async () => {
      const { container } = render(<SpyNav />)
      scrollTo(600)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe('useScrollspy', () => {
  test('returns null until the first observation, then the active id', () => {
    render(<Sections />)
    const { result } = renderHook(() => useScrollspy(['one', 'two', 'three']))
    expect(result.current).toBeNull()
    scrollTo(600)
    expect(result.current).toBe('two')
  })

  test('takes a new array of the same ids without observing again', () => {
    render(<Sections />)
    const { rerender } = renderHook(({ ids }) => useScrollspy(ids), {
      initialProps: { ids: ['one', 'two'] }
    })
    rerender({ ids: ['one', 'two'] })
    expect(IntersectionObserverMock.instances).toHaveLength(1)
    rerender({ ids: ['two'] })
    expect(IntersectionObserverMock.instances).toHaveLength(2)
  })

  test('returns null for no ids', () => {
    const { result } = renderHook(() => useScrollspy([]))
    expect(result.current).toBeNull()
    expect(IntersectionObserverMock.instances).toHaveLength(0)
  })
})
