import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxPopover, CxButton } from '../../../index'

const openPopover = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Test' }))
}

describe('CxPopover', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxPopover content="A">
          <CxButton>Test</CxButton>
        </CxPopover>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders title, content, placement and arrow once shown', () => {
      vi.useFakeTimers()
      render(
        <CxPopover content="content" title="title" placement="right">
          <CxButton>Test</CxButton>
        </CxPopover>
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
          <CxPopover content="content" title="title">
            <CxButton>Test</CxButton>
          </CxPopover>
        </dialog>
      )
      openPopover()
      act(() => vi.runAllTimers())
      const dialogs = screen.getAllByRole('dialog')
      const [ancestorDialog, popover] = dialogs
      expect(popover).toBeInTheDocument()
      expect(ancestorDialog.contains(popover)).toBe(true)
      vi.useRealTimers()
    })

    test('responds to the visible prop changing after mount', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <CxPopover content="content" title="title" visible={false}>
          <CxButton>Test</CxButton>
        </CxPopover>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      rerender(
        <CxPopover content="content" title="title" visible={true}>
          <CxButton>Test</CxButton>
        </CxPopover>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      rerender(
        <CxPopover content="content" title="title" visible={false}>
          <CxButton>Test</CxButton>
        </CxPopover>
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
        <CxPopover content="content" title="title">
          <CxButton onClick={onClick}>Test</CxButton>
        </CxPopover>
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
        <CxPopover content="content" title="title">
          <CxButton>Test</CxButton>
        </CxPopover>
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
        <CxPopover content="content" title="title">
          <CxButton>Test</CxButton>
        </CxPopover>
      )
      openPopover()
      act(() => vi.runAllTimers())
      vi.useRealTimers()
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})
