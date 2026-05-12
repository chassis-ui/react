import React, { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../utils/hooks'
import { Colors, Shapes } from '../Types'

import { CxFormLabel } from './CxFormLabel'

export type ButtonObject = {
  /**
   * Sets the context context of the component to one of Bootstrap React’s themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context?: Colors
  /**
   * Select the shape of the component.
   *
   * @type 'rounded' | 'rounded-top' | 'rounded-end' | 'rounded-bottom' | 'rounded-start' | 'rounded-circle' | 'rounded-pill' | 'rounded-0' | 'rounded-1' | 'rounded-2' | 'rounded-3' | string
   */
  shape?: Shapes
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set the button variant to an outlined button or a ghost button.
   */
  variant?: 'outline' | 'ghost'
}

export interface CFormCheckProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Create button-like checkboxes and radio buttons.
   */
  button?: ButtonObject
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets hit area to the full area of the component.
   */
  hitArea?: 'full'
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * Input Checkbox indeterminate Property.
   */
  indeterminate?: boolean
  /**
   * Group checkboxes or radios on the same horizontal row by adding.
   */
  inline?: boolean
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * The element represents a caption for a component.
   */
  label?: string | ReactNode
  /**
   * Specifies the type of component.
   */
  type?: 'checkbox' | 'radio'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
}

export const CxFormCheck = forwardRef<HTMLInputElement, CFormCheckProps>(
  (
    {
      className,
      button,
      hitArea,
      id,
      indeterminate,
      inline,
      invalid,
      label,
      type = 'checkbox',
      valid,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    useEffect(() => {
      if (inputRef.current && indeterminate) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    const _className = classNames(
      'form-check',
      {
        'form-check-inline': inline,
        'is-invalid': invalid,
        'is-valid': valid,
      },
      className,
    )

    const inputClassName = classNames(button ? 'button-check' : 'check-input', {
      'is-invalid': invalid,
      'is-valid': valid,
      'me-2': hitArea,
    })
    const labelClassName = classNames(
      button
        ? classNames('button', button.context, button.variant, button.size, button.shape)
        : 'check-label',
    )

    const formControl = () => {
      return <input type={type} className={inputClassName} id={id} {...rest} ref={forkedRef} />
    }

    const formLabel = () => {
      return (
        <CxFormLabel customClassName={labelClassName} {...(id && { htmlFor: id })}>
          {label}
        </CxFormLabel>
      )
    }

    return button ? (
      <>
        {formControl()}
        {label && formLabel()}
      </>
    ) : label ? (
      hitArea ? (
        <CxFormLabel customClassName={className} {...(id && { htmlFor: id })}>
          {formControl()}
          {label}
        </CxFormLabel>
      ) : (
        <div className={_className}>
          {formControl()}
          {formLabel()}
        </div>
      )
    ) : (
      formControl()
    )
  },
)

CxFormCheck.displayName = 'CxFormCheck'
