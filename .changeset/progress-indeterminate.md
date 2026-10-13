---
'@chassis-ui/react': minor
---

`Progress` and `ProgressBar` take `indeterminate`, for work whose extent is not known: a page navigation, an upload before its size is known, a request with no progress events. The bar sweeps across the track, and `Progress` leaves out `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, where it used to report "0%". `value` and `inlineValue` are ignored, and `showValue` keeps its place in the caption row empty. With `striped` the bar fills the track with its stripes instead, moving when `animated` is set. The sweep animates `transform` only, so it keeps running while the main thread is busy; under `prefers-reduced-motion: reduce` the bar shows still stripes. `--cx-progress-indeterminate-animation` replaces the animation. The styles are in `@chassis-ui/react/style.css`.
