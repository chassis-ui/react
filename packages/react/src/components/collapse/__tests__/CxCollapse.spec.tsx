import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCollapse } from '../../../index'

describe('CxCollapse', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxCollapse>Test</CxCollapse>)
      expect(container).toMatchSnapshot()
    })

    test('applies a custom className', () => {
      render(<CxCollapse className="bazinga">Test</CxCollapse>)
      expect(screen.getByText('Test')).toHaveClass('bazinga')
    })
  })

  describe('visibility transition', () => {
    test('cycles collapse/collapsing/show classes as visible toggles', () => {
      vi.useFakeTimers()
      const { rerender } = render(<CxCollapse visible={false}>Test</CxCollapse>)
      expect(screen.getByText('Test')).toHaveClass('collapse')
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).not.toHaveClass('collapsing')

      rerender(<CxCollapse visible={true}>Test</CxCollapse>)
      expect(screen.getByText('Test')).not.toHaveClass('collapse')
      expect(screen.getByText('Test')).not.toHaveClass('show')
      expect(screen.getByText('Test')).toHaveClass('collapsing')
      act(() => vi.runAllTimers())
      expect(screen.getByText('Test')).toHaveClass('collapse')
      expect(screen.getByText('Test')).toHaveClass('show')
      expect(screen.getByText('Test')).not.toHaveClass('collapsing')

      rerender(<CxCollapse visible={false}>Test</CxCollapse>)
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
      render(<CxCollapse ref={ref}>Test</CxCollapse>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxCollapse visible>Test</CxCollapse>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
