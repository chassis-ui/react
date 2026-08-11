import React, { RefObject, useRef } from 'react'
import classNames from 'classnames'
import { AriaTagGroupOptions, useButton, useTag, useTagGroup } from 'react-aria'
import { ListState, Node } from 'react-stately'

import { CloseButton } from '../close-button/CloseButton'

// react-stately's collection builder caches nodes in a WeakMap keyed by each item's own
// identity, so `items` must be objects — plain tag strings can't be WeakMap keys.
export interface ChipItem {
  id: string
  value: string
}

interface ChipListProps {
  chipVariant?: string
  groupRef: RefObject<HTMLDivElement | null>
  props: AriaTagGroupOptions<ChipItem>
  state: ListState<ChipItem>
}

export const ChipList = ({ chipVariant, groupRef, props, state }: ChipListProps) => {
  const { gridProps } = useTagGroup(props, state, groupRef)

  return (
    <div {...gridProps} ref={groupRef as RefObject<HTMLDivElement>}>
      {[...state.collection].map((item) => (
        <Chip chipVariant={chipVariant} item={item} key={item.key} state={state} />
      ))}
    </div>
  )
}

interface ChipProps {
  chipVariant?: string
  item: Node<ChipItem>
  state: ListState<ChipItem>
}

const Chip = ({ chipVariant, item, state }: ChipProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { rowProps, gridCellProps, removeButtonProps, allowsRemoving } = useTag(
    { item },
    state,
    ref
  )
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(removeButtonProps, buttonRef)

  return (
    <div
      {...rowProps}
      className={classNames('chip', chipVariant, {
        active: state.selectionManager.isSelected(item.key)
      })}
      ref={ref}
    >
      <div {...gridCellProps}>
        {item.rendered}
        {allowsRemoving && (
          // react-aria's generic ButtonHTMLAttributes typing includes a legacy `color?: string`
          // attribute that's wider than CloseButton's `color?: ContextColor` prop; buttonProps
          // never actually sets it, so it's safe to omit from the spread's type.
          <CloseButton {...(buttonProps as Omit<typeof buttonProps, 'color'>)} ref={buttonRef} />
        )}
      </div>
    </div>
  )
}
