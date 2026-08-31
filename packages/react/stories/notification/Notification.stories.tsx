import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Notification } from '../../src/components/notification/Notification'
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
      <div className="hstack gap-small justify-content-end">
        <button type="button" className="button danger small">
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
        <div className="d-flex flex-column xlarge:flex-row gap-medium">
          <p className="m-0">
            A notification with inline actions — stacked on narrow viewports, side-by-side from
            xlarge up.
          </p>
          <div className="hstack gap-small align-items-center justify-content-end">
            <button type="button" className="button danger small">
              Take Action
            </button>
          </div>
        </div>
      </>
    )
  }
}
