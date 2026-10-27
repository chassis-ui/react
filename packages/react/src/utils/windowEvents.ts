// Listens for `type` on `window` for an overlay's outside-press handling, including the events
// that something stopped on the way. react-aria's `usePress` stops the `pointerdown` and `click` of
// the element it is on (a `Tab`, a `Checkbox`, a `Select` trigger, a `DataGrid` row), so a menu
// that listened in the bubble phase alone never heard a press on one of them, and stayed open
// beside the control the user had just operated.
//
// Not the capture phase alone: `isEventInside` reads the mark React's root puts on an event in its
// own capture phase, which comes after `window`'s. An event is seen in the capture phase and
// handled when it bubbles up to `window`, as before; one that never arrives is handled a task
// later, once its dispatch is over. Each event reaches `handler` once, with `stopped` for one that
// never bubbled up: something on its path took it, and a listener that reads the event as a click
// on one of its own items (a menu's dismissal) leaves such a one to the control it was on.
export function listenOnWindow<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K], stopped: boolean) => void
): () => void {
  const pending = new Map<Event, number>()

  const handleCapture = (event: WindowEventMap[K]) => {
    pending.set(
      event,
      window.setTimeout(() => {
        pending.delete(event)
        handler(event, true)
      })
    )
  }

  const handleBubble = (event: WindowEventMap[K]) => {
    window.clearTimeout(pending.get(event))
    pending.delete(event)
    handler(event, false)
  }

  window.addEventListener(type, handleCapture, true)
  window.addEventListener(type, handleBubble)
  return () => {
    window.removeEventListener(type, handleCapture, true)
    window.removeEventListener(type, handleBubble)
    for (const timer of pending.values()) window.clearTimeout(timer)
    pending.clear()
  }
}
