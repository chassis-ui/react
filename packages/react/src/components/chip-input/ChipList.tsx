import React, { RefObject, useRef } from 'react'
import classNames from 'classnames'
import { AriaTagGroupOptions, useButton, useTag, useTagGroup } from 'react-aria'
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
  props: AriaTagGroupOptions<ChipItem>
  size?: 'small' | 'large'
  state: ListState<ChipItem>
}

export const ChipList = ({
  chipVariant,
  disabled,
  groupRef,
  props,
  size,
  state
}: ChipListProps) => {
  const { gridProps } = useTagGroup(props, state, groupRef)

  return (
    <div {...gridProps} style={{ display: 'contents' }} ref={groupRef as RefObject<HTMLDivElement>}>
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
  size?: 'small' | 'large'
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
