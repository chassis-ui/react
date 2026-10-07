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
    <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 'md', lg: 'xl' }}>
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

export const Rows: Story = {
  render: () => (
    <Grid columns={3} rows={3} style={{ height: '18rem' }}>
      <div className={boxClass}>1</div>
      <div className={boxClass}>2</div>
      <div className={boxClass}>3</div>
      <div className={boxClass}>4</div>
      <div className={boxClass}>5</div>
      <div className={boxClass}>6</div>
    </Grid>
  )
}

export const FlowColumn: Story = {
  render: () => (
    <Grid columns={2} rows={3} flow="column" gap="md">
      <div className={boxClass}>1</div>
      <div className={boxClass}>2</div>
      <div className={boxClass}>3</div>
      <div className={boxClass}>4</div>
      <div className={boxClass}>5</div>
      <div className={boxClass}>6</div>
    </Grid>
  )
}

export const FlowDense: Story = {
  render: () => (
    <Grid columns={3} flow="dense" gap="md">
      <div className={`col-span-2 ${boxClass}`}>1, two tracks</div>
      <div className={`col-span-2 ${boxClass}`}>2, two tracks</div>
      <div className={boxClass}>3, moves up beside 1</div>
      <div className={boxClass}>4, moves up beside 2</div>
    </Grid>
  )
}

// The 24rem box is a query container below `@md` (48rem) whatever the viewport: the grid in it
// has one column and the narrow gutter, and the same grid in the page below it has three.
export const Contained: Story = {
  render: () => (
    <>
      <div className="contains-inline mb-lg" style={{ width: '24rem' }}>
        <Grid columns={{ base: 1, '@md': 3 }} contained>
          <div className={boxClass}>Column</div>
          <div className={boxClass}>Column</div>
          <div className={boxClass}>Column</div>
        </Grid>
      </div>
      <div className="contains-inline">
        <Grid columns={{ base: 1, '@md': 3 }} contained>
          <div className={boxClass}>Column</div>
          <div className={boxClass}>Column</div>
          <div className={boxClass}>Column</div>
        </Grid>
      </div>
    </>
  )
}
