import React, { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { AriaSwitchProps, useSwitch } from 'react-aria'
import { useToggleState } from 'react-stately'

import { useForkedRef } from '../../hooks'
import { ContextColor } from '../../types'
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
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * Whether the switch is selected, controlled.
   */
  isSelected?: boolean
  /**
   * The element represents a caption for a component.
   */
  label?: ReactNode
  /**
   * Callback fired when the selected state changes.
   */
  onChange?: (isSelected: boolean) => void
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Specifies the type of component.
   */
  type?: 'checkbox' | 'radio'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
}

type SwitchVariantProps = Omit<SwitchProps, 'type'>

interface RenderSwitchOptions {
  checkInputClassName: string
  className: string
  input: ReactNode
  label?: ReactNode
}

// Mirrors renderFormCheck's nested-label/bare-span shape — Switch inlines its own markup (see
// FORMS.md) rather than sharing that helper directly, since `role="switch"` placement didn't fit
// it cleanly. Keep this in sync with renderFormCheck by eye if either changes.
const renderSwitch = ({ checkInputClassName, className, input, label }: RenderSwitchOptions) => {
  if (!label) {
    return <span className={checkInputClassName}>{input}</span>
  }
  return (
    <FormLabel customClassName={className}>
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
  size?: 'small' | 'large'
  valid?: boolean
}

// Shared className-building/markup for `SwitchCheckbox`/`SwitchRadio` — the two variants only
// differ in how `inputProps` gets built (a react-aria hook vs. a hand-wired radio), everything
// after that is identical.
const renderSwitchInput = ({
  className,
  color,
  forkedRef,
  id,
  inputProps,
  invalid,
  label,
  size,
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
    checkInputClassName,
    className: _className,
    input: <input {...inputProps} className={inputClassName} id={id} ref={forkedRef} />,
    label
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
      color,
      defaultSelected,
      disabled,
      id,
      invalid,
      isSelected,
      label,
      onChange,
      size,
      valid,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    const toggleState = useToggleState({
      defaultSelected,
      isDisabled: disabled,
      isSelected,
      onChange
    })

    const { inputProps: switchProps } = useSwitch(
      {
        ...rest,
        children: label,
        isDisabled: disabled,
        isInvalid: invalid,
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
      inputProps: switchProps,
      invalid,
      label,
      size,
      valid
    })
  }
)
SwitchCheckbox.displayName = 'SwitchCheckbox'

// Radio-backed switch: react-aria has no ungrouped radio hook (see Checkbox's own split for the
// same reason), so this stays a native, hand-wired `<input type="radio" role="switch">` — no
// react-aria hook to call here at all.
const SwitchRadio = forwardRef<HTMLInputElement, SwitchVariantProps>(
  (
    {
      className,
      color,
      defaultSelected,
      disabled,
      id,
      invalid,
      isSelected,
      label,
      onChange,
      size,
      valid,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    const radioProps = {
      ...rest,
      'aria-invalid': invalid,
      checked: isSelected,
      defaultChecked: defaultSelected,
      disabled,
      onChange: onChange
        ? (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.checked)
        : undefined,
      role: 'switch' as const,
      type: 'radio' as const
    }

    return renderSwitchInput({
      className,
      color,
      forkedRef,
      id,
      inputProps: radioProps,
      invalid,
      label,
      size,
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
