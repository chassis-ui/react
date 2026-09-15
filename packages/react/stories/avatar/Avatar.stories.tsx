import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar } from '../../src/components/avatar/Avatar'
import { AvatarImage } from '../../src/components/avatar/AvatarImage'
import { AvatarStack } from '../../src/components/avatar/AvatarStack'

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'avatar/Avatar'
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => (
    <>
      <Avatar>CX</Avatar>
      <Avatar src="https://i.pravatar.cc/256" />
    </>
  )
}

export const WithAvatarImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/256" alt="Profile picture" loading="lazy" />
    </Avatar>
  )
}

export const Colors: Story = {
  render: () => (
    <>
      <Avatar color="default">CX</Avatar>
      <Avatar color="primary">CX</Avatar>
      <Avatar color="secondary">CX</Avatar>
      <Avatar color="danger">CX</Avatar>
      <Avatar color="success">CX</Avatar>
    </>
  )
}

export const Sizes: Story = {
  render: () => (
    <>
      <Avatar size="xs">CX</Avatar>
      <Avatar size="sm">CX</Avatar>
      <Avatar>CX</Avatar>
      <Avatar size="lg">CX</Avatar>
      <Avatar size="xl">CX</Avatar>
    </>
  )
}

export const Stack: Story = {
  render: () => (
    <AvatarStack
      items={[
        { src: 'https://i.pravatar.cc/256?u=1', alt: 'Team member' },
        { src: 'https://i.pravatar.cc/256?u=2', alt: 'Team member' },
        { src: 'https://i.pravatar.cc/256?u=3', alt: 'Team member' }
      ]}
    >
      <Avatar component="span">+5</Avatar>
    </AvatarStack>
  )
}

export const Status: Story = {
  render: () => (
    <>
      <Avatar src="https://i.pravatar.cc/256" status="success" statusLabel="Online" />
      <Avatar src="https://i.pravatar.cc/256" status="danger" statusLabel="Offline" />
      <Avatar src="https://i.pravatar.cc/256" status="warning" statusLabel="Away" />
    </>
  )
}
