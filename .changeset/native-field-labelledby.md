---
'@chassis-ui/react': patch
---

`Select`, `FileInput`, `ColorInput` and `RangeInput` keep their visible `label` in the accessible name when given an `aria-labelledby` of their own, as `TextInput` does: `<Select label="Country" aria-labelledby="extra" />` is named "Country Extra". The caller's `aria-labelledby` outranked the `<label for>`, and the name became "Extra". The label now carries an id, and the control is labelled by it and the caller's ids together; without an `aria-labelledby` of the caller's, the control is labelled by the `<label for>` as before.
