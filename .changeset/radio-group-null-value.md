---
'@chassis-ui/react': patch
---

`RadioGroup` takes `value={null}` and `defaultValue={null}` (#94): `null` clears a controlled selection, as it does for `Combobox`, `Autocomplete` and the date and time fields. The props were typed `string`, and `undefined`, the only value the type allowed for "none", makes react-stately treat the group as uncontrolled and keep the previous choice, so a form reset in TypeScript had no legal way to unselect a controlled group.
