import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Grid } from '../../src/components/grid/Grid'

const meta: Meta<typeof Grid> = {
  component: Grid,
  title: 'grid/Grid'
}
export default meta

type Story = StoryObj<typeof Grid>

const boxClass = 'primary-dim-slight primary-border-subtle border p-medium text-center'

export const Basic: Story = {
  render: () => (
    <Grid>
      <div className={`g-col-4 ${boxClass}`}>.g-col-4</div>
      <div className={`g-col-4 ${boxClass}`}>.g-col-4</div>
      <div className={`g-col-4 ${boxClass}`}>.g-col-4</div>
    </Grid>
  )
}

export const Responsive: Story = {
  render: () => (
    <Grid>
      <div className={`g-col-6 medium:g-col-4 ${boxClass}`}>.g-col-6 .medium:g-col-4</div>
      <div className={`g-col-6 medium:g-col-4 ${boxClass}`}>.g-col-6 .medium:g-col-4</div>
      <div className={`g-col-6 medium:g-col-4 ${boxClass}`}>.g-col-6 .medium:g-col-4</div>
    </Grid>
  )
}

export const CustomColumns: Story = {
  render: () => (
    <Grid columns={4} gap="1rem">
      <div className={`g-col-2 ${boxClass}`}>.g-col-2</div>
      <div className={`g-col-2 ${boxClass}`}>.g-col-2</div>
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
