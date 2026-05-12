---
name: react-example-island
description: 'Phase 4 of chassis-react migration: design and implement the ReactExample island component for live interactive component previews in the Astro docs site. Run after Phase 3 (Astro scaffold) is complete.'
---

# Phase 4 — `<ReactExample>` Island Component

**Prerequisite**: Phase 3 (Astro scaffold) must be complete.  
**Check**: `.github/skills/react-migration/references/phase-status.md` Phase 3 = `[x]`  
**Completion marker**: Update Phase 4 status to `[x]` in phase-status.md

## Context

The old Gatsby docs had a trivial `<Example>` component — just a wrapper `<div>`. In the Astro site, component examples need to:
1. **Render live React components** (interactive: modals, dropdowns, tooltips all must work)
2. **Show the corresponding JSX source code** in a syntax-highlighted code block
3. **Be hydrated on the client** — Astro renders the shell server-side, React hydrates client-side

This is the most architecturally novel piece of the migration. Study it carefully before implementing.

## Design Decisions

### Hydration strategy

| Component type | Directive | Rationale |
|----------------|-----------|-----------|
| Simple (Button, Badge, etc.) | `client:visible` | Lazy — hydrate when scrolled into view |
| Interactive (Modal, Dropdown, Tooltip) | `client:visible` | Still fine — interaction only happens after viewport entry |
| Exceptions | `client:load` | Only if a component must be interactive on page load (rare) |

Use `client:visible` as the default.

### Code source extraction

The code to display alongside the preview must be the actual JSX source. Options:
- **Recommended**: Use a Vite/Rollup transform that extracts the JSX children of `<ReactExample>` as a raw string at build time (similar to how `chassis-website` extracts code examples)
- **Alternative**: Pass the code as a separate `code` prop to `<ReactExample>` (explicit but verbose)
- **Avoid**: Runtime string serialization — brittle and misses formatting

Before implementing, read `chassis-website/packages/website/src/` to see how the CSS docs site handles code extraction from `<Example>` blocks. Replicate the same mechanism but for JSX.

### Component API

```tsx
// In MDX files, usage will look like:
<ReactExample>
  <CxButton context="primary">Primary</CxButton>
  <CxButton context="secondary">Secondary</CxButton>
</ReactExample>

// With optional override for display code (when auto-extraction isn't enough):
<ReactExample code={`<CxButton context="primary">Primary</CxButton>`}>
  <CxButton context="primary">Primary</CxButton>
</ReactExample>
```

## Step 1 — Study chassis-website Example component

Read:
- `chassis-website/packages/website/src/components/` — find the `Example` component
- How it extracts code vs. renders preview
- What the Astro wrapper looks like vs. what runs client-side

Replicate the same pattern but adapted for React JSX instead of raw HTML.

## Step 2 — Implement `ReactExamplePreview.tsx` (React island)

Location: `packages/site/src/components/ReactExample/ReactExamplePreview.tsx`

This is the pure React component that renders inside the island:

```tsx
import React from 'react'

interface ReactExamplePreviewProps {
  children: React.ReactNode
}

export function ReactExamplePreview({ children }: ReactExamplePreviewProps) {
  return (
    <div className="cxd-example context">
      {children}
    </div>
  )
}
```

Keep it simple — the preview pane just needs to render children. State and interactivity are fully contained in the child `Cx*` components themselves.

## Step 3 — Implement `ReactExample.astro` (Astro wrapper)

Location: `packages/site/src/components/ReactExample/ReactExample.astro`

This Astro component:
1. Accepts the children (React components to render)
2. Renders the outer shell (tab bar, code/preview toggle) as static HTML
3. Mounts `ReactExamplePreview` as a React island with `client:visible`
4. Renders the code block alongside

```astro
---
// ReactExample.astro
const { code } = Astro.props
---
<div class="cxd-example-snippet cxd-code-snippet">
  <div class="cxd-example-preview">
    <ReactExamplePreview client:visible>
      <slot />
    </ReactExamplePreview>
  </div>
  {code && (
    <div class="cxd-example-code">
      <!-- syntax-highlighted code block -->
    </div>
  )}
</div>
```

**Note**: Passing `<slot />` into a React island is an Astro-specific pattern. Verify this works with `@astrojs/react` — slots from Astro parent into React island children is supported but may need a specific pattern. Check Astro docs for "passing slots to framework components".

## Step 4 — Code extraction via Vite plugin or remark plugin

Investigate: how does `chassis-website` get the raw source code string from inside `<Example>` MDX blocks?

If it uses a remark/rehype plugin: create a similar plugin for `<ReactExample>` that extracts the JSX children as a string and passes it as the `code` prop.

If it passes code explicitly as a prop: adopt the same convention in the React MDX files.

Create the plugin/utility at:
`packages/site/src/plugins/rehype-react-example.ts`

## Step 5 — Register in astro.config.ts

Add the plugin to `markdown.rehypePlugins` (if remark/rehype approach) or `vite.plugins`.

## Step 6 — Test with simple components

Add a test page `packages/site/src/pages/test-example.astro` with:
```mdx
import { CxButton } from '@chassis-ui/react'
import ReactExample from '../components/ReactExample/ReactExample.astro'

<ReactExample>
  <CxButton context="primary">Primary</CxButton>
  <CxButton context="secondary">Secondary</CxButton>
</ReactExample>
```

Verify: live buttons render, code block shows the JSX.

## Step 7 — Test with interactive components

Test with at least:
- `CxDropdown` — Popper.js positioning
- `CxModal` — portal rendering, body scroll lock
- `CxTooltip` — Popper.js, hover trigger

If a component fails to render in the island context (e.g., due to SSR incompatibility), the fix is:
- Wrap in `<ClientOnly>` pattern, or
- Use `client:only="react"` directive (skips SSR entirely)

## Step 8 — Delete test page, mark complete

Delete `test-example.astro`. Update phase-status.md Phase 4 to `[x]`.

## Verification Checklist

- [ ] `ReactExamplePreview.tsx` renders React children correctly
- [ ] `ReactExample.astro` shows live preview + code block
- [ ] Simple components (Button, Badge) render and display correctly
- [ ] Interactive components (Modal, Dropdown) work after hydration
- [ ] Tooltip (Popper.js) positions correctly
- [ ] Code block displays correct JSX source
- [ ] No React hydration mismatch warnings in browser console
