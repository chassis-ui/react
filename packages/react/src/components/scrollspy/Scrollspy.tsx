import React, {
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { ScrollspyContext, ScrollspyController, ScrollspyMark } from '../../utils/scrollspy'
import { findSection, resolveRoot, useScrollspy, UseScrollspyOptions } from './useScrollspy'

export interface ScrollspyProps extends UseScrollspyOptions {
  /**
   * The navigation whose links are marked: a `Nav`, a `List`, `Link`s, or anything holding them.
   */
  children?: ReactNode
  /**
   * Fires when the active section changes, with its id, or `null` when no section is active.
   */
  onActiveChange?: (id: string | null) => void
  /**
   * Scrolls smoothly to a section when one of the links is clicked, instead of jumping to it. The
   * page's address doesn't change. When the reader asks for reduced motion, it jumps.
   *
   * @default false
   */
  smoothScroll?: boolean
}

// The section a link points to: its fragment, when it points into the current page.
function linkTarget(element: Element): string | null {
  const href = element.getAttribute('href')
  if (!href || !href.includes('#')) return null
  let url: URL
  try {
    url = new URL(href, document.baseURI)
  } catch {
    // Not a URL a browser could follow either, such as `http://#top`.
    return null
  }
  const page = new URL(window.location.href)
  if (url.origin !== page.origin || url.pathname !== page.pathname || url.search !== page.search) {
    return null
  }
  if (url.hash.length < 2) return null
  try {
    return decodeURIComponent(url.hash.slice(1))
  } catch {
    return url.hash.slice(1)
  }
}

const LIST = '.nav, .list'
const LIST_LINK = '.nav-link, .list-item'

// The links a marked link belongs under, as chassis-css's plugin finds them: the toggle of the
// menu a menu item is in, and the link just before a nested `.nav` or `.list`. Each of those is
// followed up in turn, so every level of a nested navigation is marked.
function parentsOf(element: Element): Element[] {
  const parents: Element[] = []
  const seen = new Set<Element>([element])
  const queue = [element]
  while (queue.length) {
    const current = queue.shift() as Element
    let parent: Element | null
    const menu = current.classList.contains('menu-item') ? current.closest('.menu') : null
    if (menu) {
      // A `Menu`'s list is labelled by its toggle, wherever the list is rendered.
      const labelledBy = menu.getAttribute('aria-labelledby')
      parent =
        (labelledBy && document.getElementById(labelledBy)) || menu.previousElementSibling || null
    } else {
      const list = current.parentElement?.closest(LIST)
      let sibling = list?.previousElementSibling ?? null
      while (sibling && !sibling.matches(LIST_LINK)) sibling = sibling.previousElementSibling
      parent = sibling
    }
    if (parent && !seen.has(parent)) {
      seen.add(parent)
      parents.push(parent)
      queue.push(parent)
    }
  }
  return parents
}

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Where a section lands, as a jump to it would put it: below the scroll container's
// `scroll-padding-top` (a sticky header's usual fix) and the section's own `scroll-margin-top`.
function scrollToSection(section: HTMLElement, root: Element | null) {
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
  const margin = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0
  const padding =
    Number.parseFloat(getComputedStyle(root ?? document.documentElement).scrollPaddingTop) || 0
  const offset = section.getBoundingClientRect().top - margin - padding
  if (root) {
    const top = offset - root.getBoundingClientRect().top - root.clientTop + root.scrollTop
    root.scrollTo({ top, behavior })
  } else {
    window.scrollTo({ top: offset + window.scrollY, behavior })
  }
}

/**
 * Marks the link to the section being read as active, in the navigation it wraps. The links are
 * `Link`s and the components built on it (`NavLink`, `ListItem`, `MenuItem`) whose `href` points
 * to an element's `id` on the page. It renders no element of its own.
 */
export function Scrollspy({
  children,
  onActiveChange,
  root,
  rootMargin,
  smoothScroll = false
}: ScrollspyProps): ReactElement {
  const links = useRef(new Map<Element, (mark: ScrollspyMark) => void>())
  // Bumped when a link comes or goes, which changes the sections to observe and the marks.
  const [version, setVersion] = useState(0)
  const [ids, setIds] = useState<string[]>([])

  const register = useCallback<ScrollspyController['register']>((element, setMark) => {
    links.current.set(element, setMark)
    setVersion((value) => value + 1)
    // A link's target can change without its component rendering with another `href`: the
    // element given with `asChild` has it, and a router link renders it from `to`.
    const targetChanges = new MutationObserver(() => setVersion((value) => value + 1))
    targetChanges.observe(element, { attributeFilter: ['href'] })
    return () => {
      targetChanges.disconnect()
      links.current.delete(element)
      setMark(false)
      setVersion((value) => value + 1)
    }
  }, [])

  // The targets are read from the elements, which is where a link given with `asChild` or a
  // router link has its `href`.
  useEffect(() => {
    const next: string[] = []
    for (const element of links.current.keys()) {
      const id = linkTarget(element)
      if (id !== null && !next.includes(id)) next.push(id)
    }
    setIds((previous) =>
      previous.length === next.length && previous.every((id, i) => id === next[i]) ? previous : next
    )
  }, [version])

  const activeId = useScrollspy(ids, { root, rootMargin })

  useEffect(() => {
    const marks = new Map<Element, ScrollspyMark>()
    if (activeId !== null) {
      for (const element of links.current.keys()) {
        if (linkTarget(element) === activeId) marks.set(element, 'current')
      }
      for (const element of [...marks.keys()]) {
        for (const parent of parentsOf(element)) {
          if (links.current.has(parent) && !marks.has(parent)) marks.set(parent, 'parent')
        }
      }
    }
    for (const [element, setMark] of links.current) setMark(marks.get(element) ?? false)
  }, [activeId, version])

  const onActiveChangeRef = useRef(onActiveChange)
  const reportedRef = useRef<string | null>(null)
  useEffect(() => {
    onActiveChangeRef.current = onActiveChange
  })
  useEffect(() => {
    if (reportedRef.current === activeId) return
    reportedRef.current = activeId
    onActiveChangeRef.current?.(activeId)
  }, [activeId])

  const optionsRef = useRef({ root, smoothScroll })
  useEffect(() => {
    optionsRef.current = { root, smoothScroll }
  })

  const onLinkClick = useCallback((event: MouseEvent<Element>) => {
    const { root, smoothScroll } = optionsRef.current
    if (
      !smoothScroll ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    const id = linkTarget(event.currentTarget)
    const rootElement = resolveRoot(root)
    const section = id === null ? null : findSection(id, rootElement)
    if (!section) return
    event.preventDefault()
    scrollToSection(section, rootElement)
  }, [])

  const controller = useMemo<ScrollspyController>(
    () => ({ register, onLinkClick }),
    [register, onLinkClick]
  )

  return <ScrollspyContext.Provider value={controller}>{children}</ScrollspyContext.Provider>
}

Scrollspy.displayName = 'Scrollspy'
