import React, { forwardRef, HTMLAttributes } from 'react'
import { useModal } from '../../hooks'
import { CloseButton } from '../close-button/CloseButton'
import classNames from 'classnames'

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, closeButton = true, closeLabel, ...rest }, ref) => {
    const { close } = useModal()
    const _className = classNames('modal-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CloseButton label={closeLabel} onClick={close} />}
      </div>
    )
  }
)

ModalHeader.displayName = 'ModalHeader'
