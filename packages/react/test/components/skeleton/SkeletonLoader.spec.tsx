import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { SkeletonLoader } from '../../../src/index'

describe('SkeletonLoader', () => {
  describe('rendering', () => {
    test('renders children unchanged, with no wrapping element, once loaded', () => {
      const { container } = render(
        <SkeletonLoader loading={false} spans={[6]}>
          Real content
        </SkeletonLoader>
      )
      expect(container.innerHTML).toBe('Real content')
    })

    // The generated lines are decorative, with no text/role - there's no accessible query for them.
    /* eslint-disable testing-library/no-node-access, testing-library/no-container */
    test('renders one skeleton per span while loading, instead of children', () => {
      const { container } = render(
        <SkeletonLoader loading spans={[12, 6]}>
          Real content
        </SkeletonLoader>
      )
      const lines = container.querySelectorAll('.skeleton')
      expect(lines).toHaveLength(2)
      expect(lines[0]).toHaveClass('col-12')
      expect(lines[1]).toHaveClass('col-6')
      expect(container).not.toHaveTextContent('Real content')
    })

    test('applies color to every generated line', () => {
      const { container } = render(
        <SkeletonLoader loading spans={[6, 4]} color="primary">
          Real content
        </SkeletonLoader>
      )
      const lines = container.querySelectorAll('.skeleton')
      expect(lines[0]).toHaveClass('bg-primary')
      expect(lines[1]).toHaveClass('bg-primary')
    })

    test('renders a single line for a single-entry spans array', () => {
      const { container } = render(
        <SkeletonLoader loading spans={[4]}>
          Real content
        </SkeletonLoader>
      )
      expect(container.querySelectorAll('.skeleton')).toHaveLength(1)
    })

    test('accepts a bare span value as shorthand for a single-entry array', () => {
      const { container } = render(
        <SkeletonLoader loading spans={4}>
          Real content
        </SkeletonLoader>
      )
      const lines = container.querySelectorAll('.skeleton')
      expect(lines).toHaveLength(1)
      expect(lines[0]).toHaveClass('col-4')
    })
    /* eslint-enable testing-library/no-node-access, testing-library/no-container */

    test('renders non-text children unchanged once loaded', () => {
      render(
        <SkeletonLoader loading={false} spans={[6]}>
          <button type="button">Click me</button>
        </SkeletonLoader>
      )
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    /* eslint-disable testing-library/no-node-access, testing-library/no-container */
    test('renders the generated skeleton as a custom component when component is set', () => {
      const { container } = render(
        <SkeletonLoader loading component="div">
          Real content
        </SkeletonLoader>
      )
      expect(container.querySelector('.skeleton')?.nodeName).toBe('DIV')
    })

    test('forwards extra props to the generated skeleton for a custom component', () => {
      const { container } = render(
        <SkeletonLoader loading component="button" aria-label="Loading">
          Real content
        </SkeletonLoader>
      )
      const line = container.querySelector('.skeleton')
      expect(line?.nodeName).toBe('BUTTON')
      expect(line).toHaveAttribute('aria-label', 'Loading')
    })

    test('adds no width class to the generated skeleton when spans is omitted', () => {
      const { container } = render(
        <SkeletonLoader loading component="div">
          Real content
        </SkeletonLoader>
      )
      const line = container.querySelector('.skeleton')
      expect(line).not.toHaveClass('w-100', 'col')
      expect(container.querySelectorAll('.skeleton')).toHaveLength(1)
    })
    /* eslint-enable testing-library/no-node-access, testing-library/no-container */
  })

  describe('accessibility', () => {
    test('has no axe violations while loading', async () => {
      const { container } = render(
        <SkeletonLoader loading spans={[12, 6]}>
          Real content
        </SkeletonLoader>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations once loaded', async () => {
      const { container } = render(
        <SkeletonLoader loading={false} spans={[12, 6]}>
          Real content
        </SkeletonLoader>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
