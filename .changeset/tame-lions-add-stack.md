---
"@chassis-ui/react": minor
---

**Add:** new `Stack` component, wrapping chassis-css's `.hstack`/`.vstack` flexbox layout helpers.

```tsx
<Stack gap="medium">
  <div>First item</div>
  <div>Second item</div>
</Stack>

<Stack direction="vertical" gap="medium" responsive={{ small: 'horizontal' }}>
  <button type="button">Primary action</button>
  <button type="button">Cancel</button>
</Stack>
```

`direction` (`'horizontal'` default, `'vertical'`) picks the base layout; `gap` maps to the `gap-*` utility classes (`Spacing | 0`); `responsive` switches `direction` at one or more breakpoints via container queries — pair it with a `.contains-inline` ancestor to establish the container context.
