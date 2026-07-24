import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import {
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import type { Placement } from '@floating-ui/react-dom'

import { focusMenuItem, getMenuItems, handleMenuKeyDown } from './menuNavigation'
import { SubmenuActionsContext, SubmenuGroupContext, useSubmenuGroupProvider } from './submenuGroup'

export interface CSubmenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * Submenu activation mode on hover-capable devices. `'click'` activates on click only.
   * `'hover'` activates on hover only. `'both'` (the default) activates on both. Touch
   * devices always use tap regardless of this setting.
   */
  activation?: 'click' | 'hover' | 'both'
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Prevents the submenu from opening.
   */
  disabled?: boolean
  /**
   * Distance between the nested menu and the trigger, as `[skidding, distance]` in pixels.
   */
  offset?: [number, number]
  /**
   * Placement of the nested menu relative to the trigger.
   */
  placement?: Placement
  /**
   * Switches to a view-replacement pattern below the `small` breakpoint. Pair with a
   * `CxSubmenuBack` as the first item of the nested menu.
   */
  stacked?: boolean
  /**
   * Milliseconds before closing the submenu when the pointer leaves it.
   */
  submenuDelay?: number
  /**
   * Content of the `.menu-item` trigger that opens the submenu.
   */
  trigger: ReactNode
}

export const CxSubmenu = forwardRef<HTMLDivElement, CSubmenuProps>(
  (
    {
      children,
      activation = 'both',
      className,
      disabled,
      offset: offsetProp = [-4, 0],
      placement = 'right-start',
      stacked,
      submenuDelay = 100,
      trigger,
      ...rest
    },
    ref,
  ) => {
    const id = useId()
    const [visible, setVisible] = useState(false)
    // Portaling is only safe once mounted on the client: during SSR (and the initial client
    // hydration pass, which must match the server-rendered markup) the panel renders inline next
    // to its trigger, then moves to `document.body` on the next render once this flips to true.
    const [mounted, setMounted] = useState(false)
    const closeTimeoutRef = useRef<number | undefined>(undefined)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const parentGroup = useContext(SubmenuGroupContext)
    const ownGroup = useSubmenuGroupProvider()

    const {
      refs,
      x,
      y,
      strategy: resolvedStrategy,
    } = useFloating({
      placement,
      // 'fixed' (viewport-relative), matching the portal below: the trigger lives inside the
      // parent menu's own floated panel, and a containing-block-establishing ancestor anywhere in
      // that chain (a CSS transform, filter, or container-type) would throw off 'absolute' math —
      // or even 'fixed' math if it isn't escaped via a portal.
      strategy: 'fixed',
      whileElementsMounted: visible ? autoUpdate : undefined,
      middleware: [
        offsetMiddleware({ crossAxis: offsetProp[0], mainAxis: offsetProp[1] }),
        flip(),
        shift({ padding: 8 }),
      ],
    })

    const floatingStyles: React.CSSProperties = {
      position: resolvedStrategy,
      top: y ?? 0,
      left: x ?? 0,
    }

    const clearCloseTimeout = () => {
      if (closeTimeoutRef.current !== undefined) {
        window.clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = undefined
      }
    }

    const close = () => {
      clearCloseTimeout()
      setVisible(false)
    }

    const open = () => {
      if (disabled || visible) return
      clearCloseTimeout()
      parentGroup?.notifyOpen(id)
      setVisible(true)
    }

    const scheduleClose = () => {
      clearCloseTimeout()
      closeTimeoutRef.current = window.setTimeout(close, submenuDelay)
    }

    useEffect(() => parentGroup?.register(id, close), [parentGroup, id])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => () => clearCloseTimeout(), [])
    useEffect(() => setMounted(true), [])

    const supportsHover =
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(hover: hover)').matches
    const hoverEnabled = supportsHover && (activation === 'hover' || activation === 'both')
    const clickEnabled = activation === 'click' || activation === 'both'

    const openAndFocusFirst = () => {
      open()
      requestAnimationFrame(() => focusMenuItem(getMenuItems(refs.floating.current), 'first'))
    }

    const closeAndRefocusTrigger = () => {
      close()
      triggerRef.current?.focus()
    }

    const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!clickEnabled || disabled) return
      event.preventDefault()
      event.stopPropagation()
      visible ? close() : openAndFocusFirst()
    }

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        openAndFocusFirst()
      }
    }

    const actionsValue = { close: closeAndRefocusTrigger }

    return (
      <div className={classNames('submenu', { show: visible }, className)} {...rest} ref={ref}>
        <button
          type="button"
          className="menu-item"
          aria-expanded={visible}
          aria-haspopup="true"
          disabled={disabled}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          onMouseEnter={hoverEnabled ? open : undefined}
          onMouseLeave={hoverEnabled ? scheduleClose : undefined}
          ref={(node) => {
            triggerRef.current = node
            refs.setReference(node)
          }}
        >
          {trigger}
        </button>
        {(() => {
          const panel = (
            <div
              className={classNames('menu', { show: visible, 'submenu-stacked': stacked })}
              style={floatingStyles}
              aria-hidden={!visible}
              onKeyDown={(event) =>
                handleMenuKeyDown(event, {
                  onEscape: closeAndRefocusTrigger,
                  onArrowLeft: closeAndRefocusTrigger,
                })
              }
              onMouseEnter={hoverEnabled ? clearCloseTimeout : undefined}
              onMouseLeave={hoverEnabled ? scheduleClose : undefined}
              ref={refs.setFloating}
            >
              <SubmenuActionsContext.Provider value={actionsValue}>
                <SubmenuGroupContext.Provider value={ownGroup}>
                  {children}
                </SubmenuGroupContext.Provider>
              </SubmenuActionsContext.Provider>
            </div>
          )

          return mounted ? createPortal(panel, document.body) : panel
        })()}
      </div>
    )
  },
)

CxSubmenu.displayName = 'CxSubmenu'
