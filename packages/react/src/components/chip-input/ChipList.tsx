import React, { RefObject, useRef } from 'react'
import classNames from 'classnames'
import { AriaTagGroupOptions, mergeProps, useButton, useTag, useTagGroup } from 'react-aria'
import { ListState, Node } from 'react-stately'

import { Chip } from '../chip/Chip'
import { CloseButton } from '../close-button/CloseButton'

// react-stately's collection builder caches nodes in a WeakMap keyed by each item's own
// identity, so `items` must be objects — plain tag strings can't be WeakMap keys.
export interface ChipItem {
  id: string
  value: string
}

interface ChipListProps {
  chipVariant?: string
  disabled?: boolean
  groupRef: RefObject<HTMLDivElement | null>
  /**
   * Called when the list takes focus while it has no chips: react-aria focuses it when the last
   * chip is removed. `ChipInput` sends the focus on to its text input.
   */
  onEmptyFocus: () => void
  props: AriaTagGroupOptions<ChipItem>
  size?: 'sm' | 'lg'
  state: ListState<ChipItem>
}

export const ChipList = ({
  chipVariant,
  disabled,
  groupRef,
  onEmptyFocus,
  props,
  size,
  state
}: ChipListProps) => {
  const { gridProps } = useTagGroup(props, state, groupRef)
  const empty = state.collection.size === 0

  // react-aria describes the list by a description and an error message it never renders here
  // (FORMS.md, gotcha 6), and keeps `aria-multiselectable` when an empty list turns from a `grid`
  // into a `group`, which doesn't allow it.
  // An empty list is a `group` with `tabIndex={0}`, so that a message for the empty state can be
  // reached. Nothing is rendered in it here, and it was a zero-size tab stop before the input, which
  // also took focus when the last chip was removed. It is focusable by script only, and passes on
  // the focus react-aria gives it.
  return (
    <div
      {...mergeProps(gridProps, {
        onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
          if (empty && event.target === event.currentTarget) onEmptyFocus()
        }
      })}
      aria-describedby={undefined}
      aria-multiselectable={
        gridProps.role === 'grid' ? gridProps['aria-multiselectable'] : undefined
      }
      tabIndex={empty ? -1 : gridProps.tabIndex}
      style={{ display: 'contents' }}
      ref={groupRef as RefObject<HTMLDivElement>}
    >
      {[...state.collection].map((item) => (
        <ChipRow
          chipVariant={chipVariant}
          disabled={disabled}
          item={item}
          key={item.key}
          size={size}
          state={state}
        />
      ))}
    </div>
  )
}

interface ChipRowProps {
  chipVariant?: string
  disabled?: boolean
  item: Node<ChipItem>
  size?: 'sm' | 'lg'
  state: ListState<ChipItem>
}

// Renders one tag as the shared `Chip` component, wrapped in the row/gridcell markup
// `useTag`'s grid semantics require — see FORMS.md-adjacent notes in ChipInput.tsx for why the
// grid role lives on `ChipList`'s own wrapper rather than `.chip-input` itself. The `active`
// class communicates selection directly (react-aria's `aria-selected`, from `rowProps`, is the
// actual ARIA signal); `Chip`'s own `pressed`/`aria-pressed` prop is deliberately left unset
// here since `aria-pressed` isn't a valid property on a `role="row"` element.
const ChipRow = ({ chipVariant, disabled, item, size, state }: ChipRowProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { rowProps, gridCellProps, removeButtonProps, allowsRemoving } = useTag(
    { item },
    state,
    ref
  )
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(removeButtonProps, buttonRef)

  return (
    <Chip
      {...rowProps}
      // Labelled by its `aria-label`. react-aria adds a description id it never renders here.
      aria-labelledby={undefined}
      className={classNames(chipVariant, { active: state.selectionManager.isSelected(item.key) })}
      component="div"
      disabled={disabled}
      ref={ref}
      size={size}
    >
      <div {...gridCellProps} style={{ display: 'contents' }}>
        {item.rendered}
        {allowsRemoving && (
          // react-aria's generic ButtonHTMLAttributes typing includes a legacy `color?: string`
          // attribute that's wider than CloseButton's `color?: ContextColor` prop; buttonProps
          // never actually sets it, so it's safe to omit from the spread's type.
          <CloseButton {...(buttonProps as Omit<typeof buttonProps, 'color'>)} ref={buttonRef} />
        )}
      </div>
    </Chip>
  )
}
