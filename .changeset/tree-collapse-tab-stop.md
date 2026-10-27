---
'@chassis-ui/react': patch
---

A `Tree` keeps its tab stop when a controlled `expandedKeys` collapses the row above the focused one (a "Collapse all" button, for example). react-aria-components kept the hidden row as the tree's focused key, so no rendered row could be tabbed to: Tab no longer entered the tree until a row was clicked, and when the hidden row had the focus, it fell to `<body>`. The collapsed row now takes the focused key, as it does when its own chevron collapses it, and the focus too when the hidden row had it.
