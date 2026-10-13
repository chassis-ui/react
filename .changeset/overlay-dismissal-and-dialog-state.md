---
'@chassis-ui/react': patch
---

Fixes to how `Modal`, `Alert`, `Drawer`, `Popover`, `Menu` and `ContextMenu` open, close and nest.

- A `Modal`, `Alert` or `Drawer` whose `visible` goes back to `true` while its exit transition runs stays open. The end of that exit closed it, with `visible` still `true`.
- `onClose` fires once per close. Every Escape or backdrop click during the exit fired it again.
- A dialog the browser closes by itself (a second Escape in a row, a `<form method="dialog">`) asks to close through `onClose` and `onVisibleChange(false)`, releases the scroll lock and fires `onHidden`.
- `onShown` fires for a dialog mounted with `visible` under `React.StrictMode`.
- Escape closes the innermost open overlay only. One press closed a menu, the popover it was in and the dialog around both.
- A press inside an overlay opened from a `Popover`, a `Menu` or a `ContextMenu` (a nested popover, a `Menu` with `container`, a picker's list) no longer counts as a press outside it. `Popover` closes on the press outside, not the click that follows, so a control that removes itself when clicked doesn't close it.
- A submenu nested in a `MenuSubmenu` closes with it.
- `Menu`'s `container` puts the list in the open dialog the menu is in, and so does a `MenuSubmenu` with its panel: both went to `document.body`, behind a `Modal`'s backdrop, where a submenu could not be used. A `Menu` closes when the dialog around it does.
- `Modal` and `Drawer` have `aria-labelledby` only when a `ModalTitle` or `DrawerTitle` is rendered, under the id the title has, and not at all when given an `aria-label`. The attribute named an id no element had when there was no title or the title had its own `id`.
- A `responsive` `Drawer` asks to close when the viewport grows past its breakpoint, where it stayed over a scroll-locked page.
