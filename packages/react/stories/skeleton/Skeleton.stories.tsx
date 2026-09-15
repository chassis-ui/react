import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Avatar } from '../../src/components/avatar/Avatar'
import { Button } from '../../src/components/button/Button'
import { Skeleton } from '../../src/components/skeleton/Skeleton'
import { SkeletonLoader } from '../../src/components/skeleton/SkeletonLoader'

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: 'skeleton/Skeleton'
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => (
    <div className="vstack gap-md" aria-hidden="true">
      <Skeleton span={12} />
      <p>
        <Skeleton span={7} />
        <Skeleton span={4} />
        <Skeleton span={4} />
      </p>
    </div>
  )
}

export const Colors: Story = {
  render: () => (
    <>
      <Skeleton color="primary" span={12} />
      <Skeleton color="success" span={12} />
      <Skeleton color="danger" span={12} />
    </>
  )
}

export const Animation: Story = {
  render: () => (
    <>
      <Skeleton component="p" animation="glow" className="w-100">
        <Skeleton span={12} />
      </Skeleton>
      <Skeleton component="p" animation="wave" className="w-100">
        <Skeleton span={12} />
      </Skeleton>
    </>
  )
}

export const CustomElements: Story = {
  render: () => (
    <div className="d-flex align-items-center gap-md">
      <Skeleton component={Avatar} size="lg" aria-label="Loading" />
      <Skeleton component={Button} span={3} disabled aria-label="Loading" />
    </div>
  )
}

export const Loader: Story = {
  render: function SkeletonLoaderStory() {
    const [loading, setLoading] = useState(true)
    return (
      <div className="vstack gap-md">
        <p className={loading ? 'skeleton-glow mb-0' : 'mb-0'}>
          <SkeletonLoader loading={loading} spans={[12, 9, 5]}>
            Chassis is a design system and component library built for teams who need to move fast
            without sacrificing consistency or accessibility.
          </SkeletonLoader>
        </p>
        <Button onClick={() => setLoading(!loading)}>
          {loading ? 'Mark as loaded' : 'Reset to loading'}
        </Button>
      </div>
    )
  },
  play: async function ({ canvas, userEvent }) {
    const toggle = canvas.getByRole('button', { name: /mark as loaded/i })
    await userEvent.click(toggle)
    await expect(canvas.getByText(/Chassis is a design system/i)).toBeVisible()
  }
}
