import { createContext, MouseEvent, RefCallback, useContext, useEffect, useState } from 'react'

// How `Scrollspy` (`components/scrollspy`) and the links inside it work together.
//
// chassis-css's plugin finds the links in its target with a selector and toggles their `.active`
// class. Here a link's markup belongs to React, so each `Link` inside a `Scrollspy` registers its
// element and a setter instead, and renders the mark it is given. `NavLink`, `ListItem` and
// `MenuItem` render through `Link`, so they take part without code of their own; so does a
// `MenuToggle` rendered as a `NavLink`, which is marked as the parent of its menu's items.
//
// This lives here, not in `components/scrollspy`, so that `Link` imports a context and a hook and
// nothing else: the observer and the rest stay out of the bundle of a page with no `Scrollspy`.

/**
 * What a link shows: `'current'` for a link to the active section, `'parent'` for the link its
 * nested list or menu belongs to, `false` for any other.
 */
export type ScrollspyMark = 'current' | 'parent' | false

export interface ScrollspyController {
  /**
   * Adds a link's element. Returns the function that removes it.
   */
  register: (element: Element, setMark: (mark: ScrollspyMark) => void) => () => void
  /**
   * A link's click, after its own `onClick`: scrolls to the section smoothly, when the
   * `Scrollspy` is set to.
   */
  onLinkClick: (event: MouseEvent<Element>) => void
}

export const ScrollspyContext = createContext<ScrollspyController | null>(null)

export interface ScrollspyLink {
  mark: ScrollspyMark
  /**
   * For the link's element, inside a `Scrollspy`.
   */
  ref?: RefCallback<Element>
  onClick?: (event: MouseEvent<Element>) => void
}

/**
 * A link's part in the nearest `Scrollspy`. Outside one, it returns no mark, no ref and no handler.
 * A disabled link takes no part, as under chassis-css's plugin. The `Scrollspy` reads the target
 * from the element, where a link given with `asChild` has it too, and follows it when it changes.
 */
export function useScrollspyLink(disabled: boolean | undefined): ScrollspyLink {
  const spy = useContext(ScrollspyContext)
  const [mark, setMark] = useState<ScrollspyMark>(false)
  const [element, setElement] = useState<Element | null>(null)

  useEffect(() => {
    if (!spy || !element || disabled) return
    return spy.register(element, setMark)
  }, [spy, element, disabled])

  if (!spy) return { mark: false }
  return { mark: disabled ? false : mark, ref: setElement, onClick: spy.onLinkClick }
}
