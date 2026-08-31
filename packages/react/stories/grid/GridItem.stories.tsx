import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Grid } from '../../src/components/grid/Grid'
import { GridItem } from '../../src/components/grid/GridItem'

const meta: Meta<typeof GridItem> = {
  component: GridItem,
  title: 'grid/GridItem'
}
export default meta

type Story = StoryObj<typeof GridItem>

const boxClass = 'border p-medium text-center'

export const Basic: Story = {
  render: () => (
    <Grid>
      <GridItem span={4} className={boxClass}>
        span=4
      </GridItem>
      <GridItem span={4} className={boxClass}>
        span=4
      </GridItem>
      <GridItem span={4} className={boxClass}>
        span=4
      </GridItem>
    </Grid>
  )
}

export const Start: Story = {
  render: () => (
    <Grid>
      <GridItem span={4} start={3} className={boxClass}>
        span=4 start=3
      </GridItem>
      <GridItem span={4} className={boxClass}>
        span=4
      </GridItem>
    </Grid>
  )
}

export const Responsive: Story = {
  render: () => (
    <Grid>
      <GridItem span={6} responsive={{ medium: { span: 4 } }} className={boxClass}>
        span=6 medium:span=4
      </GridItem>
      <GridItem span={6} responsive={{ medium: { span: 4 } }} className={boxClass}>
        span=6 medium:span=4
      </GridItem>
      <GridItem span={6} responsive={{ medium: { span: 4 } }} className={boxClass}>
        span=6 medium:span=4
      </GridItem>
    </Grid>
  )
}

export const Subgrid: Story = {
  render: () => (
    <Grid>
      <GridItem span={8} subgrid className={boxClass}>
        <GridItem span={4} className={boxClass}>
          Subgrid span=4
        </GridItem>
        <GridItem span={4} className={boxClass}>
          Subgrid span=4
        </GridItem>
      </GridItem>
      <GridItem span={4} className={boxClass}>
        span=4
      </GridItem>
    </Grid>
  )
}
