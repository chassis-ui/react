---
'@chassis-ui/react': patch
---

A `Table` row listed in `disabledKeys` is skipped by the arrow keys and carries `aria-disabled="true"`, as `disabledKeys` promises and as `DataGrid` already did. Under react-stately's default `disabledBehavior` the row could only not be selected: it still took focus from the keyboard, and nothing told a screen reader it was disabled.
