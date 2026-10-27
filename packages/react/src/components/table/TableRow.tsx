import { Key, ReactElement } from 'react'
import { Row } from 'react-stately'

export interface TableRowProps {
  /**
   * `TableCell` elements, or a render function called once per column with that column's key —
   * required when the row's parent `TableBody` uses the `items`/render-function form.
   */
  children: ReactElement | ReactElement[] | ((columnKey: Key) => ReactElement)
  /**
   * A string of all className you want applied to the row.
   */
  className?: string
  /**
   * The unique id of the row, referenced by `selectedKeys`/`disabledKeys` and reported by
   * `onSelectionChange` as it is given. A React `key` is always a string, so `key={row.id}`
   * turns a numeric id into one.
   */
  id?: Key
  /**
   * A string representation of the row's contents, used for typeahead.
   */
  textValue?: string
}

interface CollectionNode {
  key?: Key | null
  type?: string
}

// react-stately's `Row` builds its node from its element's `key`, which React has made a string,
// and has no `id` of its own. Its node, with the key `id` gives it: the collection builder reads a
// node's own key ahead of the element's.
const StatelyRow = Row as unknown as {
  getCollectionNode: (props: TableRowProps, context: unknown) => Generator<CollectionNode>
}

function TableRowNode(_props: TableRowProps): ReactElement | null {
  return null
}

TableRowNode.getCollectionNode = function* getCollectionNode(
  props: TableRowProps,
  context: unknown
): Generator<CollectionNode> {
  for (const node of StatelyRow.getCollectionNode(props, context)) {
    yield props.id == null ? node : { ...node, key: props.id }
  }
}

/**
 * Collection node, data-only — see `TableHeader`. Read by `Table` to build a row in the
 * table's collection; never rendered directly.
 */
export const TableRow = TableRowNode as unknown as (props: TableRowProps) => ReactElement
