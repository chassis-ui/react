import React, {
  ElementType,
  ForwardRefRenderFunction,
  ReactElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import { mergeProps, useLocale, useOverlayPosition } from 'react-aria'
import { useMenuTriggerState } from 'react-stately'

import {
  useFloatingOverlay,
  useForkedRef,
  useIsomorphicLayoutEffect,
  useOpenStateProps
} from '../../hooks'
import { resolveMenuOverlayPositioning, toAriaPlacement } from '../../utils/overlayPlacement'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { MenuAutoClose, MenuContext, MenuContextProps, MenuFocusStrategy } from '../menu/Menu'

// How long a touch or pen has to stay down, and how far it may travel meanwhile, for a long
// press. react-aria's `useLongPress` uses the same threshold; it isn't used here because its
// `usePress` prevents the default of key and pointer events on the element it is given, which
// would break the buttons and links inside a region.
const LONG_PRESS_MS = 500
const LONG_PRESS_TOLERANCE_PX = 10
// iOS emits a click when the finger that long-pressed lifts, on whatever is under it by then: the
// first item of the menu that has just opened at the finger. A click this soon after a long press
// is that release, not a choice.
const LONG_PRESS_CLICK_WINDOW_MS = 1000

// Where the menu opens: at a point (the pointer, or a finger's long press), or at an element (the
// one focused when the keyboard asked for it). Read from a ref inside `getTargetRect`, since
// `useOverlayPosition` captures that function once.
type Anchor = { kind: 'point'; x: number; y: number } | { kind: 'element'; element: Element }

const pointRect = (x: number, y: number): DOMRect =>
  ({
    x,
    y,
    top: y,
    left: x,
    right: x,
    bottom: y,
    width: 0,
    height: 0,
    toJSON: () => ({ x, y, width: 0, height: 0 })
  }) as DOMRect

type ContextMenuOwnProps<C extends ElementType> = {
  /**
   * Controls which presses close the menu. `true` closes on a click on an item and on a press
   * outside the menu. `false` leaves closing to the Escape key and `visible`. `'inside'` closes
   * only on a click on an item. `'outside'` closes only on a press outside the menu.
   */
  autoClose?: MenuAutoClose
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node, the region the menu opens from. Either a string to use an
   * HTML element or a component.
   *
   * @default 'div'
   */
  component?: C
  /**
   * Whether the menu is open when it first renders. Use it instead of `visible` when nothing
   * outside needs to control the menu. Opened this way, the menu sits under the region's start
   * edge, since no pointer has asked for it anywhere.
   */
  defaultVisible?: boolean
  /**
   * Leaves the region to the browser: a right-click shows the browser's own menu, a long press
   * and the keys do nothing.
   */
  disabled?: boolean
  /**
   * Callback fired when the menu hides.
   */
  onHide?: () => void
  /**
   * Callback fired when the menu shows.
   */
  onShow?: () => void
  /**
   * Callback fired when the menu asks to show or hide: a right-click, a long press or Shift+F10
   * in the region, a click on an item, a press outside, the Escape key, or the closing of the
   * dialog it is in. Receives the state it asks for. With `visible` set, the menu changes only
   * when `visible` does.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * Whether the menu is open. Setting it makes the menu controlled: it shows and hides only when
   * this changes, so pair it with `onVisibleChange`. Leave it unset, or use `defaultVisible`, for
   * a menu that opens and closes itself.
   */
  visible?: boolean
}

export type ContextMenuProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ContextMenuOwnProps<C>
>

type ContextMenuComponent = (<C extends ElementType = 'div'>(
  props: ContextMenuProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

// The region a context menu belongs to. The region is the component's own element: `className`,
// `style`, the rest of the props and the ref go to it. The menu is a `MenuList` among its
// children, with `Menu`'s own items, headers, dividers and submenus: this component provides
// `Menu`'s context, so `MenuList` renders, positions, portals and navigates the list as it does
// under a `Menu`. What differs is the trigger, the whole region rather than a button, and the
// position, the pointer rather than that button.
function ContextMenuRender<C extends ElementType = 'div'>(
  {
    children,
    autoClose = true,
    className,
    component,
    defaultVisible,
    disabled = false,
    id,
    onHide,
    onShow,
    onVisibleChange,
    visible,
    ...rest
  }: ContextMenuProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const generatedId = useId()
  // The list is labelled by the region, the way `Menu`'s is labelled by its toggle. A caller
  // that names the list itself (`aria-label` on the `MenuList`) drops that link.
  const [triggerId, setTriggerId] = useState(
    () => (id as string | undefined) ?? `${generatedId}-trigger`
  )
  const menuId = `${generatedId}-menu`
  const regionRef = useRef<HTMLElement | null>(null)
  const forkedRef = useForkedRef(ref, regionRef)

  // Under `asChild` the child's own `id` wins the merge (`Slot`), so the label follows the element
  // that rendered rather than the id this component asked for. The list exists only after
  // hydration, so the server's HTML never refers to the id this corrects.
  useIsomorphicLayoutEffect(() => {
    const rendered = regionRef.current?.id
    if (rendered && rendered !== triggerId) setTriggerId(rendered)
  }, [triggerId])

  // iOS shows its own callout for a long press on a link or an image; the region's menu takes
  // its place. Set on the element rather than through `style`, which a slotted child's own
  // `style` would replace. The property is inherited, so the region's children lose it too.
  useIsomorphicLayoutEffect(() => {
    regionRef.current?.style.setProperty('-webkit-touch-callout', 'none')
  }, [])
  const overlayRef = useRef<HTMLElement | null>(null)
  // `MenuToggle` writes into these two: a `MenuToggle` inside a region belongs to no `Menu`, so
  // it gets refs of its own to write to rather than the region's.
  const toggleNodeRef = useRef<HTMLElement | null>(null)
  const targetRef = useRef<HTMLElement | null>(null)
  // Portaled `MenuSubmenu` panels register themselves here, so a press inside one counts as inside
  // the menu (see `MenuContext.registerOverlay`).
  const submenuOverlaysRef = useRef<Map<string, HTMLElement>>(new Map())
  const registerOverlay = (overlayId: string, node: HTMLElement | null) => {
    if (node) submenuOverlaysRef.current.set(overlayId, node)
    else submenuOverlaysRef.current.delete(overlayId)
  }

  const state = useMenuTriggerState(
    useOpenStateProps({ defaultVisible, onVisibleChange, visible }, 'ContextMenu')
  )

  const anchorRef = useRef<Anchor | null>(null)
  // Bumped with each request to open, so the menu is placed again when a second right-click
  // moves an open menu: `useOverlayPosition` positions on its own only when the open state
  // changes.
  const [anchorVersion, setAnchorVersion] = useState(0)
  // The element focused when the menu opened, focused again when the menu closes from the
  // keyboard or an item. Cleared by a press outside, which puts focus somewhere else itself.
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const openAt = (anchor: Anchor) => {
    if (disabled) return
    anchorRef.current = anchor
    if (!state.isOpen) restoreFocusRef.current = document.activeElement as HTMLElement | null
    setAnchorVersion((version) => version + 1)
    state.open('first')
  }

  const hide = () => {
    restoreFocusRef.current = null
    state.close()
  }
  const close = () => state.close()

  useEffect(() => {
    if (state.isOpen) return
    const element = restoreFocusRef.current
    restoreFocusRef.current = null
    if (!element || !document.contains(element)) return
    // Only when the menu still holds focus, or nothing does: focus the user has put on another
    // control since, or an app closing the menu through `visible` while they type elsewhere,
    // stays there (`Popover` does the same).
    const active = document.activeElement
    const focusIsLoose = !active || active === document.body
    const focusIsInMenu = !!active && !!overlayRef.current?.contains(active)
    if (focusIsLoose || focusIsInMenu) element.focus()
  }, [state.isOpen])

  // Resolves the `<dialog>` the region is in, if any, so the list portals into its top layer and
  // closes with it, and fires `onShow`/`onHide`.
  const portalContainer = useFloatingOverlay({
    close: state.close,
    isOpen: state.isOpen,
    onHide,
    onShow,
    triggerRef: regionRef
  })

  // A context menu opens toward the reading direction: its start edge at the pointer, and flipped
  // above the pointer when there is no room below (`useOverlayPosition`'s own flip).
  const { direction } = useLocale()
  const placement = direction === 'rtl' ? 'bottom-end' : 'bottom-start'

  const {
    overlayProps,
    placement: resolvedPlacement,
    updatePosition
  } = useOverlayPosition({
    // The region is the target `useOverlayPosition` measures; `getTargetRect` replaces its
    // rectangle with the anchor's. A menu opened by `defaultVisible` or `visible` alone, with no
    // anchor yet, sits under the region's start edge.
    targetRef: regionRef,
    overlayRef,
    placement: toAriaPlacement(placement),
    containerPadding: 8,
    isOpen: state.isOpen,
    // See `Menu`: `null` opts out of closing on any window scroll, so the menu scrolls with the
    // page instead of vanishing.
    onClose: null,
    getTargetRect: () => {
      const anchor = anchorRef.current
      if (!anchor) return undefined
      return anchor.kind === 'point'
        ? pointRect(anchor.x, anchor.y)
        : anchor.element.getBoundingClientRect()
    }
  })

  useIsomorphicLayoutEffect(() => {
    if (state.isOpen) updatePosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, anchorVersion])

  const { menuStyle, placementAttr } = resolveMenuOverlayPositioning(
    overlayProps.style,
    placement,
    resolvedPlacement
  )

  // Presses outside the menu, and clicks on its items. A press rather than a click outside, as
  // a native menu closes: the click that follows a long press's release then finds no open menu
  // to close, and a right-click elsewhere closes this menu before it opens another.
  useEffect(() => {
    if (!state.isOpen || autoClose === false) return undefined

    const isInMenu = (target: Node) =>
      !!overlayRef.current?.contains(target) ||
      Array.from(submenuOverlaysRef.current.values()).some((node) => node.contains(target))

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (isInMenu(target) || autoClose === 'inside') return
      // A right-click inside the region asks for the menu at a new place: the `contextmenu`
      // event that follows moves it.
      if (event.button === 2 && regionRef.current?.contains(target)) return
      hide()
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!isInMenu(target) || autoClose === 'outside') return
      // A form control inside the menu is used in place, as in `Menu`.
      if (/input|select|option|textarea|form/i.test(target.tagName ?? '')) return
      close()
    }

    // Tab has moved focus out of the menu by the time the key comes up.
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || isInMenu(event.target as Node)) return
      hide()
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('click', handleClick)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keyup', handleKeyUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, autoClose])

  // Escape closes the menu wherever focus is, independent of `autoClose`, as in `Menu`.
  useEffect(() => {
    if (!state.isOpen) return undefined

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  // Becoming `disabled` closes an open menu. Not on mount: `disabled` with `visible` is the
  // caller's to hold.
  const wasDisabledRef = useRef(disabled)
  useEffect(() => {
    if (disabled && !wasDisabledRef.current) hide()
    wasDisabledRef.current = disabled
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled])

  // The list is a React child of the region, so its events reach these handlers through the
  // portal: a right-click on an item, or Shift+F10 with an item focused, is not a request to open
  // the menu somewhere else. Only what happens in the region's own element counts.
  const isInRegion = (event: React.SyntheticEvent<HTMLElement>) =>
    event.currentTarget.contains(event.target as Node)

  // The browser's own menu is replaced. When `disabled`, the event isn't handled at all, so the
  // browser's menu shows.
  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return
    // Prevented for the list too: a browser that fires `contextmenu` for the context menu key on
    // key up (Chromium) fires it at the item the key down has just focused.
    event.preventDefault()
    if (!isInRegion(event)) return
    openAt({ kind: 'point', x: event.clientX, y: event.clientY })
  }

  const isContextMenuKey = (event: React.KeyboardEvent<HTMLElement>) =>
    event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)

  // Shift+F10 and the context menu key, on any element in the region: the menu opens under that
  // element. Preventing the default keeps the browser from firing its own `contextmenu` event
  // for the key, which would move the menu to where the browser reports the key. Firefox fires
  // it from the key down, Chromium from the key up, so both are prevented.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (disabled || !isContextMenuKey(event)) return
    event.preventDefault()
    if (!isInRegion(event)) return
    openAt({ kind: 'element', element: event.target as Element })
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!disabled && isContextMenuKey(event)) event.preventDefault()
  }

  // A long press by a finger or a pen. A browser that fires `contextmenu` for it as well (Android)
  // opens the menu through `handleContextMenu` at the same point.
  const longPressRef = useRef<{ timer: number; x: number; y: number } | null>(null)
  // While a finger is down, the region selects no text: iOS starts selecting at about the same
  // time the press becomes long. Restored when the finger lifts.
  const userSelectRef = useRef<string | null>(null)
  const restoreUserSelect = () => {
    const region = regionRef.current
    if (!region || userSelectRef.current === null) return
    region.style.setProperty('-webkit-user-select', userSelectRef.current)
    region.style.setProperty('user-select', userSelectRef.current)
    userSelectRef.current = null
  }
  const cancelLongPress = () => {
    if (!longPressRef.current) return
    window.clearTimeout(longPressRef.current.timer)
    longPressRef.current = null
  }
  const endPress = () => {
    cancelLongPress()
    restoreUserSelect()
  }
  // The click the release of a long press emits (iOS) lands on the item that has just opened
  // under the finger: swallowed before it reaches the item or the click-inside dismissal.
  const clickSwallowRef = useRef<(() => void) | null>(null)
  const stopSwallowingClicks = () => {
    clickSwallowRef.current?.()
    clickSwallowRef.current = null
  }
  const swallowNextClick = () => {
    stopSwallowingClicks()
    const swallow = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      stopSwallowingClicks()
    }
    window.addEventListener('click', swallow, { capture: true })
    const timer = window.setTimeout(stopSwallowingClicks, LONG_PRESS_CLICK_WINDOW_MS)
    clickSwallowRef.current = () => {
      window.removeEventListener('click', swallow, { capture: true })
      window.clearTimeout(timer)
    }
  }

  useEffect(
    () => () => {
      endPress()
      stopSwallowingClicks()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.pointerType === 'mouse' || !isInRegion(event)) return
    endPress()
    const region = event.currentTarget
    userSelectRef.current = region.style.getPropertyValue('user-select')
    region.style.setProperty('-webkit-user-select', 'none')
    region.style.setProperty('user-select', 'none')
    const { clientX: x, clientY: y } = event
    longPressRef.current = {
      x,
      y,
      timer: window.setTimeout(() => {
        longPressRef.current = null
        swallowNextClick()
        openAt({ kind: 'point', x, y })
      }, LONG_PRESS_MS)
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const press = longPressRef.current
    if (!press) return
    if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > LONG_PRESS_TOLERANCE_PX) {
      cancelLongPress()
    }
  }

  const contextValue: MenuContextProps = useMemo(
    () => ({
      autoClose,
      close,
      container: portalContainer ?? true,
      focusStrategy: state.focusStrategy as MenuFocusStrategy | null,
      hide,
      menuId,
      menuStyle,
      menuTriggerProps: {},
      overlayRef,
      placementAttr,
      reference: 'toggle',
      registerOverlay,
      show: (focusStrategy) => state.open(focusStrategy ?? 'first'),
      targetRef,
      toggle: (focusStrategy) => state.toggle(focusStrategy ?? 'first'),
      toggleNodeRef,
      triggerId,
      visible: state.isOpen
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      autoClose,
      menuId,
      menuStyle,
      placementAttr,
      portalContainer,
      state.focusStrategy,
      state.isOpen,
      triggerId
    ]
  )

  return (
    <MenuContext.Provider value={contextValue}>
      <Component
        id={triggerId}
        className={classNames('context-menu', className)}
        {...(mergeProps(
          {
            onContextMenu: handleContextMenu,
            onKeyDown: handleKeyDown,
            onKeyUp: handleKeyUp,
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: endPress,
            onPointerCancel: endPress,
            onPointerLeave: endPress
          },
          rest
        ) as Record<string, unknown>)}
        ref={forkedRef}
      >
        {children}
      </Component>
    </MenuContext.Provider>
  )
}

export const ContextMenu = createPolymorphicComponent<ContextMenuComponent>(
  ContextMenuRender as ForwardRefRenderFunction<Element, ContextMenuProps<ElementType>>,
  'ContextMenu'
)
