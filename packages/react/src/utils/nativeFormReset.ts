// The reset of a native control React renders. A browser puts a control back to its default,
// `defaultValue` or the options with `defaultSelected`, which React keeps in step with the
// controlled value of an input and never sets for a controlled select: a controlled
// `<select value>` went to its first option with its state left as it was, and the next render
// put the edited value back, and a controlled color or range input stayed as edited. Before the
// browser's own reset, in the form's `reset` event, the first value is made the default and the
// control set to it, and the change is dispatched as a browser dispatches it, so React reports
// it through `onChange` and the state follows. The value is set through the prototype's setter:
// React tracks one set through the element's own, and reports no change for it.
export const resetNativeControl = (
  node: HTMLInputElement | HTMLSelectElement,
  initial: string | number | readonly string[]
): void => {
  const values = (Array.isArray(initial) ? initial : [initial]).map(String)
  if (node instanceof HTMLSelectElement) {
    let changed = false
    for (const option of node.options) {
      const selected = values.includes(option.value)
      option.defaultSelected = selected
      if (option.selected !== selected) {
        option.selected = selected
        changed = true
      }
    }
    if (changed) node.dispatchEvent(new Event('change', { bubbles: true }))
    return
  }
  const value = values[0] ?? ''
  node.defaultValue = value
  if (node.value === value) return
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(node, value)
  node.dispatchEvent(new Event('input', { bubbles: true }))
}
