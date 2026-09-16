import * as React from 'react'
import { act } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '../../../src/index'

// react-stately's `@react-stately/table` derives the auto-injected "select all" column's key from
// a module-scoped `'row-header-column-' + Math.random()` constant, computed once per JS
// environment rather than per render (see Table.tsx's `TableSelectAllCell`/`TableSelectionCell`
// comments). Under SSR the server and browser bundles are two separate environments, so that key
// -- and the `id`/`data-key` DOM attributes react-aria derives from it -- differs between the
// markup `renderToString` produced and what the client computes during hydration, on every
// request. This can't be reproduced by actually running two module instances in one Vitest
// process without also splitting `react`/`react-dom` (which would trip React's *own* "two
// copies" invariant instead of the bug under test) -- so this simulates the effect directly: take
// real server-rendered markup and mutate a cell's `id`/`data-key` to look like it came from a
// different random key, the way the real server and browser actually would disagree.
//
// React logs at most one hydration-mismatch warning per `hydrateRoot` call (not one per
// mismatched node), so the two cases below run as separate hydrations rather than sharing one.
const renderTable = () => (
  <Table aria-label="Users" selectionMode="multiple">
    <TableHeader>
      <TableColumn key="name">Name</TableColumn>
    </TableHeader>
    <TableBody items={[{ id: '1', name: 'Mark' }]}>
      {(row) => <TableRow key={row.id}>{() => <TableCell>{row.name}</TableCell>}</TableRow>}
    </TableBody>
  </Table>
)

const mutateToLookMismatched = (el: HTMLElement) => {
  el.setAttribute('data-key', `${el.getAttribute('data-key')}-mismatched`)
  el.id = `${el.id}-mismatched`
}

const countHydrationWarnings = (mutate: (container: HTMLElement) => void) => {
  const container = document.createElement('div')
  container.innerHTML = renderToString(renderTable())
  document.body.appendChild(container)
  mutate(container)

  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  act(() => {
    hydrateRoot(container, renderTable())
  })
  const count = consoleError.mock.calls.filter((args) =>
    String(args[0]).includes("didn't match the client properties")
  ).length

  consoleError.mockRestore()
  document.body.removeChild(container)
  return count
}

describe('Table SSR hydration', () => {
  test('a mismatched id/data-key on the select-all column header is silenced', () => {
    const warnings = countHydrationWarnings((container) =>
      mutateToLookMismatched(container.querySelector('th.table-selection-cell')!)
    )
    expect(warnings).toBe(0)
  })

  test('the same kind of mismatch on an ordinary column header still warns (control)', () => {
    const warnings = countHydrationWarnings((container) =>
      mutateToLookMismatched(container.querySelector('th[scope="col"]:not(.table-selection-cell)')!)
    )
    expect(warnings).toBe(1)
  })
})
