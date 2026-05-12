import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CxFormLabel } from './CxFormLabel'

export interface CFormSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * The element represents a caption for a component.
   */
  label?: string | ReactNode
  /**
   * Size the component large or extra large. Works only with `switch` [docs]
   */
  size?: 'large' | 'xlarge'
  /**
   * Specifies the type of component.
   */
  type?: 'checkbox' | 'radio'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
}

export const CxFormSwitch = forwardRef<HTMLInputElement, CFormSwitchProps>(
  ({ className, id, invalid, label, size, type = 'checkbox', valid, ...rest }, ref) => {
    const _className = classNames(
      'form-check form-switch',
      {
        [`form-switch-${size}`]: size,
        'is-invalid': invalid,
        'is-valid': valid,
      },
      className,
    )

    const inputClassName = classNames('form-check-input', {
      'is-invalid': invalid,
      'is-valid': valid,
    })
    const labelClassName = classNames('form-check-label')

    return (
      <div className={_className}>
        <input type={type} className={inputClassName} id={id} {...rest} ref={ref} />
        {label && (
          <CxFormLabel customClassName={labelClassName} {...(id && { htmlFor: id })}>
            {label}
          </CxFormLabel>
        )}
      </div>
    )
  },
)

CxFormSwitch.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  size: PropTypes.oneOf(['large', 'xlarge']),
  type: PropTypes.oneOf(['checkbox', 'radio']),
  valid: PropTypes.bool,
}

CxFormSwitch.displayName = 'CxFormSwitch'
