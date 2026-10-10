---
'@chassis-ui/react': patch
---

`MenuSubmenuBack` goes back to the list without closing the menu. Its click reached the `autoClose` listener of `Menu` and `ContextMenu`, which read it as a click on an item and closed the whole menu; the click now stops at the back item, as a click on the submenu's trigger does. Closing a `stacked` submenu below the `sm` breakpoint, with the back item, ArrowLeft or Escape, returns focus to its trigger: the trigger was focused while `@chassis-ui/css` still hid it, so focus fell to the page.
