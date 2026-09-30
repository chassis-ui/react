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

  describe('size during the transition', () => {
    // jsdom lays nothing out, so every size it reports is 0.
    beforeEach(() => {
      vi.useFakeTimers()
      vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(120)
      vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300)
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        height: 120,
        width: 300
      } as DOMRect)
    })

    afterEach(() => {
      vi.restoreAllMocks()
      vi.useRealTimers()
    })

    test('grows to the content’s height, then lets go of it', () => {
      const { rerender } = render(<Collapse visible={false}>Test</Collapse>)
      rerender(<Collapse visible>Test</Collapse>)
      expect(screen.getByText('Test')).toHaveClass('collapsing')
      expect(screen.getByText('Test')).toHaveStyle({ height: '120px' })

      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('collapse', 'show')
      expect(screen.getByText('Test')).not.toHaveStyle({ height: '120px' })
    })

    test('shrinks from the height it has, pinned before it is let go', () => {
      const { rerender } = render(<Collapse visible>Test</Collapse>)
      const collapse = screen.getByText('Test')
      const observer = new MutationObserver(() => undefined)
      observer.observe(collapse, { attributeFilter: ['style'], attributeOldValue: true })

      rerender(<Collapse visible={false}>Test</Collapse>)
      expect(collapse).toHaveClass('collapsing')
      expect(collapse).not.toHaveStyle({ height: '120px' })
      const pinned = observer.takeRecords().map((record) => record.oldValue)
      observer.disconnect()
      expect(pinned).toContain('height: 120px;')

      act(() => vi.runAllTimers())
      expect(collapse).toHaveClass('collapse')
      expect(collapse).not.toHaveClass('show')
    })

    test('animates the width when horizontal', () => {
      const { rerender } = render(
        <Collapse horizontal visible={false}>
          Test
        </Collapse>
      )
      rerender(
        <Collapse horizontal visible>
          Test
        </Collapse>
      )
      expect(screen.getByText('Test')).toHaveStyle({ width: '300px' })
      expect(screen.getByText('Test')).not.toHaveStyle({ height: '120px' })
    })

    test('keeps the caller’s own style next to the size', () => {
      const { rerender } = render(
        <Collapse visible={false} style={{ color: 'red' }}>
          Test
        </Collapse>
      )
      rerender(
        <Collapse visible style={{ color: 'red' }}>
          Test
        </Collapse>
      )
      expect(screen.getByText('Test')).toHaveStyle({ color: 'rgb(255, 0, 0)', height: '120px' })
    })

    test('reverses from where it is when toggled mid-transition', () => {
      const onShow = vi.fn()
      const onHide = vi.fn()
      const { rerender } = render(
        <Collapse visible={false} onShow={onShow} onHide={onHide}>
          Test
        </Collapse>
      )
      rerender(
        <Collapse visible onShow={onShow} onHide={onHide}>
          Test
        </Collapse>
      )
      rerender(
        <Collapse visible={false} onShow={onShow} onHide={onHide}>
          Test
        </Collapse>
      )
      expect(screen.getByText('Test')).toHaveClass('collapsing')
      expect(onShow).toHaveBeenCalledTimes(1)
      expect(onHide).toHaveBeenCalledTimes(1)

      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('collapse')
      expect(screen.getByText('Test')).not.toHaveClass('show')
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
