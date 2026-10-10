import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { Button } from '../../src/components/button/Button'
import { Toast } from '../../src/components/toast/Toast'
import { ToastBody } from '../../src/components/toast/ToastBody'
import { ToastFooter } from '../../src/components/toast/ToastFooter'
import { ToastHeader } from '../../src/components/toast/ToastHeader'
import { ToastIcon } from '../../src/components/toast/ToastIcon'
import { Toaster } from '../../src/components/toast/Toaster'

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'toast/Toast'
}
export default meta

type Story = StoryObj<typeof Toast>

const logo = (
  <svg
    className="rounded me-sm"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    focusable="false"
    role="img"
  >
    <rect width="100%" height="100%" fill="#007aff"></rect>
  </svg>
)

// `visible` renders the toast shown. `autohide` is
// `true` by default with a 5s `delay` — left on, a story would visibly disappear mid-test-run.
// `autohide={false}` is the same pattern the docs site's own StackingExample uses for a toast
// that's meant to stay put for a static render.
export const Basic: Story = {
  args: {
    autohide: false,
    visible: true,
    children: (
      <>
        <ToastHeader icon={logo} time="7 min ago" closeButton>
          Chassis
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </>
    )
  }
}

// Same result as `Basic`, composed from Toast's own shorthand props (icon/title/time/message/
// closeButton) instead of hand-composing `ToastHeader`/`ToastBody`.
export const PropsOnly: Story = {
  args: {
    autohide: false,
    visible: true,
    icon: logo,
    title: 'Chassis',
    time: '7 min ago',
    message: 'Hello, world! This is a toast message.',
    closeButton: true
  }
}

export const Solid: Story = {
  args: {
    autohide: false,
    visible: true,
    color: 'primary',
    solid: true,
    children: (
      <>
        <ToastHeader icon={logo} time="7 min ago" closeButton>
          Chassis
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </>
    )
  }
}

// Two toasts stacked inside a static (non-portaled — no `placement`) `Toaster`, matching the docs
// site's own StackingExample.
export const Stacked: Story = {
  render: () => (
    <Toaster>
      <Toast autohide={false} visible={true}>
        <ToastHeader icon={logo} time="7 min ago" closeButton>
          Chassis
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </Toast>
      <Toast autohide={false} visible={true}>
        <ToastHeader icon={logo} time="7 min ago" closeButton>
          Chassis
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </Toast>
    </Toaster>
  )
}

// `Toaster`'s `placement` prop portals it to `document.body` (outside Storybook's
// `#storybook-root`) and applies its own fixed-position/alignment CSS classes
// (`position-fixed`/`bottom-0`/`end-0`) — a distinct render path from the static `Stacked` story
// above, worth covering separately. The Playwright spec screenshots the whole iframe page for
// this story rather than a specific element, same reasoning as the portal-based overlay stories
// (Menu/Popover/Tooltip).
export const PlacementBottomEnd: Story = {
  render: () => (
    <Toaster placement="bottom-end">
      <Toast autohide={false} visible={true}>
        <ToastHeader icon={logo} time="7 min ago" closeButton>
          Chassis
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </Toast>
    </Toaster>
  )
}

// Storybook has no icon sprite, so this story embeds the one symbol it draws, from chassis-icons.
const withCheckIcon = (Story: () => React.ReactElement) => (
  <>
    <Story />
    <svg aria-hidden="true" style={{ display: 'none' }}>
      <symbol id="check-solid" viewBox="0 0 24 24">
        <path d="M20.36 6.14c.507.47.507 1.29 0 1.758l-10 10a1.205 1.205 0 0 1-1.758 0l-5-5a1.205 1.205 0 0 1 0-1.757 1.205 1.205 0 0 1 1.757 0L9.5 15.242l9.102-9.101a1.205 1.205 0 0 1 1.757 0" />
      </symbol>
    </svg>
  </>
)

// A `ToastIcon` composed into the header, and a `ToastFooter` of actions after the body — what
// the `icon` and `footer` shorthand props of `Toast` render. The play function reads the toast
// and leaves it as it is: the family's visual regression spec screenshots the settled toast.
export const IconAndFooter: Story = {
  decorators: [withCheckIcon],
  args: {
    autohide: false,
    visible: true,
    children: (
      <>
        <ToastHeader icon={<ToastIcon name="check-solid" title="Saved" />} time="just now">
          Draft saved
        </ToastHeader>
        <ToastBody>Your changes are safe. Undo to restore the previous draft.</ToastBody>
        <ToastFooter>
          <Button color="secondary" size="sm" variant="outline">
            Undo
          </Button>
          <Button color="primary" size="sm">
            View draft
          </Button>
        </ToastFooter>
      </>
    )
  },
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('img', { name: 'Saved' })).toHaveClass('toast-icon')
    // The toast plays its entrance at opacity 0 before it settles.
    const undo = canvas.getByRole('button', { name: 'Undo' })
    await waitFor(() => expect(undo).toBeVisible())
    await expect(canvas.getByRole('button', { name: 'View draft' })).toBeVisible()
    await expect(canvas.getByText('Draft saved')).toBeVisible()
  }
}
