---
'@chassis-ui/react': minor
---

Every polymorphic component now accepts `asChild`, which makes the polymorphic API usable from
React Server Components (#23). Pass the target as a child element instead of a component
reference, and the component merges its classes, props and ref onto that element:

```tsx
import Link from 'next/link'
import { Button } from '@chassis-ui/react/button'

// In a Server Component
<Button asChild variant="outline">
  <Link href="/login">Log in</Link>
</Button>
```

`<Button component={Link} href="/login">` fails `next build` in a Server Component under Next.js
16 with "Functions cannot be passed directly to Client Components". A component reference is a
function and can't cross the server→client boundary; it only worked before because older
`next/link` exports weren't plain functions. An element crosses the boundary without trouble.
The rendered `<a>` gets the button's classes, and `next/link` still handles the navigation
client-side.

The child's own props win over the component's, except that class names are combined and event
handlers are chained (the component's runs first). If `children` isn't exactly one element,
`asChild` logs a dev warning and the component renders its default element. `asChild` takes
precedence when both it and `component` are passed.

`asChild` is implemented once in the shared polymorphic wrapper, so it works on every component
with a `component` prop. `SkeletonLoader` is the exception because it renders no element of its
own. `component` itself is unchanged.
