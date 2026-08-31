import React, {
  FC,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useRef
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { mergeProps, useDialog, useOverlayPosition, useOverlayTrigger } from 'react-aria'
import { useOverlayTriggerState } from 'react-stately'
import { Transition } from 'react-transition-group'

import { getOverlayArrowStyle, getOverlayTransitionClass, useFloatingOverlay } from '../../hooks'
import { Placement, resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'

interface PopoverPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'content'> {
  arrowProps: HTMLAttributes<HTMLDivElement>
  content: ReactNode | string
  overlayRef: RefObject<HTMLDivElement>
  overlayTriggerProps: HTMLAttributes<HTMLDivElement>
  title?: ReactNode | string
}

// A distinct component (rather than inline JSX from the `Transition` render prop) so
// `useDialog`'s own mount-focus effect — which only fires on this component's mount, not on
// `overlayRef.current` merely becoming non-null — actually runs each time the popover opens.
// `Transition`'s `unmountOnExit` genuinely unmounts and remounts this component on every
// open, giving `useDialog` a fresh mount each time.
const PopoverPanel = ({
  arrowProps,
  content,
  overlayRef,
  overlayTriggerProps,
  title,
  ...rest
}: PopoverPanelProps) => {
  const { dialogProps, titleProps } = useDialog({}, overlayRef)

  return (
    <div {...mergeProps(overlayTriggerProps, dialogProps, rest)} ref={overlayRef}>
      <div className="popover-arrow" {...arrowProps} style={getOverlayArrowStyle(arrowProps)}></div>
      {title && (
        <div className="popover-header" {...titleProps}>
          {title}
        </div>
      )}
      <div className="popover-body">{content}</div>
    </div>
  )
}

export interface PopoverProps extends Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby'
> {
  children: ReactElement
  /**
   * Content node for your component.
   */
  content: ReactNode | string
  /**
   * Offset of the popover relative to its target, as `[crossAxis, mainAxis]`.
   */
  offset?: [number, number]
  /**
   * Callback fired when the component requests to be hidden.
   */
  onHide?: () => void
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void
  /**
   * Title node for your component.
   */
  title?: ReactNode | string
  /**
   * Describes the preferred placement of your component. Chassis will flip it to keep it in
   * view.
   */
  placement?: Placement
  /**
   * Toggle the visibility of popover component.
   */
  visible?: boolean
}

export const Popover: FC<PopoverProps> = ({
  children,
  content,
  placement = 'right',
  offset: offsetProp = [0, 8],
  onHide,
  onShow,
  title,
  visible,
  ...rest
}) => {
  const arrowRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  const state = useOverlayTriggerState({ defaultOpen: !!visible })
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    triggerProps: { onPress: _onPress, ...triggerProps },
    overlayProps: overlayTriggerProps
  } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef)

  const portalContainer = useFloatingOverlay({
    close: state.close,
    isOpen: state.isOpen,
    open: state.open,
    onHide,
    onShow,
    triggerRef,
    visible
  })

  // Escape should always close the popover, regardless of where focus currently is — a
  // mouse-opened popover leaves focus on the trigger, not inside the panel. Mirrors
  // `Menu.tsx`'s own window-level Escape handling. `onExited` below already returns focus to the
  // trigger once the exit transition finishes, so this doesn't need to do that itself.
  useEffect(() => {
    if (!state.isOpen) return undefined

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      state.close()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, state.close])

  // Deferred so the click that opened the popover doesn't immediately close it again — mirrors
  // `Menu.tsx`'s own outside-click handling.
  useEffect(() => {
    if (!state.isOpen) return undefined

    const handleDismiss = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      if (floatingRef.current?.contains(target)) return
      state.close()
    }

    const id = window.setTimeout(() => {
      window.addEventListener('click', handleDismiss)
    })

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('click', handleDismiss)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, state.close])

  const {
    overlayProps,
    arrowProps,
    placement: resolvedPlacement
  } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: floatingRef,
    placement: toAriaPlacement(placement),
    offset: offsetProp[1],
    crossOffset: offsetProp[0],
    arrowSize: 8,
    arrowRef,
    isOpen: state.isOpen,
    // `useOverlayPosition` closes on any window scroll via a backward-compat `WeakMap` that
    // `useOverlayTrigger` populates for `triggerRef.current` above. Passing `null` opts out so
    // the popover repositions with its trigger instead of vanishing — matching
    // `Autocomplete`/`Combobox`, neither of which is wired into that map.
    onClose: null
  })

  const floatingStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement(placement, resolvedPlacement)

  return (
    <>
      {React.cloneElement(children, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node
        },
        ...triggerProps,
        onClick: (event: React.MouseEvent) => {
          children.props.onClick?.(event)
          state.toggle()
        }
      })}
      {typeof window !== 'undefined' &&
        createPortal(
          <Transition
            in={state.isOpen}
            mountOnEnter
            nodeRef={floatingRef}
            onExited={() => {
              const trigger = triggerRef.current
              if (trigger && document.contains(trigger)) {
                trigger.focus()
              }
            }}
            timeout={{
              enter: 0,
              exit: 200
            }}
            unmountOnExit
          >
            {(transitionState) => {
              const transitionClass = getOverlayTransitionClass(transitionState)
              return (
                <PopoverPanel
                  className={classNames('popover cx-popover-auto', transitionClass)}
                  data-cx-placement={placementAttr}
                  style={floatingStyle}
                  overlayTriggerProps={overlayTriggerProps}
                  overlayRef={floatingRef}
                  arrowProps={arrowProps}
                  title={title}
                  content={content}
                  {...rest}
                />
              )
            }}
          </Transition>,
          portalContainer ?? document.body
        )}
    </>
  )
}

Popover.displayName = 'Popover'
