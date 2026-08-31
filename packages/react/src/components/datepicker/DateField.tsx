import React, { useRef } from 'react'
import classNames from 'classnames'
import { AriaDateFieldProps, DateValue, useDateField, useDateSegment, useLocale } from 'react-aria'
import { DateFieldState, DateSegment as DateSegmentType, useDateFieldState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

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
  const { fieldProps: domFieldProps } = useDateField(fieldProps, state, ref)

  return (
    <div {...domFieldProps} className="datepicker-field" ref={ref}>
      {state.segments.map((segment, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <DateSegment key={index} segment={segment} state={state} />
      ))}
    </div>
  )
}

interface DateSegmentProps {
  segment: DateSegmentType
  state: DateFieldState
}

const DateSegment = ({ segment, state }: DateSegmentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <span
      {...segmentProps}
      className={classNames('datepicker-segment', { placeholder: segment.isPlaceholder })}
      ref={ref}
    >
      {segment.text}
    </span>
  )
}
