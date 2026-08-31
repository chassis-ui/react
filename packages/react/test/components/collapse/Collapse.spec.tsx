import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Collapse } from '../../../src/index'

describe('Collapse', () => {
  describe('rendering', () => {
    test('applies a custom className', () => {
      render(<Collapse className="bazinga">Test</Collapse>)
      expect(screen.getByText('Test')).toHaveClass('bazinga')
    })
  })

  describe('visibility transition', () => {
    test('cycles collapse/collapsing/show classes as visible toggles', () => {
      vi.useFakeTimers()
      const { rerender } = render(<Collapse visible={false}>Test</Collapse>)
      expect(screen.getByText('Test')).toHaveClass('collapse')
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).not.toHaveClass('collapsing')

      rerender(<Collapse visible={true}>Test</Collapse>)
      expect(screen.getByText('Test')).not.toHaveClass('collapse')
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).toHaveClass('collapsing')
      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('collapse')
      expect(screen.getByText('Test')).toHaveClass('show')
      expect(screen.getByText('Test')).not.toHaveClass('collapsing')

      rerender(<Collapse visible={false}>Test</Collapse>)
      expect(screen.getByText('Test')).not.toHaveClass('collapse')
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).toHaveClass('collapsing')
      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('collapse')
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).not.toHaveClass('collapsing')
      act(() => vi.runAllTimers())
      vi.useRealTimers()
    })

    test('cycles collapse/collapsing/show classes as visible toggles when horizontal', () => {
      vi.useFakeTimers()
      const onShow = vi.fn()
      const onHide = vi.fn()
      const { rerender } = render(
        <Collapse horizontal visible={false} onShow={onShow} onHide={onHide}>
          Test
        </Collapse>
      )
      expect(screen.getByText('Test')).toHaveClass('collapse', 'collapse-horizontal')

      rerender(
        <Collapse horizontal visible={true} onShow={onShow} onHide={onHide}>
          Test
        </Collapse>
      )
      expect(screen.getByText('Test')).toHaveClass('collapsing')
      expect(onShow).toHaveBeenCalledTimes(1)
      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('collapse', 'show')

      rerender(
        <Collapse horizontal visible={false} onShow={onShow} onHide={onHide}>
          Test
        </Collapse>
      )
      expect(screen.getByText('Test')).toHaveClass('collapsing')
      expect(onHide).toHaveBeenCalledTimes(1)
      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('collapse')
      act(() => vi.runAllTimers())
      vi.useRealTimers()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Collapse ref={ref}>Test</Collapse>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Collapse visible>Test</Collapse>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
