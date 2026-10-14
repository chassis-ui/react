import { RefObject, useContext, useEffect, useRef, useState } from 'react'

import { FormValidatedContext } from '../components/form/context'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export interface UseHeldBackOptions {
  /**
   * Whether to listen at all. `false` for a field with nothing a form would validate: a value
   * input that is `type="hidden"` until the field is required.
   */
  enabled?: boolean
  /**
   * Moves focus into the field once a form is held back and this control is its first invalid
   * one, and cancels the event: for a control that isn't displayed, which a browser can neither
   * focus nor show a message on. Omit it where react-aria's own listener does both already,
   * which is every control one of its hooks was given.
   */
  focus?: () => void
  /**
   * The caller's `invalid`. Once it is set, to `false` too, the caller decides how the field
   * looks: it is never shown as held back, nor by its form's `validated`.
   */
  invalid?: boolean
  /**
   * The caller's `valid`. While it is `true`, the caller decides how the field looks, as it does
   * once `invalid` is set.
   */
  valid?: boolean
}

export interface UseHeldBackResult {
  /**
   * `true` from a submit the field held back until it would no longer hold one back, or its form
   * is reset.
   */
  heldBack: boolean
  /**
   * What the field shows as invalid: the caller's `invalid` where it is set, `true` while
   * `heldBack` or while its form is `validated` and it would hold the form back.
   */
  invalid: boolean | undefined
  /**
   * What the field shows as valid: the caller's `valid`, or `true` while its form is `validated`
   * and it would let the form submit. Unless the caller decides how the field looks.
   */
  valid: boolean | undefined
}

interface Listening {
  form: HTMLFormElement | null
  stop: () => void
  target: HTMLElement
}

// By its tag and not by a `validity` property: a `<fieldset>` has one too, and validates nothing.
const CONTROLS = 'input, select, textarea'
const isControl = (element: HTMLElement): element is Control => element.matches(CONTROLS)

// The controls a form validates under `target`: itself, or the inputs inside a group.
const controlsOf = (target: HTMLElement): Control[] =>
  isControl(target) ? [target] : Array.from(target.querySelectorAll<Control>(CONTROLS))

const holdsBack = (control: Control) => control.willValidate && !control.validity.valid

type Validity = 'invalid' | 'none' | 'valid'

// What a form would make of the controls under `target`. `none` when it validates none of them:
// a disabled control, a `type="hidden"` one, or a group with no control.
const validityOf = (target: HTMLElement | null): Validity => {
  const controls = target ? controlsOf(target).filter((control) => control.willValidate) : []
  if (controls.length === 0) return 'none'
  return controls.some(holdsBack) ? 'invalid' : 'valid'
}

const firstInvalidControl = (form: HTMLFormElement) =>
  Array.from(form.elements).find(
    (control) => (control as HTMLInputElement).validity?.valid === false
  )

// A field that held its form back from submitting shows as invalid until it no longer would.
//
// A form with an invalid control isn't submitted, and the browser says why in a message beside
// the first such control. react-aria cancels that message for every control its hooks are given
// (`useFormValidation` calls `preventDefault()` on the `invalid` event, whatever
// `validationBehavior` is) and focuses the control instead, and a control that isn't displayed
// has no message to begin with. Either way the form stayed and nothing said why. A native control
// no hook is given keeps the browser's message, on the first invalid one alone: the others, and
// it once the message has gone, looked as they did before the submit. So the field
// reads the `invalid` event itself and shows it as it shows the `invalid` prop: the class, the
// ARIA state and the caller's `invalidFeedback`. react-stately's `displayValidation` doesn't
// have it: it stays empty unless the whole field is under `validationBehavior: 'native'`, which
// also moves every other validation to blur.
//
// A `Form` with `validated` shows each of its fields by the same test from then on, with no
// submit, and as valid once it would let the form submit (FORMS.md, gotcha 10).
// chassis-css's own gate, `[data-cx-validate]` with `:user-valid`/`:user-invalid`, styles the
// control alone, never the feedback the field renders, and wins over the class the caller's
// `invalid` or `valid` sets.
//
// `ref` is the control, or the element around several: the fieldset of a group, the boxes of a
// code. The event doesn't bubble, so a group hears its controls in the capture phase.
export const useHeldBack = (
  ref: RefObject<HTMLElement | null>,
  { enabled = true, focus, invalid, valid }: UseHeldBackOptions
): UseHeldBackResult => {
  const validated = useContext(FormValidatedContext)
  const validatedRef = useRef(validated)
  validatedRef.current = validated
  const [blocked, setBlocked] = useState(false)
  // Read only while the form is `validated`.
  const [validity, setValidity] = useState<Validity>('none')
  const focusRef = useRef(focus)
  focusRef.current = focus
  const listening = useRef<Listening | null>(null)

  // Runs after every render and listens again only when the target is another element (an
  // `Autocomplete` that turns `multiple`) or belongs to another form (`form`). The listeners
  // stay the same ones otherwise: a browser runs the render a listener asked for before it calls
  // the next listener of the same event, and one removed and added again by that render is not
  // called at all. A `reset` after react-aria's own listener, or after the other input's of a
  // `DateRangePicker`, was lost that way.
  useEffect(() => {
    const target = enabled ? ref.current : null
    const form = target
      ? ((isControl(target) ? target : controlsOf(target)[0])?.form ?? target.closest('form'))
      : null
    const current = listening.current
    if (current?.target === target && current?.form === form) return
    current?.stop()
    listening.current = null
    if (!target) return

    // `checkValidity()` and `reportValidity()` fire it too, as a submit does.
    const onInvalid = (event: Event) => {
      setBlocked(true)
      if (!focusRef.current) return
      if (!event.defaultPrevented && form && firstInvalidControl(form) === event.target) {
        focusRef.current()
      }
      // Cancelled, as react-aria cancels it: the browser has nothing to show for a control that
      // isn't displayed, and Chromium logs an error for an invalid control it can't focus.
      event.preventDefault()
    }
    const onReset = () => setBlocked(false)
    // A native control that keeps its own value (a `Select` with no `value`, a `FileInput`)
    // changes with no render to follow, and the effect below would never look again.
    //
    // Heard on the window, after React's own listener on its root. For a real keystroke the
    // browser runs the render a listener asks for before the next listener: a render asked for
    // on the control itself ran before React had read the edit, wrote the old value back, and an
    // empty field lost the first character typed into it.
    const view = target.ownerDocument.defaultView
    const onEdit = (event: Event) => {
      if (!(event.target instanceof Node) || !target.contains(event.target)) return
      const next = validityOf(target)
      if (next !== 'invalid') setBlocked(false)
      if (validatedRef.current) setValidity(next)
    }
    const capture = !isControl(target)

    target.addEventListener('invalid', onInvalid, capture)
    view?.addEventListener('input', onEdit)
    view?.addEventListener('change', onEdit)
    form?.addEventListener('reset', onReset)
    listening.current = {
      form,
      stop: () => {
        target.removeEventListener('invalid', onInvalid, capture)
        view?.removeEventListener('input', onEdit)
        view?.removeEventListener('change', onEdit)
        form?.removeEventListener('reset', onReset)
      },
      target
    }
  })
  useEffect(
    () => () => {
      listening.current?.stop()
      listening.current = null
    },
    []
  )

  // The mark lasts while the field would still hold the form back. Read after each render, where
  // its controls have the values just rendered, and before the paint: the field never shows a
  // value and the mark together. A control that has gone, is disabled or is no longer invalid
  // doesn't hold anything back either.
  // A `validated` form's field is read at the same point, for the same reason.
  useIsomorphicLayoutEffect(() => {
    if (!blocked && !validated) return
    const next = validityOf(enabled ? ref.current : null)
    if (next !== 'invalid') setBlocked(false)
    if (validated) setValidity(next)
  })

  const decided = invalid !== undefined || Boolean(valid)
  const heldBack = blocked && !decided
  const shown = validated && !decided ? validity : 'none'
  return {
    heldBack,
    invalid: invalid ?? (heldBack || shown === 'invalid' || undefined),
    valid: valid || shown === 'valid' || undefined
  }
}
