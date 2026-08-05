import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Notification } from '../../components/notification/Notification'
import { NotificationHeading } from '../../components/notification/NotificationHeading'
import { NotificationLink } from '../../components/notification/NotificationLink'

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

export const WithLink: Story = {
  args: {
    color: 'success',
    children: (
      <>
        A simple success notification with{' '}
        <NotificationLink href="#">an example link</NotificationLink>.
      </>
    )
  }
}

export const WithHeading: Story = {
  args: {
    color: 'success',
    children: (
      <>
        <NotificationHeading component="h4">Well done!</NotificationHeading>
        <p>
          Aww yeah, you successfully read this important notification message. This example text is
          going to run a bit longer so that you can see how spacing within a notification works with
          this kind of content.
        </p>
        <hr />
        <p className="mb-0">
          Whenever you need to, be sure to use margin utilities to keep things nice and tidy.
        </p>
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
    variant: 'solid',
    children: 'A solid danger notification—check it out!'
  }
}
