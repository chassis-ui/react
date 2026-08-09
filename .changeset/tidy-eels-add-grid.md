---
"@chassis-ui/react": minor
---

**Add:** new `Grid` component, wrapping chassis-css's native CSS Grid layout (`.grid`), distinct from the existing flexbox grid built by `Row`/`Col`.

```tsx
<Grid>
  <div className="g-col-4">.g-col-4</div>
  <div className="g-col-4">.g-col-4</div>
  <div className="g-col-4">.g-col-4</div>
</Grid>

<Grid columns={4} gap="1rem">
  <div className="g-col-2">.g-col-2</div>
  <div className="g-col-2">.g-col-2</div>
</Grid>

<Grid fill>
  <div>Column</div>
  <div>Column</div>
</Grid>
```

`columns`/`rows`/`gap` set the `--cx-grid-columns`/`--cx-grid-rows`/`--cx-grid-gap` custom properties directly; `fill` renders `.grid-fill` instead (auto-fit columns, `gap` maps to `--cx-gap` in this mode); `subgrid` adds `.grid-cols-subgrid` alongside the base class. Item-level column span/placement (`g-col-{n}`/`g-start-{n}`) is applied via plain `className` on children — not wrapped by a dedicated prop in this first cut.
