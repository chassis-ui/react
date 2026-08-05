import React, {
  createContext,
  ElementType,
  forwardRef,
  Fragment,
  HTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'
import classNames from 'classnames'
import { AriaButtonProps, useMenuTrigger, useOverlayPosition } from 'react-aria'
import { useMenuTriggerState } from 'react-stately'

import { useForkedRef } from '../../hooks'
import { Placement, resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'

export type { Placement }
export type MenuFocusStrategy = 'first' | 'last'

export type MenuAutoClose = boolean | 'inside' | 'outside'

export interface MenuProps extends HTMLAttributes<HTMLElement> {
  /**
   * Controls which clicks close the menu. `true` closes on any click inside or outside.
   * `false` requires a programmatic `visible` change. `'inside'` closes only on click inside
   * the menu. `'outside'` closes only on click outside the menu.
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
  component?: string | ElementType
  /**
   * Teleports the menu panel to a container element on open. Accepts an element reference, or
   * `true` to append to `document.body`.
   */
  container?: boolean | Element
  /**
   * Distance between the menu and its reference element, as `[skidding, distance]` in pixels.
   */
  offset?: [number, number]
  /**
   * Callback fired when the menu requests to be hidden.
   */
  onHide?: () => void
  /**
   * Callback fired after the menu finishes hiding.
   */
  onHidden?: () => void
  /**
   * Callback fired when the menu requests to be shown.
   */
  onShow?: () => void
  /**
   * Callback fired after the menu finishes showing.
   */
  onShown?: () => void
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
   * Toggle the visibility of the menu component.
   */
  visible?: boolean
}

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
  show: (focusStrategy?: MenuFocusStrategy | null) => void
  targetRef: React.MutableRefObject<HTMLElement | null>
  toggle: (focusStrategy?: MenuFocusStrategy | null) => void
  toggleNodeRef: React.MutableRefObject<HTMLElement | null>
  triggerId: string
  visible: boolean
}

// A fully-shaped no-op default so a `MenuToggle`/`MenuList`/`Submenu` rendered without a
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
  show: noop,
  targetRef: { current: null },
  toggle: noop,
  toggleNodeRef: { current: null },
  triggerId: '',
  visible: false
}

export const MenuContext = createContext(defaultMenuContext)

export const Menu = forwardRef<HTMLElement, MenuProps>(
  (
    {
      children,
      autoClose = true,
      className,
      component: Component = Fragment as ElementType,
      container,
      offset: offsetProp = [0, 2],
      onHide,
      onHidden,
      onShow,
      onShown,
      placement = 'bottom-start',
      reference = 'toggle',
      visible,
      ...rest
    },
    ref
  ) => {
    const wrapperRef = useRef<HTMLElement>(null)
    const forkedRef = useForkedRef(ref, wrapperRef)
    const toggleNodeRef = useRef<HTMLElement | null>(null)
    const targetRef = useRef<HTMLElement | null>(null)
    const overlayRef = useRef<HTMLElement | null>(null)

    const state = useMenuTriggerState({ defaultOpen: !!visible })
    const { menuTriggerProps, menuProps } = useMenuTrigger<unknown>({}, state, toggleNodeRef)

    // Sync-on-change, not strictly controlled — matches `Modal`'s `visible` semantics.
    // Internal `show`/`hide`/`toggle` calls (from `MenuToggle`, autoClose dismissal, etc.)
    // still work freely between prop changes; `visible` only re-asserts the open state when
    // its own value actually changes.
    useEffect(() => {
      if (visible === undefined) return
      if (visible) state.open()
      else state.close()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible])

    useLayoutEffect(() => {
      if (reference === 'parent') {
        targetRef.current = wrapperRef.current
      }
    }, [reference])

    useEffect(() => {
      if (state.isOpen) {
        onShow?.()
        onShown?.()
      } else {
        onHide?.()
        onHidden?.()
      }
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

    // Only `position`/`top`/`left` are taken from the hook's computed style — `zIndex` and
    // `maxHeight` stay owned by chassis-css's own `--zindex`/`--max-height` tokens (see
    // `_menu.scss`), the same reasoning the old `@floating-ui/react-dom`-based implementation
    // already followed for `top`/`left` over its `floatingStyles` convenience.
    const menuStyle: React.CSSProperties = {
      position: overlayProps.style?.position as React.CSSProperties['position'],
      top: overlayProps.style?.top,
      left: overlayProps.style?.left
    }
    const placementAttr = resolveDataPlacement(placement, resolvedPlacement)

    const show = (focusStrategy?: MenuFocusStrategy | null) => state.open(focusStrategy)
    const hide = () => state.close()
    const toggleVisible = (focusStrategy?: MenuFocusStrategy | null) => state.toggle(focusStrategy)
    const close = () => {
      state.close()
      toggleNodeRef.current?.focus()
    }

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

        const isMenuTarget = !!menuNode?.contains(target)

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

    const contextValue: MenuContextProps = {
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
      show,
      targetRef,
      toggle: toggleVisible,
      toggleNodeRef,
      triggerId: menuTriggerProps.id ?? '',
      visible: state.isOpen
    }

    return (
      <MenuContext.Provider value={contextValue}>
        {Component === Fragment ? (
          children
        ) : (
          <Component className={classNames(className)} {...rest} ref={forkedRef}>
            {children}
          </Component>
        )}
      </MenuContext.Provider>
    )
  }
)

Menu.displayName = 'Menu'
