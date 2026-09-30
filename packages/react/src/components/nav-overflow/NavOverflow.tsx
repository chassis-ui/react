import React, {
  CSSProperties,
  ElementType,
  ForwardRefRenderFunction,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { flushSync } from 'react-dom'
import classNames from 'classnames'

import { useForkedRef, useIsomorphicLayoutEffect } from '../../hooks'
import { Breakpoint } from '../../types'
import { devWarning } from '../../utils/devWarning'
import { IconValue } from '../../utils/iconConfig'
import {
  NavOverflowContext,
  NavOverflowController,
  NavOverflowLinkProps
} from '../../utils/navOverflow'
import { Placement } from '../../utils/overlayPlacement'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { useHydrated } from '../portal/Portal'
import { NavOverflowMore, NavOverflowMoreContext, NavOverflowMoreState } from './more'
import { MeasuredItem, overflowingIds } from './overflow'

export interface NavOverflowDetail {
  /**
   * How many items are in the menu.
   */
  overflowCount: number
  /**
   * How many items are left in the list.
   */
  visibleCount: number
}

type NavOverflowOwnProps<C extends ElementType> = {
  /**
   * The list to collapse: a `Nav`, a `NavbarNav` or a `TabList`.
   */
  children?: ReactNode
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Moves every item into the menu while the component is narrower than this: a width in pixels,
   * or the name of a breakpoint, read from `--cx-breakpoint-{name}`.
   */
  collapseBelow?: number | Breakpoint
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   *
   * @default 'div'
   */
  component?: C
  /**
   * Which side of the toggle's text its icon is on.
   *
   * @default 'start'
   */
  iconPlacement?: 'start' | 'end'
  /**
   * Renders the menu in a container element instead of inside the toggle's item, where an
   * ancestor with `overflow` set would clip it: an element, or `true` for `document.body`. The
   * menu of a `TabList` is always rendered outside it.
   */
  menuContainer?: boolean | Element
  /**
   * Where the menu opens, relative to the toggle. It flips to stay in view.
   *
   * @default 'bottom-end'
   * @type 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
   */
  menuPlacement?: Placement
  /**
   * The toggle's icon: an icon name, or an element of your own icon set. Defaults to
   * `IconProvider`'s `more` icon.
   */
  moreIcon?: IconValue
  /**
   * The accessible name of a toggle without text (`moreText={false}`).
   *
   * @default 'More'
   */
  moreLabel?: string
  /**
   * The toggle's text. `false` leaves the icon alone, named by `moreLabel`.
   *
   * @default 'More'
   */
  moreText?: ReactNode | false
  /**
   * Callback fired when items move into the menu or back out of it, with the number of items in
   * the menu and in the list.
   */
  onOverflow?: (detail: NavOverflowDetail) => void
  /**
   * The fewest items to leave in the list. They stay even when they don't fit.
   *
   * @default 0
   */
  threshold?: number
}

export type NavOverflowProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  NavOverflowOwnProps<C>
>

type NavOverflowComponent = (<C extends ElementType = 'div'>(
  props: NavOverflowProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

interface Entry {
  element: HTMLElement | null
  link: NavOverflowLinkProps | null
}

interface Observers {
  frame: number
  mutation: MutationObserver | null
  nav: Element | null
  observed: Set<Element>
  resize: ResizeObserver | null
  wrapper: HTMLElement
  wrapperFrame: number
}

// What the items and links registered, and the listeners of the menu that renders from it. Kept
// outside React state: a link registers new props on every one of its renders.
function createRegistry() {
  const entries = new Map<string, Entry>()
  const listeners = new Set<() => void>()
  let version = 0

  const entry = (id: string) => {
    let found = entries.get(id)
    if (!found) {
      found = { element: null, link: null }
      entries.set(id, found)
    }
    return found
  }

  return {
    entries,
    getVersion: () => version,
    notify: () => {
      version += 1
      listeners.forEach((listener) => listener())
    },
    set: (id: string, value: Partial<Entry>) => {
      const next = Object.assign(entry(id), value)
      if (!next.element && !next.link) entries.delete(id)
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }
  }
}

// chassis-css hides an item with this attribute (`_nav-overflow.scss`) and the toggle item with
// the display utility, as its plugin does.
const HIDDEN_ATTRIBUTE = 'data-cx-nav-overflow'
const HIDDEN_CLASS = 'd-none'

// What keeps an item in the list by being inside it: the current link, and the tab that is the
// list's Tab stop. react-aria gives that to the tab focused last, which needn't be the selected
// one: hidden, it would leave the keyboard no way into the list.
const KEPT_CONTENT =
  '.nav-link.active, .nav-link[aria-current]:not([aria-current="false"]), [role="tab"][tabindex="0"]'

const EMPTY: readonly string[] = []

const pixels = (value: string) => Number.parseFloat(value) || 0

// Not `instanceof HTMLElement`: a list rendered into another window has that window's classes.
const isHTMLElement = (element: Element): element is HTMLElement => 'offsetWidth' in element

const sameIds = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((id, index) => id === b[index])

// `collapseBelow` in pixels. A breakpoint is a custom property of chassis-css, in `rem`.
function resolveCollapseBelow(value: number | Breakpoint | undefined, wrapper: HTMLElement) {
  if (typeof value === 'number') return value
  if (!value) return 0
  const root = getComputedStyle(wrapper.ownerDocument.documentElement)
  const width = root.getPropertyValue(`--cx-breakpoint-${value}`).trim()
  return /r?em$/.test(width) ? pixels(width) * (pixels(root.fontSize) || 16) : pixels(width)
}

// Until the page has hydrated nothing has been measured, and the server's HTML holds every item
// on one line (`.nav-overflow > .nav` doesn't wrap). The items that don't fit are clipped at the
// wrapper's edge and can be scrolled to, instead of running over what is next to the list.
const UNMEASURED_STYLE: CSSProperties = { overflowX: 'auto', scrollbarWidth: 'none' }

function NavOverflowRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    collapseBelow,
    component,
    iconPlacement = 'start',
    menuContainer,
    menuPlacement = 'bottom-end',
    moreIcon,
    moreLabel = 'More',
    moreText = 'More',
    onOverflow,
    style,
    threshold = 0,
    ...rest
  }: NavOverflowProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  // The wrapper, kept while React re-attaches a ref: a caller's ref that is a new function on
  // each render makes it detach and attach this one too, and in between, where the list's
  // effects run, there would be nothing to measure.
  const wrapperRef = useRef<HTMLElement | null>(null)
  const setWrapper = useCallback((element: HTMLElement | null) => {
    if (element) wrapperRef.current = element
  }, [])
  const forkedRef = useForkedRef(ref, setWrapper)
  const hydrated = useHydrated()

  const [registry] = useState(createRegistry)
  const [hidden, setHidden] = useState(EMPTY)
  const hiddenRef = useRef(hidden)
  const itemCountRef = useRef(0)
  const optionsRef = useRef({ collapseBelow, threshold })
  optionsRef.current = { collapseBelow, threshold }

  const observersRef = useRef<Observers | null>(null)

  // Which items don't fit, or `null` when there is nothing to measure.
  //
  // Widths are read with every item and the toggle shown, so they never depend on what the last
  // pass hid. Showing and hiding again happens in one synchronous block, outside React: the browser
  // paints neither, and the elements are back as React rendered them before it looks again.
  const measure = useCallback((): string[] | null => {
    const wrapper = wrapperRef.current?.isConnected ? wrapperRef.current : null
    const nav = wrapper && Array.from(wrapper.children).find((child) => child.matches('.nav'))
    devWarning(
      !!wrapper && !nav,
      'NavOverflow: expects a `Nav`, a `NavbarNav` or a `TabList` as its child; found no `.nav` ' +
        'to collapse.'
    )
    if (!wrapper || !nav) return null

    // Every child of the list takes room in the row, a title or a divider too; only registered
    // items can leave it.
    const children = Array.from(nav.children).filter(isHTMLElement)
    const more = children.find((child) => child.classList.contains('nav-overflow-item'))
    const elements = children.filter((child) => child !== more)
    observe(wrapper, nav, children)
    itemCountRef.current = elements.length
    // No toggle: the list is not one that takes part, so nothing can move.
    if (!more) return []

    const ids = new Map<Element, string>()
    registry.entries.forEach((entry, id) => {
      if (entry.element) ids.set(entry.element, id)
    })

    const wereHidden = elements.filter((element) => element.hasAttribute(HIDDEN_ATTRIBUTE))
    const moreWasHidden = more.classList.contains(HIDDEN_CLASS)
    wereHidden.forEach((element) => element.removeAttribute(HIDDEN_ATTRIBUTE))
    more.classList.remove(HIDDEN_CLASS)

    try {
      const wrapperStyle = getComputedStyle(wrapper)
      const navStyle = getComputedStyle(nav)
      // The wrapper's content box, as chassis-css's plugin takes it.
      const width =
        wrapper.clientWidth -
        pixels(wrapperStyle.paddingInlineStart) -
        pixels(wrapperStyle.paddingInlineEnd)
      const focused = wrapper.ownerDocument.activeElement

      const items = elements.map((element): MeasuredItem => {
        const id = ids.get(element)
        return {
          id,
          // An item stays in the list when the menu has nothing to show for it, when it is
          // marked to stay, when it is the current one or the list's Tab stop, and while it has
          // focus, which hiding it would drop.
          keep:
            !id ||
            !registry.entries.get(id)?.link ||
            element.classList.contains('nav-overflow-keep') ||
            element.querySelector(KEPT_CONTENT) !== null ||
            element.contains(focused),
          width: element.offsetWidth
        }
      })

      const { collapseBelow, threshold } = optionsRef.current
      return overflowingIds({
        available:
          width -
          pixels(navStyle.paddingInlineStart) -
          pixels(navStyle.paddingInlineEnd) -
          pixels(navStyle.borderInlineStartWidth) -
          pixels(navStyle.borderInlineEndWidth),
        collapseAll: width < resolveCollapseBelow(collapseBelow, wrapper),
        gap: pixels(navStyle.columnGap),
        items,
        more: more.offsetWidth,
        threshold
      })
    } finally {
      wereHidden.forEach((element) => element.setAttribute(HIDDEN_ATTRIBUTE, 'true'))
      if (moreWasHidden) more.classList.add(HIDDEN_CLASS)
      // Lay the list out as it was. Without this the layout stays as measured, with everything
      // shown, until the browser next needs it, and a ResizeObserver delivering in the meantime
      // (react-aria's, on the toggle) is told of sizes that were never painted.
      void wrapper.offsetWidth
      // The mutations above are this function's own.
      observersRef.current?.mutation?.takeRecords()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registry])

  const update = useCallback(() => {
    const next = measure()
    if (!next || sameIds(next, hiddenRef.current)) return
    hiddenRef.current = next
    setHidden(next)
  }, [measure])

  // What changes the result without a render of the list:
  //
  // - The wrapper's width. The wrapper and not the list, whose width the result itself changes.
  // - An item's width: a font that loads, a label that changes.
  // - A link that becomes the current one by itself, as a router's link does on navigation.
  //
  // An observer's callback runs before the browser paints, and `flushSync` commits the result
  // there, so no frame shows the items of the old width.
  //
  // A ResizeObserver delivers sizes top down, and reports a loop error when a callback changes
  // a size it has already passed. Two things here would: hiding an item's siblings from the
  // callback for that item, so an item's own resize waits a frame; and a toggle taller than the
  // links, which changes the wrapper's height from the wrapper's own callback, so the wrapper is
  // observed again from the next frame once a pass has moved anything.
  function observe(wrapper: HTMLElement, nav: Element, children: HTMLElement[]) {
    let observers = observersRef.current
    if (observers && observers.wrapper !== wrapper) {
      disconnect()
      observers = null
    }
    if (!observers) {
      const flush = () => flushSync(update)
      const created: Observers = {
        frame: 0,
        mutation: typeof MutationObserver === 'undefined' ? null : new MutationObserver(flush),
        nav: null,
        observed: new Set(),
        resize:
          typeof ResizeObserver === 'undefined'
            ? null
            : new ResizeObserver((entries) => {
                if (!entries.some((entry) => entry.target === wrapper)) {
                  cancelAnimationFrame(created.frame)
                  created.frame = requestAnimationFrame(flush)
                  return
                }
                const before = hiddenRef.current
                flush()
                // The pass can have replaced these observers, for a wrapper that is a new element.
                if (hiddenRef.current === before || observersRef.current !== created) return
                created.resize?.unobserve(wrapper)
                cancelAnimationFrame(created.wrapperFrame)
                created.wrapperFrame = requestAnimationFrame(() => created.resize?.observe(wrapper))
              }),
        wrapperFrame: 0,
        wrapper
      }
      observers = observersRef.current = created
      observers.resize?.observe(wrapper)
    }
    const { mutation, observed, resize } = observers

    if (observers.nav !== nav) {
      observers.nav = nav
      mutation?.disconnect()
      mutation?.observe(nav, {
        attributeFilter: ['class', 'aria-current'],
        attributes: true,
        childList: true,
        subtree: true
      })
    }

    const current = new Set<Element>(children)
    observed.forEach((element) => {
      if (current.has(element)) return
      resize?.unobserve(element)
      observed.delete(element)
    })
    current.forEach((element) => {
      if (observed.has(element)) return
      resize?.observe(element)
      observed.add(element)
    })
  }

  function disconnect() {
    const observers = observersRef.current
    if (!observers) return
    cancelAnimationFrame(observers.frame)
    cancelAnimationFrame(observers.wrapperFrame)
    observers.mutation?.disconnect()
    observers.resize?.disconnect()
    observersRef.current = null
  }

  useEffect(() => disconnect, [])

  // The list measures after each of its commits (`NavOverflowItems`). This covers what it can't:
  // the first commit and a wrapper that becomes another element, where React attaches the
  // wrapper's ref after the list's effects have run, and the options, which can change without
  // the list rendering.
  useIsomorphicLayoutEffect(update, [update, Component, collapseBelow, threshold])

  const reportedRef = useRef(hidden)
  useEffect(() => {
    if (reportedRef.current === hidden) return
    reportedRef.current = hidden
    onOverflow?.({
      overflowCount: hidden.length,
      visibleCount: itemCountRef.current - hidden.length
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden])

  const registerItem = useCallback(
    (id: string, element: HTMLElement | null) => registry.set(id, { element }),
    [registry]
  )
  const registerLink = useCallback(
    (id: string, link: NavOverflowLinkProps | null) => {
      registry.set(id, { link })
      // The menu renders from these props, and only it needs to hear of new ones.
      if (hiddenRef.current.includes(id)) registry.notify()
    },
    [registry]
  )

  const controller: NavOverflowController = useMemo(
    () => ({ hidden, More: NavOverflowMore, registerItem, registerLink, update }),
    [hidden, registerItem, registerLink, update]
  )

  const more: NavOverflowMoreState = useMemo(
    () => ({
      getLink: (id) => registry.entries.get(id)?.link ?? null,
      getVersion: registry.getVersion,
      hidden,
      iconPlacement,
      menuContainer,
      menuPlacement,
      moreIcon,
      moreLabel,
      moreText,
      subscribe: registry.subscribe
    }),
    [hidden, iconPlacement, menuContainer, menuPlacement, moreIcon, moreLabel, moreText, registry]
  )

  return (
    <NavOverflowContext.Provider value={controller}>
      <NavOverflowMoreContext.Provider value={more}>
        <Component
          className={classNames('nav-overflow', className)}
          style={hydrated ? style : { ...UNMEASURED_STYLE, ...style }}
          {...rest}
          ref={forkedRef}
        >
          {children}
        </Component>
      </NavOverflowMoreContext.Provider>
    </NavOverflowContext.Provider>
  )
}

export const NavOverflow = createPolymorphicComponent<NavOverflowComponent>(
  NavOverflowRender as ForwardRefRenderFunction<Element, NavOverflowProps<ElementType>>,
  'NavOverflow'
)
