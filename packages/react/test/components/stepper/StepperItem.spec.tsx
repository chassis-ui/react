import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { StepperItem } from '../../../src/index'

describe('StepperItem', () => {
  describe('rendering', () => {
    test('renders an li with the base class by default', () => {
      render(<StepperItem>Test</StepperItem>)
      const item = screen.getByText('Test')
      expect(item).toHaveClass('stepper-item')
      expect(item.tagName).toBe('LI')
    })

    test('applies color and active classes together', () => {
      render(
        <StepperItem className="bazinga" active color="warning">
          Test
        </StepperItem>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'stepper-item',
        'context',
        'warning',
        'active',
        'bazinga'
      )
    })

    test('renders as an interactive link when component is "a"', () => {
      render(
        <StepperItem component="a" href="/bazinga">
          Test
        </StepperItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('renders as an interactive button when component is "button"', () => {
      render(<StepperItem component="button">Test</StepperItem>)
      expect(screen.getByRole('button', { name: 'Test' })).toHaveClass('stepper-item')
    })

    test('exposes aria-current="step" when active', () => {
      render(
        <StepperItem component="a" href="/bazinga" active>
          Test
        </StepperItem>
      )
      expect(screen.getByRole('link', { name: 'Test' })).toHaveAttribute('aria-current', 'step')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref for the default li element', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<StepperItem ref={ref}>Test</StepperItem>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })

    test('forwards a ref to the underlying anchor when component is "a"', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <StepperItem ref={ref} component="a" href="/bazinga">
          Test
        </StepperItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button when component is "button"', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <StepperItem ref={ref} component="button">
          Test
        </StepperItem>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a plain step', async () => {
      const { container } = render(
        <ol>
          <StepperItem>Test</StepperItem>
        </ol>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as an active link', async () => {
      const { container } = render(
        <StepperItem component="a" href="/bazinga" active>
          Test
        </StepperItem>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
