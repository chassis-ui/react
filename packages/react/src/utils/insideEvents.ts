import { SyntheticEvent } from 'react'

// Which overlays an event came from inside of, by React's tree rather than the DOM's. An overlay
// opened from inside another (a popover in a popover, a `Menu` with `container`, a date picker's
// calendar) is portaled out of it, so `contains()` reads a press in the inner one as a press
// outside the outer one. React still delivers the event to the outer overlay's handlers, through
// the portal: its root marks the native event in the capture phase, and the outer overlay's
// listener on `window`, which runs after React's, asks whether the event carries its mark.
const sources = new WeakMap<Event, Set<object>>()

const markEventInside = (event: Event, owner: object) => {
  const owners = sources.get(event) ?? new Set<object>()
  owners.add(owner)
  sources.set(event, owners)
}

/**
 * Whether `event` passed through the element that spreads `insideEventProps(owner)`.
 */
export const isEventInside = (event: Event, owner: object): boolean =>
  sources.get(event)?.has(owner) ?? false

/**
 * Props for an overlay's root element, for the events its outside listener reads. `owner` is any
 * object the overlay keeps for its lifetime, such as the ref of its panel.
 */
export const insideEventProps = (owner: object) => {
  const mark = (event: SyntheticEvent) => markEventInside(event.nativeEvent, owner)
  return { onClickCapture: mark, onKeyUpCapture: mark, onPointerDownCapture: mark }
}
