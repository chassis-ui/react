---
'@chassis-ui/react': patch
---

A click on the `<label>` of a form control inside a `Menu`'s or `ContextMenu`'s list keeps the menu open, as one on the control already did. The click lands on the label, or the text inside it, before the browser passes it on to the control, and the check for a form control looked at that element's tag name alone, so the docs' own Forms example closed the menu when "Remember me" was ticked. A click is now used in place when it lands in an `input`, `select`, `option`, `textarea`, `label` or editable element inside the list, or on a `form` there itself: a button in that form still closes the menu. A menu that sits inside a page's form still closes on an item.
