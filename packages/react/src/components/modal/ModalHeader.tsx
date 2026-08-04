import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import { ModalContext } from './Modal'
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
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, closeButton = true, ...rest }, ref) => {
    const { requestClose } = useContext(ModalContext)
    const _className = classNames('modal-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CloseButton onClick={() => requestClose?.()} />}
      </div>
    )
  }
)

ModalHeader.displayName = 'ModalHeader'
