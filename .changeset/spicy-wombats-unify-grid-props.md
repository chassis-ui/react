---
"@chassis-ui/react": major
---

**Breaking:** `Col`, `Row`, and `Placeholder` no longer accept per-breakpoint `xs`/`sm`/`md`/`lg`/`xl`/`xxl` props. They now use the same base-prop-plus-`responsive`-object pattern as `Flex`/`Stack`.

- `Col`: `xs`/`sm`/`md`/`lg`/`xl`/`xxl` → `span`/`offset`/`order` (base) + `responsive?: Partial<Record<Breakpoint, { span?, offset?, order? }>>`.
- `Row`: `xs`/`sm`/`md`/`lg`/`xl`/`xxl` → `cols`/`gutter`/`gutterX`/`gutterY` (base) + `responsive?: Partial<Record<Breakpoint, { cols?, gutter?, gutterX?, gutterY? }>>`.
- `Placeholder`: `xs`/`sm`/`md`/`lg`/`xl`/`xxl` → `span` (base) + `responsive?: Partial<Record<Breakpoint, Span>>`.

```diff
- <Col xs={6} md={4}>
+ <Col span={6} responsive={{ medium: { span: 4 } }}>

- <Row xs={{ cols: 1 }} md={{ cols: 3 }}>
+ <Row cols={1} responsive={{ medium: { cols: 3 } }}>

- <Placeholder sm={7} />
+ <Placeholder responsive={{ small: 7 }} />
```

`Breakpoint` values are `'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'` — the same type `Flex`/`Stack` already use, replacing the short-key shorthand the grid family previously needed as JSX prop names.

Also fixes two latent bugs surfaced while rewriting the class-building logic: `Col`/`Placeholder`'s boolean-breakpoint case (e.g. `<Col md>`) was emitting a nonexistent `col-medium` class instead of the real `medium:col` class, so it never had any visual effect above the base breakpoint; and `Col`'s `offset` only accepted `number` at runtime despite its type allowing `string` (e.g. `offset="auto"` was silently dropped).
