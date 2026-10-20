---
'@chassis-ui/react': patch
---

A `Modal`, `Drawer` or `Popover` given `aria-labelledby={undefined}` keeps its automatic name (#66): the `ModalTitle` or `DrawerTitle`, or a `Popover`'s title or trigger. A wrapper that forwards an optional prop (`<Modal aria-labelledby={props.labelId}>`) passes the key with no value, and that `undefined` wrote over the computed label, leaving an unnamed dialog. A caller's own `aria-labelledby` still names the dialog in place of the title.
