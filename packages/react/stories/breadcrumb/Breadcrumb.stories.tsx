import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Breadcrumb } from '../../src/components/breadcrumb/Breadcrumb'
import { BreadcrumbItem } from '../../src/components/breadcrumb/BreadcrumbItem'

const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
  title: 'breadcrumb/Breadcrumb'
}

export default meta

type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Library</BreadcrumbItem>
      <BreadcrumbItem active>Data</BreadcrumbItem>
    </Breadcrumb>
  )
}

export const DataDriven: Story = {
  args: {
    items: [{ label: 'Home', href: '/' }, { label: 'Library', href: '/library' }, { label: 'Data' }]
  }
}

export const CustomDivider: Story = {
  render: () => (
    <Breadcrumb style={{ '--cui-breadcrumb-divider': "'>'" } as React.CSSProperties}>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem active>Library</BreadcrumbItem>
    </Breadcrumb>
  )
}
