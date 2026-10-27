---
'@chassis-ui/react': minor
---

The native fields are typed with the attributes their element has (#88).

- Breaking: `SelectProps` extends `SelectHTMLAttributes`, not `InputHTMLAttributes`: `readOnly`, `type`, `pattern`, `min`, `max`, `checked` and the other input attributes a `<select>` ignores are type errors now. `readOnly` rendered a `readonly` attribute the select didn't honour: it still changed and fired `onChange`.
- Breaking: `FileInputProps` has no `value` or `defaultValue`. A file input's value is the files chosen, and a string given threw `InvalidStateError` at mount.
- Breaking: `ColorInputProps` and `RangeInputProps` have no `placeholder` or `readOnly`, which HTML doesn't apply to `type="color"` or `type="range"`; `RangeInput` documented a read-only state it never had.
