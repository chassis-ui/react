---
"@chassis-ui/react": minor
---

`Link` — the most-consumed polymorphic component in the library — now uses the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`. `NavLink`, `List`, `ListItem`, `MenuItem`, `CardLink` and `NavItem` all wrap `Link` and migrate along with it, since they inherited the same untyped gap.

`NavLink` drops its manual `to?: string` escape hatch (previously needed to let a router's `to` prop through a plain `string` type on *any* usage, even a default, non-router anchor). A custom router `component` now gets its own `to`-shaped prop typed and passed through correctly via the generic pattern instead — e.g. `<NavLink component={RouterLink} to="/x">` — rather than a blanket, untyped stand-in.
