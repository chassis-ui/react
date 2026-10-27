---
'@chassis-ui/react': patch
---

A `CloseButton` whose icon is swapped through `children` keeps its "Close" name. Any child used to cancel the fallback, an `aria-hidden` `Icon` or `<svg>` included, so every close button with a custom icon and no `label` was a button with no accessible name. The fallback now gives way only to children that name the button themselves: text, an element that holds text or carries its own `aria-label`, `aria-labelledby` or `title`, or a component other than `Icon` whose output it can't read (a `<FormattedMessage>`). Give an icon component from another library `aria-hidden`.
