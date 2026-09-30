---
'@chassis-ui/react': minor
---

`SearchField`: a native `<input type="search">` on react-aria's `useSearchField`, in chassis-css's
input adorn shape, a `.form-input.search-field` around a `.ghost-input` with a search icon at its
start and, while there is a value, a clear button. The button and the Escape key empty the field
and keep focus on the input; Escape in an empty field reaches the dialog or menu around it.
`onSubmit` receives the value on Enter, with any modifier key and in a read-only field too, instead
of the form submitting; without it the field submits its form under `name`. It takes `label`,
`help`, the validation props, `size`, `disabled` and `readOnly` like the other form fields,
`searchIcon` (`false` leaves it out), `clearIcon` and `clearAriaLabel`. Two icon purposes join
`IconProvider`'s `icons`: `search` (`search-outline`) and `clear` (`xmark-outline`).

Its styles, in `@chassis-ui/react/style.css`, hide the browser's own clear button, and give the clear
button the field's icon color and the close button's idle and hover opacity
(`--cx-close-button-idle-opacity`, `--cx-close-button-hover-opacity`). A field disabled by its
`<fieldset>` hides the button too.
