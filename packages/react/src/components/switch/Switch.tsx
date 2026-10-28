import React, {
  CSSProperties,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useRef
} from 'react'
import classNames from 'classnames'
import { AriaSwitchProps, useSwitch } from 'react-aria'
import { useToggleState } from 'react-stately'

import { useForkedRef, useHeldBack, useIsomorphicLayoutEffect } from '../../hooks'
import { ContextColor } from '../../types'
import { mergeUnhandledProps, TOGGLE_PROPS } from '../../utils/unhandledProps'
import { validationClassName } from '../../utils/validationClassName'

import { FormLabel } from '../form/FormLabel'

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'onChange' | 'size'
> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the switch indicator to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Whether the switch is selected, uncontrolled.
   */
  defaultSelected?: boolean
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * Set component validation state to invalid. Left unset, the component shows as invalid by itself
   * from a submit it held back (an empty `required` one, say) until it no longer would, or its
   * form is reset. Set it, to `false` too, and it alone decides.
   */
  invalid?: boolean
  /**
   * Whether the switch is selected, controlled.
   */
  isSelected?: boolean
  /**
   * The element represents a caption for a component.
   *
   * Children are accepted as an alias for this prop — `label` wins when both are given.
   * react-aria, which backs this component, calls the same thing `children`; this package renames
   * it to `label`, and honouring both means the shape React developers reach for first still
   * names the control instead of silently producing an unlabelled one.
   */
  label?: ReactNode
  /**
   * Callback fired when the selected state changes.
   */
  onChange?: (isSelected: boolean) => void
  /**
   * Toggle the read-only state: the control keeps its state, can still be focused, and says it
   * is read-only (`aria-readonly`).
   */
  readOnly?: boolean
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * `'radio'` makes the switch one of a group, as radios are: the switches of its `name` (in its
   * form) have one on at a time, a click doesn't turn the one that is on off, and `required` asks
   * for one of the group. It renders a checkbox with `role="switch"` either way.
   */
  type?: 'checkbox' | 'radio'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
}

type SwitchVariantProps = Omit<SwitchProps, 'type'>

interface RenderSwitchOptions {
  bareClassName: string
  checkInputClassName: string
  className: string
  input: ReactNode
  label?: ReactNode
  style?: CSSProperties
}

// Mirrors renderFormCheck's nested-label/bare-span shape — Switch inlines its own markup (see
// FORMS.md) rather than sharing that helper directly, since `role="switch"` placement didn't fit
// it cleanly. Keep this in sync with renderFormCheck by eye if either changes.
const renderSwitch = ({
  bareClassName,
  checkInputClassName,
  className,
  input,
  label,
  style
}: RenderSwitchOptions) => {
  if (!label) {
    return (
      <span className={bareClassName} style={style}>
        {input}
      </span>
    )
  }
  return (
    <FormLabel customClassName={className} style={style}>
      <span className={checkInputClassName}>{input}</span>
      {label}
    </FormLabel>
  )
}

interface RenderSwitchInputOptions {
  className?: string
  color?: ContextColor
  forkedRef: React.Ref<HTMLInputElement>
  id?: string
  inputProps: InputHTMLAttributes<HTMLInputElement>
  invalid?: boolean
  label?: ReactNode
  size?: 'sm' | 'lg'
  style?: CSSProperties
  valid?: boolean
}

// Shared className-building/markup for `SwitchCheckbox`/`SwitchRadio` — the two variants only
// differ in how `inputProps` gets built (a react-aria hook vs. a hand-wired input), everything
// after that is identical. `style` goes on the outermost element, as `className` does: the
// label, or the `.check-input` when there is no label.
const renderSwitchInput = ({
  className,
  color,
  forkedRef,
  id,
  inputProps,
  invalid,
  label,
  size,
  style,
  valid
}: RenderSwitchInputOptions) => {
  const inputClassName = classNames(validationClassName(invalid, valid))
  const checkInputClassName = classNames('check-input', color, validationClassName(invalid, valid))
  const _className = classNames(
    'form-check form-switch',
    size,
    validationClassName(invalid, valid),
    className
  )

  return renderSwitch({
    // With no label the `.check-input` is the outermost element, and takes the caller's
    // `className` as it takes `style`.
    bareClassName: classNames(checkInputClassName, className),
    checkInputClassName,
    className: _className,
    input: <input {...inputProps} className={inputClassName} id={id} ref={forkedRef} />,
    label,
    style
  })
}

// Checkbox-backed switch: a real toggle, so it goes through react-aria's useSwitch/useToggleState
// like Checkbox does. Split into its own component (rather than branching inside one Switch on
// `type`) so SwitchRadio below never has to call these hooks just to discard their result —
// calling them unconditionally and ignoring the output risked react-aria's own dev-mode warnings
// (e.g. its missing-accessible-name check) firing for state that was never actually rendered.
const SwitchCheckbox = forwardRef<HTMLInputElement, SwitchVariantProps>(
  (
    {
      className,
      children,
      color,
      defaultSelected,
      disabled,
      id,
      invalid: invalidProp,
      isSelected,
      label,
      onChange,
      readOnly,
      size,
      style,
      valid: validProp,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)
    // Shown as invalid from a submit it held back until it no longer would (`useHeldBack`):
    // react-aria cancels the browser's own message, and the form stayed with nothing to say why.
    const { invalid, valid } = useHeldBack(inputRef, { invalid: invalidProp, valid: validProp })
    // `label` is this package's name for what react-aria calls `children`. Accept either, so the
    // shape React developers reach for first names the control instead of vanishing.
    const resolvedLabel = label ?? children

    // `readOnly` goes to react-aria, as in `Checkbox`: a browser ignores the native attribute.
    const toggleState = useToggleState({
      defaultSelected,
      isDisabled: disabled,
      isReadOnly: readOnly,
      isSelected,
      onChange
    })

    const { inputProps: switchProps } = useSwitch(
      {
        ...rest,
        children: resolvedLabel,
        isDisabled: disabled,
        isInvalid: invalid,
        isReadOnly: readOnly,
        value: rest.value as string | undefined
      } as AriaSwitchProps,
      toggleState,
      inputRef
    )

    return renderSwitchInput({
      className,
      color,
      forkedRef,
      id,
      // `aria-describedby` over react-aria's own, which adds ids it never renders (FORMS.md,
      // gotcha 6).
      inputProps: {
        ...mergeUnhandledProps(switchProps, rest, TOGGLE_PROPS),
        'aria-describedby': rest['aria-describedby']
      },
      invalid,
      label: resolvedLabel,
      size,
      style,
      valid
    })
  }
)
SwitchCheckbox.displayName = 'SwitchCheckbox'

// `type="radio"`: switches of which one is on per `name`, as radios are, rendered as checkboxes.
// ARIA allows no role but `radio` on `<input type="radio">`, so `role="switch"` there failed
// axe's `aria-allowed-role`, and chassis-css styles a switch by `[role=switch]` alone. What the
// browser does for a radio group is done here: turning one on turns the others of its group off,
// a click doesn't turn the one that is on off, and `required` asks for one of the group, through
// a custom validity, as a checkbox's own `required` would ask for each. react-aria has no
// ungrouped radio hook (see Checkbox's own split), so the input stays hand-wired.
interface ExclusiveSwitch {
  controlled: boolean
  required: boolean
}

const exclusiveSwitches = new WeakMap<HTMLInputElement, ExclusiveSwitch>()

const MISSING_MESSAGE = 'Turn one of these on.'

// The switches of `input`'s group: its `name` in its form, or outside any form in its document,
// as a radio button group is.
const groupOf = (input: HTMLInputElement): HTMLInputElement[] => {
  if (!input.name) return [input]
  const candidates = input.form
    ? Array.from(input.form.elements)
    : Array.from((input.getRootNode() as ParentNode).querySelectorAll('input'))
  return candidates.filter(
    (element): element is HTMLInputElement =>
      element instanceof HTMLInputElement &&
      element.name === input.name &&
      element.form === input.form &&
      exclusiveSwitches.has(element)
  )
}

const syncGroupValidity = (input: HTMLInputElement) => {
  const group = groupOf(input)
  const missing =
    group.some((element) => exclusiveSwitches.get(element)?.required) &&
    !group.some((element) => element.checked)
  for (const element of group) element.setCustomValidity(missing ? MISSING_MESSAGE : '')
}

const SwitchRadio = forwardRef<HTMLInputElement, SwitchVariantProps>(
  (
    {
      children,
      className,
      color,
      defaultSelected,
      disabled,
      id,
      invalid: invalidProp,
      isSelected,
      label,
      onChange,
      readOnly,
      required,
      size,
      style,
      valid: validProp,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)
    // Shown as invalid from a submit it held back until it no longer would (`useHeldBack`). The
    // browser's own message stays: no react-aria hook is given this control to cancel it. It is
    // on the first invalid control of the form alone, and gone at the next click.
    const { invalid, valid } = useHeldBack(inputRef, { invalid: invalidProp, valid: validProp })
    // `label` is this package's name for what react-aria calls `children`. Accept either, so the
    // shape React developers reach for first names the control instead of vanishing.
    const resolvedLabel = label ?? children
    const controlled = isSelected !== undefined

    // On every render: a controlled switch's `isSelected`, or its group, may have changed.
    useIsomorphicLayoutEffect(() => {
      const input = inputRef.current
      if (!input) return undefined
      exclusiveSwitches.set(input, { controlled, required: !!required })
      syncGroupValidity(input)
      return () => {
        exclusiveSwitches.delete(input)
      }
    })

    // A reset puts each switch back without a change event, after its `reset` event.
    const formAttribute = rest.form
    useEffect(() => {
      const owner = inputRef.current?.form
      if (!owner) return undefined
      let timer: ReturnType<typeof setTimeout> | undefined
      const onReset = () => {
        timer = setTimeout(() => {
          if (inputRef.current) syncGroupValidity(inputRef.current)
        })
      }
      owner.addEventListener('reset', onReset)
      return () => {
        owner.removeEventListener('reset', onReset)
        clearTimeout(timer)
      }
    }, [formAttribute])

    const inputProps = {
      ...rest,
      'aria-invalid': invalid || undefined,
      // A browser ignores `readonly` on a checkbox: a read-only switch keeps its click from
      // changing it, and says so.
      'aria-readonly': readOnly || undefined,
      'aria-required': required || undefined,
      checked: isSelected,
      defaultChecked: defaultSelected,
      disabled,
      // A click puts back the switch that was on, as a radio's does, and any of a read-only one.
      onClick: (event: React.MouseEvent<HTMLInputElement>) => {
        rest.onClick?.(event)
        if (readOnly || !event.currentTarget.checked) event.preventDefault()
      },
      // Always a handler: React takes a `checked` input with none for a mistake and warns. React
      // reports the click it puts back too, so only a switch turned on is a change.
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target
        if (readOnly || !input.checked) return
        // A controlled switch of the group follows its `isSelected`, and a controlled one turned
        // on here syncs its group once it renders as on.
        for (const element of groupOf(input)) {
          if (element !== input && !exclusiveSwitches.get(element)?.controlled) {
            element.checked = false
          }
        }
        if (!controlled) syncGroupValidity(input)
        onChange?.(true)
      },
      role: 'switch' as const,
      type: 'checkbox' as const
    }

    return renderSwitchInput({
      className,
      color,
      forkedRef,
      id,
      inputProps,
      invalid,
      label: resolvedLabel,
      size,
      style,
      valid
    })
  }
)
SwitchRadio.displayName = 'SwitchRadio'

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ type = 'checkbox', ...rest }, ref) =>
    type === 'radio' ? <SwitchRadio {...rest} ref={ref} /> : <SwitchCheckbox {...rest} ref={ref} />
)

Switch.displayName = 'Switch'
