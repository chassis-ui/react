// Deliberately no 'use client' directive — unlike every other component folder's barrel, this one
// is the server-safe entry point, `@chassis-ui/react/static-table`, and must stay importable from
// a React Server Component without creating a client boundary (see RSC.md). Nothing reachable from
// here may use hooks, context, or browser APIs; `scripts/check-rsc-directive.ts` fails the build if
// the built entry ever gains a directive. For the same reason it skips the
// `suppressFocusRingGlobally` import the other barrels carry — there's no client module to run it.
export { StaticTable } from './StaticTable'
export type { StaticTableProps } from './StaticTable'
