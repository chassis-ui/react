import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../src/components/button/Button'
import { VisuallyHidden } from '../../src/components/visually-hidden/VisuallyHidden'

const meta: Meta<typeof VisuallyHidden> = {
  component: VisuallyHidden,
  title: 'visually-hidden/VisuallyHidden'
}

export default meta

type Story = StoryObj<typeof VisuallyHidden>

export const Default: Story = {
  render: () => (
    <Button>
      <span aria-hidden="true">★</span>
      <VisuallyHidden>Add to favorites</VisuallyHidden>
    </Button>
  )
}

export const SkipLink: Story = {
  render: () => (
    <>
      <VisuallyHidden component="a" focusable href="#story-content">
        Skip to main content
      </VisuallyHidden>
      <main id="story-content">Main content</main>
    </>
  )
}
