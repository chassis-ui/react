import * as React from 'react'
import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxTabContent, CxTabPane } from '../../../index'

describe('CxTabPane', () => {
  describe('rendering', () => {
    test('renders a div with the base and fade classes by default', () => {
      render(<CxTabPane>Test</CxTabPane>)
      const pane = screen.getByText('Test')
      expect(pane).toHaveClass('tab-pane', 'fade')
      expect(pane).not.toHaveClass('active')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxTabPane className="bazinga" visible>
          Test
        </CxTabPane>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies the active class when visible', () => {
      render(<CxTabPane visible>Test</CxTabPane>)
      expect(screen.getByText('Test')).toHaveClass('active')
    })
  })

  describe('visibility transition', () => {
    test('adds the show class after the transition completes and removes it on hide', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <CxTabContent>
          <CxTabPane visible={false}>Test</CxTabPane>
        </CxTabContent>
      )
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).not.toHaveClass('active')

      rerender(
        <CxTabContent>
          <CxTabPane visible>Test</CxTabPane>
        </CxTabContent>
      )
      expect(screen.getByText('Test')).toHaveClass('active')
      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('show', 'active')

      rerender(
        <CxTabContent>
          <CxTabPane visible={false}>Test</CxTabPane>
        </CxTabContent>
      )
      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).not.toHaveClass('active')
      vi.useRealTimers()
    })

    test('fires onShow and onHide as visibility changes', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      const onHide = vi.fn()
      const { rerender } = render(
        <CxTabPane visible={false} onShow={onShow} onHide={onHide}>
          Test
        </CxTabPane>
      )
      rerender(
        <CxTabPane visible onShow={onShow} onHide={onHide}>
          Test
        </CxTabPane>
      )
      expect(onShow).toHaveBeenCalledTimes(1)

      rerender(
        <CxTabPane visible={false} onShow={onShow} onHide={onHide}>
          Test
        </CxTabPane>
      )
      expect(onHide).toHaveBeenCalledTimes(1)
      act(() => vi.runAllTimers())
      vi.useRealTimers()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxTabPane ref={ref}>Test</CxTabPane>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxTabPane visible>Test</CxTabPane>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
