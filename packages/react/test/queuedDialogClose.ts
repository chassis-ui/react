// jsdom's `close()` (`dialogPolyfill.ts`) fires the `close` event inside the call. A browser
// queues it as a task, so whatever runs in the same task as `close()` (a dialog shown again from
// `onHidden`, a rerender that sets `visible` back to `true`) runs before the event arrives. This
// swaps `close()` for one that queues the event on a timer, as browsers do, until the returned
// function restores the polyfill. Use with fake timers: `vi.runAllTimers()` delivers the event.
export function queueDialogCloseEvents(): () => void {
  const polyfilled = HTMLDialogElement.prototype.close
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return
    this.open = false
    setTimeout(() => this.dispatchEvent(new Event('close')), 0)
  }
  return () => {
    HTMLDialogElement.prototype.close = polyfilled
  }
}
