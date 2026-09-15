import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Chip } from '../../src/components/chip/Chip'
import { CloseButton } from '../../src/components/close-button/CloseButton'

const meta: Meta<typeof Chip> = {
  component: Chip,
  title: 'chip/Chip'
}

export default meta

type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: {
    color: 'primary',
    children: 'Chip'
  }
}

export const Colors: Story = {
  render: () => (
    <>
      <Chip color="default">default</Chip>
      <Chip color="primary">primary</Chip>
      <Chip color="secondary">secondary</Chip>
      <Chip color="danger">danger</Chip>
      <Chip color="success">success</Chip>
    </>
  )
}

export const Outline: Story = {
  render: () => (
    <>
      <Chip color="primary" variant="outline">
        primary
      </Chip>
      <Chip color="danger" variant="outline">
        danger
      </Chip>
    </>
  )
}

export const Dismissible: Story = {
  render: function DismissibleChips() {
    const [tags, setTags] = useState(['React', 'TypeScript', 'CSS'])
    return (
      <>
        {tags.map((tag) => (
          <Chip key={tag} color="primary">
            {tag}
            <CloseButton
              label={`Remove ${tag}`}
              onClick={() => setTags((current) => current.filter((value) => value !== tag))}
            />
          </Chip>
        ))}
      </>
    )
  },
  play: async function ({ canvas, userEvent }) {
    const removeReact = canvas.getByRole('button', { name: /remove react/i })
    await userEvent.click(removeReact)
    await expect(canvas.queryByText('React')).not.toBeInTheDocument()
  }
}

export const Pressed: Story = {
  render: function PressedChip() {
    const [pressed, setPressed] = useState(false)
    return (
      <Chip
        component="button"
        color="primary"
        pressed={pressed}
        onClick={() => setPressed(!pressed)}
      >
        In stock
      </Chip>
    )
  },
  play: async function ({ canvas, userEvent }) {
    const chip = canvas.getByRole('button', { name: /in stock/i })
    await userEvent.click(chip)
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
  }
}

export const Disabled: Story = {
  args: {
    component: 'button',
    color: 'primary',
    disabled: true,
    children: 'Button',
    onClick: fn()
  }
}

export const Component: Story = {
  render: () => (
    <>
      <Chip color="primary">Span</Chip>
      <Chip component="div" color="primary">
        Div
      </Chip>
      <Chip component="button" color="primary">
        Button
      </Chip>
      <Chip href="#" role="button" color="primary">
        Link
      </Chip>
    </>
  )
}
