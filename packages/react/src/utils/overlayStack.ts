// The overlays that are open, in the order they opened: `Popover`, `Menu`, `ContextMenu`, and a
// dialog opened with `showModal()`. Escape belongs to the last of them only. Each of these used
// to listen for the key by itself, so one press closed a menu, the popover it was in and the
// dialog around both.
export interface OverlayStackEntry {
  /**
   * The elements the overlay is made of: its panel and its trigger. A non-modal dialog reads them
   * to leave Escape to an overlay that is open inside it (`hasOverlayWithin`).
   */
  nodes: () => Array<Element | null | undefined>
  /**
   * Closes the overlay. A modal dialog has none: the browser sends it a `cancel` event for the
   * key itself, so its entry only keeps the overlays under it from taking the key first.
   */
  onEscape?: () => void
}

const stack: OverlayStackEntry[] = []

// On `window`, in the bubble phase: whatever handles Escape closer to the focused element (a
// submenu, a combobox's list, react-aria's tooltip) has stopped or prevented the event by then.
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || event.defaultPrevented) return
  const top = stack[stack.length - 1]
  if (!top?.onEscape) return
  // Prevented, so the browser doesn't also send `cancel` to a modal dialog the overlay is in.
  event.preventDefault()
  top.onEscape()
}

/**
 * Adds an open overlay to the top of the stack, and returns the function that takes it out.
 */
export function pushOverlay(entry: OverlayStackEntry): () => void {
  if (stack.length === 0) window.addEventListener('keydown', handleKeyDown)
  stack.push(entry)

  return () => {
    const index = stack.indexOf(entry)
    if (index !== -1) stack.splice(index, 1)
    if (stack.length === 0) window.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Whether an overlay of the stack is open inside `container`, which is then not the innermost.
 */
export function hasOverlayWithin(container: Element): boolean {
  return stack.some((entry) =>
    entry.nodes().some((node) => !!node && node !== container && container.contains(node))
  )
}
