import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Icon } from '../../src/components/icon/Icon'
import { IconProvider } from '../../src/components/icon/IconProvider'
import type { IconComponentProps } from '../../src/utils/iconConfig'
import { Pagination } from '../../src/components/pagination/Pagination'

const meta: Meta<typeof Icon> = {
  component: Icon,
  title: 'icon/Icon'
}

export default meta

type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'check-solid'
  }
}

export const AccessibleName: Story = {
  args: {
    name: 'exclamation-triangle-solid',
    title: 'Warning'
  }
}

export const Sizes: Story = {
  render: () => (
    <>
      <Icon name="check-solid" size={16} />
      <Icon name="check-solid" size={24} />
      <Icon name="check-solid" size={32} />
      <Icon name="check-solid" size={48} />
    </>
  )
}

// `IconProvider` renders every `Icon` below it as a font glyph, under its own class prefix.
export const FontProvider: Story = {
  render: () => (
    <IconProvider font fontPrefix="fa-" className="fa">
      <Icon name="check" title="Done" />
      <Icon name="triangle-exclamation" title="Warning" />
    </IconProvider>
  ),
  play: async function ({ canvas }) {
    const done = canvas.getByRole('img', { name: 'Done' })
    await expect(done).toHaveClass('icon', 'fa', 'fa-check')
    await expect(canvas.getByRole('img', { name: 'Warning' })).toHaveClass(
      'fa-triangle-exclamation'
    )
  }
}

// The icons the library's own components draw are named by purpose. A text component stands in
// for an icon set here, so the story can read which name each purpose resolved to: the
// provider's `icons` remap `previous`, and `next` keeps its default.
const TextIcon = ({ name, className }: IconComponentProps) => (
  <span className={className}>{name}</span>
)

export const ComponentAndIcons: Story = {
  render: () => (
    <IconProvider component={TextIcon} icons={{ previous: 'arrow-left' }}>
      <Pagination activePage={2} pages={5} />
    </IconProvider>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getByText('arrow-left')).toHaveClass('directional-icon')
    await expect(canvas.getByText('chevron-right-outline')).toHaveClass('directional-icon')
  }
}
