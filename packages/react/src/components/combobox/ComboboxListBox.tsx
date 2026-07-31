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

// Options never receive real DOM focus — react-aria keeps focus on the combobox's text input
// and tracks the highlighted option virtually, so `:hover`/`:focus-visible` can't style it. To
// indicate the highlight without touching chassis-css, we reuse its own hover color tokens
// (already defined on the ancestor `.menu`, prefixed `--cx-` by chassis-css's build) as inline
// overrides instead of relying on `.active`, which chassis-css reserves for the pressed/`:active`
// look.
const focusedStyle: React.CSSProperties = {
  '--cx-icon-color': 'var(--cx-item-hover-icon-color)',
  '--cx-item-fg-color': 'var(--cx-item-hover-fg-color)',
  '--cx-item-bg-color': 'var(--cx-item-hover-bg-color)'
} as React.CSSProperties

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
      style={isFocused ? focusedStyle : undefined}
      {...optionProps}
      ref={ref}
    >
      {item.rendered}
    </div>
  )
}
