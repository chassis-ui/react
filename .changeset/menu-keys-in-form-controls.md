---
'@chassis-ui/react': patch
---

A text field, `<select>`, `<textarea>`, radio, range or editable element inside a `Menu`, `MenuSubmenu` or `ContextMenu` list keeps its own arrow, Home and End keys. The menu's navigation took them from it: Home and End no longer moved the caret, and ArrowDown or ArrowUp left the field for the first or last item, so a `<select>` in the list could not be operated with the arrows. Escape still closes the menu from inside a field, and a checkbox, which has no use for the arrows, still steps on to the items.
