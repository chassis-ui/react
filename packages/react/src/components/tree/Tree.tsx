import React, { CSSProperties, forwardRef, ReactElement, ReactNode, Ref, useMemo } from 'react'
import classNames from 'classnames'
import { Key, Selection, Tree as AriaTree } from 'react-aria-components'

import { IconValue } from '../../utils/iconConfig'
import { TreeConfigContext } from './context'
import './Tree.scss'

export interface TreeProps<T extends object> {
  /**
   * An accessible name for the tree, when no visible heading names it.
   */
  'aria-label'?: string
  /**
   * The id of the visible heading that names the tree.
   */
  'aria-labelledby'?: string
  /**
   * Focus the tree when it mounts: `true` or `'first'` focuses its first item, `'last'` its last.
   */
  autoFocus?: boolean | 'first' | 'last'
  /**
   * Draw a checkbox in every item, which selects the item. On by default with
   * `selectionMode="multiple"` and the `'toggle'` selection behavior, off otherwise.
   */
  checkboxes?: boolean
  /**
   * `TreeItem` elements, or a render function called once per entry of `items`, returning that
   * entry's `TreeItem`.
   */
  children: ReactNode | ((item: T) => ReactElement)
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The keys of the items expanded at first (uncontrolled).
   */
  defaultExpandedKeys?: Iterable<Key>
  /**
   * The keys of the items selected at first (uncontrolled): `'all'`, or an iterable of keys.
   */
  defaultSelectedKeys?: 'all' | Iterable<Key>
  /**
   * Values that should rebuild the items when using the `items`/render-function form of
   * `children` — e.g. a value from outside `items` that the render function reads. Without this,
   * changing that value won't re-render the items, which are only rebuilt when `items` or
   * `dependencies` change by reference.
   */
  dependencies?: ReadonlyArray<unknown>
  /**
   * Whether `disabledKeys` disables every interaction with an item, or only its selection.
   *
   * @default 'all'
   */
  disabledBehavior?: 'all' | 'selection'
  /**
   * The keys of the items that are disabled.
   */
  disabledKeys?: Iterable<Key>
  /**
   * Keep at least one item selected: the last selected item can't be deselected.
   */
  disallowEmptySelection?: boolean
  /**
   * The keys of the expanded items (controlled).
   */
  expandedKeys?: Iterable<Key>
  /**
   * The chevron of an item with child items, in place of `IconProvider`'s `expand` icon: an icon
   * name, or an element.
   */
  expandIcon?: IconValue
  /**
   * The id of the tree element.
   */
  id?: string
  /**
   * The data to render as items, through the function form of `children`.
   */
  items?: Iterable<T>
  /**
   * Called with an item's key when the item is activated: with Enter, or with a click when the
   * tree has no selection. An item's own `onAction` is called too.
   */
  onAction?: (key: Key) => void
  /**
   * Called with the keys of the expanded items when an item expands or collapses.
   */
  onExpandedChange?: (keys: Set<Key>) => void
  /**
   * Called with the keys of the selected items (`'all'`, or a `Set`) when the selection changes.
   */
  onSelectionChange?: (keys: Selection) => void
  /**
   * What to render in place of the items when there are none.
   */
  renderEmptyState?: () => ReactNode
  /**
   * The keys of the selected items (controlled): `'all'`, or an iterable of keys.
   */
  selectedKeys?: 'all' | Iterable<Key>
  /**
   * How a click changes a multiple selection: `'toggle'` adds or removes the clicked item,
   * `'replace'` selects it alone, with Ctrl, Cmd and Shift for more, as a file manager does.
   *
   * @default 'toggle'
   */
  selectionBehavior?: 'toggle' | 'replace'
  /**
   * Whether items can be selected, and how many at a time.
   *
   * @default 'none'
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * Inline styles for the tree element.
   */
  style?: CSSProperties
}

const TreeInner = <T extends object>(
  {
    autoFocus,
    checkboxes,
    children,
    className,
    expandIcon,
    renderEmptyState,
    selectionBehavior = 'toggle',
    selectionMode = 'none',
    ...rest
  }: TreeProps<T>,
  ref: Ref<HTMLDivElement>
) => {
  // A checkbox per item is the toggle behavior's way of selecting several; the replace behavior
  // selects by click, as a file manager does.
  const config = useMemo(
    () => ({
      checkboxes: checkboxes ?? (selectionMode === 'multiple' && selectionBehavior === 'toggle'),
      expandIcon
    }),
    [checkboxes, expandIcon, selectionBehavior, selectionMode]
  )

  // react-aria-components builds the collection from `children`, flattens it by `expandedKeys`
  // and renders every visible item as a row of a `treegrid`, on the server too, so the server's
  // HTML holds the expanded items.
  return (
    <TreeConfigContext.Provider value={config}>
      <AriaTree
        {...rest}
        // react-aria focuses the tree element itself for `true`; the first item is what a
        // keyboard user expects.
        autoFocus={autoFocus === true ? 'first' : autoFocus}
        className={classNames('tree', className)}
        ref={ref}
        renderEmptyState={renderEmptyState && (() => renderEmptyState())}
        selectionBehavior={selectionBehavior}
        selectionMode={selectionMode}
      >
        {children}
      </AriaTree>
    </TreeConfigContext.Provider>
  )
}

// `forwardRef` erases type parameters, so the generic component is cast back to a generic
// signature for callers — the pattern `DataGrid` uses.
export const Tree = forwardRef(TreeInner) as <T extends object>(
  props: TreeProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement

;(Tree as { displayName?: string }).displayName = 'Tree'
