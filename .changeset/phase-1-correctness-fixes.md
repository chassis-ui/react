---
"@chassis-ui/react": patch
---

Fixes five isolated correctness bugs found in a component audit, none of which change any public prop or type:

- `Autocomplete` now memoizes its entry-list/disabled-keys derivation (mirroring `Combobox`), instead of recomputing it on every render including every keystroke.
- `ListItem` now sets `aria-current="page"` on its active item, matching `List`/`Nav`, instead of the non-standard `aria-current={true}`.
- `Toast`'s `autohide` timer now actually waits for the show transition to reach `entered` before starting, matching its documented behavior, instead of starting the instant `visible` flips true while the toast is still animating in.
- `MenuSubmenu` now cancels the `requestAnimationFrame` it schedules to focus the submenu's first item when the submenu closes or unmounts before that frame fires, instead of leaving it to run against a stale/removed panel.
- `PaginationItem`'s disabled-click guard now also applies when rendering a custom `component`, not just the built-in `button`/`a` branches.
