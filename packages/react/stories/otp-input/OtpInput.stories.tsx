import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { OtpInput } from '../../src/components/otp-input/OtpInput'

const meta: Meta<typeof OtpInput> = {
  component: OtpInput,
  title: 'otp-input/OtpInput'
}

export default meta

type Story = StoryObj<typeof OtpInput>

export const Default: Story = {
  args: {
    'aria-label': 'Verification code',
    length: 6,
    onChange: fn(),
    onComplete: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const digits = canvas.getAllByRole('textbox')
    for (const [index, char] of '123456'.split('').entries()) {
      await userEvent.type(digits[index] as HTMLElement, char)
    }
    await expect(args.onComplete).toHaveBeenCalledWith('123456')
  }
}

export const Separator: Story = {
  args: {
    'aria-label': 'Verification code',
    groupSizes: [3, 3],
    inputGroup: true
  }
}

export const Masked: Story = {
  args: {
    'aria-label': 'Verification code',
    defaultValue: '123',
    inputGroup: true,
    mask: true
  }
}

export const WithFormField: Story = {
  args: {
    label: 'Verification code',
    help: 'Enter the 6-digit code sent to your phone.',
    inputGroup: true,
    name: 'code'
  }
}

export const Validation: Story = {
  render: () => (
    <div className="vstack gap-md">
      <OtpInput aria-label="Verified code" defaultValue="123456" inputGroup valid />
      <OtpInput aria-label="Invalid code" defaultValue="123" inputGroup invalid />
    </div>
  )
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Verification code',
    defaultValue: '123',
    disabled: true,
    inputGroup: true,
    length: 6
  }
}
