import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { SearchField } from '../../src/components/search-field/SearchField'
import { I18nProvider } from '../../src/index'

// Storybook has no icon sprite, so these stories embed the four symbols they draw, from
// chassis-icons: the screenshots then show the search icon and the clear button.
const symbols = [
  [
    'search-outline',
    'M16.382 10.117c0-2.224-1.212-4.254-3.127-5.385-1.954-1.132-4.338-1.132-6.253 0-1.954 1.131-3.126 3.16-3.126 5.385a6.21 6.21 0 0 0 3.126 5.424c1.915 1.132 4.3 1.132 6.254 0 1.915-1.131 3.126-3.16 3.126-5.424m-1.212 6.4a8.2 8.2 0 0 1-5.041 1.717C5.635 18.234 2 14.604 2 10.117 2 5.668 5.635 2 10.129 2c4.455 0 8.129 3.668 8.129 8.117a8.23 8.23 0 0 1-1.759 5.073l5.237 5.19c.352.39.352.976 0 1.327-.39.39-.977.39-1.329 0z'
  ],
  [
    'xmark-outline',
    'm18.477 7.352-4.688 4.687 4.649 4.649c.39.351.39.937 0 1.289a.856.856 0 0 1-1.29 0l-4.687-4.649-4.648 4.649a.856.856 0 0 1-1.29 0c-.39-.352-.39-.938 0-1.329L11.172 12 6.523 7.352c-.39-.352-.39-.938 0-1.329.352-.351.938-.351 1.329 0l4.648 4.688 4.648-4.648c.352-.391.938-.391 1.329 0a.92.92 0 0 1 0 1.289'
  ],
  [
    'search-solid',
    'M18.258 10.113a8.1 8.1 0 0 1-1.563 4.798l4.924 4.954a1.2 1.2 0 0 1 0 1.755 1.207 1.207 0 0 1-1.759 0l-4.963-4.954c-1.329 1.014-3.01 1.56-4.768 1.56C5.635 18.226 2 14.6 2 10.113 2 5.667 5.635 2 10.129 2c4.455 0 8.129 3.667 8.129 8.113m-8.129 5.617a5.58 5.58 0 0 0 4.846-2.809c1.016-1.716 1.016-3.861 0-5.616-1.016-1.717-2.853-2.809-4.846-2.809a5.68 5.68 0 0 0-4.885 2.809c-1.016 1.755-1.016 3.9 0 5.617a5.6 5.6 0 0 0 4.885 2.808'
  ],
  [
    'xmark-circle-solid',
    'M12 22c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10C5.125 3.914 8.406 2 12 2c3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10A9.93 9.93 0 0 1 12 22M8.836 8.836c-.39.39-.39.976 0 1.328L10.672 12l-1.836 1.836c-.39.39-.39.976 0 1.328.351.39.937.39 1.289 0l1.836-1.836 1.836 1.836c.39.39.976.39 1.328 0 .39-.351.39-.937 0-1.328L13.289 12l1.836-1.836c.39-.351.39-.937 0-1.328-.352-.352-.937-.352-1.328 0l-1.836 1.836-1.836-1.836a.92.92 0 0 0-1.29 0'
  ]
]

// The sprite comes after the story: a tool that reads the first element of the canvas as the
// story (design-sync's capture does) would find a hidden `<svg>` and call the story empty.
const withIcons = (Story: () => React.ReactElement) => (
  <>
    <Story />
    <svg aria-hidden="true" style={{ display: 'none' }}>
      {symbols.map(([id, path]) => (
        <symbol id={id} key={id} viewBox="0 0 24 24">
          <path d={path} />
        </symbol>
      ))}
    </svg>
  </>
)

const meta: Meta<typeof SearchField> = {
  component: SearchField,
  decorators: [withIcons],
  title: 'search-field/SearchField'
}

export default meta

type Story = StoryObj<typeof SearchField>

// Stories set a locale, so the clear button's name doesn't depend on the browser running them.
const inLocale = (locale: string) => (Story: () => React.ReactElement) => (
  <I18nProvider locale={locale}>
    <Story />
  </I18nProvider>
)

export const Default: Story = {
  args: {
    help: 'Pages and posts.',
    label: 'Search',
    onChange: fn(),
    onClear: fn(),
    onSubmit: fn(),
    placeholder: 'Search…'
  },
  decorators: [inLocale('en-US')],
  play: async function ({ args, canvas, userEvent }) {
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    await userEvent.type(input, 'chassis{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledWith('chassis')

    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(input).toHaveValue('')
    await expect(input).toHaveFocus()
    await expect(args.onClear).toHaveBeenCalledTimes(1)
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()

    await userEvent.type(input, 'vue{Escape}')
    await expect(input).toHaveValue('')
    await expect(args.onChange).toHaveBeenLastCalledWith('')

    // The state the visual regression spec waits for before its screenshot.
    await userEvent.type(input, 'react')
  }
}

export const Sizes: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <SearchField aria-label="Small" defaultValue="chassis" size="sm" />
      <SearchField aria-label="Medium" defaultValue="chassis" />
      <SearchField aria-label="Large" defaultValue="chassis" size="lg" />
    </div>
  ),
  decorators: [inLocale('en-US')]
}

export const States: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <SearchField aria-label="Empty" placeholder="Search…" />
      <SearchField
        defaultValue="c"
        invalid
        invalidFeedback="Type at least two letters."
        label="Invalid"
      />
      <SearchField defaultValue="chassis" label="Valid" valid validFeedback="12 results." />
      <SearchField defaultValue="chassis" disabled label="Disabled" />
      <SearchField defaultValue="chassis" label="Read only" readOnly />
    </div>
  ),
  decorators: [inLocale('en-US')]
}

export const Icons: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <SearchField aria-label="Without the search icon" defaultValue="chassis" searchIcon={false} />
      <SearchField
        aria-label="Other icons"
        clearIcon="xmark-circle-solid"
        defaultValue="chassis"
        searchIcon="search-solid"
      />
    </div>
  ),
  decorators: [inLocale('en-US')]
}

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: '20rem' }}>
      <SearchField defaultValue="بحث" label="بحث" />
    </div>
  ),
  decorators: [inLocale('ar-EG')]
}
