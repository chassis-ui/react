---
'@chassis-ui/react': patch
---

`Popover` and `Tooltip` panels are as tall as their content (#71). react-aria wrote the room it found beside the trigger as an inline `max-height` on the panel, which nothing scrolled: a popover taller than the room, a form in a popover on a short viewport, overflowed its own border, and a tooltip placed before it had a size kept `max-height: 0px`. The menus keep the room and scroll inside it since 0.5.1; a popover's arrow sits at its edge, which a scrolling panel would clip, so these release it, as chassis-css's own popovers have no cap.
