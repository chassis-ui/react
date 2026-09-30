import { RefObject, useEffect, useState } from 'react'

export interface UseScrollspyOptions {
  /**
   * The element that scrolls, or a ref to it. The viewport when unset.
   */
  root?: Element | RefObject<Element | null> | null
  /**
   * The margin around `root`, as `IntersectionObserver` takes it: one to four lengths in `px` or
   * `%`. Its bottom edge is the line a section's top has to pass to become the active one;
   * `-25%` puts it a quarter of the root's height above the root's bottom.
   *
   * @default '0px 0px -25%'
   */
  rootMargin?: string
}

export const DEFAULT_ROOT_MARGIN = '0px 0px -25%'

/**
 * The element `root` names: the element itself, or what a ref holds. `null` for the viewport.
 */
export function resolveRoot(root: UseScrollspyOptions['root']): Element | null {
  if (!root) return null
  return 'current' in root ? root.current : root
}

/**
 * The section with this `id`, when it is inside `root` (anywhere in the document for the
 * viewport).
 */
export function findSection(id: string, root: Element | null): HTMLElement | null {
  const section = document.getElementById(id)
  if (!section || (root && !root.contains(section))) return null
  return section
}

interface Zone {
  top: number
  bottom: number
}

// A length of `rootMargin`: `px`, or `%` of the root's height.
function marginLength(value: string | undefined, height: number): number {
  if (!value) return 0
  if (value.endsWith('%')) return (Number.parseFloat(value) / 100) * height
  return Number.parseFloat(value) || 0
}

// The root's box grown by `rootMargin` (shrunk, for negative lengths), in viewport coordinates:
// the box an `IntersectionObserver` with the same options observes. A section's top crosses its
// bottom edge, the activation line, exactly when the section starts or stops intersecting from
// below, so the observer reports it.
function activationZone(root: Element | null, rootMargin: string): Zone {
  let top: number
  let height: number
  if (root) {
    // The root's padding box: what an observer with an element root clips to.
    top = root.getBoundingClientRect().top + root.clientTop
    height = root.clientHeight
  } else {
    top = 0
    height = document.documentElement.clientHeight
  }
  const values = rootMargin.trim().split(/\s+/)
  const marginTop = values[0]
  const marginBottom = values.length >= 3 ? values[2] : values[0]
  return {
    top: top - marginLength(marginTop, height),
    bottom: top + height + marginLength(marginBottom, height)
  }
}

interface Pick {
  id: string | null
  /**
   * The first section is active because its top is still in the zone. Leaving that state is a
   * scroll the observer doesn't always report (see `useScrollspy`).
   */
  atStart: boolean
}

/**
 * The id of the last section, in document order, whose top has passed the activation line, or
 * `null` when none has. While the first of those hasn't scrolled past the top of the zone, the
 * reader is at its start, and it is the active one: at the top of a page of short sections,
 * several have passed the line before anything scrolled. A section that isn't rendered
 * (`display: none`) takes no part.
 */
function pickActive(sections: readonly HTMLElement[], zone: Zone): Pick {
  let first: string | null = null
  let last: string | null = null
  let atStart = false
  for (const section of sections) {
    const rect = section.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) continue
    if (rect.top >= zone.bottom) continue
    if (first === null) {
      first = section.id
      atStart = rect.top >= zone.top
    }
    last = section.id
  }
  return atStart ? { id: first, atStart } : { id: last, atStart }
}

function inDocumentOrder(a: Node, b: Node): number {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

// A separator no id contains, to depend on the ids' values rather than the array's identity.
const SEPARATOR = '\u0000'

/**
 * Tracks which of the sections named by `ids` the reader is in, as a scrollspy does: the last
 * section, in document order, whose top has scrolled past a line near the bottom of `root` (set
 * by `rootMargin`), or the first one while its top is still in view at the top of `root`. Returns
 * its id, or `null` when no section has reached the line yet.
 *
 * It returns `null` on the server and on the first render in the browser, so hydration matches,
 * and the active id from the first observation after that. Sections added, removed or renamed
 * later are picked up; an id with no element in `root` is ignored.
 */
export function useScrollspy(
  ids: readonly string[],
  options: UseScrollspyOptions = {}
): string | null {
  const { root, rootMargin = DEFAULT_ROOT_MARGIN } = options
  const [activeId, setActiveId] = useState<string | null>(null)
  const key = ids.join(SEPARATOR)
  // Bumped when `root` names another element than the one observed: a ref's element can mount
  // after the hook's effect ran, or be replaced, without anything rendering the hook again.
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    const idList = key ? key.split(SEPARATOR) : []
    if (!idList.length || typeof IntersectionObserver === 'undefined') {
      setActiveId(null)
      return
    }
    const rootElement = resolveRoot(root)
    const scroller: EventTarget = rootElement ?? window
    let sections: HTMLElement[] = []
    let followingScroll = false

    const update = () => {
      const { id, atStart } = pickActive(sections, activationZone(rootElement, rootMargin))
      setActiveId(id)
      // The first section stops being active when its top leaves the top of the zone. The
      // observer reports that only for a section that was wholly inside the zone (its threshold
      // of 1), which a section holding the others, or wider than the root, never is. So while
      // it is active for that reason, every scroll measures again.
      if (atStart !== followingScroll) {
        followingScroll = atStart
        if (atStart) scroller.addEventListener('scroll', onScroll, { passive: true })
        else scroller.removeEventListener('scroll', onScroll)
      }
    }

    let scrollFrame = 0
    const onScroll = () => {
      if (scrollFrame) return
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0
        update()
      })
    }

    // Called for every change of an intersection. The entries alone aren't enough: a section
    // that a jump scrolls from below the root to above it never intersects, and isn't reported.
    // So every section is measured again. A threshold of 1 also reports a section that starts
    // leaving the top of the zone, which ends the start of the first one (see `pickActive`).
    const observer = new IntersectionObserver(update, {
      root: rootElement,
      rootMargin,
      threshold: [0, 1]
    })

    // Returns whether the sections changed.
    const resolve = () => {
      const next = idList
        .map((id) => findSection(id, rootElement))
        .filter((section): section is HTMLElement => section !== null)
        .sort(inDocumentOrder)
      if (next.length === sections.length && next.every((section, i) => section === sections[i])) {
        return false
      }
      for (const section of sections) if (!next.includes(section)) observer.unobserve(section)
      for (const section of next) if (!sections.includes(section)) observer.observe(section)
      sections = next
      return true
    }

    // The observer reports each section once when it starts observing it, which sets the first
    // active id. With no section found, nothing would report, so that case updates here.
    if (!resolve()) update()

    // Sections rendered, removed or renamed later, such as content loaded after the links, and
    // a `root` ref whose element mounts later or is replaced. The whole document is watched, since
    // a replaced root is no longer in the one observed.
    let mutationFrame = 0
    const mutations = new MutationObserver(() => {
      if (mutationFrame) return
      mutationFrame = requestAnimationFrame(() => {
        mutationFrame = 0
        if (resolveRoot(root) !== rootElement) {
          setGeneration((value) => value + 1)
          return
        }
        if (resolve()) update()
      })
    })
    mutations.observe(document.body, {
      attributeFilter: ['id'],
      childList: true,
      subtree: true
    })

    // What a jump between two places with no section in view leaves out: nothing intersects
    // before or after it, so the observer has nothing to report. Where `scrollend` exists, the
    // end of every scroll measures again.
    scroller.addEventListener('scrollend', update)

    return () => {
      observer.disconnect()
      mutations.disconnect()
      cancelAnimationFrame(mutationFrame)
      cancelAnimationFrame(scrollFrame)
      scroller.removeEventListener('scrollend', update)
      scroller.removeEventListener('scroll', onScroll)
    }
  }, [key, root, rootMargin, generation])

  return activeId
}
