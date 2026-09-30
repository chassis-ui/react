import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Button } from '../../src/components/button/Button'
import { Divider } from '../../src/components/divider/Divider'

const meta: Meta<typeof Divider> = {
  component: Divider,
  title: 'divider/Divider'
}

export default meta

type Story = StoryObj<typeof Divider>

export const Default: Story = {
  render: (args) => (
    <>
      <p>Above the line</p>
      <Divider {...args} />
      <p>Below the line</p>
    </>
  )
}

export const WithLabel: Story = {
  render: () => (
    <div style={{ maxWidth: '24rem' }}>
      <Button className="w-100">Sign in with a passkey</Button>
      <Divider>or</Divider>
      <Button className="w-100">Sign in with a password</Button>
    </div>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('separator', { name: 'or' })).toHaveClass('divider-labelled')
  }
}

export const LabelPlacement: Story = {
  render: () => (
    <>
      <Divider labelPlacement="start">Start</Divider>
      <Divider>Center</Divider>
      <Divider labelPlacement="end">End</Divider>
    </>
  )
}

export const Vertical: Story = {
  render: () => (
    <div className="hstack gap-md">
      <span>First</span>
      <Divider orientation="vertical" />
      <span>Second</span>
      <Divider orientation="vertical" />
      <span>Third</span>
    </div>
  )
}

export const VerticalWithLabel: Story = {
  render: () => (
    <div className="hstack gap-md">
      <Button>Sign in with a passkey</Button>
      <Divider orientation="vertical">or</Divider>
      <Button>Sign in with a password</Button>
    </div>
  ),
  // The row is no taller than the buttons, which the label and its gaps fill: each line still
  // shows, and the row grows.
  play: async function ({ canvas }) {
    const separator = canvas.getByRole('separator', { name: 'or' })
    const fontSize = parseFloat(getComputedStyle(separator).fontSize)
    for (const side of ['::before', '::after']) {
      await expect(parseFloat(getComputedStyle(separator, side).height)).toBeGreaterThanOrEqual(
        fontSize
      )
    }
  }
}

export const Themed: Story = {
  render: () => (
    <>
      <Divider className="my-xl" />
      <Divider
        style={
          {
            '--cx-divider-color': 'var(--cx-primary)',
            '--cx-divider-size': 'var(--cx-border-width-xl)',
            '--cx-divider-label-fg-color': 'var(--cx-primary)'
          } as React.CSSProperties
        }
      >
        Themed
      </Divider>
    </>
  )
}

// A divider draws the same line as chassis-css's reboot `hr` and `.vr` helper, whatever element
// renders it: compared in each browser the story tests run in.
export const MatchesChassisLines: Story = {
  render: () => (
    <>
      <hr data-testid="reboot-hr" />
      <Divider component="div" data-testid="div-divider" />
      <Divider data-testid="hr-divider" />
      <Divider component="span" data-testid="span-divider" />
      <div className="hstack gap-md">
        <span>First</span>
        <div className="vr" data-testid="vr" />
        <Divider orientation="vertical" data-testid="vertical-divider" />
        <span>Second</span>
      </div>
    </>
  ),
  play: async function ({ canvas }) {
    const style = (testId: string) => getComputedStyle(canvas.getByTestId(testId))
    const hr = style('reboot-hr')
    const hrHeight = canvas.getByTestId('reboot-hr').getBoundingClientRect().height
    for (const testId of ['div-divider', 'hr-divider', 'span-divider']) {
      await expect(canvas.getByTestId(testId).getBoundingClientRect().height).toBe(hrHeight)
      const divider = style(testId)
      await expect(divider.borderTopWidth).toBe(hr.borderTopWidth)
      await expect(divider.borderTopColor).toBe(hr.borderTopColor)
      await expect(divider.marginTop).toBe(hr.marginTop)
      await expect(divider.marginBottom).toBe(hr.marginBottom)
      await expect(divider.opacity).toBe(hr.opacity)
    }

    const vr = style('vr')
    const vertical = style('vertical-divider')
    await expect(vertical.width).toBe(vr.width)
    await expect(vertical.height).toBe(vr.height)
    await expect(vertical.backgroundColor).toBe(vr.backgroundColor)
    await expect(vertical.opacity).toBe(vr.opacity)
  }
}
