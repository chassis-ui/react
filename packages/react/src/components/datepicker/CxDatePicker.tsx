import React, { HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { FocusScope, mergeProps, useButton, useDatePicker, useDialog, usePopover } from 'react-aria'
import { DateValue, useDatePickerState } from 'react-stately'

import { useFormField } from '../../hooks'
import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { renderFormField } from '../form-field/renderFormField'
import { CxCalendar } from '../calendar/CxCalendar'
import { mergeIsDateUnavailable } from '../calendar/mergeIsDateUnavailable'
import { DateField } from './DateField'
import './CxDatePicker.css'

export interface CxDatePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the date picker, used when there's no visible `<label>`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible `<label>` element for the date picker.
   */
  'aria-labelledby'?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The initial selected date (uncontrolled).
   */
  defaultValue?: DateValue | null
  /**
   * Prevents the date picker from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below the date picker.
   */
  help?: ReactNode
  /**
   * `id` forwarded to the field's grouping element — useful for pairing with a `<label for>`.
   */
  id?: string
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the date picker when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * Callback that is called for each date in the calendar. If it returns `true`, that date is
   * shown but cannot be selected.
   */
  isDateUnavailable?: (date: DateValue) => boolean
  /**
   * The field's caption, rendered as a `CxFormLabel` associated with the field group.
   */
  label?: ReactNode
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue | null
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue | null
  /**
   * `name` of an auto-created hidden input, kept in sync with the selection, for native form
   * submission. Omit to skip creating one.
   */
  name?: string
  /**
   * Callback fired when the selected date changes.
   */
  onChange?: (value: DateValue | null) => void
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   * Applies to both the calendar popover and typing a date directly into the field.
   */
  unavailableDates?: string[]
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the date picker when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The selected date (controlled).
   */
  value?: DateValue | null
}

export const CxDatePicker = ({
  className,
  defaultValue,
  disabled,
  help,
  id,
  invalid,
  invalidFeedback,
  isDateUnavailable,
  label,
  maxValue,
  minValue,
  name,
  onChange,
  size,
  unavailableDates,
  valid,
  validFeedback,
  value,
  ...rest
}: CxDatePickerProps) => {
  const combinedIsDateUnavailable = mergeIsDateUnavailable(unavailableDates, isDateUnavailable)

  const state = useDatePickerState({
    defaultValue,
    isDateUnavailable: combinedIsDateUnavailable,
    isDisabled: disabled,
    maxValue,
    minValue,
    onChange,
    value
  })

  const groupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const {
    describedBy,
    feedbackId,
    helpId,
    inputId: groupId,
    labelId,
    labelledBy
  } = useFormField({
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

  const { groupProps, fieldProps, buttonProps, calendarProps, dialogProps } = useDatePicker(
    {
      'aria-label': rest['aria-label'],
      'aria-labelledby': labelledBy,
      defaultValue,
      id: groupId,
      isDateUnavailable: combinedIsDateUnavailable,
      isDisabled: disabled,
      isInvalid: invalid,
      maxValue,
      minValue,
      onChange,
      value
    },
    state,
    groupRef
  )

  // `useDatePicker`'s `buttonProps.onPress` only ever opens the calendar (matches upstream
  // react-aria), so re-clicking the toggle button while open would otherwise do nothing —
  // override it to actually toggle.
  const { buttonProps: toggleProps } = useButton(
    { ...buttonProps, onPress: () => state.toggle() },
    buttonRef
  )

  const { popoverProps, placement: resolvedPlacement } = usePopover(
    {
      triggerRef: groupRef,
      popoverRef,
      placement: toAriaPlacement('bottom-start'),
      offset: 2,
      // The toggle button lives inside `groupRef`, not `popoverRef` — without this it would
      // count as an "outside" interaction and `usePopover` would close the calendar on
      // pointerdown, which `toggleProps.onPress` above then immediately reopens on click.
      shouldCloseOnInteractOutside: (element) => !groupRef.current?.contains(element)
    },
    state
  )

  // `usePopover` merges positioning styles (`top`/`left`/`position`) with escape/outside-click
  // dismissal props (`onKeyDown`, focus-within handlers) — split them back apart since we only
  // want a subset of the computed style (no `zIndex`/`maxHeight` overrides; chassis-css owns those).
  const { style: popoverPositionStyle, ...popoverDismissProps } = popoverProps
  const overlayStyle: React.CSSProperties = {
    position: popoverPositionStyle?.position as React.CSSProperties['position'],
    top: popoverPositionStyle?.top,
    left: popoverPositionStyle?.left
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

  // `CxCalendar` is dialog-agnostic by design (see its own comment) — applying `role="dialog"`
  // etc. is this component's concern, layered on via the generic HTML-attribute passthrough
  // `CxCalendar` merges onto its root.
  const { dialogProps: domDialogProps } = useDialog(dialogProps, calendarRef)

  return renderFormField({
    children: (
      <>
        <div
          className={classNames(
            'form-input',
            { small: size === 'small', large: size === 'large', disabled },
            { 'is-invalid': invalid, 'is-valid': valid },
            className
          )}
          {...mergeProps(groupProps, rest)}
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          ref={groupRef}
        >
          <DateField fieldProps={fieldProps} />
          <button {...toggleProps} className="input-adorn" ref={buttonRef} type="button">
            <svg
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                height="12"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.25"
                width="13"
                x="1.5"
                y="3"
              />
              <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.25" />
              <path
                d="M4.5 1.5v3M11.5 1.5v3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.25"
              />
            </svg>
          </button>
        </div>
        <div
          className="cx-datepicker-calendar"
          data-cx-placement={placementAttr}
          hidden={!state.isOpen}
          ref={popoverRef}
          {...popoverDismissProps}
          style={overlayStyle}
        >
          {state.isOpen && (
            <FocusScope contain restoreFocus>
              <CxCalendar
                {...domDialogProps}
                autoFocus
                disabled={disabled}
                isDateUnavailable={combinedIsDateUnavailable}
                maxValue={maxValue}
                minValue={minValue}
                onChange={calendarProps.onChange}
                ref={calendarRef}
                value={calendarProps.value}
              />
            </FocusScope>
          )}
        </div>
        {name && (
          <input
            disabled={disabled}
            name={name}
            type="hidden"
            value={state.value ? state.value.toString() : ''}
          />
        )}
      </>
    ),
    help,
    ids: { feedback: feedbackId, help: helpId, label: labelId },
    invalid,
    invalidFeedback,
    label,
    valid,
    validFeedback
  })
}

CxDatePicker.displayName = 'CxDatePicker'
