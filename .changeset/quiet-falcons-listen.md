---
'@chassis-ui/react': patch
---

Fix six behavioural defects in focus handling, overlay callbacks, handler composition and form
field rendering.

- **`focusRedirect` could suppress a focus ring permanently.** It saved the element's outline,
  forced it off, and restored it on blur — but a second call before that blur captured the
  already-suppressed `none` as the value to restore. Reachable by clicking twice at the same
  disabled end of an `ends="stop"` `Carousel`. It now delegates the whole suppress/restore cycle
  to `suppressFocusRing`, which owns the re-entrancy guard, rather than reimplementing it without
  one.
- **`Popover` stole focus back to its trigger on every close.** Dismissing by clicking another
  control moved focus off whatever the user had just clicked. Focus is now reclaimed only when the
  popover still holds it, or when nothing does.
- **`Popover`, `Tooltip` and `Menu` reported a hide on mount.** The visibility effect ran its
  "hidden" branch on the initial commit, so `onHide` (and `Menu`'s `onHidden`) fired for an overlay
  that had never been shown, before `onShow` had fired once. All of these report transitions now,
  so none fires on mount — including `onShow`/`onShown` for an overlay mounted already-open.
- **`Carousel` let a caller's handler replace its own.** `onKeyDown`, `onMouseEnter` and
  `onMouseLeave` were overwritten by the props spread, so passing any of them silently switched off
  arrow-key navigation or pause-on-hover. They are composed now, matching the rule
  `CarouselControlPrev`/`CarouselControlNext`/`CarouselPlayPause` already follow for `onClick`.
- **`Modal` and `Drawer` dropped a caller's `onClick` entirely.** A `<dialog>` needs `onClick` for
  its own backdrop detection, and the caller's was spread alongside it. It is chained ahead of the
  backdrop handling now, and fires for every click on the dialog.
- **A field set both `invalid` and `valid` rendered a duplicate DOM id.** Both feedback nodes carry
  the same id, leaving every control's `aria-describedby` pointing at an ambiguous target. At most
  one renders now, invalid winning.

Two of these change behaviour beyond restoring the documented contract, hence a minor rather than a
patch:

- An overlay mounted already-open (`<Popover visible>`) no longer fires `onShow`/`onShown` on
  mount. Wire up to the transition instead, or read the prop you already control.
- `FormField` given a `className` but no `label`/`help`/feedback now renders its `.form-field`
  wrapper instead of returning the children bare — previously the class was silently dropped, so it
  had nowhere to land. Fields with no `className` still render bare, unchanged.
