import React, { forwardRef, TableHTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CTableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Key of the data item to display in this column.
   */
  key: keyof T & string
  /**
   * Column header label. Defaults to the key with underscores replaced by spaces, title-cased.
   */
  label?: string
  /**
   * Custom cell renderer. Receives the cell value and the full row item.
   */
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

export interface CTableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'align'> {
  /**
   * Set the vertical alignment.
   */
  align?: 'bottom' | 'middle' | 'top'
  /**
   * Add borders on all sides of the table and cells.
   */
  bordered?: boolean
  /**
   * Remove borders on all sides of the table and cells.
   */
  borderless?: boolean
  /**
   * Put the `<caption>` on the top of the table.
   */
  caption?: 'top'
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Column definitions for data-driven rendering. When omitted, columns are inferred from
   * the keys of the first item in `items`.
   */
  columns?: CTableColumn[]
  /**
   * Sets the context of the component.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | string
   */
  context?: ContextColor
  /**
   * Enable a hover state on table rows.
   */
  hover?: boolean
  /**
   * Array of data objects to render as rows. Accepts typical REST API array responses.
   * When provided, the table head and body are auto-generated from the data.
   */
  items?: Record<string, unknown>[]
  /**
   * Make any table responsive across all viewports or pick a maximum breakpoint.
   */
  responsive?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'
  /**
   * Make table more compact by cutting all cell padding.
   */
  small?: boolean
  /**
   * Add zebra-striping to table rows.
   */
  striped?: boolean
}

const toLabel = (key: string) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export const CxTable = forwardRef<HTMLTableElement, CTableProps>(
  (
    {
      children,
      align,
      bordered,
      borderless,
      caption,
      className,
      columns,
      context,
      hover,
      items,
      responsive,
      small,
      striped,
      ...rest
    },
    ref,
  ) => {
    const _className = classNames(
      'table',
      context,
      {
        [`align-${align}`]: align,
        [`caption-${caption}`]: caption,
        bordered,
        borderless,
        hoverable: hover,
        small,
        striped,
      },
      className,
    )

    const cols: CTableColumn[] =
      columns ??
      (items && items.length > 0
        ? Object.keys(items[0]).map((k) => ({ key: k }))
        : [])

    const autoContent = items ? (
      <>
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col.key} scope="col">
                {col.label ?? toLabel(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIdx) => (
            <tr key={rowIdx}>
              {cols.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(item[col.key], item)
                    : item[col.key] != null
                    ? String(item[col.key])
                    : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </>
    ) : null

    const tableEl = (
      <table className={_className || undefined} {...rest} ref={ref}>
        {autoContent ?? children}
      </table>
    )

    if (!responsive) return tableEl

    return (
      <div
        className={
          typeof responsive === 'boolean' ? 'table-responsive' : `table-responsive-${responsive}`
        }
      >
        {tableEl}
      </div>
    )
  },
)

CxTable.displayName = 'CxTable'
