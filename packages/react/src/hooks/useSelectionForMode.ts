import { useEffect, useRef } from 'react'
import type { Key, Selection } from 'react-aria-components'

import { useControllableState } from './useControllableState'

/**
 * The selection a collection hands react-aria, held here, controlled or not, so it can be fitted
 * to `selectionMode`: react-aria renders every key it is given, so a collection that went from
 * `multiple` to `single` (or was given several keys with `single`) kept them all selected. A
 * single-select collection keeps the first key, and the trimmed selection is reported once
 * through `onSelectionChange`, as a change the user made would be.
 */
export function useSelectionForMode({
  defaultSelectedKeys,
  onSelectionChange,
  selectedKeys,
  selectionMode
}: {
  defaultSelectedKeys?: 'all' | Iterable<Key>
  onSelectionChange?: (keys: Selection) => void
  selectedKeys?: 'all' | Iterable<Key>
  selectionMode: 'none' | 'single' | 'multiple'
}): { onSelectionChange: (keys: Selection) => void; selectedKeys: Selection } {
  const [selection, setSelection] = useControllableState<Selection>(
    selectedKeys === undefined ? undefined : toSelection(selectedKeys),
    toSelection(defaultSelectedKeys ?? []),
    onSelectionChange
  )

  const extra = selectionMode === 'single' && selection !== 'all' && selection.size > 1
  const fitted: Selection = extra ? new Set([selection.values().next().value as Key]) : selection
  // By content, not identity: a caller that passes a new set of the same keys on each render and
  // ignores the report is told once.
  const report = extra ? JSON.stringify([...selection]) : null

  const reportFitted = useRef(() => {})
  reportFitted.current = () => setSelection(fitted)
  useEffect(() => {
    if (report !== null) reportFitted.current()
  }, [report])

  return { onSelectionChange: setSelection, selectedKeys: fitted }
}

const toSelection = (keys: 'all' | Iterable<Key>): Selection =>
  keys === 'all' ? 'all' : keys instanceof Set ? keys : new Set(keys)
