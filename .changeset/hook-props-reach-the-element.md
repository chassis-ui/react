---
'@chassis-ui/react': patch
---

`TextInput`, `Textarea`, `NumberField`, `Checkbox`, `Radio`, `Switch`, `RadioGroup` and `TabList`
render the attributes and event handlers their props accept. They are built on react-aria hooks,
which return only the props they know, so `title`, `dir`, `lang`, `accessKey`, `data-*` on a
checkbox, most `aria-*` attributes, `onClick`, `onMouseEnter` and the other pointer handlers never
reached the element, `tabIndex` was always `0`, `required` was dropped, and `NumberField` ignored
`autoComplete` for `"off"`. A handler the hook runs itself, such as `onFocus` or `onKeyDown`, still
runs once. `Radio` keeps its group's `name` and its roving `tabIndex`.

`style` goes on the outermost element, as `className` does: the `.form-input` wrapper of a
`TextInput` with an adorn, and the `.form-check` label of a `Checkbox`, `Radio` or `Switch`.
`TextInput`, `Checkbox`, `Radio` and `Switch` used to drop it, and `Switch` with `type="radio"`
put it on the input.
