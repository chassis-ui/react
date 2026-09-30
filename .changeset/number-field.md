---
'@chassis-ui/react': minor
---

Add `NumberField`, a text input for numbers on react-aria's `useNumberField`: increment and
decrement buttons, the arrow keys, Page Up and Page Down, Home and End for `min` and `max`, and
`step`, which a typed value snaps to. `formatOptions` (`Intl.NumberFormat`'s) shows decimals,
percents, currencies and units in the locale's format while `value` stays a number; `onChange`
gets the number, `NaN` when empty. `label`, `help` and the validation props as on `TextInput`, and
`adornStart`/`adornEnd`. With `name`, a form receives the number. `stepButtons={false}` leaves the
buttons out; their icons are `IconProvider`'s new `increment` and `decrement`, or `incrementIcon`
and `decrementIcon`. Also a subpath: `@chassis-ui/react/number-field`.

The step buttons' styles are in `@chassis-ui/react/style.css`, and read `.form-input`'s own
padding, border and colors. On a phone, the server's HTML asks for the numeric keyboard, and the
field picks the one with the keys it needs (a minus sign, a decimal separator) once hydrated.
