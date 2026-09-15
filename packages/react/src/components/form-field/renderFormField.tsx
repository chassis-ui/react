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
  // At most one feedback node renders, and `invalid` wins: both carry the same `ids.feedback`,
  // so rendering the pair (which `invalid` + `valid` set together used to do) put a duplicate id
  // in the DOM and left every control's `aria-describedby` pointing at an ambiguous target —
  // axe's `duplicate-id-aria`. `useFormField` only ever budgets one feedback id for the same
  // reason. Contradictory state, but nothing in the types rules it out and ten components route
  // through here.
  const showInvalidFeedback = Boolean(invalid && invalidFeedback)
  const showValidFeedback = Boolean(valid && validFeedback) && !showInvalidFeedback

  // `className` alone is enough to warrant the wrapper: it has nowhere else to land, and
  // returning `children` bare (the drop-in-compatibility path every field-capable leaf relies on
  // until a consumer opts into wrapping) silently dropped it. Only `FormField` — the standalone
  // "wrap this yourself" component — passes one, so this is exactly the case where the caller
  // asked for a `.form-field` element by hand.
  if (!label && !help && !showInvalidFeedback && !showValidFeedback && !className) {
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
