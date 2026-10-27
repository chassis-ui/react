---
'@chassis-ui/react': patch
---

A `Button` keeps an `aria-pressed` of the caller's when `pressed` isn't given: `<Button aria-pressed="mixed">` is a tri-state toggle again, and a toggle whose state is kept outside `pressed` is announced as one. `pressed` was written after the caller's attributes as `aria-pressed={undefined}`, which removed the caller's on a `<button>`, an `<input>` and an element given button semantics. `pressed` still wins when both are given.
