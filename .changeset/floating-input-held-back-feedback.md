---
'@chassis-ui/react': patch
---

A `FloatingInput` shows its `invalidFeedback` when a submit is held back by the field inside it: `<FloatingInput invalidFeedback="Enter your email." label="Email"><TextInput name="email" required /></FloatingInput>` marked the empty input as invalid on submit and said nothing. The message now appears with the mark and describes the input until the field has a value or the form is reset, and a `Form` with `validated` shows the `validFeedback` of a valid field the same way. An `invalid` or `valid` set on the `FloatingInput` still decides on its own.
