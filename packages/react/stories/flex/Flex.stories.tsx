import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Flex } from '../../src/components/flex/Flex'

const meta: Meta<typeof Flex> = {
  component: Flex,
  title: 'flex/Flex',
  argTypes: {
    direction: {
      control: 'select',
      options: [undefined, 'row', 'column', 'row-reverse', 'column-reverse']
    },
    wrap: {
      control: 'select',
      options: [undefined, 'wrap', 'nowrap', 'wrap-reverse']
    },
    justify: {
      control: 'select',
      options: [undefined, 'start', 'end', 'center', 'between', 'around', 'evenly']
    },
    align: {
      control: 'select',
      options: [undefined, 'start', 'end', 'center', 'baseline', 'stretch']
    },
    gap: {
      control: 'select',
      options: [
        0,
        'zero',
        '4xsmall',
        '3xsmall',
        '2xsmall',
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
        '2xlarge',
        '3xlarge',
        '4xlarge',
        '5xlarge',
        '6xlarge'
      ]
    }
  }
}
export default meta

type Story = StoryObj<typeof Flex>

const itemClass = 'border p-xsmall'

const items = (
  <>
    <div className={itemClass}>First item</div>
    <div className={itemClass}>Second item</div>
    <div className={itemClass}>Third item</div>
  </>
)

export const Basic: Story = {
  args: {
    gap: 'medium',
    children: items
  }
}

export const Column: Story = {
  args: {
    direction: 'column',
    gap: 'medium',
    children: items
  }
}

export const JustifyBetween: Story = {
  args: {
    justify: 'between',
    children: items
  }
}

export const AlignCenter: Story = {
  render: (args) => (
    <Flex {...args} style={{ height: 120 }}>
      {items}
    </Flex>
  ),
  args: {
    align: 'center'
  }
}

export const Wrap: Story = {
  render: (args) => (
    <Flex {...args} style={{ width: 160 }}>
      {items}
      {items}
    </Flex>
  ),
  args: {
    wrap: 'wrap',
    gap: 'small'
  }
}

// row-gap and column-gap only visibly differ from a single gap once the container wraps onto
// multiple lines — a single-row flex container has only one axis of gap to show.
export const RowAndColumnGap: Story = {
  render: (args) => (
    <Flex {...args} style={{ width: 160 }}>
      {items}
      {items}
    </Flex>
  ),
  args: {
    wrap: 'wrap',
    rowGap: 'xlarge',
    columnGap: 'xsmall'
  }
}

// Resize the Storybook canvas to preview the breakpoint-driven layout switch — these are regular
// viewport media queries, unlike Stack's responsive prop, so no .contains-inline wrapper needed.
export const Responsive: Story = {
  args: {
    direction: 'column',
    gap: 'small',
    responsive: {
      medium: { direction: 'row', gap: 'medium', justify: 'between' }
    },
    children: items
  }
}
