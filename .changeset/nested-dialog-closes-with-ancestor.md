---
'@chassis-ui/react': patch
---

An `Alert`, `Modal` or `Drawer` open inside another dialog closes when that dialog closes (#69), as a `Popover` or `Tooltip` in it already did. Left open, it stayed in the top layer under a dialog no longer displayed: invisible, still holding the scroll lock, and, opened as a modal, with the rest of the page inert, where the default `keyboard={false}` of an `Alert` left Firefox and Safari users no way out. It now gets a close request (`onClose`, `onVisibleChange(false)`) and hides at once, with `onHidden`.
