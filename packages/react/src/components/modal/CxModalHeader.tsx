import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import { CModalContext } from './CxModal'
import { CxCloseButton } from '../close-button/CxCloseButton'
import classNames from 'classnames'

export interface CModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean
}

export const CxModalHeader = forwardRef<HTMLDivElement, CModalHeaderProps>(
  ({ children, className, closeButton = true, ...rest }, ref) => {
    const { setVisible } = useContext(CModalContext)
    const _className = classNames('modal-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CxCloseButton onClick={() => setVisible(false)} />}
      </div>
    )
  },
)

CxModalHeader.displayName = 'CxModalHeader'
