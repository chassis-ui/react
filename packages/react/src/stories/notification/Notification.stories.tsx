import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Notification } from '../../components/notification/Notification'
import { NotificationTitle } from '../../components/notification/NotificationTitle'
import { NotificationIcon } from '../../components/notification/NotificationIcon'

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
    children: 'A simple primary notification—check it out!'
  }
}

export const WithIcon: Story = {
  args: {
    color: 'info',
    children: (
      <>
        <NotificationIcon name="info-circle-solid" />
        <p>
          An example notification with an icon and <a href="#">a link</a>.
        </p>
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
        <p>
          Aww yeah, you successfully read this important notification message. This example text is
          going to run a bit longer so that you can see how spacing within a notification works with
          this kind of content.
        </p>
        <p>Adjust the gap with --notification-text-gap.</p>
      </>
    )
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
