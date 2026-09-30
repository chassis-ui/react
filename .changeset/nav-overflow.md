---
'@chassis-ui/react': minor
---

Add `NavOverflow`, chassis-css's nav overflow (the Priority+ pattern): wrap a `Nav`, a `NavbarNav`
or the `TabList` of a `Tabs`, and the items that don't fit its width move into a menu behind a
"More" toggle. It follows the width of its container, measures before the browser paints, and
keeps the items in their order. The active item and the item that has focus stay in the list, and
so does an item that isn't a link. A link in the menu is a `MenuItem` with the link's own props,
so `onClick` and a router link given with `asChild` keep working there. Options as chassis-css's
plugin names them: `threshold`, `collapseBelow`, `moreText`, `moreIcon`, `iconPlacement`,
`menuPlacement`, plus `moreLabel`, `menuContainer` and `onOverflow`. Also a subpath:
`@chassis-ui/react/nav-overflow`.

The server renders every item; see "What the server renders" in the SSR guide for the first paint.

With it:

- `NavItem` and `Tab` take `keepVisible`, to keep an item out of the menu. `NavItemProps` is
  exported.
- `Tabs` finds its `TabList` inside the element that holds it, so the list can sit in a
  `NavOverflow` or in an element of your own beside other controls.
- `MenuToggle` takes `caret={false}` for a toggle without the caret, and keeps a `tabIndex` it is
  given, which react-aria's used to replace.
- `IconProvider`'s `icons` takes `more`, the toggle's icon.
