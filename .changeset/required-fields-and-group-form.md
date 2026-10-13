---
'@chassis-ui/react': minor
---

`required` on the fields that had none, fields that show the submit they held back, and `form` on the groups.

- `DatePicker`, `DateRangePicker`, `Combobox`, `Autocomplete`, `OtpInput` and `ChipInput` take `required`. An empty one holds its form back from submitting and takes focus; a form that should submit anyway needs `noValidate`.
  - `DatePicker` asks for a date, or with `selectionMode="multiple"` for one date at least. `DateRangePicker` asks for both dates.
  - `Combobox` and `Autocomplete` ask for a selected option: text typed in a `Combobox` without selecting one is not a value.
  - `OtpInput` asks for every box.
  - `ChipInput` asks for one chip at least: text typed and not added as a chip is not a value.
- Breaking: a field that held its form back from submitting shows as invalid, with its `invalidFeedback` (`errorMessage` on a group), until it no longer would or the form is reset. A form with an invalid field isn't submitted, and nothing said why: react-aria cancels the browser's own message for the fields it backs, and a value in an input that isn't displayed has none. Every form field does this: `TextInput`, `Textarea`, `SearchField`, `NumberField`, `Select`, `FileInput`, `Combobox`, `Autocomplete`, `OtpInput`, `ChipInput`, `Checkbox`, `Switch`, `RadioGroup`, `CheckboxGroup`, `TimeField`, `DatePicker` and `DateRangePicker`. Set `invalid`, to `false` too, or `valid`, and that prop decides how the field looks instead; a form with `noValidate` holds nothing back.
- A `CheckboxGroup` that is no longer `invalid` takes the state off its checkboxes. They kept `aria-invalid` and `.is-invalid` once the group had been invalid, until `invalid={false}` was set.
- A radio-backed `Switch` (`type="radio"`) with `invalid={false}` no longer renders `aria-invalid="false"`.
- `RadioGroup` and `CheckboxGroup` declare `form`, the id of the `<form>` a group rendered outside it belongs to. It already reached every radio and checkbox through react-aria; TypeScript refused it on the group.
