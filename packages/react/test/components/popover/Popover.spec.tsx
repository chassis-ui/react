import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Popover, Button } from '../../../src/index'

const openPopover = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Test' }))
}

describe('Popover', () => {
  describe('rendering', () => {
    test('renders the trigger button collapsed before the popover is shown', () => {
      render(
        <Popover content="A">
          <Button>Test</Button>
        </Popover>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveClass('button', 'primary')
      expect(trigger).toHaveAttribute('type', 'button')
    })

    test('renders title, content, placement and arrow once shown', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title" placement="right">
          <Button>Test</Button>
        </Popover>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      openPopover()
      act(() => vi.runAllTimers())

      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      const popover = screen.getByRole('dialog')
      expect(popover).toHaveClass('popover', 'cx-popover-auto', 'fade', 'show')
      expect(popover).toHaveAttribute('data-cx-placement')
      expect(popover).toHaveAttribute('tabindex', '-1')
      expect(trigger.getAttribute('aria-controls')).toBe(popover.getAttribute('id'))

      const header = screen.getByText('title')
      expect(header).toHaveClass('popover-header')
      expect(popover.getAttribute('aria-labelledby')).toBe(header.getAttribute('id'))

      const body = screen.getByText('content')
      expect(body).toHaveClass('popover-body')

      // The arrow is a decorative element with no role/name of its own.
      // eslint-disable-next-line testing-library/no-node-access
      const arrow = popover.querySelector('.popover-arrow')
      expect(arrow).toBeInTheDocument()
      expect(arrow).toHaveAttribute('aria-hidden', 'true')
      expect(arrow).toHaveAttribute('role', 'presentation')
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

  describe('dismissal', () => {
    test('Escape closes the popover and returns focus to the trigger', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      openPopover()
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'Escape' })
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(trigger)
      vi.useRealTimers()
    })

    test('a click outside the trigger and panel closes the popover', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.click(document.body)
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('a click inside the panel does not close the popover', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      const popover = screen.getByRole('dialog')

      fireEvent.click(screen.getByText('content'))
      act(() => vi.runAllTimers())
      expect(popover).toBeInTheDocument()
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

    test('restores focus to the trigger once the close transition finishes', () => {
      vi.useFakeTimers()
      render(
        <Popover content="content" title="title">
          <Button>Test</Button>
        </Popover>
      )
      const trigger = screen.getByRole('button', { name: 'Test' })
      openPopover()
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.click(trigger)
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).not.toBe(trigger)
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(trigger)
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
