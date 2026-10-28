import { fireEvent } from '@testing-library/react'

// A press that goes down on `pressed` and comes up on `released`, as a mouse sends it: the
// pointer and mouse events of each end, then the `click`, which a browser fires on the nearest
// common ancestor of the two. For a press inside a dialog released over its backdrop, and for one
// both on the backdrop, that is the `<dialog>` itself, `released` in both cases. Without `mouse`,
// the press sends its pointer events only, as one whose `pointerdown` is prevented does.
export function pressAndRelease(pressed: Element, released: Element, { mouse = true } = {}) {
  fireEvent.pointerDown(pressed)
  if (mouse) fireEvent.mouseDown(pressed)
  fireEvent.pointerUp(released)
  if (mouse) fireEvent.mouseUp(released)
  fireEvent.click(released)
}
