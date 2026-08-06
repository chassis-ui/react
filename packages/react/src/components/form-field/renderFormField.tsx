import React, { ReactNode } from 'react'
import classNames from 'classnames'

import { FormFeedback } from '../form/FormFeedback'
import { FormHelp } from '../form/FormHelp'
import { FormLabel } from '../form/FormLabel'

export interface FormFieldIds {
  feedback?: string
  help?: string
  input?: string
  /**
   * The label's own id, for controls with no single input to associate via `htmlFor` (e.g. a
   * multi-input group) — reference it from the control's own `aria-labelledby` instead.
   */
  label?: string
}

export interface RenderFormFieldOptions {
  children: ReactNode
  className?: string
  help?: ReactNode
  ids?: FormFieldIds
  invalid?: boolean
  invalidFeedback?: ReactNode
  label?: ReactNode
  valid?: boolean
  validFeedback?: ReactNode
}

// Shared `.form-field` grid wrapper for label/control/help/feedback — see
// https://chassis-ui.com/css/docs/forms/form-field. Renders `children` bare when none of
// label/help/validFeedback/invalidFeedback are set, so field-capable leaves stay drop-in
// compatible until a consumer opts into the wrapping.
export const renderFormField = ({
  children,
  className,
  help,
  ids = {},
  invalid,
  invalidFeedback,
  label,
  valid,
  validFeedback
}: RenderFormFieldOptions): ReactNode => {
  const showInvalidFeedback = invalid && invalidFeedback
  const showValidFeedback = valid && validFeedback

  if (!label && !help && !showInvalidFeedback && !showValidFeedback) {
    return children
  }

  return (
    <div className={classNames('form-field', className)}>
      {label && (
        <FormLabel htmlFor={ids.input} id={ids.label}>
          {label}
        </FormLabel>
      )}
      {children}
      {help && <FormHelp id={ids.help}>{help}</FormHelp>}
      {showInvalidFeedback && (
        <FormFeedback id={ids.feedback} invalid>
          {invalidFeedback}
        </FormFeedback>
      )}
      {showValidFeedback && (
        <FormFeedback id={ids.feedback} valid>
          {validFeedback}
        </FormFeedback>
      )}
    </div>
  )
}
