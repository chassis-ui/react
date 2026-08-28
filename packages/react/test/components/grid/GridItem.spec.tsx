import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { GridItem } from '../../../src/index'

describe('GridItem', () => {
  describe('rendering', () => {
    test('renders a div with no classes when no props are set', () => {
      render(<GridItem>Test</GridItem>)
      const el = screen.getByText('Test')
      expect(el.tagName).toBe('DIV')
      expect(el.className).toBe('')
    })

    test('renders as a custom component', () => {
      render(
        <GridItem className="bazinga" component="section" span={4}>
          Test
        </GridItem>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('g-col-4', 'bazinga')
      expect(el.tagName).toBe('SECTION')
    })
  })

  describe('span/start', () => {
    test('applies the g-col-{n} class from span', () => {
      render(<GridItem span={6}>Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('g-col-6')
    })

    test('applies the g-start-{n} class from start', () => {
      render(<GridItem start={2}>Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('g-start-2')
    })

    test('applies both span and start together', () => {
      render(
        <GridItem span={4} start={3}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass('g-col-4', 'g-start-3')
    })
  })

  describe('breakpoint props', () => {
    test('applies span/start classes per breakpoint', () => {
      render(
        <GridItem
          span={12}
          responsive={{
            small: { span: 6 },
            medium: { span: 4, start: 2 },
            large: { span: 3 },
            xlarge: { span: 2 },
            '2xlarge': { span: 1 }
          }}
        >
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'g-col-12',
        'small:g-col-6',
        'medium:g-col-4',
        'medium:g-start-2',
        'large:g-col-3',
        'xlarge:g-col-2',
        '2xlarge:g-col-1'
      )
    })
  })

  describe('subgrid', () => {
    test('adds grid-cols-subgrid alongside grid, combined with the g-col-{n} class', () => {
      render(
        <GridItem span={8} subgrid>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass('g-col-8', 'grid', 'grid-cols-subgrid')
    })

    test('sets --cx-grid-rows from the rows prop', () => {
      render(
        <GridItem subgrid rows={2}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-rows': '2' })
    })

    test('sets --cx-grid-gap from the gap prop', () => {
      render(
        <GridItem subgrid gap="1rem">
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-gap': '1rem' })
    })

    test('resolves a Spacing token to the matching --cx-space-* custom property', () => {
      render(
        <GridItem subgrid gap="medium">
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-gap': 'var(--cx-space-medium)' })
    })

    test('ignores rows/gap when subgrid is not set', () => {
      render(
        <GridItem rows={2} gap="1rem">
          Test
        </GridItem>
      )
      const el = screen.getByText('Test')
      expect(el).not.toHaveClass('grid', 'grid-cols-subgrid')
      expect(el.style.getPropertyValue('--cx-grid-rows')).toBe('')
      expect(el.style.getPropertyValue('--cx-grid-gap')).toBe('')
    })

    test('preserves a caller-supplied style alongside the custom properties', () => {
      render(
        <GridItem subgrid gap="1rem" style={{ color: 'red' }}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveStyle({
        '--cx-grid-gap': '1rem',
        color: 'rgb(255, 0, 0)'
      })
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<GridItem ref={ref}>Test</GridItem>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<GridItem>Test</GridItem>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
