---
"@chassis-ui/react": major
---

**Breaking:** `Container`'s `sm`/`md`/`lg`/`xl`/`xxl` boolean props (each meaning "stay 100% wide until this breakpoint") are replaced by a single `fluidUntil?: Breakpoint` prop.

These names collided with `Row`/`Col`'s identically-named breakpoint props, which are shaped completely differently (objects, not booleans) — same names, incompatible meaning across the same component family.

```diff
- <Container md>Content</Container>
+ <Container fluidUntil="medium">Content</Container>
```

`Breakpoint` values are `'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'`. `Container`'s `fluid` boolean prop (always 100% wide) is unaffected.
