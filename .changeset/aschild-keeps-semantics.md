---
'@chassis-ui/react': patch
---

Fix `asChild` dropping the component's own handling of the element it renders. A component now
treats its child as it treats the same element passed to `component`, so
`<Button asChild disabled><a href="/login">` renders what `<Button component="a" href="/login"
disabled>` renders.

- `Button`, `Link`, `NavLink`, `CardLink`, `MenuItem`, `Chip`, `PaginationItem`, `Avatar` and
  `ListItem`, when `disabled` with a link child: the link gets `aria-disabled="true"` and
  `tabindex="-1"` and its click is blocked, including the child's own `onClick`. It used to get
  an invalid `disabled` attribute, or only a class, and still navigated.
- `CloseButton` with a link child keeps its `close-button` classes and its `Close` label.
- `ListItem` with a link or `<button>` child gets `list-action`, and `List` renders a `<div>`
  around it instead of a `<ul>`. `Stepper` does the same for a `StepperItem`.
- `List` and `Stepper` with a `<ul>`/`<ol>` child of their own keep rendering `<li>` items.
- `Placeholder` renders its child as the image. It used to ignore the child and render the
  generated graphic.
- A plain tag as the child, such as `<div>`, gets what `component="div"` gets: `Button` and
  `CloseButton` add `role="button"` and keyboard activation.

A component element with an `href` or `to` prop, such as a router's `<Link>`, counts as a link.
Any other component element is still trusted with its own semantics, as with `component={...}`.
