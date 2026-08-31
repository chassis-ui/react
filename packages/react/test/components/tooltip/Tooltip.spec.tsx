import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Tooltip, Link } from '../../../src/index'

// react-aria only treats a hover as pointer-triggered (as opposed to touch/virtual) once it's
// seen a real pointer-ish event on the page — establish that modality first. Needs actual
// PointerEvents (not mouse events) for react-aria to recognize the modality under this jsdom
// version.
const hoverOver = (target: HTMLElement) => {
  fireEvent.pointerMove(document.body)
  fireEvent.pointerEnter(target)
}

describe('Tooltip', () => {
  describe('rendering', () => {
    test('renders placement, arrow and content once shown on hover', () => {
      vi.useFakeTimers()
      render(
        <Tooltip trigger="hover" placement="right" content="content">
          <Link className="link">Test</Link>
        </Tooltip>
      )
      const trigger = screen.getByText('Test')
      hoverOver(trigger)
      act(() => vi.runAllTimers())
      act(() => vi.runAllTimers())

      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('tooltip', 'cx-tooltip-auto', 'fade', 'show')
      expect(tooltip).toHaveAttribute('data-cx-placement')
      expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.getAttribute('id'))
      expect(screen.getByText('content')).toHaveClass('tooltip-inner')

      // The arrow is a decorative element with no role/name of its own.
      // eslint-disable-next-line testing-library/no-node-access
      const arrow = tooltip.querySelector('.tooltip-arrow')
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
          <Tooltip trigger="hover" content="content">
            <Link className="link">Test</Link>
          </Tooltip>
        </dialog>
      )
      hoverOver(screen.getByText('Test'))
      act(() => vi.runAllTimers())
      const dialog = screen.getByRole('dialog')
      const tooltip = screen.getByRole('tooltip')
      expect(dialog.contains(tooltip)).toBe(true)
      vi.useRealTimers()
    })

    test('responds to the visible prop changing after mount', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <Tooltip content="content" visible={false}>
          <Link className="link">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      rerender(
        <Tooltip content="content" visible={true}>
          <Link className="link">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByRole('tooltip')).toBeInTheDocument()

      rerender(
        <Tooltip content="content" visible={false}>
          <Link className="link">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('trigger="focus" ignores hover', () => {
      vi.useFakeTimers()
      render(
        <Tooltip trigger="focus" content="content">
          <Link className="link">Test</Link>
        </Tooltip>
      )
      const link = screen.getByText('Test')
      fireEvent.mouseMove(document.body)
      fireEvent.mouseEnter(link)
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      vi.useRealTimers()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations when visible', async () => {
      vi.useFakeTimers()
      render(
        <Tooltip content="content" visible>
          <Link href="#">Test</Link>
        </Tooltip>
      )
      act(() => vi.runAllTimers())
      vi.useRealTimers()
      // The tooltip portals to document.body directly, sibling to the trigger's own render
      // container — neither sits inside a page landmark in this isolated fixture, which trips
      // axe's "region" best-practice rule. That rule is about overall page structure, not
      // anything Tooltip itself controls, so it's disabled for this check.
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})
