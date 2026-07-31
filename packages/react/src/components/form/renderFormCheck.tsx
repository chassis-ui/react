import React, { ReactNode } from 'react'
import classNames from 'classnames'

import { ContextColor, Shapes } from '../Types'

import { CxFormLabel } from './CxFormLabel'

export type ButtonObject = {
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Select the shape of the component.
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

export interface RenderFormCheckOptions {
  button?: ButtonObject
  className?: string
  color?: ContextColor
  input: ReactNode
  invalid?: boolean
  label?: ReactNode
  size?: 'small' | 'large'
  valid?: boolean
}

// Shared nested, modern `.form-check`/`.check-input` markup for CxCheckbox and CxRadio —
// see https://chassis-ui.com/css/docs/forms/checkbox-radio/#modern-inputs. Everything renders
// nested inside a single <label> (or a bare <span class="check-input"> when there's no label);
// there is no sibling/`for`-linked layout.
export const renderFormCheck = ({
  button,
  className,
  color,
  input,
  invalid,
  label,
  size,
  valid
}: RenderFormCheckOptions) => {
  if (button) {
    const _className = classNames(
      'button',
      'button-check',
      button.color,
      button.variant,
      button.size,
      button.shape,
      className
    )
    return (
      <CxFormLabel customClassName={_className}>
        {input}
        {label}
      </CxFormLabel>
    )
  }

  const checkInputClassName = classNames('check-input', color, {
    'is-invalid': invalid,
    'is-valid': valid
  })

  if (!label) {
    return <span className={checkInputClassName}>{input}</span>
  }

  const _className = classNames(
    'form-check',
    size,
    {
      'is-invalid': invalid,
      'is-valid': valid
    },
    className
  )

  return (
    <CxFormLabel customClassName={_className}>
      <span className={checkInputClassName}>{input}</span>
      {label}
    </CxFormLabel>
  )
}
