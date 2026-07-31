import { Key, ReactElement, ReactNode } from 'react'

import { CxComboboxItemProps } from './CxComboboxItem'

// Shared between CxCombobox.tsx (which builds this collection from children/items) and
// ComboboxListBox.tsx (which renders it) — kept in its own file to avoid a circular import
// between the two.

export type ComboboxItemElement = ReactElement<CxComboboxItemProps>

export interface ComboboxGroupEntry {
  entryType: 'group'
  key: Key
  label: ReactNode
  items: ComboboxItemElement[]
}

export type ComboboxEntry = ComboboxItemElement | ComboboxGroupEntry

export const isComboboxGroupEntry = (entry: ComboboxEntry): entry is ComboboxGroupEntry =>
  (entry as ComboboxGroupEntry).entryType === 'group'
