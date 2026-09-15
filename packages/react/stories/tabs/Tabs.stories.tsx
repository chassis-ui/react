import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'

import { Tabs } from '../../src/components/tabs/Tabs'
import { TabList } from '../../src/components/tabs/TabList'
import { Tab } from '../../src/components/tabs/Tab'
import { TabPanel } from '../../src/components/tabs/TabPanel'

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  title: 'tabs/Tabs'
}

export default meta

type Story = StoryObj<typeof Tabs>

// `Tabs` reads `children` as data via `React.Children.toArray` (see `Tabs.tsx`) to find the
// `TabList` and build its tab/panel collection, so they must be passed as real JSX children
// through `render` — an `args.children` value built with a `<>...</>` Fragment is a single
// Fragment element, not the multiple elements `React.Children.toArray` expects, and silently
// renders no tabs at all.
export const Default: Story = {
  args: {
    defaultSelectedKey: 'home',
    onSelectionChange: fn()
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Example tabs">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="contact">Contact</Tab>
      </TabList>
      <TabPanel id="home">Raw denim you probably haven&apos;t heard of them jean shorts.</TabPanel>
      <TabPanel id="profile">Food truck fixie locavore, accusamus mcsweeney&apos;s.</TabPanel>
      <TabPanel id="contact">Etsy mixtape wayfarers, ethical wes anderson tofu.</TabPanel>
    </Tabs>
  ),
  play: async function ({ args, canvas, userEvent }) {
    const profileTab = canvas.getByRole('tab', { name: 'Profile' })
    await userEvent.click(profileTab)
    await expect(args.onSelectionChange).toHaveBeenCalledWith('profile')
    await expect(profileTab).toHaveAttribute('aria-selected', 'true')
    // The incoming panel mounts as `tab-pane fade active` and only gains `show` a tick later, so
    // it is genuinely `opacity: 0` at the moment the click resolves — see `TabPanel`'s `Transition`.
    await waitFor(() => expect(canvas.getByText(/food truck fixie/i)).toBeVisible())
  }
}

export const Pills: Story = {
  args: {
    defaultSelectedKey: 'home'
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Pills example" variant="pills">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="contact">Contact</Tab>
      </TabList>
      <TabPanel id="home">Raw denim you probably haven&apos;t heard of them jean shorts.</TabPanel>
      <TabPanel id="profile">Food truck fixie locavore, accusamus mcsweeney&apos;s.</TabPanel>
      <TabPanel id="contact">Etsy mixtape wayfarers, ethical wes anderson tofu.</TabPanel>
    </Tabs>
  )
}

export const Disabled: Story = {
  args: {
    defaultSelectedKey: 'home'
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Example tabs with a disabled tab">
        <Tab id="home">Home</Tab>
        <Tab id="profile" disabled>
          Profile
        </Tab>
        <Tab id="contact">Contact</Tab>
      </TabList>
      <TabPanel id="home">Raw denim you probably haven&apos;t heard of them jean shorts.</TabPanel>
      <TabPanel id="profile">This panel can&apos;t be reached — Profile is disabled.</TabPanel>
      <TabPanel id="contact">Etsy mixtape wayfarers, ethical wes anderson tofu.</TabPanel>
    </Tabs>
  )
}

export const Vertical: Story = {
  args: {
    defaultSelectedKey: 'home',
    orientation: 'vertical'
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Vertical tabs">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="contact">Contact</Tab>
      </TabList>
      <TabPanel id="home">Raw denim you probably haven&apos;t heard of them jean shorts.</TabPanel>
      <TabPanel id="profile">Food truck fixie locavore, accusamus mcsweeney&apos;s.</TabPanel>
      <TabPanel id="contact">Etsy mixtape wayfarers, ethical wes anderson tofu.</TabPanel>
    </Tabs>
  )
}
