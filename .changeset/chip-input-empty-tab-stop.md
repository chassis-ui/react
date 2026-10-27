---
'@chassis-ui/react': patch
---

A `ChipInput` with no chips is one tab stop, its text input. react-aria makes an empty tag group focusable so that a message for the empty state can be reached; `ChipInput` renders none, so Tab from the field before it landed on a zero-size element, and a second Tab was needed to reach the input. Removing the last chip, with Backspace or its close button, moved the focus onto the same invisible element. The empty list is now focusable by script only, and the focus react-aria gives it after the last chip goes moves on to the input.
