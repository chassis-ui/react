---
'@chassis-ui/react': patch
---

`Modal`, `Drawer` and `Alert` rendered with `open` stay open. They used to close themselves right
after mounting (and after hydration, in a server-rendered page), firing `onHidden`, because their
state started closed. `open` is now the initial state when neither `visible` nor `defaultVisible`
is set: the dialog is open from the first paint, server HTML included, as a non-modal dialog, and
stays open until a close request.
