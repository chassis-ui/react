---
'@chassis-ui/react': minor
---

Breaking: `@chassis-ui/css` 0.12 is required (the peer range is `>=0.12.0 <0.13.0`). No prop, export
or class name of this package changes, and no component renders a class whose rule 0.12 changes;
a page changes where its own classes do. A border width or style class, such as `.border-xl` or
`.border-style-dashed`, sets `border-width` and `border-style` on its element only, no longer the
inherited `--cx-border-width` and `--cx-border-style` that reached every border inside it; on a
component it changes the outline, and the component's variable, such as `--cx-card-border-width`,
changes its dividers too. In `chassis.css` a longhand utility wins over a shorthand on the same
element: `place-items-center align-items-baseline` aligns to the baseline, and `-m-2xl mb-0` gives
a bottom margin of `0`. The dividers of a card, popover, toast, tabs and table read
`--cx-border-style`, and the inner corners of a card, accordion, popover and toast follow the
component's own radius and width. The changelog of `@chassis-ui/css` 0.12.0 has the full list.
