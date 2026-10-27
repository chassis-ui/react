---
'@chassis-ui/react': patch
---

A `ContextMenu` under a right-to-left locale opens leftwards from the pointer, its start edge at the pointer as the docs describe. It asked for `bottom-end` under RTL, which react-aria mirrors again, so the menu extended rightwards as in a left-to-right page.
