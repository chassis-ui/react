---
'@chassis-ui/react': patch
---

A `Menu` no longer calls `onHide` and `onHidden` (or `onShow` and `onShown` with `defaultVisible`) when it mounts under `React.StrictMode`. StrictMode runs mount effects twice, and the second run reported the menu's initial state as a change, so every menu on a page in development sent a spurious hide on load. The four callbacks now fire only when the menu opens or closes.
