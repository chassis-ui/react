import React, { forwardRef, HTMLAttributes, useRef, useState } from 'react'
import classNames from 'classnames'

import { TransitionPhase, useForkedRef, useTransitionState } from '../../hooks'

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Set horizontal collapsing to transition the width instead of height.
   */
  horizontal?: boolean
  /**
   * Callback fired when the component requests to be hidden.
   */
  onHide?: () => void
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void
  /**
   * Toggle the visibility of component.
   */
  visible?: boolean
}

const getTransitionClass = (phase: TransitionPhase) =>
  phase === 'entering' || phase === 'exiting'
    ? 'collapsing'
    : phase === 'entered'
      ? 'collapse show'
      : 'collapse'

// chassis-css animates the size itself and needs both ends of it as lengths: `.collapsing` is 0,
// and the content's own size is `auto`, which a transition can't start from or end at. So the
// open end is measured and set inline for as long as the transition runs, the way chassis-css's
// own collapse plugin does it.
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  ({ children, className, horizontal, onHide, onShow, style, visible, ...rest }, ref) => {
    const [size, setSize] = useState<number>()
    const collapseRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, collapseRef)
    const dimension = horizontal ? 'width' : 'height'

    const { phase } = useTransitionState({
      in: !!visible,
      nodeRef: collapseRef,
      // Reading the content's size also computes the 0 of `.collapsing`, which the transition
      // starts from.
      onEntering: () => {
        onShow?.()
        const node = collapseRef.current
        if (node) setSize(horizontal ? node.scrollWidth : node.scrollHeight)
      },
      onEntered: () => setSize(undefined),
      // Still open here: pin the size it has, as a length.
      onExit: () => {
        const node = collapseRef.current
        if (node) setSize(node.getBoundingClientRect()[dimension])
      },
      // Pinned and `.collapsing` now. Compute that, then let go, and it shrinks to 0.
      onExiting: () => {
        onHide?.()
        void collapseRef.current?.offsetHeight
        setSize(undefined)
      },
      onExited: () => setSize(undefined)
    })

    return (
      <div
        className={classNames(
          { 'collapse-horizontal': horizontal },
          className,
          getTransitionClass(phase)
        )}
        style={size ? { ...style, [dimension]: size } : style}
        {...rest}
        ref={forkedRef}
      >
        {children}
      </div>
    )
  }
)

Collapse.displayName = 'Collapse'
