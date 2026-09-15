import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Pagination } from '../../src/components/pagination/Pagination'
import { PaginationItem } from '../../src/components/pagination/PaginationItem'

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: 'pagination/Pagination'
}

export default meta

type Story = StoryObj<typeof Pagination>

export const Smart: Story = {
  render: function SmartPagination() {
    const [page, setPage] = useState(1)
    return (
      <Pagination pages={10} activePage={page} onActivePageChange={setPage} aria-label="Demo" />
    )
  },
  play: async function ({ canvas, userEvent }) {
    const pageThree = canvas.getByRole('button', { name: '3' })
    await userEvent.click(pageThree)

    // `active` lands on the wrapping `<li>`; the control itself is marked with `aria-current`.
    // It's also still the very same element and still focused — becoming the active page used to
    // swap the `<button>` for a `<span>`, which dropped focus to `<body>`.
    await expect(pageThree).toHaveAttribute('aria-current', 'page')
    await expect(pageThree).toHaveFocus()
  }
}

export const ActivePageChange: Story = {
  args: {
    'aria-label': 'Controlled pagination',
    pages: 5,
    activePage: 2,
    onActivePageChange: fn()
  },
  play: async function ({ args, canvas, userEvent }) {
    const next = canvas.getByRole('button', { name: /next/i })
    await userEvent.click(next)
    await expect(args.onActivePageChange).toHaveBeenCalledWith(3)
  }
}

export const Sizes: Story = {
  render: () => (
    <>
      <Pagination size="lg" pages={3} activePage={2} aria-label="Large pagination example" />
      <Pagination pages={3} activePage={2} aria-label="Default pagination example" />
      <Pagination size="sm" pages={3} activePage={2} aria-label="Small pagination example" />
    </>
  )
}

export const Alignment: Story = {
  render: () => (
    <>
      <Pagination align="center" pages={3} activePage={2} aria-label="Centered pagination" />
      <Pagination align="end" pages={3} activePage={2} aria-label="Right-aligned pagination" />
    </>
  )
}

export const Links: Story = {
  render: () => (
    <Pagination aria-label="Page navigation example">
      <PaginationItem href="#" aria-label="Previous" disabled>
        &laquo;
      </PaginationItem>
      <PaginationItem href="#" active>
        1
      </PaginationItem>
      <PaginationItem href="#">2</PaginationItem>
      <PaginationItem href="#">3</PaginationItem>
      <PaginationItem href="#" aria-label="Next">
        &raquo;
      </PaginationItem>
    </Pagination>
  )
}

export const Loading: Story = {
  render: () => (
    <Pagination aria-label="Page navigation example" aria-busy="true">
      <PaginationItem aria-label="Previous" disabled>
        &laquo;
      </PaginationItem>
      <PaginationItem active disabled>
        1
      </PaginationItem>
      <PaginationItem disabled>2</PaginationItem>
      <PaginationItem disabled>3</PaginationItem>
      <PaginationItem aria-label="Next" disabled>
        &raquo;
      </PaginationItem>
    </Pagination>
  )
}
