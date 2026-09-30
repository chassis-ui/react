---
'@chassis-ui/react': minor
---

`ContextMenu`: the region a context menu belongs to. A right-click (`contextmenu`, so Ctrl+click on
macOS too), a long press by a finger or a pen, or Shift+F10 and the context menu key on a focused
element inside it open the menu at that point, in place of the browser's own. The menu is a
`MenuList` among the region's children, with `Menu`'s items, headers, dividers, submenus and
`items` data, portaled to the body or to the open `<dialog>` around the region, and positioned with
its start corner at the pointer, flipped above it when there is no room below. The first item takes
focus on open; Escape and a click on an item close the menu and return focus to the element that
had it; a press outside closes it too. The region is a polymorphic element (`component`,
`asChild`) and takes `visible`/`defaultVisible`/`onVisibleChange`, `onShow`/`onHide`, `autoClose`
as `Menu`'s, and `disabled`, which leaves the region to the browser.

`MenuList` no longer writes `aria-labelledby` when it is given an `aria-label` of its own, which
that attribute would have outranked, nor when there is no trigger to point at.
