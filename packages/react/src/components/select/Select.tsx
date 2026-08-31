import React, {
  ChangeEventHandler,
  forwardRef,
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  useRef
} from 'react'
import classNames from 'classnames'

import { useForkedRef, useFormField } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'

export interface SelectOptionDef {
  /**
   * Marks the option as disabled — it can't be clicked or reached via the keyboard.
   */
  disabled?: boolean
  /**
   * Label text rendered inside the option. Falls back to the browser's default (the `value`,
   * stringified) when omitted.
   */
  label?: string
  /**
   * Marks the option as selected by default (uncontrolled) — resolved into the select's own
   * `defaultValue`, and ignored when the select's `value`/`defaultValue` is set directly. Set on
   * more than one option only when `multiple` is also set on `Select` — otherwise, matching
   * native `<select>` behavior, only the last option with `selected` set wins.
   */
  selected?: boolean
  /**
   * The option's value attribute.
   */
  value?: string | number
}
export interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Content rendered at the select's trailing edge, e.g. a `InputAdorn` icon, text, or button.
   * Setting either `adornStart` or `adornEnd` renders a `.form-input` wrapper around a
   * `.ghost-input`, matching chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern.
   * Clicking anywhere in the wrapper (other than an actionable adorn) opens the select, since the
   * native element itself no longer fills the wrapper's full width.
   */
  adornEnd?: ReactNode
  /**
   * Content rendered at the select's leading edge, e.g. a `InputAdorn` icon, text, or button.
   * Setting either `adornStart` or `adornEnd` renders a `.form-input` wrapper around a
   * `.ghost-input`, matching chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern.
   * Clicking anywhere in the wrapper (other than an actionable adorn) opens the select, since the
   * native element itself no longer fills the wrapper's full width.
   */
  adornStart?: ReactNode
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * A description for the field, rendered below the select.
   */
  help?: ReactNode
  /**
   * Specifies the number of visible options in a drop-down list.
   */
  htmlSize?: number
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the select when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` associated with this select.
   */
  label?: ReactNode
  /**
   * Allows more than one option to be selected at once. Pass `value` as a string array (or set
   * `selected` on more than one `options` entry) to control the selection.
   */
  multiple?: boolean
  /**
   * Method called immediately after the `value` prop changes.
   */
  onChange?: ChangeEventHandler<HTMLSelectElement>
  /**
   * Options list of the select component. Available keys: `label`, `value`, `disabled`,
   * `selected`.
   * Examples:
   * - `options={[{ value: 'js', label: 'JavaScript' }, { value: 'html', label: 'HTML', disabled: true }]}`
   * - `options={['js', 'html']}`
   */
  options?: SelectOptionDef[] | string[]
  /**
   * Renders a disabled placeholder option as the first item (e.g. `"Select a country…"`).
   * The option has an empty value so it is not selectable once another option is chosen.
   */
  placeholder?: string
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the select when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: string | string[] | number
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      adornEnd,
      adornStart,
      children,
      className,
      help,
      htmlSize,
      id,
      invalid,
      invalidFeedback,
      label,
      multiple,
      options,
      placeholder,
      size,
      valid,
      validFeedback,
      ...rest
    },
    ref
  ) => {
    const selectRef = useRef<HTMLSelectElement>(null)
    const forkedRef = useForkedRef(ref, selectRef)

    const selectedValues = Array.isArray(options)
      ? options
          .filter(
            (option): option is SelectOptionDef => typeof option === 'object' && !!option.selected
          )
          .map((option) => String(option.value ?? ''))
      : []

    if (!multiple && selectedValues.length > 1) {
      console.warn(
        'Select: more than one option has `selected: true` but `multiple` is not set — only ' +
          'the last one will be selected, matching native <select> behavior.'
      )
    }

    // React warns against setting `selected` directly on <option>, recommending `defaultValue`/
    // `value` on <select> instead — so `options[].selected` is resolved into a `defaultValue`
    // here rather than rendered as an attribute. Left alone when the caller already controls
    // `value`/`defaultValue` themselves.
    const inferredDefaultValue =
      selectedValues.length && rest.value === undefined && rest.defaultValue === undefined
        ? multiple
          ? selectedValues
          : selectedValues[selectedValues.length - 1]
        : undefined

    const { describedBy, feedbackId, helpId, inputId } = useFormField({
      ariaDescribedBy: rest['aria-describedby'],
      help,
      id,
      invalid,
      invalidFeedback,
      valid,
      validFeedback
    })

    const hasAdorn = adornStart != null || adornEnd != null
    // A caret can only pop the dropdown open when the select actually renders as one - an inline
    // listbox (`multiple`, or a `size` greater than 1) has no picker to show.
    const isDropdown = !multiple && (!htmlSize || htmlSize <= 1)

    // chassis-css's `.form-input:has(.ghost-input.is-valid)` selector reads validation state off
    // the inner select, not the wrapper, once adorns turn `.form-input` into a flex container -
    // see https://chassis-ui.com/css/docs/forms/input-adorn.
    const selectClassName = classNames(
      hasAdorn ? 'ghost-input' : 'form-input',
      !hasAdorn && size,
      validationClassName(invalid, valid),
      !hasAdorn && className
    )

    const handleWrapperClick: MouseEventHandler<HTMLDivElement> = (event) => {
      const node = selectRef.current
      const target = event.target as HTMLElement
      if (!node || node.disabled || !isDropdown || target === node || target.closest('button, a'))
        return
      node.focus()
      try {
        // showPicker() opens the native dropdown from a proxy click; unsupported browsers fall
        // back to the focus() above, same as tabbing to a bare select and pressing Space/Down.
        node.showPicker?.()
      } catch {
        // Can throw without a user activation or under a policy-restricted embed - focus() still
        // leaves the select reachable via the keyboard.
      }
    }

    const select = (
      <select
        {...rest}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={selectClassName}
        id={inputId}
        multiple={multiple}
        ref={forkedRef}
        size={htmlSize}
        {...(inferredDefaultValue !== undefined && { defaultValue: inferredDefaultValue })}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options
          ? options.map((option, index) => {
              return (
                <option
                  {...(typeof option === 'object' &&
                    option.disabled && { disabled: option.disabled })}
                  {...(typeof option === 'object' &&
                    option.value != null && { value: option.value })}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                >
                  {typeof option === 'string'
                    ? option
                    : (option.label ?? String(option.value ?? ''))}
                </option>
              )
            })
          : children}
      </select>
    )

    const rendered = hasAdorn ? (
      <div
        className={classNames('form-input', isDropdown && 'form-caret', size, className)}
        onClick={handleWrapperClick}
      >
        {adornStart}
        {select}
        {adornEnd}
      </div>
    ) : (
      select
    )

    return renderFormField({
      children: rendered,
      help,
      ids: { feedback: feedbackId, help: helpId, input: inputId },
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })
  }
)

Select.displayName = 'Select'
