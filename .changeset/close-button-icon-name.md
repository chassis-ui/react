---
'@chassis-ui/react': patch
---

A `CloseButton` whose icon is swapped through `children` keeps its "Close" name. Any child used to cancel the fallback, an `aria-hidden` `Icon` or `<svg>` included, so every close button with a custom icon and no `label` was a button with no accessible name. The fallback now gives way only to children that name the button themselves: text, or an element that holds text or carries its own `aria-label`, `aria-labelledby` or `title`.
