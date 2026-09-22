import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useRef
} from 'react'
import classNames from 'classnames'
import {
  AriaCheckboxGroupItemProps,
  AriaCheckboxProps,
  useCheckbox,
  useCheckboxGroupItem
} from 'react-aria'
import { CheckboxGroupState, useToggleState } from 'react-stately'

import { useForkedRef } from '../../hooks'
import { ContextColor } from '../../types'
import { validationClassName } from '../../utils/validationClassName'

import { CheckboxGroupContext } from './context'
import { ButtonObject, renderFormCheck } from '../form/renderFormCheck'
import { devError, devWarning } from '../../utils/devWarning'

export type { ButtonObject } from '../form/renderFormCheck'

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'onChange' | 'size'
> {
  /**
   * Create button-like checkboxes.
   */
  button?: ButtonObject
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the check indicator to one of Chassis context colors. Ignored when `button` is set.
   */
  color?: ContextColor
  /**
   * Whether the checkbox is selected, uncontrolled. Ignored when rendered inside a `<CheckboxGroup>` —
   * the group's `value`/`defaultValue` owns selection there.
   */
  defaultSelected?: boolean
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * Checkbox indeterminate property.
   */
  indeterminate?: boolean
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * Whether the checkbox is selected, controlled. Ignored when rendered inside a `<CheckboxGroup>` —
   * the group's `value`/`defaultValue` owns selection there.
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
   * Callback fired when the selected state changes. Ignored when rendered inside a `<CheckboxGroup>` —
   * use the group's `onChange` instead.
   */
  onChange?: (isSelected: boolean) => void
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * The value of the checkbox, used when submitting an HTML form. Required when rendered inside a
   * `<CheckboxGroup>` — it identifies this item within the group's selected values.
   */
  value?: string
}

const CheckboxStandalone = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      button,
      children,
      className,
      color,
      defaultSelected,
      disabled,
      id,
      indeterminate,
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

    // `label` is this package's name for what react-aria calls `children`. Accept either, so the
    // shape React developers reach for first names the control instead of vanishing.
    const resolvedLabel = label ?? children

    const { inputProps } = useCheckbox(
      {
        ...rest,
        children: resolvedLabel,
        isDisabled: disabled,
        isIndeterminate: indeterminate,
        isInvalid: invalid,
        value: rest.value as string | undefined
      } as AriaCheckboxProps,
      toggleState,
      inputRef
    )

    const inputClassName = classNames(validationClassName(invalid, valid))

    return renderFormCheck({
      button,
      className,
      color,
      input: <input {...inputProps} className={inputClassName} id={id} ref={forkedRef} />,
      invalid,
      label: resolvedLabel,
      size,
      valid
    })
  }
)
CheckboxStandalone.displayName = 'CheckboxStandalone'

interface CheckboxGroupItemProps extends CheckboxProps {
  groupState: CheckboxGroupState
  groupValid?: boolean
}

const CheckboxGroupItem = forwardRef<HTMLInputElement, CheckboxGroupItemProps>(
  (
    {
      button,
      children,
      className,
      color,
      defaultSelected: _defaultSelected,
      disabled,
      groupState,
      groupValid,
      id,
      indeterminate,
      invalid: itemInvalid,
      isSelected: _isSelected,
      label,
      onChange: _onChange,
      size,
      valid: itemValid,
      ...rest
    },
    ref
  ) => {
    // The group's own invalid/valid cascades to every item, same as RadioGroup does for Radio —
    // but an item can still override it with its own invalid/valid, since (unlike a lone Radio) a
    // lone Checkbox's validity is independently meaningful (see FORMS.md).
    const invalid = itemInvalid ?? groupState.isInvalid
    const valid = itemValid ?? groupValid
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    // Once per mount, not on every render — these are dev-time misuse warnings, not something
    // that needs to re-fire for every keystroke a parent's re-render happens to cause.
    useEffect(() => {
      devError(
        !rest.value,
        'Checkbox: a `value` prop is required when rendered inside a CheckboxGroup.'
      )
      devWarning(
        _defaultSelected !== undefined || _isSelected !== undefined || _onChange !== undefined,
        'Checkbox: `defaultSelected`, `isSelected`, and `onChange` are ignored inside a ' +
          "CheckboxGroup — selection is owned by the group's `value`/`defaultValue`/`onChange`."
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // `label` is this package's name for what react-aria calls `children`. Accept either, so the
    // shape React developers reach for first names the control instead of vanishing.
    const resolvedLabel = label ?? children

    const { inputProps } = useCheckboxGroupItem(
      {
        ...rest,
        children: resolvedLabel,
        isDisabled: disabled,
        isIndeterminate: indeterminate,
        isInvalid: invalid,
        value: rest.value as string
      } as AriaCheckboxGroupItemProps,
      groupState,
      inputRef
    )

    const inputClassName = classNames(validationClassName(invalid, valid))

    return renderFormCheck({
      button,
      className,
      color,
      input: <input {...inputProps} className={inputClassName} id={id} ref={forkedRef} />,
      invalid,
      label: resolvedLabel,
      size,
      valid
    })
  }
)
CheckboxGroupItem.displayName = 'CheckboxGroupItem'

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const group = useContext(CheckboxGroupContext)
  return group ? (
    <CheckboxGroupItem {...props} groupState={group.state} groupValid={group.valid} ref={ref} />
  ) : (
    <CheckboxStandalone {...props} ref={ref} />
  )
})

Checkbox.displayName = 'Checkbox'
