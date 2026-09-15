import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, waitFor } from 'storybook/test'

import { Autocomplete } from '../../src/components/autocomplete/Autocomplete'
import { AutocompleteGroup } from '../../src/components/autocomplete/AutocompleteGroup'
import { AutocompleteItem } from '../../src/components/autocomplete/AutocompleteItem'

const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  title: 'autocomplete/Autocomplete'
}

export default meta

type Story = StoryObj<typeof Autocomplete>

// `Autocomplete` reads `children` as data via `React.Children` (see `buildEntriesFromChildren` in
// `utils/comboboxCollection.tsx`), so its options must be passed as real JSX children through
// `render` — an `args.children` value built with a `<>...</>` Fragment is a single Fragment
// element, not the multiple elements `React.Children.forEach` expects, and silently yields zero
// entries.
export const Default: Story = {
  args: {
    'aria-label': 'Fruit',
    placeholder: 'Select a fruit…',
    onChange: fn()
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteItem id="apple">Apple</AutocompleteItem>
      <AutocompleteItem id="banana">Banana</AutocompleteItem>
      <AutocompleteItem id="cherry">Cherry</AutocompleteItem>
    </Autocomplete>
  ),
  // The toggle is a `role="button"` trigger — opening reveals a search input and menu that
  // portal to `document.body` outside Storybook's `#storybook-root` (see `Autocomplete.tsx`), so
  // both are queried with `screen` rather than the scoped `canvas`.
  play: async function ({ args, canvas, userEvent }) {
    const toggle = canvas.getByRole('button', { name: /fruit/i })
    await userEvent.click(toggle)
    const option = await waitFor(() => screen.getByRole('option', { name: 'Banana' }))
    await userEvent.click(option)
    await expect(args.onChange).toHaveBeenCalledWith('banana')
  }
}

// The toggle opens the panel on click with no selection made — this is the only reachable "menu
// open" state to screenshot for visual regression, since `Autocomplete` has no `defaultOpen`/
// `visible`-style prop (unlike `DatePicker`/`Menu`) to force it open declaratively.
export const OpenMenu: Story = {
  args: {
    'aria-label': 'Fruit',
    placeholder: 'Select a fruit…'
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteItem id="apple">Apple</AutocompleteItem>
      <AutocompleteItem id="banana">Banana</AutocompleteItem>
      <AutocompleteItem id="cherry">Cherry</AutocompleteItem>
    </Autocomplete>
  ),
  play: async function ({ canvas, userEvent }) {
    const toggle = canvas.getByRole('button', { name: /fruit/i })
    await userEvent.click(toggle)
    await waitFor(() => screen.getByRole('option', { name: 'Banana' }))
  }
}

export const Multiple: Story = {
  args: {
    'aria-label': 'Fruit',
    placeholder: 'Select fruits…',
    multiple: true
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteItem id="apple">Apple</AutocompleteItem>
      <AutocompleteItem id="banana">Banana</AutocompleteItem>
      <AutocompleteItem id="cherry">Cherry</AutocompleteItem>
    </Autocomplete>
  )
}

export const Grouped: Story = {
  args: {
    'aria-label': 'Language',
    placeholder: 'Choose a language…'
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteGroup label="Frontend">
        <AutocompleteItem id="html">HTML</AutocompleteItem>
        <AutocompleteItem id="css">CSS</AutocompleteItem>
        <AutocompleteItem id="js">JavaScript</AutocompleteItem>
      </AutocompleteGroup>
      <AutocompleteGroup label="Backend">
        <AutocompleteItem id="python">Python</AutocompleteItem>
        <AutocompleteItem id="ruby">Ruby</AutocompleteItem>
      </AutocompleteGroup>
    </Autocomplete>
  )
}

export const Items: Story = {
  args: {
    'aria-label': 'Timezone',
    placeholder: 'Choose a timezone…',
    items: [
      { type: 'header', id: 'americas', label: 'Americas' },
      { id: 'est', label: 'Eastern Time' },
      { id: 'cst', label: 'Central Time' },
      { type: 'header', id: 'europe', label: 'Europe' },
      { id: 'gmt', label: 'Greenwich Mean Time' },
      { id: 'cet', label: 'Central European Time' }
    ]
  }
}

export const WithFormField: Story = {
  args: {
    label: 'Country',
    help: 'The billing region.',
    name: 'country',
    placeholder: 'Pick a country…'
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteItem id="us">United States</AutocompleteItem>
      <AutocompleteItem id="uk">United Kingdom</AutocompleteItem>
      <AutocompleteItem id="ca">Canada</AutocompleteItem>
    </Autocomplete>
  )
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Role',
    placeholder: 'Choose a role…',
    disabled: true
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteItem id="admin">Admin</AutocompleteItem>
      <AutocompleteItem id="editor">Editor</AutocompleteItem>
    </Autocomplete>
  )
}
