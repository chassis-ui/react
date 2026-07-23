import React, {
  createContext,
  ElementType,
  forwardRef,
  HTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'
import {
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import type { Placement } from '@floating-ui/react-dom'

import { useForkedRef } from '../../utils/hooks'

export type { Placement }

export type MenuAutoClose = boolean | 'inside' | 'outside'

export interface CMenuProps extends HTMLAttributes<HTMLElement> {
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
   * Initial placement. Chassis will flip and shift it to keep the menu in view.
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
   * CSS positioning strategy. `'fixed'` escapes `overflow: hidden` ancestors.
   */
  strategy?: 'absolute' | 'fixed'
  /**
   * Toggle the visibility of the menu component.
   */
  visible?: boolean
}

export interface CMenuContextProps {
  autoClose: MenuAutoClose
  close: () => void
  container?: boolean | Element
  floatingStyles: React.CSSProperties
  hide: () => void
  placement: Placement
  reference: 'toggle' | 'parent'
  refs: ReturnType<typeof useFloating>['refs']
  show: () => void
  toggle: () => void
  toggleNodeRef: React.MutableRefObject<HTMLElement | null>
  visible: boolean
}

// A fully-shaped no-op default so a `CxMenuToggle`/`CxMenuList`/`CxSubmenu` rendered without a
// `CxMenu` ancestor (or in an environment where context can't cross a component boundary, e.g.
// some static-site prerenderers) degrades to an inert, always-closed menu instead of throwing.
const noop = () => undefined

const defaultMenuContext: CMenuContextProps = {
  autoClose: true,
  close: noop,
  floatingStyles: {},
  hide: noop,
  placement: 'bottom-start',
  reference: 'toggle',
  refs: {
    reference: { current: null },
    floating: { current: null },
    setReference: noop,
    setFloating: noop,
  },
  show: noop,
  toggle: noop,
  toggleNodeRef: { current: null },
  visible: false,
}

export const CMenuContext = createContext(defaultMenuContext)

export const CxMenu = forwardRef<HTMLElement, CMenuProps>(
  (
    {
      children,
      autoClose = true,
      className,
      component: Component = 'div',
      container,
      offset: offsetProp = [0, 2],
      onHide,
      onHidden,
      onShow,
      onShown,
      placement = 'bottom-start',
      reference = 'toggle',
      strategy = 'absolute',
      visible,
      ...rest
    },
    ref,
  ) => {
    const [_visible, setVisible] = useState(!!visible)
    const wrapperRef = useRef<HTMLElement>(null)
    const forkedRef = useForkedRef(ref, wrapperRef)
    const toggleNodeRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
      setVisible(!!visible)
    }, [visible])

    const {
      refs,
      x,
      y,
      strategy: resolvedStrategy,
      placement: resolvedPlacement,
    } = useFloating({
      placement,
      strategy,
      whileElementsMounted: _visible ? autoUpdate : undefined,
      middleware: [
        offsetMiddleware({ crossAxis: offsetProp[0], mainAxis: offsetProp[1] }),
        flip(),
        shift({ padding: 8 }),
      ],
    })

    // Built from raw `x`/`y`/`strategy` (matching menu.js's own `left`/`top` assignment) rather
    // than the hook's `floatingStyles` convenience, which positions via `transform: translate()`
    // assuming the floating element's offset parent sits at the viewport origin. That assumption
    // only holds when the panel is portaled straight to `document.body` (as Tooltip/Popover do);
    // since a menu panel stays in normal flow by default, `transform` positioning can be off by
    // however far its actual offset parent is from the origin.
    const floatingStyles: React.CSSProperties = {
      position: resolvedStrategy,
      top: y ?? 0,
      left: x ?? 0,
    }

    useLayoutEffect(() => {
      if (reference === 'parent') {
        refs.setReference(wrapperRef.current)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reference])

    useEffect(() => {
      if (_visible) {
        onShow?.()
        onShown?.()
      } else {
        onHide?.()
        onHidden?.()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_visible])

    const show = () => setVisible(true)
    const hide = () => setVisible(false)
    const toggleVisible = () => setVisible((current) => !current)
    const close = () => {
      setVisible(false)
      toggleNodeRef.current?.focus()
    }

    // Deferred so the click that opened the menu doesn't immediately close it, and scoped
    // to match menu.js's `clearMenus`: skip the toggle itself, honor `inside`/`outside`
    // modes, and let Tab or clicks on form controls inside the menu pass through untouched.
    useEffect(() => {
      if (!_visible || autoClose === false) return undefined

      const handleDismiss = (event: MouseEvent | KeyboardEvent) => {
        if (event instanceof KeyboardEvent && event.key !== 'Tab') return

        const target = event.target as Node
        const toggleNode = toggleNodeRef.current
        const menuNode = refs.floating.current

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
    }, [_visible, autoClose])

    const contextValue: CMenuContextProps = {
      autoClose,
      close,
      container,
      floatingStyles,
      hide,
      placement: resolvedPlacement,
      reference,
      refs,
      show,
      toggle: toggleVisible,
      toggleNodeRef,
      visible: _visible,
    }

    return (
      <CMenuContext.Provider value={contextValue}>
        <Component className={classNames(className)} {...rest} ref={forkedRef}>
          {children}
        </Component>
      </CMenuContext.Provider>
    )
  },
)

CxMenu.displayName = 'CxMenu'
