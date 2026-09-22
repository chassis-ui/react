---
'@chassis-ui/react': minor
---

Adds `StaticTable`, a server-renderable table that uses no client JavaScript (#20). It takes the
same styling props as `Table` (`bordered`, `borderless`, `hover`, `striped`, `sm`, `color`,
`align`, `responsive`, `stacked`, plus `caption`) and renders your own
`<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>` markup as written. It has no sorting, selection
or keyboard grid navigation; those remain `Table`'s job.

Import it from `@chassis-ui/react/static-table`. It's the only entry point without a
`'use client'` directive, so a React Server Component renders it as a real Server Component. In a
Next.js 16 app, a route rendering only a `StaticTable` ships no client JS beyond Next's own
baseline. Links, `next/link` and server-action forms in cells work as they do in any server markup.

```tsx
import { StaticTable } from '@chassis-ui/react/static-table'

<StaticTable hover striped caption="Members">
  <thead>
    <tr><th scope="col">Name</th></tr>
  </thead>
  <tbody>
    {members.map((m) => (
      <tr key={m.id}><td data-cell="Name">{m.name}</td></tr>
    ))}
  </tbody>
</StaticTable>
```

For `stacked` tables, give each `<td>` a `data-cell` attribute with its label. `Table` reads that
label from its column headers, but a static table has no column data to derive it from.
`StaticTable` is exported from the root entry too, for use inside Client Components.
