import React, { forwardRef, HTMLAttributes } from 'react'
import { Transition } from 'react-transition-group'
import classNames from 'classnames'

export interface CBackdropProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Toggle the visibility of modal component.
   */
  visible?: boolean
}

export const CxBackdrop = forwardRef<HTMLDivElement, CBackdropProps>(
  ({ className = 'modal-backdrop', visible, ...rest }, ref) => {
    const _className = classNames(className, 'fade')

    const getTransitionClass = (state: string) => {
      return state === 'entered' && 'show'
    }

    return (
      <Transition in={visible} mountOnEnter timeout={150} unmountOnExit>
        {(state) => {
          const transitionClass = getTransitionClass(state)
          return <div className={classNames(_className, transitionClass)} {...rest} ref={ref} />
        }}
      </Transition>
    )
  },
)

CxBackdrop.displayName = 'CxBackdrop'
