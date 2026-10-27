---
'@chassis-ui/react': patch
---

A `Toaster` or `NotificationStack` given its own `onFocus`, `onBlur`, `onKeyDown` or pointer handlers keeps the region's: both run. The caller's props were spread after react-aria's and the region's, and replaced them, so with an `onFocus` of the caller's, closing a toast from the keyboard dropped focus to `<body>` instead of handing it to the next toast.
