import React, { ReactElement, RefObject, useRef } from 'react'
import classNames from 'classnames'
import { AriaListBoxOptions, useListBox, useOption } from 'react-aria'
import { ComboBoxState, Node } from 'react-stately'

import { CxComboboxItemProps } from './CxComboboxItem'

interface ComboboxListBoxProps {
  listBoxProps: AriaListBoxOptions<ReactElement<CxComboboxItemProps>>
  listBoxRef: RefObject<HTMLElement | null>
  state: ComboBoxState<ReactElement<CxComboboxItemProps>>
}

export const ComboboxListBox = ({ listBoxProps, listBoxRef, state }: ComboboxListBoxProps) => {
  const { listBoxProps: domListBoxProps } = useListBox(listBoxProps, state, listBoxRef)

  return (
    <div {...domListBoxProps} ref={listBoxRef as RefObject<HTMLDivElement>}>
      {[...state.collection].map((item) => (
        <ComboboxOption key={item.key} item={item} state={state} />
      ))}
    </div>
  )
}

interface ComboboxOptionProps {
  item: Node<ReactElement<CxComboboxItemProps>>
  state: ComboBoxState<ReactElement<CxComboboxItemProps>>
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
        active: isFocused,
        disabled: isDisabled
      })}
      {...optionProps}
      ref={ref}
    >
      {item.rendered}
    </div>
  )
}
