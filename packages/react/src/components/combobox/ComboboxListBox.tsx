import React, { RefObject, useRef } from 'react'
import classNames from 'classnames'
import { AriaListBoxOptions, useListBox, useOption } from 'react-aria'
import { ComboBoxState, Node } from 'react-stately'

import { getVirtualFocusStyle } from '../../utils/virtualFocusStyle'
import { CxIcon } from '../icon/CxIcon'
import { ComboboxEntry } from './comboboxCollection'

interface ComboboxListBoxProps {
  listBoxProps: AriaListBoxOptions<ComboboxEntry>
  listBoxRef: RefObject<HTMLElement | null>
  state: ComboBoxState<ComboboxEntry>
}

export const ComboboxListBox = ({ listBoxProps, listBoxRef, state }: ComboboxListBoxProps) => {
  const { listBoxProps: domListBoxProps } = useListBox(listBoxProps, state, listBoxRef)

  return (
    <div {...domListBoxProps} ref={listBoxRef as RefObject<HTMLDivElement>}>
      {[...state.collection].map((node) =>
        node.type === 'section' ? (
          <ComboboxSection key={node.key} node={node} state={state} />
        ) : (
          <ComboboxOption key={node.key} item={node} state={state} />
        )
      )}
    </div>
  )
}

interface ComboboxSectionProps {
  node: Node<ComboboxEntry>
  state: ComboBoxState<ComboboxEntry>
}

// Chassis-css groups are `.menu-header` siblings interleaved with `.menu-item`s, no wrapping
// element — plain, static markup, so there's no need for react-aria's `useListBoxSection`.
// `useComboBoxState`'s filtering hides child items whose text doesn't match, but doesn't drop an
// emptied-out section node itself, so a fully-filtered-out group's header is skipped by hand here
// rather than left to render on its own.
const ComboboxSection = ({ node, state }: ComboboxSectionProps) => {
  const childNodes = [...state.collection.getChildren!(node.key)]
  if (childNodes.length === 0) return null

  return (
    <>
      <div className="menu-header" role="presentation">
        {node.rendered}
      </div>
      {childNodes.map((child) => (
        <ComboboxOption key={child.key} item={child} state={state} />
      ))}
    </>
  )
}

interface ComboboxOptionProps {
  item: Node<ComboboxEntry>
  state: ComboBoxState<ComboboxEntry>
}

const ComboboxOption = ({ item, state }: ComboboxOptionProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { optionProps, isSelected, isDisabled, isFocused } = useOption(
    { key: item.key },
    state,
    ref
  )

  return (
    <div
      className={classNames('menu-item', {
        selected: isSelected,
        disabled: isDisabled
      })}
      style={getVirtualFocusStyle(isFocused)}
      {...optionProps}
      ref={ref}
    >
      {item.rendered}
      {isSelected && <CxIcon name="check-solid" className="menu-item-check" />}
    </div>
  )
}
