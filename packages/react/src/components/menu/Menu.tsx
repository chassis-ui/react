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

import { useForkedRef, useIsomorphicLayoutEffect, useOpenStateProps } from '../../hooks'
import { executeAfterTransition } from '../../utils/dialogTransition'
import {
  Placement,
  resolveMenuOverlayPositioning,
  toAriaPlacement
} from '../../utils/overlayPlacement'
import { NavOverflowBoundary } from '../../utils/navOverflow'
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
   * `true` to append to `document.body`.
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

  const { overlayProps, placement: resolvedPlacement } = useOverlayPosition({
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

  // Deferred so the click that opened the menu doesn't immediately close it, and scoped
  // to match menu.js's `clearMenus`: skip the toggle itself, honor `inside`/`outside`
  // modes, and let Tab or clicks on form controls inside the menu pass through untouched.
  useEffect(() => {
    if (!state.isOpen || autoClose === false) return undefined

    const handleDismiss = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key !== 'Tab') return

      const target = event.target as Node
      const toggleNode = toggleNodeRef.current
      const menuNode = overlayRef.current

      if (toggleNode?.contains(target)) return

      const isMenuTarget =
        !!menuNode?.contains(target) ||
        Array.from(submenuOverlaysRef.current.values()).some((node) => node.contains(target))

      if (autoClose === 'inside' && !isMenuTarget) return
      if (autoClose === 'outside' && isMenuTarget) return

      if (
        isMenuTarget &&
        ((event instanceof KeyboardEvent && event.key === 'Tab') ||
          /input|select|option|textarea|form/i.test((target as HTMLElement).tagName ?? ''))
      ) {
        return
      }

      hide()
    }

    const id = window.setTimeout(() => {
      window.addEventListener('click', handleDismiss)
      window.addEventListener('keyup', handleDismiss)
    })

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('click', handleDismiss)
      window.removeEventListener('keyup', handleDismiss)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, autoClose])

  // Escape should always close the menu, independent of `autoClose`'s inside/outside/false
  // modes. `MenuList`'s own `onKeyDown` handling only fires when focus is already inside the
  // panel (e.g. opened via ArrowDown) — a mouse-press open via `useMenuTrigger` leaves focus on
  // the trigger button, where that handler is unreachable. Listening on `window` catches Escape
  // regardless of where focus currently is.
  useEffect(() => {
    if (!state.isOpen) return undefined

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  const contextValue: MenuContextProps = useMemo(
    () => ({
      autoClose,
      close,
      container,
      focusStrategy: state.focusStrategy as MenuFocusStrategy | null,
      hide,
      menuId: menuProps.id ?? '',
      menuStyle,
      menuTriggerProps,
      overlayRef,
      placementAttr,
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
