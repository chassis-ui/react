---
"@chassis-ui/react": patch
---

**Fix:** `Row`'s `gutter`/`gutterX`/`gutterY` props now generate real chassis-css classes.

They previously only accepted numbers (e.g. `gutter: 4` → class `g-4`), but chassis-css's gutter scale is the named spacing scale shared with padding/margin (`g-small`, `g-medium`, `g-xlarge`, ...) — `g-4` doesn't exist anywhere in the compiled CSS, so no gutter value has ever had any visual effect. `gutter`/`gutterX`/`gutterY` are now typed as `Spacing | 0` (the same `Spacing` type used elsewhere in the library), matching the real class names. The literal `0` shorthand (`g-0`) still works as before for removing gutters.

```diff
- <Row xs={{ gutter: 4 }}>
+ <Row xs={{ gutter: 'large' }}>
```
