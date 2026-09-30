---
'@chassis-ui/react': patch
---

Remove the `react-transition-group` dependency. `Collapse`, `TabPanel`, `Toast`, `Notification`,
`Tooltip` and `Popover` apply the same chassis-css classes in the same order as before.

- A transition now lasts as long as the element's own CSS transition, as it already did for
  `Modal`, `Drawer` and `Menu`, instead of a duration fixed in the component. A theme that changes
  a transition's duration is followed, and so is `prefers-reduced-motion`.
- Fix a queued toast coming back after it was closed (#40). A `Toast` or `Notification` that
  unmounts before its exit transition has finished now calls `onClose` as it unmounts. A `Toaster`
  remounted by a navigation, such as a Server Action that redirects, no longer shows the toast
  again.
- A newly selected `TabPanel` starts to fade in as soon as it is in the page. It used to wait
  150 ms at full transparency first.
- `Collapse` keeps a `style` passed to it while it animates. The `style` used to replace the size
  the transition needs, so the transition didn't run.
