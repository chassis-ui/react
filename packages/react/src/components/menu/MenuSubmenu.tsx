import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { useLocale, useOverlayPosition } from 'react-aria'

import { MenuContext } from './Menu'
import { Placement, resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { focusMenuItem, getMenuItems, handleMenuKeyDown } from './menuNavigation'
import { SubmenuActionsContext, SubmenuGroupContext, useSubmenuGroupProvider } from './submenuGroup'

export interface MenuSubmenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * MenuSubmenu activation mode on hover-capable devices. `'click'` activates on click only.
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
   * Placement of the nested menu relative to the trigger. Defaults to cascading in the reading
   * direction — `'right-start'` under LTR locales, `'left-start'` under RTL ones (see
   * `useLocale`) — matching native OS/browser submenu behavior. An explicit value always wins
   * over that locale-based default.
   */
  placement?: Placement
  /**
   * Switches to a view-replacement pattern below the `small` breakpoint. Pair with a
   * `MenuSubmenuBack` as the first item of the nested menu.
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

export const MenuSubmenu = forwardRef<HTMLDivElement, MenuSubmenuProps>(
  (
    {
      children,
      activation = 'both',
      className,
      disabled,
      offset: offsetProp = [-4, 0],
      placement,
      stacked,
      submenuDelay = 100,
      trigger,
      ...rest
    },
    ref
  ) => {
    const id = useId()
    const triggerId = `${id}-trigger`
    const menuId = `${id}-menu`
    const [visible, setVisible] = useState(false)
    // Portaling is only safe once mounted on the client: during SSR (and the initial client
    // hydration pass, which must match the server-rendered markup) the panel renders inline next
    // to its trigger, then moves to `document.body` on the next render once this flips to true.
    const [mounted, setMounted] = useState(false)
    const closeTimeoutRef = useRef<number | undefined>(undefined)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const overlayRef = useRef<HTMLElement | null>(null)
    const parentGroup = useContext(SubmenuGroupContext)
    const ownGroup = useSubmenuGroupProvider()
    const { visible: parentMenuVisible } = useContext(MenuContext)
    const { direction } = useLocale()
    const isRtl = direction === 'rtl'
    const effectivePlacement = placement ?? (isRtl ? 'left-start' : 'right-start')

    const { overlayProps, placement: resolvedPlacement } = useOverlayPosition({
      targetRef: triggerRef,
      overlayRef,
      // Viewport-relative (matching the portal below): the trigger lives inside the parent
      // menu's own floated panel, and `useOverlayPosition` measures against the overlay's real
      // containing block — since the panel portals straight to `document.body`, that resolves
      // the same way a `fixed`-strategy engine would.
      placement: toAriaPlacement(effectivePlacement),
      offset: offsetProp[1],
      crossOffset: offsetProp[0],
      containerPadding: 8,
      isOpen: visible
    })

    const menuStyle: React.CSSProperties = {
      position: overlayProps.style?.position as React.CSSProperties['position'],
      top: overlayProps.style?.top,
      left: overlayProps.style?.left
    }
    const placementAttr = resolveDataPlacement(effectivePlacement, resolvedPlacement)

    const clearCloseTimeout = useCallback(() => {
      if (closeTimeoutRef.current !== undefined) {
        window.clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = undefined
      }
    }, [])

    const close = useCallback(() => {
      clearCloseTimeout()
      setVisible(false)
    }, [clearCloseTimeout])

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

    useEffect(() => parentGroup?.register(id, close), [parentGroup, id, close])
    useEffect(() => clearCloseTimeout, [clearCloseTimeout])
    useEffect(() => setMounted(true), [])

    // The submenu's own open state is local and doesn't otherwise hear about its ancestor
    // `Menu` closing (via Escape, outside click, etc.) — without this it's left open and
    // fully visible (it's portaled to `document.body`, so nothing hides it for free) even
    // after the menu it belongs to has disappeared.
    useEffect(() => {
      if (!parentMenuVisible) close()
    }, [parentMenuVisible, close])

    const supportsHover =
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(hover: hover)').matches
    const hoverEnabled = supportsHover && (activation === 'hover' || activation === 'both')
    const clickEnabled = activation === 'click' || activation === 'both'

    const openAndFocusFirst = () => {
      open()
      requestAnimationFrame(() => focusMenuItem(getMenuItems(overlayRef.current), 'first'))
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

    // A submenu cascades toward the reading direction, so the arrow key that opens it (and the
    // one its own item list closes on, below) mirror too: ArrowRight/ArrowLeft under LTR,
    // ArrowLeft/ArrowRight under RTL.
    const openKey = isRtl ? 'ArrowLeft' : 'ArrowRight'

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return
      if (event.key === 'Enter' || event.key === ' ' || event.key === openKey) {
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
          id={triggerId}
          role="menuitem"
          className="menu-item"
          aria-expanded={visible}
          aria-haspopup="true"
          aria-controls={visible ? menuId : undefined}
          disabled={disabled}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          onMouseEnter={hoverEnabled ? open : undefined}
          onMouseLeave={hoverEnabled ? scheduleClose : undefined}
          ref={(node) => {
            triggerRef.current = node
          }}
        >
          {trigger}
        </button>
        {(() => {
          const panel = (
            <div
              role="menu"
              id={menuId}
              aria-labelledby={triggerId}
              className={classNames('menu', { show: visible, 'submenu-stacked': stacked })}
              style={menuStyle}
              data-cx-placement={placementAttr}
              aria-hidden={!visible}
              onKeyDown={(event) =>
                handleMenuKeyDown(event, {
                  onEscape: closeAndRefocusTrigger,
                  ...(isRtl
                    ? { onArrowRight: closeAndRefocusTrigger }
                    : { onArrowLeft: closeAndRefocusTrigger })
                })
              }
              onMouseEnter={hoverEnabled ? clearCloseTimeout : undefined}
              onMouseLeave={hoverEnabled ? scheduleClose : undefined}
              ref={(node) => {
                overlayRef.current = node
              }}
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
  }
)

MenuSubmenu.displayName = 'MenuSubmenu'
