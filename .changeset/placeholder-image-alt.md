---
'@chassis-ui/react': patch
---

A `Placeholder` with `src` and no `alt` renders `alt=""`, a decorative image. It took the generated graphic's label as alt text, so `<Placeholder src="/hero.jpg" width={100} height={100} />` was announced as "Placeholder: 100x100", a graphic that isn't shown. Pass `alt` to describe the real image.
