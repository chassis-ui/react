---
'@chassis-ui/react': patch
---

`FloatingInput` ties its label, help and feedback to the field inside it. It generates the ids and a `TextInput`, `Select` or `Textarea` inside takes them: `<FloatingInput label="Email"><TextInput placeholder="…" /></FloatingInput>` needs no `ids`, no `id` and no `aria-labelledby`, and a `TextInput` or `Textarea` no longer prints react-aria's "If you do not provide a visible label" warning under a floating label. `ids` still replaces a generated id, and ids already repeated on the control keep working. A control that is not a field component of this library, such as a native `<input>`, still takes its ids through `ids` by hand; `FloatingInput` warns in development when no element has the id its label points at, in place of the warning about `ids` not being set.
