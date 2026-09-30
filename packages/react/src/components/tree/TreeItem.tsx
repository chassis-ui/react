import React, {
  CSSProperties,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useContext,
  useRef
} from 'react'
import classNames from 'classnames'
import { AriaButtonProps, AriaCheckboxProps, useButton, useCheckbox } from 'react-aria'
import { useToggleState } from 'react-stately'
import {
  ButtonContext,
  ButtonProps,
  CheckboxContext,
  CheckboxProps,
  Collection,
  Key,
  TreeItem as AriaTreeItem,
  TreeItemContent,
  TreeItemContentRenderProps,
  useContextProps,
  useSlottedContext
} from 'react-aria-components'

import { IconSlot } from '../../utils/iconSlot'
import { TreeConfigContext } from './context'

export interface TreeItemProps<T extends object = object> {
  /**
   * The item's child items: `TreeItem` elements, or a render function called once per entry of
   * `items`, returning that entry's `TreeItem`.
   */
  children?: ReactNode | ((item: T) => ReactElement)
  /**
   * A string of all className you want applied to the item.
   */
  className?: string
  /**
   * Values that should rebuild the child items when using the `items`/render-function form of
   * `children`, as `Tree`'s `dependencies`.
   */
  dependencies?: ReadonlyArray<unknown>
  /**
   * Toggle the disabled state for the item, as a key in the tree's `disabledKeys` does.
   */
  disabled?: boolean
  /**
   * An icon drawn before the label.
   */
  icon?: ReactNode
  /**
   * The item's key, named by `expandedKeys`, `selectedKeys` and `disabledKeys`. Defaults to the
   * key of the data entry the item renders, or to the item's position.
   */
  id?: Key
  /**
   * The data to render as child items, through the function form of `children`.
   */
  items?: Iterable<T>
  /**
   * The item's content.
   */
  label: ReactNode
  /**
   * Called when the item is activated: with Enter, or with a click when the tree has no
   * selection.
   */
  onAction?: () => void
  /**
   * Inline styles for the item's row.
   */
  style?: CSSProperties
  /**
   * The item's text, which typing a letter in the tree searches. Defaults to `label` when it is a
   * string.
   */
  textValue?: string
}

// The chevron: a button react-aria-components hands its props (the toggle, "Expand"/"Collapse"
// named after the row, out of the tab order) through `ButtonContext`'s `chevron` slot, and whose
// ref it checks for, so it is read from that slot rather than rendered as its own `Button`. The
// icon goes through `IconSlot`, so `IconProvider` and the tree's `expandIcon` can replace it.
const TreeItemToggle = ({ disabled }: { disabled: boolean }) => {
  const { expandIcon } = useContext(TreeConfigContext)
  const [props, ref] = useContextProps({ slot: 'chevron' } as ButtonProps, null, ButtonContext)
  // The slot's `onPress` does nothing on a disabled row, but says nothing of it: the button is
  // disabled too.
  const { buttonProps } = useButton({ ...(props as AriaButtonProps), isDisabled: disabled }, ref)
  return (
    <button {...buttonProps} className="tree-item-toggle" ref={ref}>
      <IconSlot className="tree-item-toggle-icon" icon="expand" override={expandIcon} />
    </button>
  )
}

// The selection checkbox: react-aria-components publishes its props (selected, disabled, named
// "Select" after the row) on `CheckboxContext`'s `selection` slot, as `DataGridSelectionCell`
// reads them. A native `<input class="check-input">` takes chassis-css's checkbox styles as is.
const TreeItemCheckbox = () => {
  const props = useSlottedContext(CheckboxContext, 'selection') as CheckboxProps
  const state = useToggleState(props as AriaCheckboxProps)
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useCheckbox(props as AriaCheckboxProps, state, ref)
  // `aria-describedby` after the spread: react-aria's own adds ids it never renders (FORMS.md,
  // gotcha 6), on the server only.
  return (
    <input
      {...inputProps}
      aria-describedby={undefined}
      className="check-input tree-item-check"
      ref={ref}
    />
  )
}

// The row's element. react-aria's `useGridListItem` names the row by itself and a description
// slot (`aria-labelledby="<row> <description>"`) that nothing renders: the slot id is written on
// the server and dropped once the browser finds no element with it (FORMS.md, gotcha 6), so the
// settled row has `aria-label` alone. react-aria-components' `TreeItem` doesn't declare the
// `render` prop its elements take, hence the cast where it is passed.
const renderRow = (props: React.JSX.IntrinsicElements['div']) => (
  <div {...props} aria-labelledby={undefined} />
)

const TreeItemBody = ({
  hasChildItems,
  icon,
  isDisabled,
  label,
  selectionMode
}: Pick<TreeItemContentRenderProps, 'hasChildItems' | 'isDisabled' | 'selectionMode'> & {
  icon?: ReactNode
  label: ReactNode
}) => {
  const { checkboxes } = useContext(TreeConfigContext)
  return (
    <>
      {hasChildItems ? (
        <TreeItemToggle disabled={isDisabled} />
      ) : (
        <span className="tree-item-spacer" />
      )}
      {checkboxes && selectionMode !== 'none' && <TreeItemCheckbox />}
      {icon != null && (
        <span aria-hidden="true" className="tree-item-icon">
          {icon}
        </span>
      )}
      <span className="tree-item-label">{label}</span>
    </>
  )
}

const TreeItemInner = <T extends object>(
  {
    children,
    className,
    dependencies,
    disabled,
    icon,
    id,
    items,
    label,
    onAction,
    style,
    textValue
  }: TreeItemProps<T>,
  ref: Ref<HTMLDivElement>
) => {
  const text =
    textValue ?? (typeof label === 'string' || typeof label === 'number' ? String(label) : '')

  // The row is a `div` with `role="row"`, holding one `gridcell` with the content; child items
  // render as the rows after it, not inside it. `--cx-tree-level` carries the level to the
  // stylesheet, which indents by it; written prefixed here because the build prefixes the
  // stylesheet's custom properties, not this inline one.
  return (
    <AriaTreeItem
      className={({ isDisabled, isExpanded, isSelected }) =>
        classNames(
          'tree-item',
          { active: isSelected, disabled: isDisabled, expanded: isExpanded },
          className
        )
      }
      id={id}
      isDisabled={disabled}
      onAction={onAction}
      ref={ref}
      {...({ render: renderRow } as object)}
      style={({ level }) => ({ ...style, '--cx-tree-level': level }) as CSSProperties}
      textValue={text}
    >
      <TreeItemContent>
        {({ hasChildItems, isDisabled, selectionMode }) => (
          <TreeItemBody
            hasChildItems={hasChildItems}
            icon={icon}
            isDisabled={isDisabled}
            label={label}
            selectionMode={selectionMode}
          />
        )}
      </TreeItemContent>
      {items ? (
        <Collection dependencies={dependencies} items={items}>
          {children as (item: T) => ReactElement}
        </Collection>
      ) : typeof children === 'function' ? null : (
        // A render function with no `items` has nothing to render: the leaf of a tree whose
        // one function renders every level.
        children
      )}
    </AriaTreeItem>
  )
}

/**
 * An item of a `Tree`: a row with a label, an optional icon, and child items among its children.
 */
export const TreeItem = forwardRef(TreeItemInner) as <T extends object = object>(
  props: TreeItemProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement

;(TreeItem as { displayName?: string }).displayName = 'TreeItem'
