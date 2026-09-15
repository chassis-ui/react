import React, {
  ReactElement,
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import {
  Key,
  Selection,
  SortDescriptor,
  Table as AriaTable,
  Virtualizer
} from 'react-aria-components'

import { useForkedRef } from '../../hooks/useForkedRef'
import { ContextColor } from '../../types'
import { DataGridBodyProps } from './DataGridBody'
import { DataGridHeaderProps } from './DataGridHeader'
import { DataGridPinBehavior } from './DataGridPinBehavior'
import { DataGridTableLayout } from './DataGridTableLayout'
import './DataGrid.scss'

// No `striped`/`stacked` props: zebra-striping via CSS `:nth-of-type` (Table's approach) isn't
// virtualization-safe — a windowed row's DOM siblings are only the currently-mounted rows, not
// every logical row, so the stripe parity would flip as the mounted window's starting index
// changes during scroll. A correct implementation needs the row's real index at render time, not
// a pure-CSS trick; deferred rather than shipped broken.
interface DataGridOwnProps<T extends object> {
  /**
   * An accessible label for the grid, used when there's no visible heading.
   */
  'aria-label'?: string
  /**
   * Identifies a visible heading element for the grid.
   */
  'aria-labelledby'?: string
  /**
   * Set the vertical alignment of cell content. Mirrors `Table`'s prop of the same name for API
   * parity — same as `Table`, this awaits chassis-css adding the matching `.align-*` styles.
   */
  align?: 'bottom' | 'middle' | 'top'
  /**
   * Add borders on all sides of the grid and cells.
   */
  bordered?: boolean
  /**
   * Remove borders on all sides of the grid and cells.
   */
  borderless?: boolean
  /**
   * A `DataGridHeader` and a `DataGridBody`, each built from `DataGridColumn`/`DataGridRow`/
   * `DataGridCell`.
   */
  children: [ReactElement<DataGridHeaderProps<T>>, ReactElement<DataGridBodyProps<T>>]
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component.
   */
  color?: ContextColor
  /**
   * A list of row keys to disable. Disabled rows cannot be selected, focused, or interacted with.
   */
  disabledKeys?: Iterable<Key>
  /**
   * Content shown below the grid, e.g. a totals row or a "load more" control. Rendered as plain
   * markup outside the grid's own scrollable/virtualized region — not part of the
   * keyboard-navigable grid, and never scrolls out of view along with the body rows. Mirrors
   * `Table`'s `footer` prop for API parity.
   */
  footer?: ReactNode
  /**
   * Enable a hover state on grid rows.
   */
  hover?: boolean
  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Selection) => void
  /**
   * Handler that is called when a column is sorted.
   */
  onSortChange?: (descriptor: SortDescriptor) => void
  /**
   * The currently selected row keys (controlled).
   */
  selectedKeys?: Selection
  /**
   * The type of selection that is allowed.
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * Make the grid more compact by cutting all cell padding.
   */
  sm?: boolean
  /**
   * The current sort column and direction.
   */
  sortDescriptor?: SortDescriptor
}

type DataGridRowHeightProps =
  | {
      /**
       * Row height in pixels, or `"auto"` to measure each row from its own rendered content
       * instead of a single fixed height shared by every row (pair it with a required
       * `estimatedRowHeight`, and see the docs site's "Variable row height" section for the
       * tradeoffs). A fixed number renders every row, including the header, at that exact
       * height; content taller than it visually overflows rather than growing the row.
       */
      rowHeight: number
      estimatedRowHeight?: never
    }
  | {
      rowHeight: 'auto'
      /**
       * Seeds the virtualizer's scroll-position math for rows that haven't been measured yet.
       * Required when `rowHeight="auto"` — pick a value close to the typical row's real height
       * to minimize scroll-jump on first measurement. A row's real height can still turn out far
       * from this estimate once it renders, which can cause a visible scroll-jump for rows the
       * viewport hasn't reached yet.
       */
      estimatedRowHeight: number
    }

export type DataGridProps<T extends object> = DataGridOwnProps<T> & DataGridRowHeightProps

const DataGridInner = <T extends object>(
  {
    align,
    bordered,
    borderless,
    children,
    className,
    color,
    disabledKeys,
    estimatedRowHeight,
    footer,
    hover,
    onSelectionChange,
    onSortChange,
    rowHeight,
    selectedKeys,
    selectionMode = 'none',
    sm,
    sortDescriptor,
    ...rest
  }: DataGridProps<T>,
  forwardedRef: Ref<HTMLDivElement>
) => {
  const isVariableRowHeight = rowHeight === 'auto'
  const layout = useMemo(
    () =>
      new DataGridTableLayout<T>(
        // `headingHeight` is pinned to `estimatedRowHeight` (fixed, not itself an estimate) in
        // variable-height mode — leaving it unset falls back to `estimatedRowHeight` as an
        // *estimate* for the header too, which sounds harmless but isn't: the header's own
        // sticky-positioned outer wrapper (built once in `buildTableHeader`, see
        // `DataGridTableLayout`'s doc comment for why the header is sticky at all) is never
        // recomputed when a column-header cell's later real measurement corrects its height, so
        // the outer wrapper's stale height desyncs from the cell's real one, spilling header
        // content into the body's first row instead of the header growing to fit it. Fixing the
        // header's height sidesteps that gap instead of shipping it.
        isVariableRowHeight
          ? { estimatedRowHeight, headingHeight: estimatedRowHeight }
          : { rowHeight }
      ),
    [isVariableRowHeight, rowHeight, estimatedRowHeight]
  )
  const gridRef = useRef<HTMLDivElement>(null)
  const ref = useForkedRef(forwardedRef, gridRef)

  // A stable per-instance class, scoping DataGridPinBehavior's generated CSS so multiple grids on
  // the same page (each with their own pinned columns) don't collide.
  const rawId = useId()
  const instanceClassName = `datagrid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`

  // Drives the pin=start/pin=end scroll-cue box-shadow — see DataGridPinBehavior — which should
  // only appear once there's actually hidden content under the pinned column to cue.
  const [scrolledStart, setScrolledStart] = useState(false)
  const [scrolledEnd, setScrolledEnd] = useState(false)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const updateScrollState = () => {
      setScrolledStart(grid.scrollLeft > 0)
      setScrolledEnd(Math.ceil(grid.scrollLeft + grid.clientWidth) < grid.scrollWidth)
    }

    updateScrollState()
    grid.addEventListener('scroll', updateScrollState, { passive: true })
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateScrollState)
    observer?.observe(grid)
    return () => {
      grid.removeEventListener('scroll', updateScrollState)
      observer?.disconnect()
    }
  }, [])

  const _className = classNames(
    'datagrid',
    instanceClassName,
    color,
    {
      [`align-${align}`]: align,
      bordered,
      borderless,
      hoverable: hover,
      sm,
      'datagrid-scrolled-start': scrolledStart,
      'datagrid-scrolled-end': scrolledEnd
    },
    className
  )

  return (
    <Virtualizer layout={layout} shouldObserveItemSize={isVariableRowHeight}>
      <AriaTable
        aria-label={rest['aria-label']}
        aria-labelledby={rest['aria-labelledby']}
        className={_className || undefined}
        disabledKeys={disabledKeys}
        onSelectionChange={onSelectionChange}
        onSortChange={onSortChange}
        ref={ref}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        sortDescriptor={sortDescriptor}
      >
        {children}
      </AriaTable>
      {footer && <div className={classNames('datagrid-footer', { borderless })}>{footer}</div>}
      <DataGridPinBehavior
        containerRef={gridRef}
        header={children[0]}
        instanceClassName={instanceClassName}
      />
    </Virtualizer>
  )
}

// `forwardRef` erases type parameters, so the generic component is cast back to a generic
// signature for callers — same pattern `Table` uses.
export const DataGrid = forwardRef(DataGridInner) as <T extends object>(
  props: DataGridProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement

;(DataGrid as { displayName?: string }).displayName = 'DataGrid'
