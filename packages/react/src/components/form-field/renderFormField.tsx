import React, { ReactNode } from 'react'
import classNames from 'classnames'

import { CxFormFeedback } from '../form/CxFormFeedback'
import { CxFormHelp } from '../form/CxFormHelp'
import { CxFormLabel } from '../form/CxFormLabel'

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
}: RenderFormFieldOptions) => {
  const showInvalidFeedback = invalid && invalidFeedback
  const showValidFeedback = valid && validFeedback

  if (!label && !help && !showInvalidFeedback && !showValidFeedback) {
    return children
  }

  return (
    <div className={classNames('form-field', className)}>
      {label && (
        <CxFormLabel htmlFor={ids.input} id={ids.label}>
          {label}
        </CxFormLabel>
      )}
      {children}
      {help && <CxFormHelp id={ids.help}>{help}</CxFormHelp>}
      {showInvalidFeedback && (
        <CxFormFeedback id={ids.feedback} invalid>
          {invalidFeedback}
        </CxFormFeedback>
      )}
      {showValidFeedback && (
        <CxFormFeedback id={ids.feedback} valid>
          {validFeedback}
        </CxFormFeedback>
      )}
    </div>
  )
}
