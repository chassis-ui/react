---
'@chassis-ui/react': minor
---

Fixes to the carousel, the time field, range presets, list items and the scrollspy, and two values that no longer render a class.

- `Carousel`:
  - A controlled carousel (`activeIndex`) is fed from `onSlide`. The docs and the development warning also offered `onSlid`, which cannot do it: it fires once a slide has arrived, and a controlled carousel doesn't leave for one until `activeIndex` names it. The warning now fires when `onSlide` is missing, with or without `onSlid`.
  - When the parent of a controlled carousel doesn't follow a swipe, the track scrolls back to the active slide once the swipe has been at rest for half a second, which leaves a parent that follows late the time to. It stayed on the slide the user had swiped to, and the next step that was followed didn't scroll.
  - `onSlid` reports the slides `activeIndex` moved between when the parent chose the slide itself, or answered a request with another one. It reported the last step the carousel had asked for.
  - Autoplay under `ends="stop"` is over when it arrives at the last slide. It waited one more interval there, with the indicator filling and `CarouselPlayPause` reading Pause.
- Breaking: an empty `TimeField` with `required` holds its form back from submitting, and its first segment takes focus. `required` was `aria-required` alone and `form.checkValidity()` was `true`. A form that should submit anyway needs `noValidate`.
- Breaking: a preset of `RangeCalendar` or `DateRangePicker` with an unavailable day in its range is disabled, as the grid can't select a range across one. It was committed as given.
- A `ListItem` whose `component` or `asChild` element is a component, such as a router link, stays mounted when its `href` comes and goes. It was remounted, and lost its state and focus.
- `Scrollspy` and `useScrollspy` mark the last section once the scrolling area is at its end. A last section shorter than the area below the activation line never became the active one.
- Breaking: `CardImage` renders no class for an `orientation` that `@chassis-ui/css` has none for, and warns in development: `top` or `bottom` at a breakpoint, and any value at `2xl`. It rendered a class with no rule, such as `md:card-image-top`, which did nothing unless your own CSS defined it.
- Breaking: `Skeleton` renders no width class for a `span` that isn't a whole number from 1 to 12, `'auto'` or a boolean, such as `0`, `13` or `'50%'`, and warns in development. It rendered a class with no rule, such as `w-13/12`.
