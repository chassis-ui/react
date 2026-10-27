---
'@chassis-ui/react': patch
---

Closing one of several toasts or notifications with the mouse no longer keeps the rest on screen. The click focused the close button, and when the toast went the region handed focus on to the next toast, whose autohide paused for as long as it held it: it stayed until the user clicked somewhere else. As in react-aria's own region, a toast closed with the pointer now gives focus back to the element that had it before it entered the region, and the others hide after their `delay`. Closed from the keyboard, a toast still hands focus to the next one.
