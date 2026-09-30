---
'@chassis-ui/react': minor
---

`Tree` and `TreeItem`: a tree of expandable items, on react-aria-components' `Tree`. Items are
written as nested `TreeItem` elements, or rendered from data with `items` and a render function on
the tree and on any item, as `DataGrid`'s body is. An item with child items has a chevron that
expands and collapses it, as the arrow keys do; `expandedKeys`/`defaultExpandedKeys`/
`onExpandedChange` hold which items are expanded, and the server renders the expanded ones.
`selectionMode` allows one item or several to be selected, with a checkbox per item for multiple
selection (`checkboxes` turns it on or off), and `selectedKeys`/`onSelectionChange`,
`disabledKeys`, `disallowEmptySelection` and `selectionBehavior` as on `DataGrid`. Enter, or a
click in a tree with no selection, calls `onAction`, and `renderEmptyState` fills an empty tree.
The keyboard
moves between items with the arrow keys, Home and End, and finds one by typing its text.

`Tree.scss` styles the rows, in `dist/style.css`: indentation per level (`--cx-tree-indent`), the
chevron, and the hover, selected and disabled states, read from `.list`'s and `.menu`'s custom
properties. The chevron is `IconProvider`'s new `expand` icon, or the tree's `expandIcon`.
