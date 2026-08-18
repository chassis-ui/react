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

// Unlike Toast (whose internal `visible` state starts `false` and only syncs to the story's arg
// in a post-mount effect, forcing a real animated entrance — see
// toast-notification.visual.spec.ts), Collapse's `visible` prop feeds CSSTransition's `in` prop
// directly, and react-transition-group's own documented behavior is that a `CSSTransition`
// without `appear` starts in the already-settled `entered` state when `in` is `true` on first
// mount — no enter transition plays. So an `Open` story here is settled on first paint, same as
// Notification's stories, not the "wait for the settled class" treatment Toast needed.
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
