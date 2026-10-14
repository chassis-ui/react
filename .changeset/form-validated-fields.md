---
'@chassis-ui/react': minor
---

`Form`'s `validated` shows every field in the form as valid or invalid.

- Breaking: `validated` no longer renders the `.was-validated` class. `@chassis-ui/css` has no rule for it, so a validated form showed nothing: no field looked valid, and an invalid one looked invalid only after a submit it had held back. A stylesheet that targets `form.was-validated` needs another selector.
- Every field in a `Form` with `validated` shows itself as valid or invalid by its own constraints (`required`, `type`, `pattern` and the like), and again as its value changes: its class, `aria-invalid`, and its `validFeedback` or `invalidFeedback` (`errorMessage` on a group). Set `invalid`, to `false` too, or `valid` on a field, and that prop decides how the field looks instead. This holds for `TextInput`, `Textarea`, `SearchField`, `NumberField`, `Select`, `FileInput`, `ColorInput`, `RangeInput`, `Combobox`, `Autocomplete`, `OtpInput`, `ChipInput`, `Checkbox`, `Switch`, `RadioGroup`, `CheckboxGroup`, `TimeField`, `DatePicker` and `DateRangePicker`. A control that isn't one of these, such as a plain `<input className="form-input">`, isn't affected.
