---
'@chassis-ui/react': minor
---

Breaking: `@chassis-ui/css` 0.14 is required (the peer range is `>=0.14.0 <0.15.0`), so a project on css 0.12 or 0.13 takes css 0.14 with this version. No prop, export or class name of this package changes, and its `style.css` is the same as in 0.6.0.

The default tokens now come from `@chassis-ui/website-tokens`, which css 0.14 forwards in place of `@chassis-ui/tokens`, with the same `dist/` layout and token names. `@chassis-ui/tokens` is now the builder of token repositories, with the `chassis-tokens` command. A project that compiles the Sass of css 0.14 with its default token source needs `@chassis-ui/website-tokens` installed. A project that forwards `@chassis-ui/tokens/dist/...` from a `_chassis-tokens.scss` of its own keeps working while `@chassis-ui/tokens` 0.12.x ships `dist/`, and should move to `@chassis-ui/website-tokens/dist/...` before the builder drops it. The rest of the path stays the same.

A page changes in two places when it moves from css 0.12 to 0.14, both from css 0.13; 0.14 compiles the same as 0.13. A `flush` `Accordion` has no background of its own, so the page shows through its items and titles, unless it has a context color. `--cx-opacity-dim-slight` goes from 0.05 to 0.1, which doubles the strength of what reads it: the `.bg-opacity-slight` utility and `--cx-dim-slight` on a `solid` context, a `solid` notification and a badge, where the hover of a table or a link button and the header of a toast take it. A project that compiles the Sass also loses the `$black-t-*` and `$white-t-*` variables of css and the transparent primitive tokens, such as `$cx-color-base-primitive-light-primary-t-5050`. No class changes.
