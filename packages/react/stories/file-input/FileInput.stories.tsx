import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { FileInput } from '../../src/components/file-input/FileInput'
import { FormLabel } from '../../src/components/form/FormLabel'

const meta: Meta<typeof FileInput> = {
  component: FileInput,
  title: 'file-input/FileInput'
}

export default meta

type Story = StoryObj<typeof FileInput>

export const Default: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="formFile">Default file input</FormLabel>
      <FileInput id="formFile" />
    </>
  )
}

export const Multiple: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="formFileMultiple">Multiple files input</FormLabel>
      <FileInput id="formFileMultiple" multiple />
    </>
  )
}

export const Sizes: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="formFileSm">Small file input</FormLabel>
      <FileInput id="formFileSm" size="sm" className="mb-md" />
      <FormLabel htmlFor="formFileLg">Large file input</FormLabel>
      <FileInput id="formFileLg" size="lg" />
    </>
  )
}

export const Disabled: Story = {
  render: () => (
    <>
      <FormLabel htmlFor="formFileDisabled">Disabled file input</FormLabel>
      <FileInput id="formFileDisabled" disabled />
    </>
  )
}
