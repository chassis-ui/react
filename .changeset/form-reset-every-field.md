---
'@chassis-ui/react': patch
---

A form reset puts every field back to its first value, controlled or not, and reports it through `onChange` (#86), as the text fields already did. A controlled `Select` went to its first option while its state kept the edited value, which the next render put back; a controlled `ColorInput` or `RangeInput` stayed as edited; a controlled `OtpInput` reset to `""` instead of its first code; and `DatePicker`, `DateRangePicker`, `Autocomplete` and `ChipInput` kept the edited value in what the form submitted.
