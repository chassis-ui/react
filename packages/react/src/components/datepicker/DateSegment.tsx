import React, { useRef } from 'react'
import classNames from 'classnames'
import { useDateSegment } from 'react-aria'
import { DateFieldState, DateSegment as DateSegmentType } from 'react-stately'

import './DateSegment.scss'
import { joinIds, withoutSlotIds } from '../../utils/idRefs'

// One editable part of a date or time field (a month, an hour, a day period), for `DateField`
// and `TimeField` alike. A `TimeFieldState` is a `DateFieldState`.
// A literal of spaces or bidi isolation marks (U+2066-U+2069) only.
const BLANK_LITERAL = /^[\s\u2066-\u2069]+$/
const DATE_PARTS = new Set(['era', 'year', 'month', 'day'])

// Whether a literal stands between a field's date and its time (en-US ", "), found by the
// editable parts on either side of it.
const separatesDateAndTime = (segments: DateSegmentType[], index: number) => {
  const before = segments
    .slice(0, index)
    .reverse()
    .find((segment) => segment.type !== 'literal')
  const after = segments.slice(index + 1).find((segment) => segment.type !== 'literal')
  return Boolean(before && after) && DATE_PARTS.has(before!.type) !== DATE_PARTS.has(after!.type)
}

export interface DateSegmentProps {
  fieldLabelledBy?: string
  segment: DateSegmentType
  slots: { id?: string }[]
  state: DateFieldState
}

export const DateSegment = ({ fieldLabelledBy, segment, slots, state }: DateSegmentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { segmentProps } = useDateSegment(segment, state, ref)
  const plain =
    segment.type === 'literal' &&
    (BLANK_LITERAL.test(segment.text) ||
      separatesDateAndTime(state.segments, state.segments.indexOf(segment)))

  return (
    <span
      {...withoutSlotIds(segmentProps, ...slots)}
      // react-aria labels a segment by an id of its own, which it merges into the segment's `id`
      // only after hydration, and by the field's label. The server's HTML referred to the first,
      // an id no element had.
      aria-labelledby={segmentProps['aria-labelledby'] && joinIds(segmentProps.id, fieldLabelledBy)}
      // A time's literal segments include bidi isolation marks around it, which show nothing, the
      // space before AM/PM, and the ", " between a date and its time. As `.datepicker-segment`s,
      // their padding set the time off from the edge and widened the space, or put one before the
      // comma: they render as plain text. A date's own literals ("/", ko-KR's ". ") keep it.
      className={
        plain ? undefined : classNames('datepicker-segment', { placeholder: segment.isPlaceholder })
      }
      // A segment that can't be edited leaves `contenteditable` out rather than writing `false`:
      // react-aria marks it `aria-readonly`, which HTML allows only on an element that isn't
      // `contenteditable` at all.
      contentEditable={segmentProps.contentEditable || undefined}
      ref={ref}
    >
      {segment.text}
    </span>
  )
}
