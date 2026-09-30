import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Collapse } from '../../src/components/collapse/Collapse'

const meta: Meta<typeof Collapse> = {
  component: Collapse,
  title: 'collapse/Collapse'
}
export default meta

type Story = StoryObj<typeof Collapse>

const cardContent = (
  <div className="card">
    <div className="card-body">
      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
      squid.
    </div>
  </div>
)

// Unlike Toast and Notification (which play their entrance on mount, see
// toast-notification.visual.spec.ts), Collapse doesn't ask `useTransitionState` for `appear`, so
// mounted with `visible` it starts settled, in `entered`, and no enter transition plays. An
// `Open` story here is settled on first paint and needs no "wait for the settled class".
export const Closed: Story = {
  args: {
    visible: false,
    children: cardContent
  }
}

export const Open: Story = {
  args: {
    visible: true,
    children: cardContent
  }
}

export const OpenHorizontal: Story = {
  args: {
    visible: true,
    horizontal: true,
    children: (
      <div className="card" style={{ width: '300px' }}>
        <div className="card-body">Horizontal collapse content.</div>
      </div>
    )
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '120px' }}>
        <Story />
      </div>
    )
  ]
}
