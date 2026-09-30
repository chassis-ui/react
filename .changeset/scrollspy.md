---
'@chassis-ui/react': minor
---

Add `Scrollspy`, chassis-css's scrollspy: wrap a navigation whose links point to sections of the
page, and the link to the section being read gets `.active` and `aria-current="true"`, in the
viewport or in an element that scrolls (`root`). The links are `Link` and the components built on
it (`NavLink`, `NavItem`, an interactive `ListItem`, `MenuItem`), with `href` on the component or,
under `asChild`, on its element. The link a nested `Nav` follows and the toggle of a menu are
marked too, as the plugin marks them. Options: `rootMargin`, `smoothScroll` (instant under
reduced motion), and `onActiveChange` for the plugin's `activate` event. Also `useScrollspy(ids,
options)`, which returns the active section's id, and a subpath: `@chassis-ui/react/scrollspy`.

The active section is the last whose top has passed a line near the bottom of the scrolling area,
or the first while it is still in view at the top: the same position always marks the same link,
whichever way the page scrolled. Sections rendered later are found without a `refresh` call. The
server marks no link; see "What the server renders" in the SSR guide.
