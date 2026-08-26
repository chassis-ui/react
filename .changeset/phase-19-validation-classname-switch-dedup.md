---
"@chassis-ui/react": patch
---

Internal refactor: a new `validationClassName` helper (`src/utils/validationClassName.ts`) replaces the copy-pasted `{ 'is-invalid': invalid, 'is-valid': valid }` shape across `Radio`, `Switch`, `RangeInput`, `Select`, `TextInput`, and `Textarea`. `Switch`'s `SwitchCheckbox`/`SwitchRadio` also now share their className/markup-building logic via one internal `renderSwitchInput` helper. No public API or behavior change.
