import React, {
  FC,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { mergeProps, useDialog, useOverlayPosition, useOverlayTrigger } from 'react-aria'
import { useOverlayTriggerState } from 'react-stately'
import { Transition } from 'react-transition-group'

import { Placement } from '../tooltip/CxTooltip'
import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'

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
      <div className="popover-arrow" {...arrowProps}></div>
      {title && (
        <div className="popover-header" {...titleProps}>
          {title}
        </div>
      )}
      <div className="popover-body">{content}</div>
    </div>
  )
}

export interface CxPopoverProps {
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

export const CxPopover: FC<CxPopoverProps> = ({
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
  const [portalContainer, setPortalContainer] = useState<Element | null>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  const state = useOverlayTriggerState({ defaultOpen: !!visible })
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    triggerProps: { onPress: _onPress, ...triggerProps },
    overlayProps: overlayTriggerProps
  } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef)

  // Popovers inside an open `<dialog>` are appended to that dialog instead of
  // `document.body`, so they render in its top layer and close with it automatically.
  const resolvePortalContainer = () => triggerRef.current?.closest('dialog[open]') ?? document.body

  // Sync-on-change, not strictly controlled — matches `CxMenu`/`CxTooltip`'s `visible` semantics.
  useEffect(() => {
    if (visible === undefined) return
    setPortalContainer(resolvePortalContainer())
    if (visible) state.open()
    else state.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (state.isOpen) {
      setPortalContainer(resolvePortalContainer())
      onShow?.()
    } else {
      onHide?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  // A dialog fires a native `close` event on ESC, backdrop click, or `.close()`, so
  // resetting on it keeps a reopened dialog from showing a stale, already-open popover.
  useEffect(() => {
    const dialog = portalContainer?.closest('dialog')
    if (!state.isOpen || !dialog) return

    dialog.addEventListener('close', state.close)
    return () => dialog.removeEventListener('close', state.close)
  }, [state.isOpen, portalContainer, state.close])

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
    isOpen: state.isOpen
  })

  const floatingStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement(placement, resolvedPlacement)

  const getTransitionClass = (transitionState: string) => {
    return transitionState === 'entering'
      ? 'fade'
      : transitionState === 'entered'
        ? 'fade show'
        : transitionState === 'exiting'
          ? 'fade'
          : 'fade'
  }

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
            timeout={{
              enter: 0,
              exit: 200
            }}
            unmountOnExit
          >
            {(transitionState) => {
              const transitionClass = getTransitionClass(transitionState)
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

CxPopover.displayName = 'CxPopover'
