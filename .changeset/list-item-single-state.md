---
'@chassis-ui/react': patch
---

`ListItem` rendered as a link or button no longer writes its `active` and `disabled` classes
twice, and a disabled button item no longer carries `aria-disabled` next to its own `disabled`
attribute. `Link`, which renders interactive items, already sets both.
