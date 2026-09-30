import React, { useRef } from 'react'
import { AriaDateFieldProps, DateValue, useDateField, useLocale } from 'react-aria'
import { useDateFieldState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import { withoutSlotIds } from '../../utils/idRefs'
import { DateSegment } from './DateSegment'

interface DateFieldProps {
  fieldProps: AriaDateFieldProps<DateValue>
}

// Builds its own segment state from the `fieldProps` `DatePicker` hands down — mirrors react
// aria's own documented composition (the top-level `useDatePickerState`/`useDatePicker` pair
// manages the *selected value*; the field's individually-editable segments are a separate piece
// of state derived from `locale`/`createCalendar`, owned here).
export const DateField = ({ fieldProps }: DateFieldProps) => {
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...fieldProps,
    createCalendar,
    locale
  })

  const ref = useRef<HTMLDivElement>(null)
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
