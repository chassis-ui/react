import React, {
  cloneElement,
  ComponentType,
  createContext,
  ReactElement,
  ReactNode,
  RefCallback,
  useCallback,
  useContext,
  useId,
  useMemo
} from 'react'

import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { devWarning } from './devWarning'
import { isSlot, useSlotElement } from './slot'

// How `NavOverflow` (`components/nav-overflow`) and the lists it collapses work together.
//
// chassis-css's plugin clones the links that don't fit into its menu. A clone has no React
// behind it: no `onClick`, no router link. Here nothing is cloned. Three parts take a role each:
//
// - The list (`Nav`, `NavbarNav`, `TabList`) renders `NavOverflowItems` around its items, which
//   adds the toggle item after them.
// - An item (`NavItem`, a tab) registers its `<li>`, which is what `NavOverflow` measures and
//   hides.
// - The item's link (`NavLink`) registers the props it was rendered with, and the menu renders a
//   `MenuItem` from them. An item with no link registered, such as one holding a dropdown, has
//   nothing to show in the menu, so it is never moved.
//
// An item is known by an id of its own rather than by its position among the list's children, so
// a component that renders several items, or a fragment of them, works like items written in
// place. `NavOverflow` takes their order from the document.
//
// These live here, not in `components/nav-overflow`, so that `Nav` and `Tabs` import a context and
// nothing else: the toggle and its `Menu` reach a list through the controller (`More`), and stay
// out of the bundle of a page that only renders a `Nav`.

/** The props a link hands to the `MenuItem` that stands in for it. */
export type NavOverflowLinkProps = Record<string, unknown>

export interface NavOverflowMoreProps {
  /**
   * The list is a `tablist`: the toggle is one of its tabs, and its menu is rendered outside it.
   */
  tabs?: boolean
}

export interface NavOverflowController {
  /**
   * The ids of the items that are in the menu, in document order.
   */
  hidden: readonly string[]
  /**
   * The toggle item and its menu, rendered by the list after its items.
   */
  More: ComponentType<NavOverflowMoreProps>
  registerItem: (id: string, element: HTMLElement | null) => void
  registerLink: (id: string, props: NavOverflowLinkProps | null) => void
  /**
   * Measures again. A list calls it after each of its commits.
   */
  update: () => void
}

/**
 * From `NavOverflow` to the list directly inside it.
 */
export const NavOverflowContext = createContext<NavOverflowController | null>(null)

// From the list to its items (`itemId` unset), and from an item to its link (`itemId` set). One
// context, so an item nested in another item finds `itemId` set and knows it isn't the list's own.
interface NavOverflowScope {
  controller: NavOverflowController
  itemId?: string
}

const NavOverflowScopeContext = createContext<NavOverflowScope | null>(null)

/**
 * Closes the scope for everything inside: a `Menu` in an item isn't that item's link, and neither
 * is anything in its list.
 */
export function NavOverflowBoundary({ children }: { children?: ReactNode }): ReactElement {
  return (
    <NavOverflowScopeContext.Provider value={null}>{children}</NavOverflowScopeContext.Provider>
  )
}

/**
 * A list's items. Inside a `NavOverflow` they are the items it collapses, followed by the toggle
 * item. Anywhere else they render as they are, and a list nested in a collapsing item takes no
 * part in it.
 */
export function NavOverflowItems({
  children,
  tabs,
  tag
}: NavOverflowMoreProps & {
  children?: ReactNode
  /**
   * The tag the list renders, when it is known. The toggle item is an `<li>`, so only a `<ul>`
   * or an `<ol>` takes part.
   */
  tag?: string
}): ReactElement {
  const collapses = tag === undefined || tag === 'ul' || tag === 'ol'
  const inherited = useContext(NavOverflowContext)
  devWarning(
    !!inherited && !collapses,
    `NavOverflow: collapses the \`NavItem\`s of a list, and a <${tag}> has none. Leave out ` +
      `\`component\` to render a <ul>.`
  )
  const controller = collapses ? inherited : null
  const scope = useMemo(() => (controller ? { controller } : null), [controller])
  const update = controller?.update

  // After every commit of the list: an item added, removed, renamed or made active changes what
  // fits, and none of those resizes the wrapper.
  useIsomorphicLayoutEffect(() => {
    update?.()
  })

  const More = controller?.More

  return (
    <>
      <NavOverflowContext.Provider value={null}>
        <NavOverflowScopeContext.Provider value={scope}>
          {children}
        </NavOverflowScopeContext.Provider>
      </NavOverflowContext.Provider>
      {More && <More tabs={tabs} />}
    </>
  )
}

export interface NavOverflowItem {
  /**
   * Whether the item is in the menu, and so hidden in the list.
   */
  hidden: boolean
  /**
   * For the item's `<li>`. `undefined` outside a collapsing list.
   */
  ref: RefCallback<HTMLElement> | undefined
  /**
   * For `NavOverflowItemScope`, around the item's children.
   */
  scope: NavOverflowScope | null
}

export const NavOverflowItemScope = NavOverflowScopeContext.Provider

/**
 * An item of a list. `link` is for an item that is its own link, as a tab is; an item that holds
 * a `NavLink` leaves it out, and the link registers itself.
 */
export function useNavOverflowItem(link?: NavOverflowLinkProps): NavOverflowItem {
  const inherited = useContext(NavOverflowScopeContext)
  const id = useId()
  // The list's own items only: inside another item, `itemId` is that item's.
  const controller = inherited && inherited.itemId === undefined ? inherited.controller : null
  const scope = useMemo(() => (controller ? { controller, itemId: id } : null), [controller, id])
  const registerItem = controller?.registerItem
  const ref = useCallback(
    (element: HTMLElement | null) => registerItem?.(id, element),
    [registerItem, id]
  )

  useRegisteredLink(link ? controller?.registerLink : undefined, id, link)

  return {
    hidden: !!controller && controller.hidden.includes(id),
    ref: controller ? ref : undefined,
    scope
  }
}

/**
 * Whether the caller is the link of an item that can move into the menu, and so should render a
 * `NavOverflowLink`.
 */
export const useIsNavOverflowLink = (): boolean =>
  useContext(NavOverflowScopeContext)?.itemId !== undefined

/**
 * Registers the props of an item's link, which the menu renders its `MenuItem` from. It renders
 * nothing. A component, not a hook, because a link rendered with `asChild` has to hand over the
 * element it was given, and only something rendered beside the `Slot` can read that.
 */
export function NavOverflowLink({ props }: { props: NavOverflowLinkProps }): null {
  const scope = useContext(NavOverflowScopeContext)
  const slotted = useSlotElement()
  const { component, ...link } = menuProps(props)
  useRegisteredLink(
    scope?.itemId === undefined ? undefined : scope.controller.registerLink,
    scope?.itemId,
    isSlot(component) && slotted
      ? // The caller's element, without what is its own in the list: its `ref` would be taken
        // over by the copy in the menu, and dropped when that copy went.
        { ...link, asChild: true, children: cloneElement(slotted, { id: undefined, ref: null }) }
      : { ...link, component }
  )
  return null
}

// What a link hands to its menu item. Not its `id`: the two are in the document together. And of
// its handlers, `onClick` only: the rest are for the link where it is, such as the hover and
// focus handlers a `Tooltip` around it adds, which would open a tooltip anchored to a hidden
// link. Its description goes with them.
function menuProps(props: NavOverflowLinkProps): NavOverflowLinkProps {
  return Object.fromEntries(
    Object.entries(props).filter(
      ([name]) =>
        name !== 'id' &&
        name !== 'aria-describedby' &&
        (name === 'onClick' || !/^on[A-Z]/.test(name))
    )
  )
}

function useRegisteredLink(
  register: NavOverflowController['registerLink'] | undefined,
  id: string | undefined,
  props: NavOverflowLinkProps | undefined
) {
  // On every commit: the props are new objects on each render, and the menu shows the latest.
  useIsomorphicLayoutEffect(() => {
    if (register && id !== undefined && props) register(id, props)
  })

  useIsomorphicLayoutEffect(() => {
    if (!register || id === undefined) return undefined
    return () => register(id, null)
  }, [register, id])
}
