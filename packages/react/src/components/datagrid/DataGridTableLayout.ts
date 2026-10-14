import { LayoutInfo, Rect, TableLayout } from 'react-aria-components'

import { getColumnPin } from './pinnedColumns'

type LayoutNode = ReturnType<TableLayout<unknown>['buildCell']>
type GridNode<T> = Parameters<TableLayout<T>['buildCell']>[0]

/**
 * `DataGrid`'s own subclass of react-aria-components' `TableLayout`. It pins columns inside the
 * layout engine, from the rects the engine computes, so a pinned column is sized, stacked and
 * mounted by the same code that lays out every other cell.
 *
 * `pin="start"` reuses the engine's sticky positioning (`isStickyColumn`, hardcoded to `false`
 * upstream): the same mechanism that keeps the header row at the top, `position: sticky` at the
 * column's own offset from the leading edge, mirrored for RTL by the engine itself.
 *
 * `pin="end"` has no such mechanism. The engine's sticky cells are `inline-block`s in the row's
 * flow, so their in-flow position is the leading edge, and `position: sticky` toward the trailing
 * edge never moves them. So an end-pinned cell keeps its absolute position, and
 * `getVisibleLayoutInfos` moves it to `min(its own x, the visible rect's trailing edge minus the
 * end-pinned columns after it)`. The virtualizer renders again on every scroll (react-aria's
 * scroll view commits the new visible rect with `flushSync`), so the cell moves in the same
 * commit as the rows do. Every coordinate is logical: the engine writes `right` instead of `left`
 * under RTL, and its visible rect's `x` is the distance scrolled from the leading edge.
 *
 * Both sides are persisted: `isStickyColumn` returns `true` for them, which is what puts a
 * column's index in the list of cells the engine always renders. The end-pinned ones then have
 * `isSticky` taken back off in `buildColumn`/`buildCell`.
 */
export class DataGridTableLayout<T> extends TableLayout<T> {
  // The positioned copy last returned for each end-pinned layout info, reused while its `x` holds
  // so a vertical scroll doesn't re-render every pinned cell.
  private positioned = new WeakMap<LayoutInfo, LayoutInfo>()

  private pinOf(node: { type: string; index: number; colIndex?: number | null }) {
    const colIndex = node.type === 'column' ? node.index : (node.colIndex ?? node.index)
    return getColumnPin(this.collection.columns[colIndex])
  }

  private get hasEndPinnedColumn() {
    return this.collection.columns.some((column) => getColumnPin(column) === 'end')
  }

  protected isStickyColumn(node: GridNode<T>): boolean {
    return this.pinOf(node) != null
  }

  protected buildColumn(node: GridNode<T>, x: number, y: number): LayoutNode {
    return this.unstickEndPinned(node, super.buildColumn(node, x, y))
  }

  protected buildCell(node: GridNode<T>, x: number, y: number): LayoutNode {
    return this.unstickEndPinned(node, super.buildCell(node, x, y))
  }

  private unstickEndPinned(node: GridNode<T>, layoutNode: LayoutNode): LayoutNode {
    if (this.pinOf(node) === 'end') layoutNode.layoutInfo.isSticky = false
    return layoutNode
  }

  // The engine stacks header cells from the leading edge down (`columns.length - i + 1`), so a
  // header to the right of another is below it. An end-pinned header covers the ones scrolling
  // under it, so it goes above all of them; body cells already take the sticky cells' 2.
  protected buildHeaderRow(...args: Parameters<TableLayout<T>['buildHeaderRow']>): LayoutNode {
    const row = super.buildHeaderRow(...args)
    const columns = row.children ?? []
    for (const column of columns) {
      if (column.node && this.pinOf(column.node as GridNode<T>) === 'end') {
        column.layoutInfo.zIndex = columns.length + 2
      }
    }
    return row
  }

  // A row stops building cells past the requested rect's trailing edge, so an end-pinned cell
  // further right than the overscan had no layout to render. With an end-pinned column every row
  // is built across its whole width: layout objects only, the DOM is still windowed.
  protected buildRow(node: GridNode<T>, x: number, y: number): LayoutNode {
    if (!this.hasEndPinnedColumn) return super.buildRow(node, x, y)
    const requested = this.requestedRect
    this.requestedRect = new Rect(requested.x, requested.y, Infinity, requested.height)
    try {
      return super.buildRow(node, x, y)
    } finally {
      this.requestedRect = requested
    }
  }

  getVisibleLayoutInfos(rect: Rect): LayoutInfo[] {
    const infos = super.getVisibleLayoutInfos(rect)
    const { columns } = this.collection
    const visible = this.virtualizer?.visibleRect
    if (!visible || !Number.isFinite(visible.maxX) || !this.hasEndPinnedColumn) return infos

    // Each end-pinned column's distance from the trailing edge: the widths of the end-pinned
    // columns after it.
    const trailing = new Map<number, number>()
    let width = 0
    for (let index = columns.length - 1; index >= 0; index--) {
      const column = columns[index]
      if (!column || getColumnPin(column) !== 'end') continue
      trailing.set(index, width)
      width += this.getLayoutInfo(column.key)?.rect.width ?? 0
    }

    const edge = visible.maxX - this.padding
    return infos.map((info) => {
      if (info.type !== 'column' && info.type !== 'cell') return info
      const node = this.collection.getItem(info.key) as GridNode<T> | null
      if (!node) return info
      const colIndex = node.type === 'column' ? node.index : (node.colIndex ?? node.index)
      const offset = trailing.get(colIndex)
      if (offset == null) return info
      const x = Math.min(info.rect.x, edge - offset - info.rect.width)
      if (x === info.rect.x) return info
      const last = this.positioned.get(info)
      if (last?.rect.x === x) return last
      const copy = info.copy()
      copy.rect.x = x
      this.positioned.set(info, copy)
      return copy
    })
  }

  // An empty body fills the viewport below the header. On the server the viewport has no size,
  // so the body came out as tall as minus the header (`height: -40px`), which CSS doesn't allow.
  protected buildRowGroup(...args: Parameters<TableLayout<T>['buildRowGroup']>) {
    const group = super.buildRowGroup(...args)
    group.layoutInfo.rect.height = Math.max(0, group.layoutInfo.rect.height)
    return group
  }
}
