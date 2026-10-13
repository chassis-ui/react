---
'@chassis-ui/react': minor
---

Fixes to form inputs, the date pickers and the combobox family.

- Breaking: `required` is the native attribute where it was `aria-required` alone, so a form checks it: on a `NumberField`'s input, on the radios of a required `RadioGroup`, and on the checkboxes of a required `CheckboxGroup` while none is selected. `form.checkValidity()` was `true` for each of them when empty. A form that should submit anyway needs `noValidate`.
- A `Radio` passes its `form` to its input.
- `ChipInput` inside a `FloatingInput` is named by the floating label. It kept its fallback `aria-label` and was named "Add value Skills".
- `OtpInput` focuses the next empty box after a partial paste. Focus went to the last filled box, where the next digit typed replaced it.
- Breaking: `InputAdorn` with `component="button"` is `type="button"` unless `type` is given. A password reveal adorn submitted the form around it.
- A `Checkbox`, `Radio` or `Switch` with no label applies `className`, on the `.check-input` element, where `style` already went.
- Breaking: `Chip` writes `aria-pressed` only on a chip with the button role. A static `pressed` chip had it on a `<span>` with no role, and a chip that is a link (`href`, or an `<a>` as `component` or the `asChild` element) on its `<a>`, which axe reports for both; the `.active` class still shows it. Give a link chip `role="button"` for it to be announced as pressed, as with `Button`.
- `Progress` keeps the caller's `aria-labelledby`.
- `DatePicker` and `DateRangePicker` describe their segments and calendar button by the help and feedback, which reached only the group around them, and the group keeps react-aria's description of the selected date.
- The server HTML of a `Combobox` with no options no longer describes its input by the no-results message, which exists only once hydrated.
- `Autocomplete` leaves focus on the field the user moved to when its list closes. It always focused the toggle. `onClick`, `onKeyDown` and `onFocus` given to it run beside the toggle's own handlers; they were replaced.
- Breaking: a preset of `RangeCalendar` or `DateRangePicker` is selected as the grid selects a range: its dates in order, kept inside `minValue`/`maxValue`, in the calendar of the current value and with that value's times. A preset with no day inside the limits is disabled.
