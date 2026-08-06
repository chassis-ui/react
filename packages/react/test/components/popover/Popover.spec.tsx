import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Popover, Button } from '../../../src/index'

const openPopover = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Test' }))
}

describe('Popover', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <Popover content="A">
          <Button>Test</Button>
        </Popover>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders title, content, placement and arrow once shown', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title" placement="right">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      expect(document.body).toMatchSnapshot()

      const popover = screen.getByRole('dialog')
      expect(popover).toHaveClass('cx-popover-auto')
      expect(popover).toHaveAttribute('data-cx-placement')
      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('content')).toBeInTheDocument()
      // The arrow is a decorative element with no role/name of its own.
      // eslint-disable-next-line testing-library/no-node-access
      expect(popover.querySelector('.popover-arrow')).toBeInTheDocument()
      vi.useRealTimers()
    })
  })

  describe('visibility', () => {
    test('scopes itself to an open dialog ancestor', () => {
      vi.useFakeTimers()
      render(
        <dialog open>
          <Popover content="content" title="title">
            <Button>Test</Button>
          </Popover>
        </dialog>
      )
      openPopover()
      act(() => vi.runAllTimers())
      const dialogs = screen.getAllByRole('dialog')
      const [ancestorDialog, popover] = dialogs
      expect(popover).toBeInTheDocument()
      expect(ancestorDialog!.contains(popover!)).toBe(true)
      vi.useRealTimers()
    })

    test('responds to the visible prop changing after mount', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <Popover content="content" title="title" visible={false}>
          <Button>Test</Button>
        </Popover>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      rerender(
        <Popover content="content" title="title" visible={true}>
          <Button>Test</Button>
        </Popover>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      rerender(
        <Popover content="content" title="title" visible={false}>
          <Button>Test</Button>
        </Popover>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      vi.useRealTimers()
    })
  })

  describe('trigger behavior', () => {
    test("preserves the trigger child's own onClick handler", () => {
      vi.useFakeTimers()
      const onClick = vi.fn()
      render(
        <Popover content="content" title="title">
          <Button onClick={onClick}>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      vi.useRealTimers()
    })
  })

  describe('focus management', () => {
    test('moves focus into the dialog on open', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      // document.activeElement is the standard way to read current focus; no Testing Library
      // query surfaces it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(screen.getByRole('dialog'))
      vi.useRealTimers()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations when open', async () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      vi.useRealTimers()
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})
