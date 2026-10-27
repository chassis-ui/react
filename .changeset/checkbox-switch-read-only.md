---
'@chassis-ui/react': patch
---

`readOnly` on a `Checkbox` or `Switch` makes it read-only: it keeps its state, `onChange` doesn't fire, and it carries `aria-readonly="true"`. The prop went to the input as the native `readonly` attribute, which browsers ignore on a checkbox or radio, so the control still toggled and nothing said it was read-only. It works inside a `CheckboxGroup` and for the radio-backed `Switch` too, and the control can still be focused.
