import { ReactNode } from 'react'

import { FormFieldIds, renderFormField } from './renderFormField'

export interface CxFormFieldProps {
  /**
   * The form control(s) this field wraps.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * A description for the field, rendered below the control(s).
   */
  help?: ReactNode
  /**
   * The DOM ids of the wrapped control(s), used to associate the label (`htmlFor`) and
   * point your control's own `aria-describedby` at the rendered help/feedback text.
   */
  ids?: FormFieldIds
  /**
   * Set field validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the control(s) when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `CxFormLabel` associated with `ids.input`.
   */
  label?: ReactNode
  /**
   * Set field validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the control(s) when `valid` is set.
   */
  validFeedback?: ReactNode
}

// Standalone `.form-field` wrapper for the "wrap this yourself" case: a control with no field
// props of its own, or grouping more than one element under one label (e.g. an input plus a
// sibling status meter). CxCombobox/CxDatePicker/CxChipInput/CxOtpInput do NOT use this — they
// call `renderFormField` directly and expose label/help/validFeedback/invalidFeedback as their
// own props (see FORMS.md). Wrapping any of those 10 components in `CxFormField` produces a
// nested, empty `.form-field` div — see FORMS.md's Gotchas section.
export const CxFormField = ({
  children,
  className,
  help,
  ids,
  invalid,
  invalidFeedback,
  label,
  valid,
  validFeedback
}: CxFormFieldProps) =>
  renderFormField({
    children,
    className,
    help,
    ids,
    invalid,
    invalidFeedback,
    label,
    valid,
    validFeedback
  })

CxFormField.displayName = 'CxFormField'
