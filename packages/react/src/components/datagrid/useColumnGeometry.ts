import { RefObject, useEffect, useMemo, useState } from 'react'
import { Key } from 'react-aria-components'
import { ColumnSize, ColumnStaticSize } from 'react-stately'

export interface ColumnGeometryColumn {
  /**
   * The column's unique id — matches `DataGridColumn`'s `id`/collection key.
   */
  id: Key
  /**
   * Mirrors `DataGridColumn`'s prop of the same name.
   */
  defaultWidth?: ColumnSize | null
  /**
   * Mirrors `DataGridColumn`'s prop of the same name.
   */
  minWidth?: ColumnStaticSize | null
  /**
   * Mirrors `DataGridColumn`'s prop of the same name.
   */
  maxWidth?: ColumnStaticSize | null
}

export interface ColumnOffset {
  id: Key
  /**
   * Cumulative distance in pixels from the start edge of the row to this column's start edge.
   */
  offset: number
  width: number
}

const STATIC_SIZE_PATTERN = /^\d+(\.\d+)?%?$/

/**
 * Whether a `ColumnSize` resolves to a definite pixel value without waiting for layout: a plain
 * number, a numeric string (`'150'`), or a percentage string (`'50%'`) — resolvable as soon as
 * the container's own width is known. An `'<n>fr'` string is proportional — it only resolves to
 * pixels once the layout engine has distributed the container's remaining space among every
 * fractional column, so it's excluded here.
 */
export const isStaticColumnSize = (size: ColumnSize | null | undefined): size is ColumnStaticSize =>
  size != null && (typeof size === 'number' || STATIC_SIZE_PATTERN.test(size))

const resolveStaticWidth = (size: ColumnStaticSize, containerWidth: number): number => {
  if (typeof size === 'number') return size
  return size.endsWith('%') ? (parseFloat(size) / 100) * containerWidth : parseFloat(size)
}

/**
 * Computes cumulative left-edge offsets for a list of columns from their declared
 * `defaultWidth`/`minWidth`/`maxWidth` props, without reading the DOM. Only correct for a column
 * whose own width — and every preceding column's width — is statically resolvable (see
 * `isStaticColumnSize`): a column at or after the first `fr`-sized column has no offset that can
 * be known before layout runs, so it resolves to `null`. Callers should fall back to
 * `useColumnGeometry`'s DOM measurement for those.
 */
export function calculateStaticColumnOffsets(
  columns: readonly ColumnGeometryColumn[],
  containerWidth: number
): Map<Key, ColumnOffset | null> {
  const offsets = new Map<Key, ColumnOffset | null>()
  let offset = 0
  let resolvable = true

  for (const column of columns) {
    if (!resolvable || !isStaticColumnSize(column.defaultWidth)) {
      resolvable = false
      offsets.set(column.id, null)
      continue
    }

    let width = resolveStaticWidth(column.defaultWidth, containerWidth)
    if (isStaticColumnSize(column.minWidth)) {
      width = Math.max(width, resolveStaticWidth(column.minWidth, containerWidth))
    }
    if (isStaticColumnSize(column.maxWidth)) {
      width = Math.min(width, resolveStaticWidth(column.maxWidth, containerWidth))
    }

    offsets.set(column.id, { id: column.id, offset, width })
    offset += width
  }

  return offsets
}

interface MeasuredRect {
  offset: number
  width: number
}

/**
 * Measures the mounted column-header cells, keyed by their 0-based column position.
 *
 * Keyed off each cell's own `aria-colindex` (1-based, assigned from the column's position in the
 * resolved collection) rather than its position among the cells that happen to be in the DOM: the
 * layout engine windows columns horizontally as well as rows, so `querySelectorAll` returns only
 * the headers intersecting the horizontal viewport. Matching those positionally to the full column
 * list — as this used to — mapped every column past the first unmounted one onto the wrong rect.
 * A header without the attribute is skipped rather than guessed at.
 */
const measureColumnHeaders = (container: HTMLElement): Map<number, MeasuredRect> => {
  const measured = new Map<number, MeasuredRect>()
  container.querySelectorAll<HTMLElement>('[role="columnheader"]').forEach((cell) => {
    const colIndex = Number(cell.getAttribute('aria-colindex'))
    if (!Number.isInteger(colIndex) || colIndex < 1) return
    measured.set(colIndex - 1, { offset: cell.offsetLeft, width: cell.offsetWidth })
  })
  return measured
}

/**
 * Resolves each column's rendered left-offset and width, independent of the virtualizer's
 * private layout internals. Statically-sized columns (see `isStaticColumnSize`) resolve
 * immediately from their declared props; `fr`-sized (proportional) columns fall back to
 * `ResizeObserver`-measured DOM rects of the mounted `[role="columnheader"]` cells inside
 * `containerRef`, matched to `columns` by `aria-colindex` (see `measureColumnHeaders`), since
 * those only resolve to real pixels after the layout engine has actually distributed space.
 */
export function useColumnGeometry(
  columns: readonly ColumnGeometryColumn[],
  containerRef: RefObject<HTMLElement | null>
): Map<Key, ColumnOffset> {
  const [containerWidth, setContainerWidth] = useState(0)
  const [measured, setMeasured] = useState<Map<number, MeasuredRect>>(() => new Map())

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') return

    const measure = () => {
      setContainerWidth(container.clientWidth)
      setMeasured(measureColumnHeaders(container))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef])

  const staticOffsets = useMemo(
    () => calculateStaticColumnOffsets(columns, containerWidth),
    [columns, containerWidth]
  )

  return useMemo(() => {
    const result = new Map<Key, ColumnOffset>()
    columns.forEach((column, index) => {
      const staticOffset = staticOffsets.get(column.id)
      const measuredRect = measured.get(index)
      if (staticOffset) {
        result.set(column.id, staticOffset)
      } else if (measuredRect) {
        result.set(column.id, { id: column.id, ...measuredRect })
      }
    })
    return result
  }, [columns, staticOffsets, measured])
}
