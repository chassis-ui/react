import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import { CModalContext } from './CxModal'
import { CxCloseButton } from '../close-button/CxCloseButton'
import classNames from 'classnames'

export interface CxModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean
}

export const CxModalHeader = forwardRef<HTMLDivElement, CxModalHeaderProps>(
  ({ children, className, closeButton = true, ...rest }, ref) => {
    const { requestClose } = useContext(CModalContext)
    const _className = classNames('modal-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CxCloseButton onClick={() => requestClose?.()} />}
      </div>
    )
  },
)

CxModalHeader.displayName = 'CxModalHeader'
