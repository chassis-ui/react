import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { CloseButton } from '../../src/components/close-button/CloseButton'

const meta: Meta<typeof CloseButton> = {
  component: CloseButton,
  title: 'close-button/CloseButton'
}

export default meta

type Story = StoryObj<typeof CloseButton>

export const Default: Story = {
  args: {
    onClick: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const button = canvas.getByRole('button', { name: /close/i })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalled()
  }
}

export const CustomLabel: Story = {
  args: {
    label: 'Dismiss'
  }
}

export const Colors: Story = {
  render: () => (
    <div className="neutral-bg-evident d-inline-flex p-xs gap-sm">
      <CloseButton color="primary" />
      <CloseButton color="primary" variant="solid" />
      <CloseButton color="warning" />
      <CloseButton color="warning" variant="solid" />
    </div>
  )
}

export const Sizes: Story = {
  render: () => (
    <>
      <CloseButton size="sm" />
      <CloseButton />
      <CloseButton size="lg" />
    </>
  )
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
