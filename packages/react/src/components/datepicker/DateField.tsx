import React, { useRef } from 'react'
import classNames from 'classnames'
import { AriaDateFieldProps, DateValue, useDateField, useDateSegment, useLocale } from 'react-aria'
import { DateFieldState, DateSegment as DateSegmentType, useDateFieldState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import { joinIds, withoutSlotIds } from '../../utils/idRefs'

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

interface DateSegmentProps {
  fieldLabelledBy?: string
  segment: DateSegmentType
  slots: { id?: string }[]
  state: DateFieldState
}

const DateSegment = ({ fieldLabelledBy, segment, slots, state }: DateSegmentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <span
      {...withoutSlotIds(segmentProps, ...slots)}
      // react-aria labels a segment by an id of its own, which it merges into the segment's `id`
      // only after hydration, and by the field's label. The server's HTML referred to the first,
      // an id no element had.
      aria-labelledby={segmentProps['aria-labelledby'] && joinIds(segmentProps.id, fieldLabelledBy)}
      className={classNames('datepicker-segment', { placeholder: segment.isPlaceholder })}
      ref={ref}
    >
      {segment.text}
    </span>
  )
}
