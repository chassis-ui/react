import React, {
  createContext,
  ElementType,
  ForwardRefRenderFunction,
  Fragment,
  ReactElement,
  useEffect,
  useMemo,
  useRef
} from 'react'
import classNames from 'classnames'
import { AriaButtonProps, useMenuTrigger, useOverlayPosition } from 'react-aria'
import { useMenuTriggerState } from 'react-stately'

import {
  useFloatingOverlay,
  useForkedRef,
  useIsomorphicLayoutEffect,
  useOpenStateProps,
  useOverlayMaxHeight
} from '../../hooks'
import { executeAfterTransition } from '../../utils/dialogTransition'
import { isEventInside } from '../../utils/insideEvents'
import {
  Placement,
  resolveMenuOverlayPositioning,
  toAriaPlacement
} from '../../utils/overlayPlacement'
import { NavOverflowBoundary } from '../../utils/navOverflow'
import { pushOverlay } from '../../utils/overlayStack'
import { listenOnWindow } from '../../utils/windowEvents'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

export type { Placement }
export type MenuFocusStrategy = 'first' | 'last'

export type MenuAutoClose = boolean | 'inside' | 'outside'

type MenuOwnProps<C extends ElementType> = {
  /**
   * Controls which clicks close the menu. `true` closes on any click inside or outside.
   * `false` leaves closing to the toggle, the Escape key and `visible`. `'inside'` closes only
   * on click inside the menu. `'outside'` closes only on click outside the menu.
   */
  autoClose?: MenuAutoClose
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `Fragment` — `MenuToggle`/`MenuList` render with no wrapping element, so
   * they land as direct children of whatever contains the `Menu`. This matters inside
   * `ButtonGroup`/`InputGroup`, whose CSS expects the toggle button and menu panel as direct
   * children rather than nested inside an intermediate node.
   *
   * Pass an actual element (e.g. `"div"`, or `"li"` for a navbar item) to opt back into a
   * wrapper — needed if you want to apply `className`/`style`/other rest props to a container
   * around the whole menu, for semantic wrapping like a nav `<li>`, or for `reference="parent"`,
   * which positions off this wrapper and has nothing to measure against without one.
   */
  component?: C
  /**
   * Teleports the menu panel to a container element on open. Accepts an element reference, or
   * `true` to append to `document.body`, or to the open dialog the menu is in, so the panel
   * stays in that dialog's top layer.
   */
  container?: boolean | Element
  /**
   * Whether the menu is open when it first renders. Use it instead of `visible` when nothing
   * outside needs to control the menu.
   */
  defaultVisible?: boolean
  /**
   * Distance between the menu and its reference element, as `[skidding, distance]` in pixels.
   */
  offset?: [number, number]
  /**
   * Callback fired when the menu starts to hide.
   */
  onHide?: () => void
  /**
   * Callback fired after the menu finishes hiding.
   */
  onHidden?: () => void
  /**
   * Callback fired when the menu starts to show.
   */
  onShow?: () => void
  /**
   * Callback fired after the menu finishes showing.
   */
  onShown?: () => void
  /**
   * Callback fired when the menu asks to show or hide: the toggle, a click that `autoClose`
   * counts, or the Escape or Tab key. Receives the state it asks for. With `visible` set, the
   * menu changes only when `visible` does.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * Initial placement. Chassis will flip it to keep the menu in view.
   *
   * @type 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
   */
  placement?: Placement
  /**
   * Reference element used for positioning. `'toggle'` uses the trigger. `'parent'` uses this
   * component's own rendered element, useful for split buttons and button groups.
   */
  reference?: 'toggle' | 'parent'
  /**
   * Whether the menu is open. Setting it makes the menu controlled: it opens and closes only
   * when this changes, so pair it with `onVisibleChange`. Leave it unset, or use
   * `defaultVisible`, for a menu that opens and closes itself.
   */
  visible?: boolean
}

export type MenuProps<C extends ElementType = typeof Fragment> = PolymorphicComponentProps<
  C,
  MenuOwnProps<C>
>

type MenuComponent = (<C extends ElementType = typeof Fragment>(
  props: MenuProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

export interface MenuContextProps {
  autoClose: MenuAutoClose
  close: () => void
  container?: boolean | Element
  focusStrategy: MenuFocusStrategy | null
  hide: () => void
  menuId: string
  menuStyle: React.CSSProperties
  menuTriggerProps: AriaButtonProps
  overlayRef: React.MutableRefObject<HTMLElement | null>
  placementAttr: string
  /**
   * The open dialog the menu is in, or `document.body`; `null` until the menu first opens. A
   * `MenuSubmenu` portals its panel there, so inside a modal dialog it is in the top layer with
   * the menu rather than under it, where the page is inert.
   */
  portalContainer?: Element | null
  reference: 'toggle' | 'parent'
  /**
   * Registers (or, passing `null`, unregisters) a nested `MenuSubmenu`'s own portaled panel
   * element, so this `Menu`'s outside/inside click-dismiss logic recognizes clicks landing in it
   * as "inside" the menu — see `MenuSubmenu`'s own use for why this is necessary: its panel
   * portals straight to `document.body`, structurally detached from this menu's own DOM subtree.
   */
  registerOverlay: (id: string, node: HTMLElement | null) => void
  show: (focusStrategy?: MenuFocusStrategy | null) => void
  targetRef: React.MutableRefObject<HTMLElement | null>
  toggle: (focusStrategy?: MenuFocusStrategy | null) => void
  toggleNodeRef: React.MutableRefObject<HTMLElement | null>
  triggerId: string
  visible: boolean
}

// A fully-shaped no-op default so a `MenuToggle`/`MenuList`/`MenuSubmenu` rendered without a
// `Menu` ancestor (or in an environment where context can't cross a component boundary, e.g.
// some static-site prerenderers) degrades to an inert, always-closed menu instead of throwing.
const noop = () => undefined

const defaultMenuContext: MenuContextProps = {
  autoClose: true,
  close: noop,
  focusStrategy: null,
  hide: noop,
  menuId: '',
  menuStyle: {},
  menuTriggerProps: {},
  overlayRef: { current: null },
  placementAttr: 'bottom-start',
  reference: 'toggle',
  registerOverlay: noop,
  show: noop,
  targetRef: { current: null },
  toggle: noop,
  toggleNodeRef: { current: null },
  triggerId: '',
  visible: false
}

export const MenuContext = createContext(defaultMenuContext)

// The clicks on a `MenuToggle` or a `MenuSubmenu` trigger. One in a menu's list opens a menu of
// its own: it is no click on an item of that list.
export const menuToggleClicks = new WeakSet<Event>()

// The outside-click handlers of the open menus. react-aria's press handling stops the click on a
// `MenuToggle` before it reaches `window`, where those handlers listen, so another menu stayed open
// beside the one the click opened: the toggle hands its click to each of them itself.
export const openMenuDismissals = new Set<(event: Event) => void>()

// Whether a click uses a form control in a menu's list in place, which keeps the menu open: one on
// the control, on a `<label>` (whose click the browser passes on to its control), or anywhere in
// a form the list holds. Only what is inside `lists` counts: a menu inside a page's form still
// closes on an item.
export const isFormControlClick = (
  target: EventTarget | null,
  lists: Array<Element | null | undefined>
): boolean => {
  if (!(target instanceof Element)) return false
  const control = target.closest(
    'input, select, option, textarea, label, form, [contenteditable]:not([contenteditable="false"])'
  )
  return !!control && lists.some((list) => !!list?.contains(control))
}

function MenuRender<C extends ElementType = typeof Fragment>(
  {
    children,
    autoClose = true,
    className,
    component,
    container,
    defaultVisible,
    offset: offsetProp = [0, 2],
    onHide,
    onHidden,
    onShow,
    onShown,
    onVisibleChange,
    placement = 'bottom-start',
    reference = 'toggle',
    visible,
    ...rest
  }: MenuProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? (Fragment as ElementType)
  const wrapperRef = useRef<HTMLElement>(null)
  const forkedRef = useForkedRef(ref, wrapperRef)
  const toggleNodeRef = useRef<HTMLElement | null>(null)
  const targetRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLElement | null>(null)
  // Portaled `MenuSubmenu` panels register themselves here (see `registerOverlay` below and
  // `MenuSubmenu`'s own ref callback) so `handleDismiss` can recognize clicks inside them as
  // "inside" this menu despite living outside `overlayRef.current`'s own DOM subtree.
  const submenuOverlaysRef = useRef<Map<string, HTMLElement>>(new Map())
  const registerOverlay = (id: string, node: HTMLElement | null) => {
    if (node) submenuOverlaysRef.current.set(id, node)
    else submenuOverlaysRef.current.delete(id)
  }

  // Controlled by `visible` when it is set: `show`/`hide`/`toggle` (from `MenuToggle`, autoClose
  // dismissal, an item) then only report to `onVisibleChange`.
  const state = useMenuTriggerState(
    useOpenStateProps({ defaultVisible, onVisibleChange, visible }, 'Menu')
  )
  const { menuTriggerProps, menuProps } = useMenuTrigger<unknown>({}, state, toggleNodeRef)

  useIsomorphicLayoutEffect(() => {
    if (reference === 'parent') {
      targetRef.current = wrapperRef.current
    }
  }, [reference])

  // `onShown`/`onHidden` wait for chassis-css's own opacity/transform transition on `.menu`
  // (see `_menu.scss`) to actually finish, matching `Modal`'s identically-worded "requests to
  // be shown" vs "finishes showing" contract (`Modal.tsx`'s own `executeAfterTransition` use).
  // `overlayRef.current` is `MenuList`'s root element — already in the DOM and already
  // reflecting the new `.show` class by the time this effect runs, since React commits the
  // render before passive effects execute. Falls back to firing synchronously when no
  // `MenuList` is mounted to measure (nothing to transition, so nothing to wait for).
  //
  // All four report *transitions*, so none fires for the initial commit — mounting closed is not
  // a hide. Without this guard, mounting fired `onHide` (and scheduled `onHidden`) for every menu
  // on the page before `onShow` had ever fired once, which `Menu.spec.tsx` used to have to
  // `mockClear()` past.
  const mountedRef = useRef(false)

  useEffect(() => {
    const overlay = overlayRef.current
    const isInitialCommit = !mountedRef.current
    mountedRef.current = true
    if (isInitialCommit) return undefined

    if (state.isOpen) {
      onShow?.()
      if (!overlay) {
        onShown?.()
        return undefined
      }
      return executeAfterTransition(overlay, () => onShown?.(), true)
    }

    onHide?.()
    if (!overlay) {
      onHidden?.()
      return undefined
    }
    return executeAfterTransition(overlay, () => onHidden?.(), true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  const {
    overlayProps,
    placement: resolvedPlacement,
    updatePosition
  } = useOverlayPosition({
    targetRef,
    overlayRef,
    placement: toAriaPlacement(placement),
    offset: offsetProp[1],
    crossOffset: offsetProp[0],
    containerPadding: 8,
    isOpen: state.isOpen,
    // `useOverlayPosition` closes on any window scroll via a backward-compat `WeakMap` that
    // `useMenuTrigger` populates for `targetRef.current` (see `MenuToggle`'s `setRefs`).
    // Passing `null` opts out so the menu repositions with its trigger instead of vanishing —
    // matching `Autocomplete`/`Combobox`, neither of which is wired into that map.
    onClose: null
  })
  useOverlayMaxHeight(overlayRef, state.isOpen)

  const { menuStyle, placementAttr } = resolveMenuOverlayPositioning(
    overlayProps.style,
    placement,
    resolvedPlacement
  )

  // Escape closes the menu and returns focus to the toggle. Controlled, the close is a request:
  // focus returns when `visible` follows it, in the effect below, and stays where it is when
  // nothing can follow it or the caller declines. Read through a ref because the context value
  // these functions travel in is memoized.
  const followsRequestsRef = useRef(true)
  followsRequestsRef.current = visible === undefined || !!onVisibleChange
  const isControlledRef = useRef(false)
  isControlledRef.current = visible !== undefined
  const focusReturnOwedRef = useRef(false)

  const show = (focusStrategy?: MenuFocusStrategy | null) => state.open(focusStrategy)
  const hide = () => {
    focusReturnOwedRef.current = false
    state.close()
  }
  const toggleVisible = (focusStrategy?: MenuFocusStrategy | null) => state.toggle(focusStrategy)
  const close = () => {
    state.close()
    if (!isControlledRef.current) toggleNodeRef.current?.focus()
    else focusReturnOwedRef.current = followsRequestsRef.current
  }

  useEffect(() => {
    if (!state.isOpen && focusReturnOwedRef.current) toggleNodeRef.current?.focus()
    focusReturnOwedRef.current = false
  }, [state.isOpen])

  // The open dialog the toggle is in, if any, as `Popover` and `ContextMenu` resolve it: a list
  // teleported by `container` goes into that dialog rather than `document.body`, which lies
  // under a modal dialog's top layer, and the menu closes when the dialog does, teleported or
  // not, so a reopened dialog doesn't show a menu left open. `onShow`/`onHide` stay with the
  // effect above.
  const portalContainer = useFloatingOverlay({
    close: hide,
    isOpen: state.isOpen,
    triggerRef: toggleNodeRef
  })

  // The list is mounted again when it moves into the dialog, as a new element in another
  // containing block: placed again here, after its ref is set and before the paint.
  useIsomorphicLayoutEffect(() => {
    if (state.isOpen) updatePosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portalContainer])

  // Deferred so the click that opened the menu doesn't immediately close it, and scoped
  // to match menu.js's `clearMenus`: skip the toggle itself, honor `inside`/`outside`
  // modes, and let Tab or clicks on form controls inside the menu pass through untouched.
  useEffect(() => {
    if (!state.isOpen || autoClose === false) return undefined

    // A toggle's click can come both ways: from the toggle, and on `window` when nothing stopped it.
    const handled = new WeakSet<Event>()
    const handleDismiss = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== 'Tab') return
      if (handled.has(event)) return
      handled.add(event)

      const target = event.target as Node
      const toggleNode = toggleNodeRef.current
      const menuNode = overlayRef.current

      if (toggleNode?.contains(target)) return

      const lists = [menuNode, ...submenuOverlaysRef.current.values()]
      const isMenuTarget = lists.some((node) => !!node?.contains(target))

      // An overlay opened from the menu (a popover on an item, a picker's list) is portaled out
      // of the list, and React still renders it under it (`insideEvents`). A click there is
      // neither a click on an item nor one outside the menu: it is that overlay's.
      if (!isMenuTarget && isEventInside(event, overlayRef)) return
      if (isMenuTarget && menuToggleClicks.has(event)) return

      if (autoClose === 'inside' && !isMenuTarget) return
      if (autoClose === 'outside' && isMenuTarget) return

      if (
        isMenuTarget &&
        ((event instanceof KeyboardEvent && event.key === 'Tab') ||
          isFormControlClick(target, lists))
      ) {
        return
      }

      // An item chosen returns focus to the toggle, as Escape does: the closed list is
      // `display: none`, and focus on an item in it fell to `<body>`. Only while the menu holds
      // focus, or nothing does: an item that opened a dialog has moved it there. A click outside
      // or Tab has put focus where it is going already.
      const active = document.activeElement
      const holdsFocus =
        !active ||
        active === document.body ||
        !!menuNode?.contains(active) ||
        Array.from(submenuOverlaysRef.current.values()).some((node) => node.contains(active))
      if (isMenuTarget && holdsFocus) close()
      else hide()
    }

    // On `window`, including a click that a react-aria pressable outside stopped
    // (`listenOnWindow`).
    const cleanups: Array<() => void> = []
    const id = window.setTimeout(() => {
      cleanups.push(listenOnWindow('click', handleDismiss), listenOnWindow('keyup', handleDismiss))
      openMenuDismissals.add(handleDismiss)
    })

    return () => {
      window.clearTimeout(id)
      for (const cleanup of cleanups) cleanup()
      openMenuDismissals.delete(handleDismiss)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, autoClose])

  // Escape should always close the menu, independent of `autoClose`'s inside/outside/false
  // modes. `MenuList`'s own `onKeyDown` handling only fires when focus is already inside the
  // panel (e.g. opened via ArrowDown) — a mouse-press open via `useMenuTrigger` leaves focus on
  // the trigger button, where that handler is unreachable. The stack of open overlays listens on
  // `window`, which catches Escape regardless of where focus currently is, and gives it to this
  // menu only while nothing opened since is still open, and never to the popover or the dialog
  // around the menu as well.
  useEffect(() => {
    if (!state.isOpen) return undefined

    return pushOverlay({
      nodes: () => [overlayRef.current, toggleNodeRef.current],
      onEscape: close
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  const contextValue: MenuContextProps = useMemo(
    () => ({
      autoClose,
      close,
      container: container === true ? (portalContainer ?? true) : container,
      focusStrategy: state.focusStrategy as MenuFocusStrategy | null,
      hide,
      menuId: menuProps.id ?? '',
      menuStyle,
      menuTriggerProps,
      overlayRef,
      placementAttr,
      portalContainer,
      reference,
      registerOverlay,
      show,
      targetRef,
      toggle: toggleVisible,
      toggleNodeRef,
      triggerId: menuTriggerProps.id ?? '',
      visible: state.isOpen
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      autoClose,
      container,
      state.focusStrategy,
      menuProps.id,
      menuStyle,
      menuTriggerProps,
      placementAttr,
      portalContainer,
      reference,
      state.isOpen
    ]
  )

  // Inside a `NavOverflow`, a menu in a nav item is that item's content, not its link: a toggle
  // rendered as a `NavLink` has nothing to show in the overflow menu.
  const content = <NavOverflowBoundary>{children}</NavOverflowBoundary>

  return (
    <MenuContext.Provider value={contextValue}>
      {Component === Fragment ? (
        content
      ) : (
        // `show` mirrors vanilla menu.js's `this._parent.classList.add('show')` — needed for
        // e.g. `.nav-item.show .nav-link` to put a `NavLink`-rooted `MenuToggle` into its
        // pressed look while open, since a bare `.nav-link.show` has no styling of its own.
        <Component
          className={classNames(className, { show: state.isOpen })}
          {...rest}
          ref={forkedRef}
        >
          {content}
        </Component>
      )}
    </MenuContext.Provider>
  )
}

export const Menu = createPolymorphicComponent<MenuComponent>(
  MenuRender as ForwardRefRenderFunction<Element, MenuProps<ElementType>>,
  'Menu'
)
