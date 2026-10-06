import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Grid } from '../../src/components/grid/Grid'

const meta: Meta<typeof Grid> = {
  component: Grid,
  title: 'grid/Grid'
}
export default meta

type Story = StoryObj<typeof Grid>

const boxClass = 'primary-dim-slight primary-border-subtle border p-md text-center'

export const Basic: Story = {
  render: () => (
    <Grid>
      <div className={`col-span-4 ${boxClass}`}>.col-span-4</div>
      <div className={`col-span-4 ${boxClass}`}>.col-span-4</div>
      <div className={`col-span-4 ${boxClass}`}>.col-span-4</div>
    </Grid>
  )
}

export const Responsive: Story = {
  render: () => (
    <Grid>
      <div className={`col-span-6 md:col-span-4 ${boxClass}`}>.col-span-6 .md:col-span-4</div>
      <div className={`col-span-6 md:col-span-4 ${boxClass}`}>.col-span-6 .md:col-span-4</div>
      <div className={`col-span-6 md:col-span-4 ${boxClass}`}>.col-span-6 .md:col-span-4</div>
    </Grid>
  )
}

export const CustomColumns: Story = {
  render: () => (
    <Grid columns={4} gap="1rem">
      <div className={`col-span-2 ${boxClass}`}>.col-span-2</div>
      <div className={`col-span-2 ${boxClass}`}>.col-span-2</div>
    </Grid>
  )
}

export const ResponsiveColumns: Story = {
  render: () => (
    <Grid columns={1} gap="md" responsive={{ sm: { columns: 2 }, lg: { columns: 4, gap: 'xl' } }}>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
    </Grid>
  )
}

export const GapToken: Story = {
  render: () => (
    <Grid gap="xs">
      <div className={`col-span-6 ${boxClass}`}>.col-span-6</div>
      <div className={`col-span-6 ${boxClass}`}>.col-span-6</div>
      <div className={`col-span-6 ${boxClass}`}>.col-span-6</div>
      <div className={`col-span-6 ${boxClass}`}>.col-span-6</div>
    </Grid>
  )
}

export const Fill: Story = {
  render: () => (
    <Grid fill>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
    </Grid>
  )
}

export const FillMin: Story = {
  render: () => (
    <Grid fill min="12rem" gap="md">
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
      <div className={boxClass}>Column</div>
    </Grid>
  )
}
