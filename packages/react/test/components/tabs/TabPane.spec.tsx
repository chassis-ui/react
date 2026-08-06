import * as React from 'react'
import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { TabContent, TabPane } from '../../../src/index'

describe('TabPane', () => {
  describe('rendering', () => {
    test('renders a div with the base and fade classes by default', () => {
      render(<TabPane>Test</TabPane>)
      const pane = screen.getByText('Test')
      expect(pane).toHaveClass('tab-pane', 'fade')
      expect(pane).not.toHaveClass('active')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <TabPane className="bazinga" visible>
          Test
        </TabPane>
      )
      expect(container).toMatchSnapshot()
    })

    test('applies the active class when visible', () => {
      render(<TabPane visible>Test</TabPane>)
      expect(screen.getByText('Test')).toHaveClass('active')
    })
  })

  describe('visibility transition', () => {
    test('adds the show class after the transition completes and removes it on hide', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <TabContent>
          <TabPane visible={false}>Test</TabPane>
        </TabContent>
      )
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).not.toHaveClass('active')

      rerender(
        <TabContent>
          <TabPane visible>Test</TabPane>
        </TabContent>
      )
      expect(screen.getByText('Test')).toHaveClass('active')
      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('show', 'active')

      rerender(
        <TabContent>
          <TabPane visible={false}>Test</TabPane>
        </TabContent>
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
        <TabPane visible={false} onShow={onShow} onHide={onHide}>
          Test
        </TabPane>
      )
      rerender(
        <TabPane visible onShow={onShow} onHide={onHide}>
          Test
        </TabPane>
      )
      expect(onShow).toHaveBeenCalledTimes(1)

      rerender(
        <TabPane visible={false} onShow={onShow} onHide={onHide}>
          Test
        </TabPane>
      )
      expect(onHide).toHaveBeenCalledTimes(1)
      act(() => vi.runAllTimers())
      vi.useRealTimers()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<TabPane ref={ref}>Test</TabPane>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<TabPane visible>Test</TabPane>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
