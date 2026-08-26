---
"@chassis-ui/react": minor
---

`Button`, `Chip`, `CloseButton` and `Avatar` now use the same type-safe polymorphic `component` pattern as `Placeholder`/`CardImage` — passing a custom `component` gets full type-checking/autocomplete for that component's own props at the call site, instead of the previous untyped `component?: string | ElementType`. `AvatarStack` gains a new `component` prop (it was a plain `div` wrapper with no way to override the root element).

Alongside the migration, this fixes two confirmed bugs where the old untyped pattern silently dropped or overrode a caller's `component`/`href`:

- `Button` and `Chip` no longer force `component` to `'a'` whenever `href` is set — an explicitly passed `component` now always wins, with `href` still passed through to it.
- `Avatar` no longer silently drops `href`/`disabled` when `component` is a custom component reference rather than the literal `'a'`/`'button'` strings — they're now always forwarded.

Internally, `Button`/`Chip`/`CloseButton` also now share one `useDisabledAnchorGuard` hook for "a non-native-button element has no real `disabled`, so guard its click" instead of duplicating that logic three times.
