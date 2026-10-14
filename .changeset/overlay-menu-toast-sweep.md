---
'@chassis-ui/react': minor
---

Fixes to how dialogs, popovers, menus and toasts open, close, take focus and name themselves.

- Breaking: `<Drawer scroll>` with its backdrop leaves the page scrollable, as `scroll` says. It locked the page whenever the drawer opened modally.
- A `Modal`, `Alert` or `Drawer` taken out of the tree while open (`{open && <Modal visible>}`) returns focus to the element that opened it. Focus fell to `<body>`.
- A `ModalTitle` or `DrawerTitle` with `asChild` names its dialog under the child's own `id`. The dialog's `aria-labelledby` named an id no element had.
- Breaking: a `Popover` held open by `visible` with no `onVisibleChange` takes no Escape. On top of the open overlays it prevented every Escape, so a `Modal` under it could not close.
- A `Popover` whose trigger is in a shadow root toggles closed when the trigger is pressed. The press closed it and the click opened it again.
- A `Popover` with no `title` and no `aria-label` is named by its trigger (`aria-labelledby`, and an `id` on the trigger when it has none). It was a dialog with no name.
- `Popover` and `Tooltip` fire no `onShow` or `onHide` on mount under `React.StrictMode`.
- Breaking: a `Popover` or `Tooltip` mounts its panel once, in the dialog it is in. Content in a dialog mounted twice on its first open: its effects ran twice, its state was lost and its fade with it. One mounted open now fades in.
- Breaking: the list of a `Menu`, `MenuSubmenu`, `ContextMenu`, `Combobox` and `Autocomplete` takes its height from chassis-css's `--cx-menu-max-height`. react-aria wrote an inline `max-height` over it. The 320px cap of a `Combobox` or `Autocomplete` list, which the components set under a name chassis-css doesn't read, now applies.
- Overlays mounted open together take Escape innermost first. A `Modal` mounted around an open `Menu` took the key from it.
- Breaking: a click on a `MenuToggle` closes another open `Menu`. Both stayed open.
- Breaking: choosing a `Menu` item returns focus to the toggle, unless the item moved it elsewhere. It fell to `<body>`.
- A `ContextMenu` inside another opens alone on a right-click or Shift+F10, and a changed `id` reaches the region and its list's label.
- Breaking: a `MenuSubmenu` with `activation="hover"` opens on a tap on a device without hover, and a click on its trigger on a device with hover no longer closes the menu.
- A `Toast` or `Notification` hidden while hovered or focused (its close button takes focus) dismisses itself again when shown. A `delay` a timer can't hold (`Infinity`, over 2^31 - 1 ms) runs no timer: it dismissed at once.
- Closing a queued toast or notification from the keyboard moves focus to the next one, or back to where it was before the region. It fell to `<body>`.
