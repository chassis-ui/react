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

const boxClass = 'border p-md text-center'

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

export const Full: Story = {
  render: () => (
    <Grid>
      <GridItem span="full" className={boxClass}>
        span=full
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 6 } }} className={boxClass}>
        span=full md:span=6
      </GridItem>
      <GridItem span="full" responsive={{ md: { span: 6 } }} className={boxClass}>
        span=full md:span=6
      </GridItem>
    </Grid>
  )
}

export const StartReset: Story = {
  render: () => (
    <Grid>
      <GridItem span={6} start={4} responsive={{ md: { start: 'auto' } }} className={boxClass}>
        span=6 start=4 md:start=auto
      </GridItem>
      <GridItem span={6} className={boxClass}>
        span=6
      </GridItem>
    </Grid>
  )
}

export const Rows: Story = {
  render: () => (
    <Grid rows={2}>
      <GridItem span={4} rowSpan={2} className={boxClass}>
        span=4 rowSpan=2
      </GridItem>
      <GridItem span={8} className={boxClass}>
        span=8
      </GridItem>
      <GridItem span={8} start={5} rowStart={2} className={boxClass}>
        span=8 start=5 rowStart=2
      </GridItem>
    </Grid>
  )
}

export const Responsive: Story = {
  render: () => (
    <Grid>
      <GridItem span={6} responsive={{ md: { span: 4 } }} className={boxClass}>
        span=6 md:span=4
      </GridItem>
      <GridItem span={6} responsive={{ md: { span: 4 } }} className={boxClass}>
        span=6 md:span=4
      </GridItem>
      <GridItem span={6} responsive={{ md: { span: 4 } }} className={boxClass}>
        span=6 md:span=4
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

export const End: Story = {
  render: () => (
    <Grid>
      <GridItem span={3} className={boxClass}>
        span=3
      </GridItem>
      <GridItem span={3} end={13} className={boxClass}>
        span=3 end=13
      </GridItem>
    </Grid>
  )
}

// The items follow the width of the box, a query container, not the viewport: stacked in the
// 24rem box, three across where the box is as wide as the page.
export const ContainerBreakpoints: Story = {
  render: () => (
    <>
      <div className="contains-inline mb-lg" style={{ width: '24rem' }}>
        <Grid contained>
          <GridItem span="full" responsive={{ '@md': { span: 4 } }} className={boxClass}>
            span=full @md:span=4
          </GridItem>
          <GridItem span="full" responsive={{ '@md': { span: 4 } }} className={boxClass}>
            span=full @md:span=4
          </GridItem>
          <GridItem span="full" responsive={{ '@md': { span: 4 } }} className={boxClass}>
            span=full @md:span=4
          </GridItem>
        </Grid>
      </div>
      <div className="contains-inline">
        <Grid contained>
          <GridItem span="full" responsive={{ '@md': { span: 4 } }} className={boxClass}>
            span=full @md:span=4
          </GridItem>
          <GridItem span="full" responsive={{ '@md': { span: 4 } }} className={boxClass}>
            span=full @md:span=4
          </GridItem>
          <GridItem span="full" responsive={{ '@md': { span: 4 } }} className={boxClass}>
            span=full @md:span=4
          </GridItem>
        </Grid>
      </div>
    </>
  )
}
