import React, { ComponentType, ReactElement, ReactNode } from 'react'
import { Item, Key, Section } from 'react-stately'

import { ComboboxGroupProps } from '../components/combobox/ComboboxGroup'
import { ComboboxItem, ComboboxItemProps } from '../components/combobox/ComboboxItem'
import { MenuItemsDef } from '../components/menu/MenuItemDef'
import { renderMenuItemContent } from './renderMenuItemContent'

// Shared between Combobox.tsx/ComboboxListBox.tsx (which build/render this collection) and
// Autocomplete.tsx (which reuses the same entry shape — see the comment on
// `buildEntriesFromChildren` below). Lives in `utils/` rather than `components/combobox/` because
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

// `Autocomplete`'s own `AutocompleteItem`/`AutocompleteGroup` are structurally identical to
// `ComboboxItem`/`ComboboxGroup` (see AutocompleteItem.tsx/AutocompleteGroup.tsx — kept as
// separate named types only so `Autocomplete`'s public API doesn't leak `Combobox`'s own prop
// type), but they're different *runtime* component identities, which is what
// `buildEntriesFromChildren` below needs to check consumer-authored `children` against. Passing
// the pair in lets one implementation serve both families instead of two near-duplicate copies.
export interface ComboboxCollectionComponents {
  Group: ComponentType<ComboboxGroupProps>
  Item: ComponentType<ComboboxItemProps>
}

// Splits `children` into a flat, ordered list of entries — bare `Item` elements and
// `Group`-wrapped clusters of them — mirroring how `useComboBoxState`'s dynamic collection needs
// top-level nodes: some rendered as a plain `<Item>`, some as a `<Section>` wrapping several
// `<Item>`s (see `comboboxCollectionChildren` below).
export const buildEntriesFromChildren = (
  children: ReactNode,
  { Group, Item: ItemComponent }: ComboboxCollectionComponents
): ComboboxEntry[] => {
  const entries: ComboboxEntry[] = []
  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) return
    if (child.type === Group) {
      const groupProps = child.props as ComboboxGroupProps
      const items: ComboboxItemElement[] = []
      React.Children.forEach(groupProps.children, (groupChild) => {
        if (React.isValidElement(groupChild) && groupChild.type === ItemComponent) {
          items.push(groupChild as ComboboxItemElement)
        }
      })
      entries.push({ entryType: 'group', key: `group-${index}`, label: groupProps.label, items })
      return
    }
    if (child.type === ItemComponent) {
      entries.push(child as ComboboxItemElement)
    }
  })
  return entries
}

// Same shape as `buildEntriesFromChildren`, from a flat `MenuItemsDef` instead. A `'header'`
// entry opens a new group that all following items join until the next header (or the end of
// the array) — matching how chassis-css itself renders grouped items (flat siblings, no
// wrapping element per group). `'divider'` entries aren't meaningful for a listbox/option
// collection and are skipped.
//
// Always builds a bare `ComboboxItem` internally regardless of which family (`Combobox` or
// `Autocomplete`) called it: unlike `buildEntriesFromChildren`, nothing downstream re-checks
// these elements' runtime type (they're read only via `.props.*`, never matched against a
// component reference again), so there's no need to thread `ComboboxCollectionComponents`
// through here too. `def.href`/`def.onClick` are intentionally not read — see the doc comments on
// `MenuItemDef` itself for why: they're `Menu`-only fields on this shared type.
export const buildEntriesFromItemsDef = (defs: MenuItemsDef): ComboboxEntry[] => {
  const entries: ComboboxEntry[] = []
  let currentGroup: ComboboxGroupEntry | null = null

  defs.forEach((def) => {
    if (def.type === 'divider') return
    if (def.type === 'header') {
      currentGroup = { entryType: 'group', key: def.id, label: def.label, items: [] }
      entries.push(currentGroup)
      return
    }
    const item = (
      <ComboboxItem
        key={def.id}
        id={def.id}
        disabled={def.disabled}
        icon={def.icon}
        description={def.description}
        textValue={def.textValue}
      >
        {def.label}
      </ComboboxItem>
    )
    if (currentGroup) currentGroup.items.push(item)
    else entries.push(item)
  })

  return entries
}

export const getDisabledKeys = (entries: ComboboxEntry[]): Key[] =>
  entries.reduce<Key[]>((keys, entry) => {
    const items = isComboboxGroupEntry(entry) ? entry.items : [entry]
    return keys.concat(items.filter((item) => item.props.disabled).map((item) => item.props.id))
  }, [])

// Builds the react-stately `Item` node `useComboBoxState`'s collection actually renders from one
// entry's props — identical for `Combobox` and `Autocomplete` regardless of which authoring
// component (`ComboboxItem`/`AutocompleteItem`) produced it, since both share the same prop shape.
export const renderComboboxCollectionItem = (item: ComboboxItemElement) => (
  <Item
    key={item.props.id}
    textValue={
      item.props.textValue ??
      (typeof item.props.children === 'string' ? item.props.children : undefined)
    }
  >
    {renderMenuItemContent({
      icon: item.props.icon,
      label: item.props.children,
      description: item.props.description
    })}
  </Item>
)

// `useComboBoxState`'s own `children` render prop, given one `ComboboxEntry` — a plain `Item` for
// a bare entry, a `Section` wrapping its items for a group. Identical for `Combobox` and
// `Autocomplete`'s state setup.
export const comboboxCollectionChildren = (entry: ComboboxEntry) =>
  isComboboxGroupEntry(entry) ? (
    <Section key={entry.key} title={entry.label} items={entry.items}>
      {renderComboboxCollectionItem}
    </Section>
  ) : (
    renderComboboxCollectionItem(entry)
  )
