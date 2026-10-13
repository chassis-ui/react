---
'@chassis-ui/react': minor
---

Fixes to refs and `asChild`, the navigation components and the carousel.

- A callback ref that returns a cleanup function (React 19) has it run when the element goes away. Every component that forks your ref with its own (`asChild`, a `Tooltip` or `Popover` trigger, `Link`, `Button`) dropped the cleanup and called the ref with `null` instead. An `async` callback ref is called; it was never called.
- Under `asChild`, the inline styles a component computes are merged with the child's own `style`, the child's winning. A child with any `style` lost them: a `Grid`'s `--cx-grid-gap`, a `GridItem`'s `grid-template-rows`.
- A component element given to `asChild`, such as a router link, stays mounted when its `href` or `to` comes and goes. It was remounted, and lost its state and focus.
- Two copies of the package in one page, or a hot reload of it, no longer leave `outline: none` on a pressed element for good.
- `Tab` and `TabPanel` work with a number as `id`, as the type allows. `<Tab id={1}>` showed no panel and ignored `disabled`. `selectedKey`, `defaultSelectedKey` and `disabledKeys` take the numbers too, and `onSelectionChange` reports the `id` as the `Tab` has it.
- An item of `List`'s `items` renders as a `ListItem` does. A disabled linked item is out of the tab order and doesn't navigate, and a linked item is marked by a `Scrollspy` around the list.
- `NavOverflow` keeps every item of a list that has no more than `threshold` of them. It moved them all into the menu.
- An `Accordion` item with no `id` that starts `open` is the one expanded when `onExpandedChange` is set. A different item was.
- `Carousel`:
  - Autoplay follows `interval`, `ends`, `items`, `transition` and `onSlide` as they change. It kept those of the render it started in.
  - A controlled carousel whose parent leaves `activeIndex` where it is keeps stepping from the slide that is shown.
  - When autoplay reaches the last slide of `ends="stop"`, `CarouselPlayPause` shows Play. It is disabled on that slide while stopped, as `CarouselControlNext` is, and focus on it moves to the previous control: there is nothing left to play, and Play there ran one interval with no slide to go to. A cycle that would start on the last slide doesn't.
  - With `transition="fade"`, `onSlid` fires when the incoming slide has faded in. It fired with `onSlide`.
  - Breaking: in a right-to-left layout Left Arrow moves to the next slide and Right Arrow to the previous one, as the slides lie.
- Breaking: a `Button` that is a link (`href`, or an `<a>` as `component` or the `asChild` element) no longer gets `aria-pressed`, which the link role doesn't take and axe reports. `pressed` still applies the `.active` class; give the button `role="button"` for it to be announced as pressed.
