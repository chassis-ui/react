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
      expect(el).toHaveClass('col-span-4', 'bazinga')
      expect(el.tagName).toBe('SECTION')
    })
  })

  describe('span/start', () => {
    test('applies the col-span-{n} class from span', () => {
      render(<GridItem span={6}>Test</GridItem>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('col-span-6')
      expect(el).not.toHaveClass('g-col-6')
    })

    test('applies col-span-full for a full-width item', () => {
      render(<GridItem span="full">Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('col-span-full')
    })

    test('applies the col-start-{n} class from start', () => {
      render(<GridItem start={2}>Test</GridItem>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('col-start-2')
      expect(el).not.toHaveClass('g-start-2')
    })

    test('applies col-start-auto to return the item to the flow', () => {
      render(<GridItem start="auto">Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('col-start-auto')
    })

    test('applies both span and start together', () => {
      render(
        <GridItem span={4} start={3}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass('col-span-4', 'col-start-3')
    })
  })

  describe('end/rowEnd', () => {
    test('applies the col-end-{n} class from end', () => {
      render(
        <GridItem span={3} end={13}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test').className).toBe('col-span-3 col-end-13')
    })

    test('applies col-end-auto to undo an end line', () => {
      render(<GridItem end="auto">Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('col-end-auto')
    })

    test('applies the row-end-{n} class from rowEnd', () => {
      render(
        <GridItem rowStart={2} rowEnd={4}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test').className).toBe('row-start-2 row-end-4')
    })

    test('applies row-end-auto to undo an end line', () => {
      render(<GridItem rowEnd="auto">Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('row-end-auto')
    })

    test('applies end/rowEnd classes per breakpoint', () => {
      render(
        <GridItem span={3} end={13} responsive={{ md: { end: 'auto', rowEnd: 3 } }}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test').className).toBe(
        'col-span-3 col-end-13 md:col-end-auto md:row-end-3'
      )
    })
  })

  describe('rowSpan/rowStart', () => {
    test('applies the row-span-{n} class from rowSpan', () => {
      render(<GridItem rowSpan={2}>Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('row-span-2')
    })

    test('applies the row-start-{n} class from rowStart', () => {
      render(<GridItem rowStart={3}>Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('row-start-3')
    })

    test('applies row-start-auto to return the item to the flow', () => {
      render(<GridItem rowStart="auto">Test</GridItem>)
      expect(screen.getByText('Test')).toHaveClass('row-start-auto')
    })

    test('places an item on both axes', () => {
      render(
        <GridItem span={4} start={2} rowSpan={2} rowStart={1}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'col-span-4',
        'col-start-2',
        'row-span-2',
        'row-start-1'
      )
    })
  })

  describe('breakpoint props', () => {
    test('applies span/start classes per breakpoint', () => {
      render(
        <GridItem
          span={12}
          responsive={{
            sm: { span: 6 },
            md: { span: 4, start: 2 },
            lg: { span: 3 },
            xl: { span: 2 },
            '2xl': { span: 1 }
          }}
        >
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'col-span-12',
        'sm:col-span-6',
        'md:col-span-4',
        'md:col-start-2',
        'lg:col-span-3',
        'xl:col-span-2',
        '2xl:col-span-1'
      )
    })

    test('stacks below a breakpoint with span="full" and resets a start line with "auto"', () => {
      render(
        <GridItem
          span="full"
          start={1}
          responsive={{ md: { span: 6, start: 4 }, xl: { span: 'full', start: 'auto' } }}
        >
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'col-span-full',
        'col-start-1',
        'md:col-span-6',
        'md:col-start-4',
        'xl:col-span-full',
        'xl:col-start-auto'
      )
    })

    test('applies rowSpan/rowStart classes per breakpoint', () => {
      render(
        <GridItem
          rowSpan={1}
          responsive={{ md: { rowSpan: 2, rowStart: 2 }, lg: { rowStart: 'auto' } }}
        >
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'row-span-1',
        'md:row-span-2',
        'md:row-start-2',
        'lg:row-start-auto'
      )
    })
  })

  describe('container breakpoints', () => {
    test('maps an @ key of responsive to the container-query classes', () => {
      render(
        <GridItem
          span="full"
          responsive={{
            '@sm': { span: 6 },
            '@md': { span: 4, start: 2 },
            '@lg': { end: 13 },
            '@xl': { rowSpan: 2, rowStart: 1 },
            '@2xl': { rowEnd: 'auto' }
          }}
        >
          Test
        </GridItem>
      )
      expect(screen.getByText('Test').className).toBe(
        'col-span-full @sm:col-span-6 @md:col-span-4 @md:col-start-2 @lg:col-end-13 ' +
          '@xl:row-span-2 @xl:row-start-1 @2xl:row-end-auto'
      )
    })

    test('mixes breakpoint and container keys, container classes last', () => {
      render(
        <GridItem span="full" responsive={{ '@lg': { span: 4 }, md: { span: 6 } }}>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test').className).toBe('col-span-full md:col-span-6 @lg:col-span-4')
    })
  })

  describe('subgrid', () => {
    test('adds grid-cols-subgrid alongside grid, combined with the col-span-{n} class', () => {
      render(
        <GridItem span={8} subgrid>
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveClass('col-span-8', 'grid', 'grid-cols-subgrid')
    })

    test('maps rows from 1 to 6 to the grid-rows-{n} class', () => {
      render(
        <GridItem subgrid rows={2}>
          Test
        </GridItem>
      )
      const el = screen.getByText('Test')
      expect(el.className).toBe('grid grid-cols-subgrid grid-rows-2')
      expect(el).not.toHaveAttribute('style')
    })

    test('sets grid-template-rows inline for a row count with no class', () => {
      render(
        <GridItem subgrid rows={8}>
          Test
        </GridItem>
      )
      const el = screen.getByText('Test')
      expect(el.className).toBe('grid grid-cols-subgrid')
      expect(el.style.gridTemplateRows).toBe('repeat(8, minmax(0, 1fr))')
    })

    test('sets --cx-grid-gap from the gap prop', () => {
      render(
        <GridItem subgrid gap="1rem">
          Test
        </GridItem>
      )
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-gap': '1rem' })
    })

    test('maps a Spacing token to the gap-{token} class, not a custom property', () => {
      render(
        <GridItem subgrid gap="md">
          Test
        </GridItem>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('gap-md')
      expect(el.style.getPropertyValue('--cx-grid-gap')).toBe('')
    })

    test('ignores rows/gap when subgrid is not set', () => {
      render(
        <GridItem rows={2} gap="1rem">
          Test
        </GridItem>
      )
      const el = screen.getByText('Test')
      expect(el.className).toBe('')
      expect(el).not.toHaveAttribute('style')
    })

    test('ignores a row count with no class when subgrid is not set', () => {
      render(<GridItem rows={8}>Test</GridItem>)
      expect(screen.getByText('Test')).not.toHaveAttribute('style')
    })

    test('adds no gap class when subgrid is not set', () => {
      render(<GridItem gap="md">Test</GridItem>)
      expect(screen.getByText('Test')).not.toHaveClass('gap-md')
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
