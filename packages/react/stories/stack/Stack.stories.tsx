import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Stack } from '../../src/components/stack/Stack'

const meta: Meta<typeof Stack> = {
  component: Stack,
  title: 'stack/Stack',
  argTypes: {
    direction: {
      control: 'select'
    },
    gap: {
      control: 'select'
    }
  }
}
export default meta

type Story = StoryObj<typeof Stack>

const itemClass = 'border p-xs'

const items = (
  <>
    <div className={itemClass}>First item</div>
    <div className={itemClass}>Second item</div>
    <div className={itemClass}>Third item</div>
  </>
)

export const Horizontal: Story = {
  args: {
    gap: 'md',
    children: items
  }
}

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    gap: 'md',
    children: items
  }
}

// `responsive` requires a `.contains-inline` ancestor to establish the container-query context —
// resize the Storybook canvas/panel to preview the direction switch at the `md` breakpoint.
export const Responsive: Story = {
  render: () => (
    <div className="contains-inline">
      <Stack direction="vertical" gap="md" responsive={{ md: 'horizontal' }}>
        {items}
      </Stack>
    </div>
  )
}
