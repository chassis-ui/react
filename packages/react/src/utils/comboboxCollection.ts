import { Key, ReactElement, ReactNode } from 'react'

import { ComboboxItemProps } from '../components/combobox/ComboboxItem'

// Shared between Combobox.tsx/ComboboxListBox.tsx (which build/render this collection) and
// Autocomplete.tsx (which reuses the same entry shape — see the comment on
// `buildEntriesFromChildren` there). Lives in `utils/` rather than `components/combobox/` because
// it crosses that folder boundary; kept in its own file to also avoid a circular import between
// Combobox.tsx and ComboboxListBox.tsx.

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
