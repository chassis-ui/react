import React, {
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useRef
} from 'react'
import classNames from 'classnames'
import { AriaSearchFieldProps, mergeProps, useButton, useSearchField } from 'react-aria'
import { useSearchFieldState } from 'react-stately'

import './SearchField.scss'
import { useForkedRef, useFormField } from '../../hooks'
import { IconValue } from '../../utils/iconConfig'
import { IconSlot } from '../../utils/iconSlot'
import { mergeUnhandledProps, TEXT_FIELD_PROPS } from '../../utils/unhandledProps'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'

export interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'onChange' | 'onSubmit' | 'size' | 'type' | 'value'
> {
  /**
   * The accessible name of the clear button. Defaults to react-aria's, in the locale's language
   * ("Clear search").
   */
  clearAriaLabel?: string
  /**
   * The icon of the clear button, in place of `IconProvider`'s `clear` icon.
   */
  clearIcon?: IconValue
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The value of the field, uncontrolled.
   */
  defaultValue?: string
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below it.
   */
  help?: ReactNode
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below it when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` associated with the input.
   */
  label?: ReactNode
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: string) => void
  /**
   * Handler that is called when the field is cleared, by the clear button or the Escape key.
   */
  onClear?: () => void
  /**
   * Handler that is called when the Enter key is pressed, with the value. When set, Enter, with
   * or without a modifier key, no longer submits the input's form.
   */
  onSubmit?: (value: string) => void
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * The icon at the field's start, in place of `IconProvider`'s `search` icon. `false` leaves it
   * out.
   */
  searchIcon?: IconValue | false
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below it when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The value of the field, controlled.
   */
  value?: string
}

// The clear button. A `<button>` react-aria keeps out of the tab order, since Escape does the
// same; a press leaves focus on the input.
function ClearButton({
  ariaLabel,
  buttonProps,
  icon
}: {
  ariaLabel?: string
  buttonProps: ReturnType<typeof useSearchField>['clearButtonProps']
  icon?: IconValue
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps: props } = useButton(
    { ...buttonProps, 'aria-label': ariaLabel ?? buttonProps['aria-label'] },
    ref as RefObject<HTMLButtonElement | null>
  )
  return (
    <button {...props} className="button icon-only input-adorn search-field-clear" ref={ref}>
      <IconSlot icon="clear" override={icon} />
    </button>
  )
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      className,
      clearAriaLabel,
      clearIcon,
      defaultValue,
      disabled,
      help,
      id,
      invalid,
      invalidFeedback,
      label,
      onChange,
      onClear,
      onSubmit,
      readOnly,
      searchIcon,
      size,
      style,
      valid,
      validFeedback,
      value,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    const { describedBy, feedbackId, helpId, inputId, labelId, labelledBy } = useFormField({
      ariaDescribedBy: rest['aria-describedby'],
      ariaLabelledBy: rest['aria-labelledby'],
      help,
      id,
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })

    const fieldProps = {
      ...rest,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy,
      defaultValue,
      id: inputId,
      isDisabled: disabled,
      isInvalid: invalid,
      isReadOnly: readOnly,
      onChange,
      onClear,
      onSubmit,
      value
    } as AriaSearchFieldProps
    const state = useSearchFieldState(fieldProps)
    const { clearButtonProps, inputProps } = useSearchField(fieldProps, state, inputRef)

    // react-aria's Enter shortcut matches Enter alone, and a read-only field has none, so with
    // `onSubmit` Shift+Enter, or Enter in a read-only field, would still submit the form.
    const submitProps = {
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        const modified = event.shiftKey || event.altKey || event.ctrlKey || event.metaKey
        if (!onSubmit || event.key !== 'Enter' || event.nativeEvent.isComposing) return
        if (!modified && !readOnly) return
        event.preventDefault()
        onSubmit(state.value)
      }
    }

    return renderFormField({
      // The input adorn shape of chassis-css: a `.form-input` around a `.ghost-input`, which takes
      // the validation classes, with the icon and the clear button as `.input-adorn`s. `style`
      // goes on the wrapper, with `className`. `aria-describedby` after the spread: react-aria's
      // own adds ids it never renders (FORMS.md, gotcha 6).
      children: (
        <div className={classNames('form-input', 'search-field', size, className)} style={style}>
          {searchIcon !== false && (
            <span className="input-adorn search-field-icon">
              <IconSlot icon="search" override={searchIcon} />
            </span>
          )}
          <input
            {...mergeUnhandledProps(mergeProps(inputProps, submitProps), rest, TEXT_FIELD_PROPS)}
            aria-describedby={describedBy}
            className={classNames('ghost-input', validationClassName(invalid, valid))}
            ref={forkedRef}
          />
          {state.value !== '' && !disabled && !readOnly && (
            <ClearButton
              ariaLabel={clearAriaLabel}
              buttonProps={clearButtonProps}
              icon={clearIcon}
            />
          )}
        </div>
      ),
      help,
      ids: { feedback: feedbackId, help: helpId, input: inputId, label: labelId },
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })
  }
)

SearchField.displayName = 'SearchField'
