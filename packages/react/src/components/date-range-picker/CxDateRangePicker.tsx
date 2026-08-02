import React, { HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import {
  FocusScope,
  mergeProps,
  RangeValue,
  useButton,
  useDateRangePicker,
  useDialog,
  useLocale,
  usePopover
} from 'react-aria'
import { DateValue, useDateRangePickerState } from 'react-stately'

import { useFormField } from '../../hooks'
import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { renderFormField } from '../form-field/renderFormField'
import { CxRangeCalendar } from '../calendar/CxRangeCalendar'
import { mergeIsDateUnavailable } from '../calendar/mergeIsDateUnavailable'
import { DateField } from '../datepicker/DateField'
import { CxDateRangePreset, getDefaultDateRangePresets } from './dateRangePresets'
import '../datepicker/CxDatePicker.css'
import './CxDateRangePicker.css'

export interface CxDateRangePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the date range picker, used when there's no visible `<label>`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible `<label>` element for the date range picker.
   */
  'aria-labelledby'?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The initial selected date range (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue> | null
  /**
   * Prevents the date range picker from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below the date range picker.
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
   * An error message for the field, rendered below the date range picker when `invalid` is set.
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
   * Base `name` for a pair of auto-created hidden inputs, kept in sync with the selection, for
   * native form submission — rendered as `${name}Start` and `${name}End`. Omit to skip creating
   * them.
   */
  name?: string
  /**
   * Callback fired when the selected date range changes.
   */
  onChange?: (value: RangeValue<DateValue> | null) => void
  /**
   * A list of quick-select range presets shown in the popover next to the calendar, or `true`
   * for a sensible default list (Today, Last 7/30/90 Days, Last Week, Last Month — all relative
   * to today). Selecting a preset commits its range immediately, the same as picking a start and
   * end date from the calendar. Omit (or `false`) to not show a preset list.
   *
   * @default false
   */
  presets?: boolean | CxDateRangePreset[]
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   * Applies to both the calendar popover and typing a date directly into either field.
   */
  unavailableDates?: string[]
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the date range picker when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The selected date range (controlled).
   */
  value?: RangeValue<DateValue> | null
  /**
   * Number of months to display side by side in the calendar popover.
   *
   * @default 1
   */
  visibleMonths?: number
}

// Mirrors `CxDatePicker` closely — same field/popover/dialog composition, just with two
// segmented fields (`startFieldProps`/`endFieldProps` in place of a single `fieldProps`) and
// `CxRangeCalendar` in place of `CxCalendar` in the popover. See `CxDatePicker`'s own comments for
// the reasoning behind the dialog-wiring pattern in general — one difference here: the dialog
// role/ref lands on a wrapper *around* both the optional presets list and `CxRangeCalendar`
// (rather than on the calendar itself), since the dialog now encompasses the presets too when
// they're shown.
export const CxDateRangePicker = ({
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
  presets,
  size,
  unavailableDates,
  valid,
  validFeedback,
  value,
  visibleMonths,
  ...rest
}: CxDateRangePickerProps) => {
  const { locale } = useLocale()
  const combinedIsDateUnavailable = mergeIsDateUnavailable(unavailableDates, isDateUnavailable)
  const resolvedPresets = presets === true ? getDefaultDateRangePresets(locale) : presets || null

  const state = useDateRangePickerState({
    defaultValue,
    isDateUnavailable: combinedIsDateUnavailable,
    isDisabled: disabled,
    maxValue,
    minValue,
    onChange,
    value
  })

  // Mirrors what completing a selection in the calendar itself does — commit the full range
  // through the same state.setValue path (so controlled/uncontrolled onChange semantics stay
  // consistent) and close the popover.
  const handlePresetSelect = (range: RangeValue<DateValue>) => {
    state.setValue(range)
    state.setOpen(false)
  }

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

  const { groupProps, startFieldProps, endFieldProps, buttonProps, calendarProps, dialogProps } =
    useDateRangePicker(
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

  // Same override as `CxDatePicker`'s toggle button — `buttonProps.onPress` only ever opens the
  // calendar, so re-clicking it while open would otherwise do nothing.
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
      shouldCloseOnInteractOutside: (element) => !groupRef.current?.contains(element)
    },
    state
  )

  const { style: popoverPositionStyle, ...popoverDismissProps } = popoverProps
  const overlayStyle: React.CSSProperties = {
    position: popoverPositionStyle?.position as React.CSSProperties['position'],
    top: popoverPositionStyle?.top,
    left: popoverPositionStyle?.left
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

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
          <div className="d-flex gap-small w-100">
            <DateField fieldProps={startFieldProps} />
            <span aria-hidden="true" className="cx-daterangepicker-separator">
              –
            </span>
            <DateField fieldProps={endFieldProps} />
          </div>
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
          className="datepicker"
          data-cx-placement={placementAttr}
          hidden={!state.isOpen}
          ref={popoverRef}
          {...popoverDismissProps}
          style={overlayStyle}
        >
          {state.isOpen && (
            <FocusScope contain restoreFocus>
              <div
                {...domDialogProps}
                className={classNames('cx-daterangepicker-popover-body', {
                  'has-presets': resolvedPresets
                })}
                ref={calendarRef}
              >
                {resolvedPresets && (
                  <DateRangePresets onSelect={handlePresetSelect} presets={resolvedPresets} />
                )}
                <CxRangeCalendar
                  autoFocus
                  disabled={disabled}
                  isDateUnavailable={combinedIsDateUnavailable}
                  maxValue={maxValue}
                  minValue={minValue}
                  onChange={calendarProps.onChange}
                  value={calendarProps.value}
                  visibleMonths={visibleMonths}
                />
              </div>
            </FocusScope>
          )}
        </div>
        {name && (
          <>
            <input
              disabled={disabled}
              name={`${name}Start`}
              type="hidden"
              value={state.value?.start ? state.value.start.toString() : ''}
            />
            <input
              disabled={disabled}
              name={`${name}End`}
              type="hidden"
              value={state.value?.end ? state.value.end.toString() : ''}
            />
          </>
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

CxDateRangePicker.displayName = 'CxDateRangePicker'

interface DateRangePresetsProps {
  onSelect: (range: RangeValue<DateValue>) => void
  presets: CxDateRangePreset[]
}

// Plain buttons in a list, not a listbox — a group of independent actions (each one commits and
// closes) rather than a single-selection widget, so native Tab/Enter/Space is the right
// interaction model without extra roving-tabindex/arrow-key wiring.
const DateRangePresets = ({ onSelect, presets }: DateRangePresetsProps) => (
  <ul className="cx-daterangepicker-presets">
    {presets.map((preset) => (
      <li key={preset.label}>
        <button
          className="cx-daterangepicker-preset"
          onClick={() => onSelect(preset.range)}
          type="button"
        >
          {preset.label}
        </button>
      </li>
    ))}
  </ul>
)
