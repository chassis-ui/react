import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { List } from '../../src/components/list/List'
import { ListItem } from '../../src/components/list/ListItem'

const meta: Meta<typeof List> = {
  component: List,
  title: 'list/List'
}

export default meta

type Story = StoryObj<typeof List>

export const Default: Story = {
  render: () => (
    <List>
      <ListItem active>Cras justo odio</ListItem>
      <ListItem>Dapibus ac facilisis in</ListItem>
      <ListItem>Morbi leo risus</ListItem>
      <ListItem disabled>Vestibulum at eros</ListItem>
    </List>
  )
}

export const Links: Story = {
  render: () => (
    <List>
      <ListItem component="a" href="#" active>
        Cras justo odio
      </ListItem>
      <ListItem component="a" href="#">
        Dapibus ac facilisis in
      </ListItem>
      <ListItem component="a" href="#" disabled>
        Vestibulum at eros
      </ListItem>
    </List>
  )
}

export const DataDriven: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '#', active: true },
      { label: 'Profile', href: '#' },
      { label: 'Settings', href: '#' },
      { label: 'Billing', href: '#', disabled: true }
    ]
  }
}

export const Flush: Story = {
  render: () => (
    <List flush>
      <ListItem>Cras justo odio</ListItem>
      <ListItem>Dapibus ac facilisis in</ListItem>
      <ListItem>Morbi leo risus</ListItem>
    </List>
  )
}

export const Numbered: Story = {
  render: () => (
    <List component="ol" numbered>
      <ListItem>A list item</ListItem>
      <ListItem>A list item</ListItem>
      <ListItem>A list item</ListItem>
    </List>
  )
}
