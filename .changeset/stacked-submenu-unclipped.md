---
'@chassis-ui/react': patch
---

A `stacked` `MenuSubmenu` is no longer clipped by the list it is in above the `sm` breakpoint, a regression of 0.5.1. Since then every `Menu` list kept the room react-aria finds beside its trigger as an inline `max-height` and scrolled inside it; a `stacked` panel renders inside its parent list, so that list cut it off and scrolled instead of letting it sit beside its trigger. A list that holds a `stacked` submenu now keeps the theme's `--cx-menu-max-height` only above that breakpoint, as before 0.5.1. Below it the panel opens in the list's flow, and the list still keeps the room and scrolls.
