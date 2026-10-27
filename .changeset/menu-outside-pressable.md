---
'@chassis-ui/react': patch
---

A `Menu` or `ContextMenu` closes on a click outside it on a react-aria control too: a `Tab`, a `Checkbox`, a `Select` or `Combobox` trigger, a calendar cell, a `Table` or `DataGrid` row. react-aria's press handling stops the `pointerdown` and `click` of the element it is on, and the menus heard outside presses on `window` once they had bubbled there, so the menu stayed open beside the control just used. They now see those events in the capture phase too, and handle one that never bubbles up once its dispatch is over.
