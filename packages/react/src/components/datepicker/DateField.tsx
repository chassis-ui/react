import React, { RefObject, useRef } from 'react'
import { AriaDateFieldProps, DateValue, useDateField, useLocale } from 'react-aria'
import { useDateFieldState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import { withoutSlotIds } from '../../utils/idRefs'
import { DateSegment } from './DateSegment'

interface DateFieldProps {
  fieldProps: AriaDateFieldProps<DateValue>
  /**
   * A ref to the field's element, for a picker that focuses one field of two.
   */
  fieldRef?: RefObject<HTMLDivElement | null>
}

// Where a required picker puts focus once it has held its form back: the first segment under
// `root`, a picker's group or one of its fields.
export const focusFirstSegment = (root: HTMLElement | null) =>
  root?.querySelector<HTMLElement>('[role="spinbutton"]')?.focus()

// Builds its own segment state from the `fieldProps` `DatePicker` hands down — mirrors react
// aria's own documented composition (the top-level `useDatePickerState`/`useDatePicker` pair
// manages the *selected value*; the field's individually-editable segments are a separate piece
// of state derived from `locale`/`createCalendar`, owned here).
export const DateField = ({ fieldProps, fieldRef }: DateFieldProps) => {
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...fieldProps,
    createCalendar,
    locale
  })

  const ownRef = useRef<HTMLDivElement>(null)
  const ref = fieldRef ?? ownRef
  const {
    descriptionProps,
    errorMessageProps,
    fieldProps: domFieldProps
  } = useDateField(fieldProps, state, ref)

  return (
    <div
      {...withoutSlotIds(domFieldProps, descriptionProps, errorMessageProps)}
      className="datepicker-field"
      ref={ref}
    >
      {state.segments.map((segment, index) => (
        <DateSegment
          fieldLabelledBy={fieldProps['aria-labelledby']}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          segment={segment}
          slots={[descriptionProps, errorMessageProps]}
          state={state}
        />
      ))}
    </div>
  )
}
