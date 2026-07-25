import React, { forwardRef, HTMLAttributes, useRef } from 'react'
import { Transition } from 'react-transition-group'
import classNames from 'classnames'

import { useForkedRef } from '../../utils/hooks'

export interface CxBackdropProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Toggle the visibility of modal component.
   */
  visible?: boolean
}

export const CxBackdrop = forwardRef<HTMLDivElement, CxBackdropProps>(
  ({ className = 'modal-backdrop', visible, ...rest }, ref) => {
    const nodeRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, nodeRef)
    const _className = classNames(className, 'fade')

    const getTransitionClass = (state: string) => {
      return state === 'entered' && 'show'
    }

    return (
      <Transition in={visible} mountOnEnter nodeRef={nodeRef} timeout={150} unmountOnExit>
        {(state) => {
          const transitionClass = getTransitionClass(state)
          return (
            <div className={classNames(_className, transitionClass)} {...rest} ref={forkedRef} />
          )
        }}
      </Transition>
    )
  },
)

CxBackdrop.displayName = 'CxBackdrop'
