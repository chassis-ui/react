import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip } from '../../src/components/tooltip/Tooltip'
import { Button } from '../../src/components/button/Button'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'tooltip/Tooltip',
  // Storybook's canvas renders the story flush against the top-left corner of the viewport —
  // without room on every side, `useOverlayPosition`'s collision detection has nowhere to place
  // a `top`/`left` tooltip and silently flips it to `bottom`/`right` instead, which would make
  // those stories screenshot the wrong placement. Margin on all sides gives every direction room.
  decorators: [
    (Story) => (
      <div style={{ margin: 200 }}>
        <Story />
      </div>
    )
  ]
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Closed: Story = {
  args: {
    content: 'Tooltip text',
    children: <Button color="secondary">Hover me</Button>
  }
}

// `visible` renders the tooltip open on mount (synced by an effect, see Tooltip.tsx) — the only
// way to screenshot its content without driving real hover/focus interaction from the test. The
// tooltip portals to `document.body` (outside Storybook's `#storybook-root`), so the Playwright
// spec screenshots the whole iframe page for these stories rather than a specific element.
export const Top: Story = {
  args: {
    content: 'Tooltip on top',
    placement: 'top',
    visible: true,
    children: <Button color="secondary">Trigger</Button>
  }
}

export const Right: Story = {
  args: {
    content: 'Tooltip on right',
    placement: 'right',
    visible: true,
    children: <Button color="secondary">Trigger</Button>
  }
}

export const Bottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    placement: 'bottom',
    visible: true,
    children: <Button color="secondary">Trigger</Button>
  }
}

export const Left: Story = {
  args: {
    content: 'Tooltip on left',
    placement: 'left',
    visible: true,
    children: <Button color="secondary">Trigger</Button>
  }
}
