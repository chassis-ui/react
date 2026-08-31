import { ReactNode, useId } from 'react'

export interface UseFormFieldOptions {
  /**
   * A caller-supplied `aria-describedby` to merge in alongside the generated help/feedback ids
   * (e.g. `rest['aria-describedby']`).
   */
  ariaDescribedBy?: string
  /**
   * A caller-supplied `aria-labelledby` to merge in alongside `labelId` (e.g.
   * `rest['aria-labelledby']`). Relevant for the `role="group"` shape and for any single-input
   * component backed by a react-aria hook — see `labelledBy`.
   */
  ariaLabelledBy?: string
  help?: ReactNode
  id?: string
  invalid?: boolean
  invalidFeedback?: ReactNode
  label?: ReactNode
  valid?: boolean
  validFeedback?: ReactNode
}

export interface UseFormFieldResult {
  /**
   * Merged `aria-describedby` value (help id + feedback id, if shown + `ariaDescribedBy`), or
   * `undefined` when none apply. Safe to spread straight onto the real control:
   * `aria-describedby={describedBy}`.
   */
  describedBy?: string
  feedbackId: string
  helpId: string
  /**
   * Id for the one real focusable control — pair with `<FormLabel htmlFor={inputId}>` (via
   * `ids.input`). Ignore this and use `labelId`/`labelledBy` instead for a `role="group"` wrapper
   * with no single input to target — see FORMS.md's "`htmlFor` vs `aria-labelledby`" section.
   */
  inputId: string
  /**
   * This field's own label id, for a control to reference via its own `aria-labelledby` (via
   * `ids.label`) instead of `htmlFor`.
   */
  labelId: string
  /**
   * Merged `aria-labelledby` value (`labelId`, only when `label` is set + `ariaLabelledBy`), or
   * `undefined` when neither applies. Feed this into the underlying react-aria hook's own
   * `aria-labelledby` (in addition to any `htmlFor`-based association) so its own dev-mode
   * "no accessible label" warning knows about a visible `label` it can't otherwise see.
   */
  labelledBy?: string
}

// Shared id-generation and aria-describedby/aria-labelledby merge logic behind every
// renderFormField-based component (see FORMS.md's "The two engines" section). Every id is
// generated with React's own useId(), not react-aria's — see FORMS.md for why that's deliberate.
//
// If you spread the result of a react-aria hook via mergeProps(hookProps, rest) instead of
// directly onto the control, re-apply `describedBy`/`labelledBy` as explicit props *after* that
// spread — mergeProps lets the later argument win, so rest's raw (un-merged) aria-describedby/
// aria-labelledby can silently overwrite these otherwise. See FORMS.md gotcha #4.
export const useFormField = ({
  ariaDescribedBy,
  ariaLabelledBy,
  help,
  id,
  invalid,
  invalidFeedback,
  label,
  valid,
  validFeedback
}: UseFormFieldOptions): UseFormFieldResult => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const labelId = `${generatedId}-label`
  const helpId = `${generatedId}-help`
  const feedbackId = `${generatedId}-feedback`

  const showInvalidFeedback = invalid && invalidFeedback
  const showValidFeedback = valid && validFeedback

  const describedBy =
    [help && helpId, (showInvalidFeedback || showValidFeedback) && feedbackId, ariaDescribedBy]
      .filter(Boolean)
      .join(' ') || undefined

  const labelledBy = [label && labelId, ariaLabelledBy].filter(Boolean).join(' ') || undefined

  return { describedBy, feedbackId, helpId, inputId, labelId, labelledBy }
}
