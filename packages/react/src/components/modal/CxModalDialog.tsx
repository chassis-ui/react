import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CModalDialogProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Align the modal in the center or top of the screen.
   */
  alignment?: 'top' | 'center'
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Set modal to covers the entire user viewport.
   */
  fullscreen?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'
  /**
   * Does the modal dialog itself scroll, or does the whole dialog scroll within the window.
   */
  scrollable?: boolean
  /**
   * Size the component small, large, or extra large.
   */
  size?: 'small' | 'large' | 'xlarge'
}

export const CxModalDialog = forwardRef<HTMLDivElement, CModalDialogProps>(
  ({ children, alignment, className, fullscreen, scrollable, size, ...rest }, ref) => {
    const _className = classNames(
      'modal-dialog',
      {
        'modal-dialog-centered': alignment === 'center',
        [typeof fullscreen === 'boolean'
          ? 'modal-fullscreen'
          : `${fullscreen}:modal-fullscreen-down`]: fullscreen,
        'modal-dialog-scrollable': scrollable,
        [`modal-${size}`]: size,
      },
      className,
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxModalDialog.propTypes = {
  alignment: PropTypes.oneOf(['top', 'center']),
  children: PropTypes.node,
  className: PropTypes.string,
  fullscreen: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>(['small', 'medium', 'large', 'xlarge', '2xlarge']),
  ]),
  scrollable: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large', 'xlarge']),
}

CxModalDialog.displayName = 'CxModalDialog'
