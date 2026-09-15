---
'@chassis-ui/react': patch
---

Fix `Popover` and `Tooltip` dropping the trigger child's `ref`.

Both re-render their child with `cloneElement`, whose config replaces the child's `ref` outright
rather than merging with it, so `<Tooltip><Button ref={mine} /></Tooltip>` never populated `mine`.
Both now fork the caller's ref with their own. `Tooltip` additionally spread its react-aria
`triggerProps` over the child's props, silently dropping a handler the caller had put on their own
trigger (e.g. `onFocus`); both now merge them with `mergeProps` instead.
