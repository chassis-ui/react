import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Flex } from '../../src/components/flex/Flex'
import { Placeholder } from '../../src/components/placeholder/Placeholder'

const meta: Meta<typeof Placeholder> = {
  component: Placeholder,
  title: 'placeholder/Placeholder'
}

export default meta

type Story = StoryObj<typeof Placeholder>

export const Default: Story = {
  args: {
    width: 400,
    height: 200
  }
}

export const Colors: Story = {
  render: () => (
    <Flex gap="sm" wrap="wrap">
      <Placeholder color="primary" width={140} height={100} />
      <Placeholder color="secondary" width={140} height={100} />
      <Placeholder color="success" width={140} height={100} />
      <Placeholder color="danger" width={140} height={100} />
    </Flex>
  )
}

export const TextLabels: Story = {
  render: () => (
    <Flex gap="md" wrap="wrap">
      <Placeholder width={200} height={120} title="Cover" text="No cover yet" />
      <Placeholder width={200} height={120} title={false} text="Coming soon" />
      <Placeholder width={200} height={120} text={false} />
    </Flex>
  )
}

export const RealImage: Story = {
  args: {
    src: 'https://placehold.co/400x200',
    alt: 'A placeholder image served from placehold.co',
    width: 400,
    height: 200
  }
}

export const Styling: Story = {
  render: () => (
    <Flex gap="md" wrap="wrap" align="center">
      <Placeholder src="https://placehold.co/160x100" alt="" fluid />
      <Placeholder src="https://placehold.co/160x100" alt="" thumbnail />
      <Placeholder src="https://placehold.co/160x100" alt="" rounded />
    </Flex>
  )
}
