---
"@chassis-ui/react": minor
---

`<Grid>`'s `gap` prop now also accepts a `Spacing` token (the same named scale `<Row>`'s `gutter`/`<Stack>`'s `gap`/`<Flex>`'s `gap` use), resolved to the matching `--cx-space-*` custom property. Any other string is still passed through unchanged as a raw CSS `gap` value, so existing usage (`gap="1rem"`, `gap=".25rem 1rem"`) is unaffected.

```diff
- <Grid gap="1.25rem">
+ <Grid gap="large">
```

`<Grid>` intentionally does not get a `responsive` prop for `columns`/`rows`/`gap` — chassis-css has no breakpoint-scoped utility classes for the grid container itself (only for item placement on children, via `g-col-{n}`/`g-start-{n}`'s breakpoint-prefixed variants), so there's nothing to wire a `responsive` override onto without inventing new runtime infrastructure this library doesn't otherwise use. Reach for `<Row>`/`<Col>` when you need a responsive column count.
