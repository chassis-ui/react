import { RefObject } from 'react'

import { useHeldBack } from './useHeldBack'

// What makes the input that carries a field's value hold its form back. `type="hidden"` is barred
// from constraint validation, so it is a text input that isn't displayed, the one react-aria
// renders under `validationBehavior: 'native'`. `onChange` because React takes an input with a
// `value` and no handler for a mistake; nobody types in this one.
const REQUIRED_INPUT_PROPS = {
  hidden: true,
  onChange: () => undefined,
  required: true,
  type: 'text'
} as const

export interface UseRequiredValueInputOptions {
  /**
   * Moves focus into the field once a form is held back and this input is its first invalid
   * control, which a browser does itself for an input it displays. Omit it where something else
   * does already: react-aria's own listener on the input of a `TimeField`.
   */
  focus?: () => void
  /**
   * The caller's `invalid`. Once it is set, to `false` too, the caller decides how the field
   * looks and `missing` stays `false`.
   */
  invalid?: boolean
  /**
   * Whether the field is required and can be filled in: not read-only, since an input in that
   * state isn't validated. A disabled one isn't either, which its `disabled` attribute says.
   */
  required?: boolean
  /**
   * The caller's `valid`. While it is `true`, `missing` stays `false`.
   */
  valid?: boolean
}

export interface UseRequiredValueInputResult {
  /**
   * Spread onto the value input after its own props, `type` included, while the field is
   * required. `undefined` otherwise, which leaves the input as it is.
   */
  inputProps?: typeof REQUIRED_INPUT_PROPS
  /**
   * `true` from a submit this input held back until the field has a value, or its form is reset.
   * Show the field as invalid while it is.
   */
  missing: boolean
}

// `required` for a field whose value isn't in a native input a form validates (FORMS.md, gotcha
// 9): the segments of a date or a time, a toggle that opens a list. The field renders the input
// that carries its value with `inputProps`, and an empty one then holds its form back.
//
// The browser has no bubble to show on an input that isn't displayed, so nothing told the user
// why the form stayed. `missing` does (`useHeldBack`): the field shows it as it shows `invalid`,
// with the caller's `invalidFeedback`, and `focus` puts the user in the field.
export const useRequiredValueInput = (
  inputRef: RefObject<HTMLInputElement | null>,
  { focus, invalid, required, valid }: UseRequiredValueInputOptions
): UseRequiredValueInputResult => {
  const { heldBack } = useHeldBack(inputRef, {
    enabled: Boolean(required),
    focus,
    invalid,
    valid
  })

  return {
    inputProps: required ? REQUIRED_INPUT_PROPS : undefined,
    missing: heldBack
  }
}
