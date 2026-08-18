import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Button } from '../../src/components/button/Button'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'button/Button'
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    'aria-label': 'button',
    children: 'Button',
    onClick: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const button = canvas.getByRole('button', { name: /button/i })

    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalled()
  }
}

export const Disabled: Story = {
  args: {
    'aria-label': 'button',
    children: 'Disabled',
    disabled: true,
    onClick: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const button = canvas.getByRole('button', { name: /button/i })
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    expect(button).toHaveStyle({ pointerEvents: 'none' })
    await user.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  }
}
