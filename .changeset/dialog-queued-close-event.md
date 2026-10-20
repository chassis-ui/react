---
'@chassis-ui/react': patch
---

A `Modal`, `Drawer` or `Alert` shown again before the browser delivers the `close` event of its last close stays open (#65). Browsers fire that event from a queued task, after whatever ran in the same task as the close: a wizard that opens its next step from `onHidden`, or a `visible` set to `false` and back in one event, reopened the dialog first, then took the late event for the browser's own close, fired `onClose` and `onVisibleChange(false)`, and closed it. A `Popover` or `Tooltip` open in a dialog reopened that way closed too. The event is now left alone when the dialog is open again by the time it arrives; a close the browser makes by itself (a `<form method="dialog">`, a second Escape) still closes the dialog.
