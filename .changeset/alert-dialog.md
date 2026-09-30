---
'@chassis-ui/react': minor
---

Add `Alert`, chassis-css's alert dialog: a `<dialog role="alertdialog">` opened as a modal dialog
for a decision the flow can't continue without, such as confirming a destructive action. Compose
`AlertIcon`, `AlertBody` with `AlertTitle`, `AlertCode` and `AlertText`, and `AlertFooter` with
the actions. `AlertCancel` is the least destructive action: it closes the alert and has focus
when the alert opens. Open state works like `Modal`'s (`visible`, `defaultVisible`,
`onVisibleChange`, `onClose`), but a backdrop click and Escape don't close an alert unless
`backdrop` and `keyboard` allow them. The title names the alert and the code and text describe
it. Also a subpath: `@chassis-ui/react/alert`.

`Modal`, `Drawer` and `Alert` now focus an element with `data-autofocus` when they open. The docs
said `autofocus` worked, but React writes no `autofocus` attribute in a page rendered in the
browser, so the dialog itself got focus instead. A closing `Modal`, `Drawer` or `Alert` also no longer
takes focus back from a dialog opened from it, and after a chain of them focus returns to the
element that opened the first.
