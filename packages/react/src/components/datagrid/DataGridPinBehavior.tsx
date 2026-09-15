import React, { ReactElement, RefObject, useEffect, useMemo } from 'react'

import { DataGridColumnProps } from './DataGridColumn'
import { DataGridHeaderProps } from './DataGridHeader'
import { ColumnGeometryColumn, useColumnGeometry } from './useColumnGeometry'

export interface DataGridPinBehaviorProps<T> {
  /**
   * The same header element passed as `DataGrid`'s first child. Read directly (rather than via
   * `TableStateContext`) because react-aria-components' virtualized `<Table>` only ever renders
   * DOM output for its own collection-derived tree — an arbitrary extra child (like this
   * component, if it were nested inside `<Table>`) never mounts, regardless of context
   * availability. Only the static-children form of `DataGridHeader` can be introspected this
   * way; the `columns`/render-function form gets no pinned-column behavior from here (`pin=
   * "start"`'s positioning still works either way — see `DataGridTableLayout`, which reads pin
   * state off the resolved collection instead, not off this introspection).
   */
  header: ReactElement<DataGridHeaderProps<T>>
  /**
   * A CSS class unique to this `DataGrid` instance, scoping the generated rules below so
   * multiple grids on the same page (with different pinned columns) don't collide.
   */
  instanceClassName: string
  /**
   * Ref to `DataGrid`'s own scrolling root — used both to measure `fr`-sized pinned columns via
   * `useColumnGeometry` and, for `pin="end"`, to find and reposition its cells on scroll (see
   * below).
   */
  containerRef: RefObject<HTMLElement | null>
}

interface PinnedColumnInfo {
  index: number
  /** Cumulative width of the end-pinned columns after this one — its distance from the edge. */
  rightOffset: number
}

interface DeclaredColumns {
  all: ColumnGeometryColumn[]
  endIndices: number[]
  startIndices: number[]
}

/**
 * A cell's (1-based) `aria-colindex` for the (0-based) column position it was declared at.
 *
 * Every cell and column header react-aria-components renders carries `aria-colindex`, set from the
 * column's position in the resolved collection — which is the declaration order this component
 * reads off the header's JSX. That makes it the one stable handle from a declared column back to
 * its rendered DOM, and the reason nothing here counts DOM children: the layout engine windows
 * columns horizontally as well as rows (only the cells intersecting the horizontal viewport are
 * mounted, see `datagrid.mdx`'s Scope section), so a row's child count is the size of the mounted
 * window, not the column count. The `nth-child`/`nth-last-child` arithmetic this used to do was
 * therefore only correct while every column happened to be mounted, and silently moved and
 * shadowed the wrong cells in exactly the wide grids pinning exists for.
 */
const colIndexSelector = (index: number) => `[aria-colindex="${index + 1}"]`

/**
 * Handles the two things `DataGrid`'s own layout subclass (`DataGridTableLayout`) can't:
 *
 * - `pin="end"`'s positioning. `DataGridTableLayout` reuses the layout engine's own sticky
 *   mechanism for `pin="start"`, but that mechanism is hardcoded to the leading edge — there's no
 *   upstream hook for a trailing-edge pin. A pure-CSS `position: sticky; right: 0` equivalent
 *   doesn't work either: for the *last* child of a horizontally-scrolling container, the browser's
 *   own max-scroll bound is defined such that its gap to the viewport's trailing edge never goes
 *   negative until the very last pixel of scroll — sticky has nothing to correct until then, so it
 *   renders exactly like `position: absolute` for the entire scroll range up to that point (this is
 *   a well-known, verified-here CSS limitation, not specific to this layout). So `pin="end"` is
 *   positioned imperatively instead: on every scroll (and on mount/resize), each `pin="end"`
 *   column's auto-generated wrapper div gets a `transform: translateX(...)` that keeps it flush
 *   against the scroll viewport's trailing edge, computed from `useColumnGeometry`'s cumulative
 *   offsets, plus the `z-index` that keeps it above the cells it now overlaps. This bypasses React
 *   for those two styles, similar to how other virtualized grids (e.g. AG-Grid) handle right-pinned
 *   columns — react-aria-components' own layout doesn't re-render an already-mounted cell's style on
 *   a plain scroll (its `layoutInfo` doesn't depend on scroll position), so there's no fight between
 *   this and React's own reconciliation; newly-mounted rows (from vertical scroll bringing fresh
 *   cells into the virtualized window) are covered by the same scroll-driven sync running again.
 * - The scroll-cue box-shadow on the boundary column of each pinned group (the last `pin="start"`
 *   column, the first `pin="end"` column) — shown only once the grid has actually scrolled far
 *   enough to hide content under it, via the `datagrid-scrolled-start`/`datagrid-scrolled-end`
 *   classes `DataGrid` toggles on scroll. This part stays pure CSS since box-shadow, unlike
 *   sticky's position offsets, has no "last child" gotcha.
 *
 * Rendered as a plain sibling of `DataGrid`'s `<Table>`, not inside it.
 */
export const DataGridPinBehavior = <T extends object>({
  header,
  instanceClassName,
  containerRef
}: DataGridPinBehaviorProps<T>) => {
  const headerChildren = header.props.children

  // Re-derived only when a column's own sizing/pin props actually change, not on every parent
  // render: `useColumnGeometry` keys its memoized result off this array's identity, and the
  // scroll-sync effect below keys off that result in turn — rebuilding it unconditionally tore
  // down and re-registered the effect's scroll listener and its two observers on every single
  // `DataGrid` render.
  const columnElements = useMemo(
    () => (typeof headerChildren === 'function' ? [] : React.Children.toArray(headerChildren)),
    [headerChildren]
  )
  const declaredKey = columnElements
    .map((element) => {
      if (!React.isValidElement<DataGridColumnProps>(element)) return ''
      const { defaultWidth, maxWidth, minWidth, pin } = element.props
      return `${defaultWidth ?? ''}/${minWidth ?? ''}/${maxWidth ?? ''}/${pin ?? ''}`
    })
    .join('|')

  const {
    all: allColumns,
    endIndices,
    startIndices
  } = useMemo<DeclaredColumns>(() => {
    const declared: DeclaredColumns = { all: [], endIndices: [], startIndices: [] }
    columnElements.forEach((element, index) => {
      if (!React.isValidElement<DataGridColumnProps>(element)) return
      const { defaultWidth, maxWidth, minWidth, pin } = element.props
      declared.all.push({ id: index, defaultWidth, maxWidth, minWidth })
      if (pin === 'start') declared.startIndices.push(index)
      else if (pin === 'end') declared.endIndices.push(index)
    })
    return declared
    // `declaredKey` is the value-based identity of `columnElements` — a fresh JSX array every
    // render, so its own reference can't be the dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [declaredKey])

  const offsets = useColumnGeometry(allColumns, containerRef)

  // Cumulative width of the end-pinned columns after this one, keyed by column index — how far
  // from the viewport's trailing edge each one needs to sit so they stack correctly.
  const endPinnedInfo = useMemo(() => {
    const info = new Map<number, PinnedColumnInfo>()
    let right = 0
    for (let i = endIndices.length - 1; i >= 0; i--) {
      const index = endIndices[i]
      if (index == null) continue
      const width = offsets.get(index)?.width ?? 0
      info.set(index, { index, rightOffset: right })
      right += width
    }
    return info
  }, [endIndices, offsets])

  useEffect(() => {
    const container = containerRef.current
    if (!container || endPinnedInfo.size === 0) return

    let frame: number | null = null
    // The wrappers this effect has written inline styles onto, so they can be handed back
    // unstyled when it tears down — un-pinning a column at runtime (or unmounting this behavior
    // while the grid stays) otherwise left its cells stuck at their last scroll offset.
    const styled = new Set<HTMLElement>()

    const sync = () => {
      frame = null
      const clientWidth = container.clientWidth
      const scrollLeft = container.scrollLeft
      const rows = container.querySelectorAll<HTMLElement>('[role="row"]')
      rows.forEach((row) => {
        endPinnedInfo.forEach(({ index, rightOffset }) => {
          const cell = row.querySelector<HTMLElement>(colIndexSelector(index))
          const wrapper = cell?.parentElement
          if (!wrapper) return
          const offset = offsets.get(index)
          if (!offset) return
          const rightEdge = offset.offset + offset.width
          const delta = clientWidth - rightOffset - rightEdge + scrollLeft
          wrapper.style.transform = `translateX(${delta}px)`
          // Above the unpinned cells it now overlaps. Set here rather than in the generated
          // stylesheet below because the virtualizer writes the wrapper's own `z-index` inline,
          // which no plain rule can outrank without `!important`.
          wrapper.style.zIndex = '2'
          styled.add(wrapper)
        })
      })
    }

    const scheduleSync = () => {
      if (frame == null) frame = requestAnimationFrame(sync)
    }

    scheduleSync()
    container.addEventListener('scroll', scheduleSync, { passive: true })
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleSync)
    resizeObserver?.observe(container)
    const mutationObserver =
      typeof MutationObserver === 'undefined' ? null : new MutationObserver(scheduleSync)
    mutationObserver?.observe(container, { childList: true, subtree: true })

    return () => {
      if (frame != null) cancelAnimationFrame(frame)
      container.removeEventListener('scroll', scheduleSync)
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
      styled.forEach((wrapper) => {
        wrapper.style.transform = ''
        wrapper.style.zIndex = ''
      })
    }
  }, [containerRef, endPinnedInfo, offsets])

  if (startIndices.length === 0 && endIndices.length === 0) return null

  const rules: string[] = []

  if (startIndices.length > 0) {
    const lastStartIndex = Math.max(...startIndices)
    rules.push(
      `.${instanceClassName}.datagrid-scrolled-start ${colIndexSelector(lastStartIndex)} { box-shadow: var(--datagrid-pin-cue-shadow-start); }`
    )
  }

  if (endIndices.length > 0) {
    const firstEndIndex = Math.min(...endIndices)
    rules.push(
      `.${instanceClassName}.datagrid-scrolled-end ${colIndexSelector(firstEndIndex)} { box-shadow: var(--datagrid-pin-cue-shadow-end); }`
    )
  }

  return <style>{rules.join('\n')}</style>
}
