import React, { ClipboardEvent, ForwardedRef, forwardRef, KeyboardEvent } from 'react'
import classNames from 'classnames'
import { mergeProps, useFocusRing, useObjectRef, useTextField } from 'react-aria'

import { validationClassName } from '../../utils/validationClassName'

interface OtpBoxProps {
  disabled?: boolean
  index: number
  invalid?: boolean
  mask?: boolean
  onChangeValue: (value: string) => void
  onKeyDownBox: (event: KeyboardEvent<HTMLInputElement>) => void
  onPasteBox: (event: ClipboardEvent<HTMLInputElement>) => void
  required?: boolean
  size?: 'sm' | 'lg'
  valid?: boolean
  value: string
}

export const OtpBox = forwardRef(
  (
    {
      disabled,
      index,
      invalid,
      mask,
      onChangeValue,
      onKeyDownBox,
      onPasteBox,
      required,
      size,
      valid,
      value
    }: OtpBoxProps,
    forwardedRef: ForwardedRef<HTMLInputElement>
  ) => {
    const ref = useObjectRef(forwardedRef)
    const { focusProps, isFocusVisible } = useFocusRing()
    const { inputProps } = useTextField(
      {
        'aria-label': `Digit ${index + 1}`,
        // Only the first box takes the whole code; the others turn autofill off. Browsers ignore
        // `off` on a password field, though, so a masked box would be offered saved passwords:
        // every masked box says it takes a one-time code instead, the one other value that fits.
        autoComplete: index === 0 || mask ? 'one-time-code' : 'off',
        isDisabled: disabled,
        isInvalid: invalid,
        isRequired: required,
        maxLength: 1,
        onChange: onChangeValue,
        onFocus: (event) => (event.target as HTMLInputElement).select(),
        onKeyDown: onKeyDownBox,
        type: mask ? 'password' : 'text',
        value
      },
      ref
    )

    return (
      <input
        {...mergeProps(inputProps, focusProps)}
        // The group describes the boxes. react-aria's own ids here are never rendered (FORMS.md,
        // gotcha 6).
        aria-describedby={undefined}
        // The native `required` below says the same.
        aria-required={undefined}
        className={classNames('form-input', size, validationClassName(invalid, valid))}
        data-focus-visible={isFocusVisible || undefined}
        inputMode="numeric"
        onPaste={onPasteBox}
        pattern="\d*"
        ref={ref}
        // A required code is one with every box filled, so each box is required: a form is held
        // back by the first empty one, which react-aria's listener then focuses. The hidden input
        // that carries `name` is barred from constraint validation (FORMS.md, gotcha 9), and
        // react-aria writes `aria-required` alone, which no form checks.
        required={required || undefined}
      />
    )
  }
)

OtpBox.displayName = 'OtpBox'
