---
'@chassis-ui/react': patch
---

`Button`, `CloseButton` and a clickable `Link` rendered on a plain tag (`component="span"`, `"div"`) keep a `tabIndex` and a `role` the caller passes, as they already did on a `<button>` or an `<a>`. The `role="button"` and `tabIndex={0}` they add to such a tag were written over the caller's, so a `tabIndex={-1}` for a roving tab stop in a toolbar, or a `role="menuitem"`, was lost.
