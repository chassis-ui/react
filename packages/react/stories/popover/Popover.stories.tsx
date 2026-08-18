import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Popover } from '../../src/components/popover/Popover'
import { Button } from '../../src/components/button/Button'

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: 'popover/Popover',
  // Storybook's canvas renders the story flush against the top-left corner of the viewport —
  // without room on every side, `useOverlayPosition`'s collision detection has nowhere to place
  // a `top`/`left` popover and silently flips it to `bottom`/`right` instead, which would make
  // those stories screenshot the wrong placement. 400px clears the ~300px-wide panel these
  // stories render (confirmed by inspecting the resolved `left`/`top` inline style at 200px — not
  // enough room, so it was flipping even with a margin present).
  decorators: [
    (Story) => (
      <div style={{ margin: 400 }}>
        <Story />
      </div>
    )
  ]
}
export default meta

type Story = StoryObj<typeof Popover>

export const Closed: Story = {
  args: {
    content: "And here's some amazing content. It's very engaging. Right?",
    title: 'Popover title',
    children: <Button color="danger">Click to toggle popover</Button>
  }
}

// `visible` renders the popover open on mount (synced by an effect, see Popover.tsx) — the only
// way to screenshot its content without driving a real click from the test. The popover portals
// to `document.body` (outside Storybook's `#storybook-root`), so the Playwright spec screenshots
// the whole iframe page for these stories rather than a specific element.
export const Open: Story = {
  args: {
    content: "And here's some amazing content. It's very engaging. Right?",
    title: 'Popover title',
    placement: 'right',
    visible: true,
    children: <Button color="danger">Trigger</Button>
  }
}

export const OpenNoTitle: Story = {
  args: {
    content: 'Content with no title.',
    // A dialog needs an accessible name; with no visible `title` to point `aria-labelledby`
    // at, `aria-label` is the only way to give it one.
    'aria-label': 'Content with no title.',
    placement: 'top',
    visible: true,
    children: <Button color="secondary">Trigger</Button>
  }
}

export const OpenPlacementLeft: Story = {
  args: {
    content: "And here's some amazing content. It's very engaging. Right?",
    title: 'Popover title',
    placement: 'left',
    visible: true,
    children: <Button color="danger">Trigger</Button>
  }
}
