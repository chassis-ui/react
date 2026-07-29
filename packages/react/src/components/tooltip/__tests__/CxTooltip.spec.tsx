import * as React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { CxTooltip, CxLink } from '../../../index'

// react-aria only treats a hover as pointer-triggered (as opposed to touch/virtual) once it's
// seen a real pointer-ish event on the page — establish that modality first. Needs actual
// PointerEvents (not mouse events) for react-aria to recognize the modality under this jsdom
// version.
const hoverOver = (target: HTMLElement) => {
  fireEvent.pointerMove(document.body)
  fireEvent.pointerEnter(target)
}

describe('CxTooltip', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxTooltip content="content">
          <CxLink>Test</CxLink>
        </CxTooltip>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders placement, arrow and content once shown on hover', () => {
      vi.useFakeTimers()
      render(
        <CxTooltip trigger="hover" placement="right" content="content">
          <CxLink className="link">Test</CxLink>
        </CxTooltip>
      )
      hoverOver(screen.getByText('Test'))
      act(() => vi.runAllTimers())
      act(() => vi.runAllTimers())
      expect(document.body).toMatchSnapshot()

      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('cx-tooltip-auto')
      expect(tooltip).toHaveAttribute('data-cx-placement')
      expect(tooltip.innerHTML).toContain('content')
      // The arrow is a decorative element with no role/name of its own.
      // eslint-disable-next-line testing-library/no-node-access
      expect(tooltip.querySelector('.tooltip-arrow')).toBeInTheDocument()
      vi.useRealTimers()
    })
  })

  describe('visibility', () => {
    test('scopes itself to an open dialog ancestor', () => {
      vi.useFakeTimers()
      render(
        <dialog open>
          <CxTooltip trigger="hover" content="content">
            <CxLink className="link">Test</CxLink>
          </CxTooltip>
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
        <CxTooltip content="content" visible={false}>
          <CxLink className="link">Test</CxLink>
        </CxTooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      rerender(
        <CxTooltip content="content" visible={true}>
          <CxLink className="link">Test</CxLink>
        </CxTooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByRole('tooltip')).toBeInTheDocument()

      rerender(
        <CxTooltip content="content" visible={false}>
          <CxLink className="link">Test</CxLink>
        </CxTooltip>
      )
      act(() => vi.runAllTimers())
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    test('trigger="focus" ignores hover', () => {
      vi.useFakeTimers()
      render(
        <CxTooltip trigger="focus" content="content">
          <CxLink className="link">Test</CxLink>
        </CxTooltip>
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
        <CxTooltip content="content" visible>
          <CxLink href="#">Test</CxLink>
        </CxTooltip>
      )
      act(() => vi.runAllTimers())
      vi.useRealTimers()
      // The tooltip portals to document.body directly, sibling to the trigger's own render
      // container — neither sits inside a page landmark in this isolated fixture, which trips
      // axe's "region" best-practice rule. That rule is about overall page structure, not
      // anything CxTooltip itself controls, so it's disabled for this check.
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})
