---
'@chassis-ui/react': minor
---

Icons are now configurable, and the components that draw icons of their own no longer depend on
`Icon`.

**Breaking: `Icon` no longer references `/static/icons/chassis-icons.svg` by default.** With no
`sprite` set, it renders `<use href="#name">`, which works for a sprite embedded in the page. To
keep the old behavior, set the path once for the whole app:

```tsx
<IconProvider sprite="/static/icons/chassis-icons.svg">{children}</IconProvider>
```

**New `IconProvider`.** It sets defaults for every `Icon` below it (`sprite`, `className`, `font`,
`fontPrefix` for icon fonts generated with a prefix other than `cx-`) and configures the icons
this library's own components draw. Nested providers extend the one above them.

**Replaceable library icons.** `Pagination`, `CarouselControlPrev`/`CarouselControlNext`,
`CarouselPlayPause`, `NavbarToggler`, the check on a selected menu or combobox item, and a string
`icon` on `Toast`/`Notification` now ask for their icon by purpose: `check`, `previous`, `next`,
`menu`, `play` or `pause`. You can replace any of them with another icon name or with an element
from any icon set:

```tsx
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

<IconProvider icons={{ check: <Check />, previous: <ChevronLeft />, next: <ChevronRight /> }}>
```

You can also render every icon name with your own icon component (`component={MyIcon}`, set in a
`'use client'` module). A single instance can override its icon with the new `previousIcon`/
`nextIcon` (Pagination), `icon` (carousel prev/next controls, NavbarToggler), and
`playIcon`/`pauseIcon` (CarouselPlayPause) props. A custom icon gets the class the component
positions it by, including `directional-icon`, so arrows still flip in right-to-left layouts. It
doesn't get `.icon`, whose `fill` would paint over outline icon sets.

**Pagination's previous/next chevrons are now the outline style,** matching the carousel's.

**Fix: `Icon`'s `size` had no visible effect when chassis-css was loaded.** It set only the SVG's
`width`/`height` attributes, which chassis-css's `.icon` sizing overrides, so `size={48}` rendered
at 24px. It now sets `--cx-icon-size`, which also makes it work for font glyphs, and accepts CSS
lengths as well as pixel numbers (`size="1.25rem"`).
