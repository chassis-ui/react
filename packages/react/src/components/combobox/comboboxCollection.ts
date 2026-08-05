import { Key, ReactElement, ReactNode } from 'react'

import { ComboboxItemProps } from './ComboboxItem'

// Shared between Combobox.tsx (which builds this collection from children/items) and
// ComboboxListBox.tsx (which renders it) — kept in its own file to avoid a circular import
// between the two.

export type ComboboxItemElement = ReactElement<ComboboxItemProps>

export interface ComboboxGroupEntry {
  entryType: 'group'
  key: Key
  label: ReactNode
  items: ComboboxItemElement[]
}

export type ComboboxEntry = ComboboxItemElement | ComboboxGroupEntry

// `useComboBoxState`/`useComboBox`'s own `SelectionMode` ('single' | 'multiple') isn't
// re-exported from react-stately's public entry point (only `ComboBoxState` etc. are) — this is
// a structurally-identical stand-in so `ComboboxListBox` can stay generic over it without a
// fragile deep import.
export type ComboboxSelectionMode = 'single' | 'multiple'

export const isComboboxGroupEntry = (entry: ComboboxEntry): entry is ComboboxGroupEntry =>
  (entry as ComboboxGroupEntry).entryType === 'group'
