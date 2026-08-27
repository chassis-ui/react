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
  size?: 'small' | 'large'
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
        autoComplete: index === 0 ? 'one-time-code' : 'off',
        isDisabled: disabled,
        isInvalid: invalid,
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
        className={classNames('form-input', size, validationClassName(invalid, valid))}
        data-focus-visible={isFocusVisible || undefined}
        inputMode="numeric"
        onPaste={onPasteBox}
        pattern="\d*"
        ref={ref}
      />
    )
  }
)

OtpBox.displayName = 'OtpBox'
