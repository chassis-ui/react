import { TableLayout } from 'react-aria-components'

interface StickyColumnNode {
  type: string
  index: number
  colIndex?: number | null
}

/**
 * `DataGrid`'s own subclass of react-aria-components' `TableLayout`, overriding the (protected,
 * hardcoded-`false` upstream) `isStickyColumn` hook so a `pin="start"` `DataGridColumn` uses the
 * layout engine's own sticky-positioning machinery — the same mechanism that already makes the
 * header row pin to the top (`buildTableHeader` sets `layoutInfo.isSticky = true` unconditionally
 * there). The subclass exists instead of a pure-CSS `position: sticky` override because
 * react-aria-components' own `TableLayout` never overrides `isStickyColumn`, so no column becomes
 * visually sticky by default — and because the engine, not CSS, owns each cell wrapper's `left`.
 *
 * `pin="end"` isn't handled here — the engine's sticky positioning is hardcoded to the leading
 * edge (`position: sticky; left: ...`, mirrored to `right` only for RTL *direction*, never per
 * column), so there's no upstream mechanism to reuse for a trailing pin in an LTR grid. See
 * `DataGrid.scss`'s `nth-last-child`-based rules for that half instead.
 */
export class DataGridTableLayout<T> extends TableLayout<T> {
  protected isStickyColumn(node: StickyColumnNode): boolean {
    const colIndex = node.type === 'column' ? node.index : (node.colIndex ?? node.index)
    if (colIndex == null) return false
    const column = this.collection.columns[colIndex]
    return (column?.props as { pin?: 'start' | 'end' } | undefined)?.pin === 'start'
  }
}
