import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Collapse } from '../../../index'

describe('Collapse', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Collapse>Test</Collapse>)
      expect(container).toMatchSnapshot()
    })

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
