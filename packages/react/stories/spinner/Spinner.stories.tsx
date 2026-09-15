import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../src/components/button/Button'
import { Spinner } from '../../src/components/spinner/Spinner'

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  title: 'spinner/Spinner'
}

export default meta

type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  args: {}
}

export const Grow: Story = {
  args: {
    variant: 'grow'
  }
}

export const Colors: Story = {
  render: () => (
    <>
      <Spinner color="primary" visuallyHiddenLabel="Loading, primary" />
      <Spinner color="success" visuallyHiddenLabel="Loading, success" />
      <Spinner color="danger" visuallyHiddenLabel="Loading, danger" />
    </>
  )
}

export const Sizes: Story = {
  render: () => (
    <>
      <Spinner size="sm" />
      <Spinner size="sm" variant="grow" />
    </>
  )
}

export const InButton: Story = {
  render: () => (
    <>
      <Button disabled>
        <Spinner component="span" size="sm" aria-hidden="true" />
      </Button>
      <Button disabled>
        <Spinner component="span" size="sm" aria-hidden="true" />
        Loading...
      </Button>
    </>
  )
}
