import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, waitFor } from 'storybook/test'

import { Combobox } from '../../src/components/combobox/Combobox'
import { ComboboxGroup } from '../../src/components/combobox/ComboboxGroup'
import { ComboboxItem } from '../../src/components/combobox/ComboboxItem'

const meta: Meta<typeof Combobox> = {
  component: Combobox,
  title: 'combobox/Combobox'
}

export default meta

type Story = StoryObj<typeof Combobox>

// `Combobox` reads `children` as data via `React.Children` (see `buildEntriesFromChildren` in
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
    <Combobox {...args}>
      <ComboboxItem id="apple">Apple</ComboboxItem>
      <ComboboxItem id="banana">Banana</ComboboxItem>
      <ComboboxItem id="cherry">Cherry</ComboboxItem>
    </Combobox>
  ),
  // The menu portals to `document.body` outside Storybook's `#storybook-root` (see
  // `Combobox.tsx`), so options are queried with `screen` rather than the scoped `canvas`.
  play: async function ({ args, canvas, userEvent }) {
    const input = canvas.getByRole('combobox', { name: /fruit/i })
    await userEvent.click(input)
    const option = await waitFor(() => screen.getByRole('option', { name: 'Banana' }))
    await userEvent.click(option)
    await expect(args.onChange).toHaveBeenCalledWith('banana')
    await expect(input).toHaveValue('Banana')
  }
}

// `menuTrigger: 'focus'` (see `Combobox.tsx`) opens the portal-rendered listbox as soon as the
// input is focused, with no selection made — this is the only reachable "menu open" state to
// screenshot for visual regression, since `Combobox` has no `defaultOpen`/`visible`-style prop
// (unlike `DatePicker`/`Menu`) to force it open declaratively.
export const OpenMenu: Story = {
  args: {
    'aria-label': 'Fruit',
    placeholder: 'Select a fruit…'
  },
  render: (args) => (
    <Combobox {...args}>
      <ComboboxItem id="apple">Apple</ComboboxItem>
      <ComboboxItem id="banana">Banana</ComboboxItem>
      <ComboboxItem id="cherry">Cherry</ComboboxItem>
    </Combobox>
  ),
  play: async function ({ canvas, userEvent }) {
    const input = canvas.getByRole('combobox', { name: /fruit/i })
    await userEvent.click(input)
    await waitFor(() => screen.getByRole('option', { name: 'Banana' }))
  }
}

export const Grouped: Story = {
  args: {
    'aria-label': 'Language',
    placeholder: 'Choose a language…'
  },
  render: (args) => (
    <Combobox {...args}>
      <ComboboxGroup label="Frontend">
        <ComboboxItem id="html">HTML</ComboboxItem>
        <ComboboxItem id="css">CSS</ComboboxItem>
        <ComboboxItem id="js">JavaScript</ComboboxItem>
      </ComboboxGroup>
      <ComboboxGroup label="Backend">
        <ComboboxItem id="python">Python</ComboboxItem>
        <ComboboxItem id="ruby">Ruby</ComboboxItem>
      </ComboboxGroup>
      <ComboboxItem id="sql">SQL</ComboboxItem>
    </Combobox>
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
    <Combobox {...args}>
      <ComboboxItem id="us">United States</ComboboxItem>
      <ComboboxItem id="uk">United Kingdom</ComboboxItem>
      <ComboboxItem id="ca">Canada</ComboboxItem>
    </Combobox>
  )
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Role',
    placeholder: 'Choose a role…',
    disabled: true
  },
  render: (args) => (
    <Combobox {...args}>
      <ComboboxItem id="admin">Admin</ComboboxItem>
      <ComboboxItem id="editor">Editor</ComboboxItem>
    </Combobox>
  )
}
