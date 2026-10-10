import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { Notification } from '../../src/components/notification/Notification'
import { NotificationStack } from '../../src/components/notification/NotificationStack'
import {
  addNotification,
  closeNotification
} from '../../src/components/notification/notificationQueue'
import { NotificationTitle } from '../../src/components/notification/NotificationTitle'
import { NotificationIcon } from '../../src/components/notification/NotificationIcon'
import { NotificationText } from '../../src/components/notification/NotificationText'

const meta: Meta<typeof Notification> = {
  component: Notification,
  title: 'notification/Notification'
}
export default meta

type Story = StoryObj<typeof Notification>

// `visible` defaults to `true` — no forced-open prop needed, unlike the portal-based overlay
// families (Menu/Popover/Tooltip). Notification renders in normal document flow.
export const Primary: Story = {
  args: {
    color: 'primary',
    children: 'A simple primary notification — check it out!'
  }
}

export const WithIcon: Story = {
  args: {
    color: 'info',
    children: (
      <>
        <NotificationIcon name="info-circle-solid" />
        <NotificationText>
          An example notification with an icon and <a href="#">a link</a>.
        </NotificationText>
      </>
    )
  }
}

export const WithTitle: Story = {
  args: {
    color: 'success',
    children: (
      <>
        <NotificationIcon name="check-solid" className="align-self-start" />
        <NotificationTitle component="h4">Well done!</NotificationTitle>
        <NotificationText>
          Aww yeah, you successfully read this important notification message. This example text is
          going to run a bit longer so that you can see how spacing within a notification works with
          this kind of content.
        </NotificationText>
        <NotificationText>Adjust the gap with --notification-text-gap.</NotificationText>
      </>
    )
  }
}

// The `icon`/`title`/`text` props are convenience sugar over the manual composition shown in
// `WithTitle` above — same markup, no `NotificationIcon`/`NotificationTitle`/`NotificationText`
// wiring required for the common case.
export const Shorthand: Story = {
  args: {
    color: 'success',
    icon: 'check-solid',
    title: 'Well done!',
    text: 'Aww yeah, you successfully read this important notification message.',
    dismissible: true
  }
}

export const ShorthandWithActions: Story = {
  args: {
    color: 'danger',
    role: 'alert',
    icon: 'exclamation-triangle-solid',
    title: 'Something went wrong',
    text: 'We couldn’t save your changes. Check your connection and try again.',
    actions: (
      <div className="hstack gap-sm justify-content-end">
        <button type="button" className="button danger sm">
          Retry
        </button>
      </div>
    ),
    dismissible: true
  }
}

export const Autohide: Story = {
  args: {
    color: 'info',
    icon: 'info-circle-solid',
    text: 'This notification dismisses itself after 5 seconds — hover or focus it to pause the timer.',
    autohide: true
  }
}

export const Dismissible: Story = {
  args: {
    color: 'warning',
    dismissible: true,
    children: (
      <>
        <strong>Go right ahead</strong> and click that dismiss button over there on the right.
      </>
    )
  }
}

export const Solid: Story = {
  args: {
    color: 'danger',
    solid: true,
    children: 'A solid danger notification—check it out!'
  }
}

export const WithActions: Story = {
  args: {
    color: 'danger',
    role: 'alert',
    dismissible: true,
    children: (
      <>
        <NotificationIcon name="exclamation-triangle-solid" className="align-self-start" />
        <div className="d-flex flex-column xl:flex-row gap-md">
          <p className="m-0">
            A notification with inline actions — stacked on narrow viewports, side-by-side from xl
            up.
          </p>
          <div className="hstack gap-sm align-items-center justify-content-end">
            <button type="button" className="button danger sm">
              Take Action
            </button>
          </div>
        </div>
      </>
    )
  }
}

// `NotificationStack` renders the shared `notificationQueue` after its own static children. The
// queued one is added before the story renders, so both play their entrance together and the
// family's visual regression spec screenshots a settled stack; it leaves the queue when the story
// does. The server-rendering sweeps compose the story with no `beforeEach` and see the pinned
// notification alone.
export const Stack: Story = {
  beforeEach: () => {
    const key = addNotification(undefined, {
      color: 'success',
      icon: 'check-solid',
      title: 'Export finished',
      text: 'Your report is ready to download.',
      dismissible: true
    })
    return () => closeNotification(key)
  },
  render: () => (
    <NotificationStack>
      <Notification color="warning" icon="exclamation-triangle-solid" role="alert">
        Scheduled maintenance starts at 02:00 UTC. Save your work before then.
      </Notification>
    </NotificationStack>
  ),
  play: async function ({ canvas }) {
    // react-aria names the region by what the queue holds; the pinned child isn't counted.
    const region = canvas.getByRole('region', { name: '1 notification.' })
    await expect(region).toHaveClass('vstack')
    await expect(canvas.getByRole('alert')).toHaveTextContent('Scheduled maintenance')
    // Both notifications play their entrance at opacity 0 before they settle.
    const title = canvas.getByRole('heading', { name: 'Export finished' })
    await waitFor(() => expect(title).toBeVisible())
    await expect(canvas.getByText('Your report is ready to download.')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Close' })).toBeVisible()
    await expect(canvas.getByRole('alert')).toBeVisible()
  }
}
