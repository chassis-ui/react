---
"@chassis-ui/react": minor
---

Internal refactor: `CarouselControlNext` and `CarouselControlPrev` now share their prev/next-button logic via a new internal `CarouselControlButton`, parameterized by direction — mirroring how `CalendarNavButton` already factors the same shape for `Calendar`/`RangeCalendar`. Both components' public props and behavior are unchanged.

`CarouselInner`, `CarouselItem`, and `CarouselOverlay` gain a new `component` prop (previously plain, unconfigurable `div` wrappers), using the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern.
