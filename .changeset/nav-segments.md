---
'@chassis-ui/react': minor
---

`Nav` and `TabList` take `variant="segments"`, the segmented control that `@chassis-ui/css` 0.6
made of the pills: it renamed `.nav-pills` to `.nav-segments` and restyled it, with the colors,
padding, corner radius and shadow of the design tokens.

Breaking: `variant="pills"` renders `nav-segments`, where it rendered `nav-pills`, a class css 0.6
no longer has. It is deprecated and warns once in development: write `variant="segments"`. A
selector of your own on `.nav-pills` no longer matches, and the `--cx-nav-pills-*` custom
properties are `--cx-nav-segments-*` in css 0.6.

css 0.6 also renamed `.card-header-pills` to `.card-header-segments`, a class an app writes itself
on a `Nav` in a `CardHeader`: `<Nav variant="segments" className="card-header-segments">`.

Also new on `Nav` and `TabList`:

- `size="sm"` and `size="lg"`, the nav sizes of css 0.6 (`.nav.sm`, `.nav.lg`), which scale the
  padding, gap, icon and font of the links in every variant.
- `variant="underline"` (`.nav-underline`), which underlines the active link.
