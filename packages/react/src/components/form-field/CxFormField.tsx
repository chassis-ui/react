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

// Standalone `.form-field` wrapper for the "wrap this yourself" case — components that don't
// (yet) generate their own ids and wire label/help/feedback internally, e.g. CxCombobox,
// CxDatepicker, CxChipInput, CxOtpInput (see the field-capable leaves for the alternative,
// where label/help/validFeedback/invalidFeedback are set directly on the input component).
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
