import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Toast } from '../../src/components/toast/Toast'
import { ToastHeader } from '../../src/components/toast/ToastHeader'
import { ToastBody } from '../../src/components/toast/ToastBody'
import { Toaster } from '../../src/components/toast/Toaster'

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'toast/Toast'
}
export default meta

type Story = StoryObj<typeof Toast>

const logo = (
  <svg
    className="rounded me-small"
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

// `visible` renders the toast open on mount (synced by an effect, see Toast.tsx). `autohide` is
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
