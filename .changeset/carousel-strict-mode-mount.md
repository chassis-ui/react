---
'@chassis-ui/react': patch
---

A `Carousel` no longer calls `onSlid` or announces "Slide N of M" when it mounts under `React.StrictMode` (the default in development for Next.js and Vite templates). StrictMode runs mount effects twice, and the second run took the mount for a slide change: screen readers heard the position of every carousel on page load, and `onSlid` received `{ from: 0, to: 0 }`. Both now fire only when the active slide changes.
