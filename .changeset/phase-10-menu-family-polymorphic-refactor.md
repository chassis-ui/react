---
"@chassis-ui/react": minor
---

`Menu`, `MenuHeader`, `MenuList`, and `MenuText` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`. `Menu` defaults `C` to `Fragment`, matching its existing runtime default (`MenuToggle`/`MenuList` render with no wrapping element unless an explicit `component` is passed).

Internal refactor, no other API change: `Menu`'s own `MenuContext` value is now memoized, so context consumers no longer re-render on every `Menu` render for unrelated prop changes. The `menuStyle`/`placementAttr` overlay-positioning computation — previously duplicated in `Menu` and `MenuSubmenu` — is extracted into a shared `resolveMenuOverlayPositioning` helper (`menuOverlayPosition.ts`) both now call.
