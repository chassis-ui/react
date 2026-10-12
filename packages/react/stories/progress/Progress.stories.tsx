import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Progress } from '../../src/components/progress/Progress'

const meta: Meta<typeof Progress> = {
  component: Progress,
  title: 'progress/Progress'
}

export default meta

type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: {
    'aria-label': 'Basic example',
    value: 25
  }
}

export const Colors: Story = {
  render: () => (
    <>
      <Progress aria-label="Basic example" value={25} />
      <Progress aria-label="Success example" color="success" value={25} />
      <Progress aria-label="Info example" color="info" value={50} />
      <Progress aria-label="Warning example" color="warning" value={75} />
      <Progress aria-label="Danger example" color="danger" value={100} />
    </>
  )
}

export const Striped: Story = {
  render: () => (
    <>
      <Progress aria-label="Basic striped example" striped value={25} />
      <Progress aria-label="Success striped example" color="success" striped value={50} />
    </>
  )
}

export const Animated: Story = {
  args: {
    'aria-label': 'Animated example',
    animated: true,
    striped: true,
    value: 50
  }
}

export const Height: Story = {
  render: () => (
    <>
      <Progress aria-label="1px high example" height={1} value={25} />
      <Progress aria-label="20px high example" height={20} value={25} />
    </>
  )
}

export const InlineValue: Story = {
  args: {
    'aria-label': 'Example with value',
    inlineValue: true,
    value: 25
  }
}

export const WithLabel: Story = {
  args: {
    label: 'Progress',
    showValue: true,
    inlineValue: true,
    value: 65
  }
}

// The part of the bar its animation shows at a point of the cycle, against the track: a build
// without `Progress.scss`, or without its keyframes, leaves an empty track or a full bar.
function sweepAt(progress: HTMLElement, bar: HTMLElement, time: number) {
  const [animation] = bar.getAnimations()
  animation.pause()
  animation.currentTime = time
  const track = progress.getBoundingClientRect()
  const part = bar.getBoundingClientRect()
  return {
    start: Math.round(part.left - track.left),
    end: Math.round(part.right - track.left),
    width: Math.round(track.width)
  }
}

export const Indeterminate: Story = {
  args: {
    'aria-label': 'Loading page',
    indeterminate: true
  },
  play: async function ({ canvas }) {
    const progress = canvas.getByRole('progressbar', { name: 'Loading page' })
    await expect(progress).not.toHaveAttribute('aria-valuenow')
    const bar = within(progress).getByText('', { selector: '.progress-bar' })
    await expect(bar.offsetWidth).toBe(progress.clientWidth)
    await expect(bar.getAnimations()).toHaveLength(1)
    // It enters from outside the start of the track and is half of it in the middle.
    const entering = sweepAt(progress, bar, 0)
    await expect(entering.end).toBe(0)
    const half = sweepAt(progress, bar, 750)
    await expect(half.start).toBe(Math.round(half.width / 4))
    await expect(half.end).toBe(Math.round((half.width * 3) / 4))
  }
}

// With `striped` the bar keeps the whole track and its stripes move, and no sweep runs.
export const IndeterminateStriped: Story = {
  args: {
    animated: true,
    indeterminate: true,
    label: 'Uploading',
    striped: true
  },
  play: async function ({ canvas }) {
    const progress = canvas.getByRole('progressbar', { name: 'Uploading' })
    const bar = within(progress).getByText('', { selector: '.progress-bar' })
    await expect(bar.offsetWidth).toBe(progress.clientWidth)
    await expect(getComputedStyle(bar).animationName).toBe('progress-bar-stripes')
    await expect(getComputedStyle(bar).transform).toBe('none')
  }
}

// Mirrored: the sweep enters from outside the right edge.
export const IndeterminateRightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Progress aria-label="Loading page" color="success" height={4} indeterminate />
    </div>
  ),
  play: async function ({ canvas }) {
    const progress = canvas.getByRole('progressbar')
    const bar = within(progress).getByText('', { selector: '.progress-bar' })
    const entering = sweepAt(progress, bar, 0)
    await expect(entering.start).toBe(entering.width)
  }
}
