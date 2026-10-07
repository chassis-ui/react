import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Grid } from '../../../src/index'

describe('Grid', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<Grid>Test</Grid>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('grid')
      expect(el).not.toHaveClass('grid-fill')
      expect(el.tagName).toBe('DIV')
    })

    test('renders as a custom component', () => {
      render(
        <Grid className="bazinga" component="section">
          Test
        </Grid>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('grid', 'bazinga')
      expect(el.tagName).toBe('SECTION')
    })
  })

  describe('custom properties', () => {
    test('sets --cx-grid-columns for a column count chassis-css has no class for', () => {
      render(<Grid columns={16}>Test</Grid>)
      const el = screen.getByText('Test')
      expect(el).toHaveStyle({ '--cx-grid-columns': '16' })
      expect(el).not.toHaveClass('grid-cols-16')
    })

    test('sets --cx-grid-gap from the gap prop', () => {
      render(<Grid gap="1rem">Test</Grid>)
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-gap': '1rem' })
    })

    test('sets a "{row} {column}" pair on --cx-grid-gap unchanged', () => {
      render(<Grid gap=".25rem 1rem">Test</Grid>)
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-gap': '.25rem 1rem' })
    })

    test('sets no custom properties when props are omitted', () => {
      render(<Grid>Test</Grid>)
      expect(screen.getByText('Test')).not.toHaveAttribute('style')
    })

    test('preserves a caller-supplied style alongside the custom properties', () => {
      render(
        <Grid gap="1rem" style={{ color: 'red' }}>
          Test
        </Grid>
      )
      expect(screen.getByText('Test')).toHaveStyle({
        '--cx-grid-gap': '1rem',
        color: 'rgb(255, 0, 0)'
      })
    })
  })

  describe('columns', () => {
    test('maps a count from 1 to 12 to the grid-cols-{n} class, not a custom property', () => {
      render(<Grid columns={4}>Test</Grid>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('grid', 'grid-cols-4')
      expect(el).not.toHaveAttribute('style')
    })

    test.each([1, 12])('has a class for %i columns, the ends of the range', (columns) => {
      render(<Grid columns={columns}>Test</Grid>)
      expect(screen.getByText('Test')).toHaveClass(`grid-cols-${columns}`)
    })

    // An inline --cx-grid-columns is inherited: a grid nested in this one would take its count.
    test('leaves --cx-grid-columns to a nested grid', () => {
      render(
        <Grid columns={1} data-testid="outer">
          <Grid>Inner</Grid>
        </Grid>
      )
      expect(screen.getByTestId('outer').style.getPropertyValue('--cx-grid-columns')).toBe('')
      expect(screen.getByText('Inner').className).toBe('grid')
    })

    test.each([0, 13, 2.5])(
      'falls back to --cx-grid-columns for %s, which has no class',
      (columns) => {
        render(<Grid columns={columns}>Test</Grid>)
        const el = screen.getByText('Test')
        expect(el.className).toBe('grid')
        expect(el.style.getPropertyValue('--cx-grid-columns')).toBe(String(columns))
      }
    )
  })

  describe('rows', () => {
    test('maps a count from 1 to 6 to the grid-rows-{n} class, not a style', () => {
      render(<Grid rows={3}>Test</Grid>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('grid', 'grid-rows-3')
      expect(el).not.toHaveAttribute('style')
    })

    test.each([1, 6])('has a class for %i rows, the ends of the range', (rows) => {
      render(<Grid rows={rows}>Test</Grid>)
      expect(screen.getByText('Test')).toHaveClass(`grid-rows-${rows}`)
    })

    // chassis-css 0.7 removed --cx-grid-rows: a count with no class is the class's declaration.
    test.each([7, 12])('sets grid-template-rows inline for %i, which has no class', (rows) => {
      render(<Grid rows={rows}>Test</Grid>)
      const el = screen.getByText('Test')
      expect(el.className).toBe('grid')
      expect(el.style.gridTemplateRows).toBe(`repeat(${rows}, minmax(0, 1fr))`)
      expect(el.style.getPropertyValue('--cx-grid-rows')).toBe('')
    })

    test('keeps the rows of a grid from a grid nested in it', () => {
      render(
        <Grid rows={8} data-testid="outer">
          <Grid>Inner</Grid>
        </Grid>
      )
      expect(screen.getByText('Inner')).not.toHaveAttribute('style')
      expect(screen.getByText('Inner').className).toBe('grid')
    })
  })

  describe('flow', () => {
    test.each([
      ['row', 'grid-flow-row'],
      ['column', 'grid-flow-col'],
      ['dense', 'grid-flow-dense'],
      ['row-dense', 'grid-flow-row-dense'],
      ['column-dense', 'grid-flow-col-dense']
    ] as const)('maps flow="%s" to %s', (flow, className) => {
      render(<Grid flow={flow}>Test</Grid>)
      expect(screen.getByText('Test').className).toBe(`grid ${className}`)
    })

    test('adds no flow class when flow is omitted', () => {
      render(<Grid>Test</Grid>)
      expect(screen.getByText('Test').className).toBe('grid')
    })

    test('applies to a fill grid too', () => {
      render(
        <Grid fill flow="dense">
          Test
        </Grid>
      )
      expect(screen.getByText('Test').className).toBe('grid-fill grid-flow-dense')
    })
  })

  describe('gap tokens', () => {
    test('maps a Spacing token to the gap-{token} class, not a custom property', () => {
      render(<Grid gap="md">Test</Grid>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('grid', 'gap-md')
      expect(el).not.toHaveAttribute('style')
    })

    test('maps the zero token to gap-zero', () => {
      render(<Grid gap="zero">Test</Grid>)
      expect(screen.getByText('Test')).toHaveClass('gap-zero')
    })

    test('adds no gap class for a raw CSS value', () => {
      render(<Grid gap="1rem">Test</Grid>)
      expect(screen.getByText('Test').className).toBe('grid')
    })
  })

  describe('breakpoint props', () => {
    test('applies grid-cols-{n} classes per breakpoint', () => {
      render(<Grid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 6, '2xl': 12 }}>Test</Grid>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass(
        'grid',
        'grid-cols-1',
        'sm:grid-cols-2',
        'md:grid-cols-3',
        'lg:grid-cols-4',
        'xl:grid-cols-6',
        '2xl:grid-cols-12'
      )
      expect(el).not.toHaveAttribute('style')
    })

    test('applies gap-{token} classes per breakpoint', () => {
      render(<Grid gap={{ base: 'md', lg: '3xl' }}>Test</Grid>)
      expect(screen.getByText('Test')).toHaveClass('gap-md', 'lg:gap-3xl')
    })

    // An inline style holds no media query, so only the base of an object can fall back to one.
    test('sets the base of an object inline where it has no class, as a plain value does', () => {
      render(
        <Grid
          columns={{ base: 16, md: 3 }}
          rows={{ base: 8, md: 2 }}
          gap={{ base: '1rem', md: 'lg' }}
        >
          Test
        </Grid>
      )
      const el = screen.getByText('Test')
      expect(el.className).toBe('grid md:grid-cols-3 md:grid-rows-2 md:gap-lg')
      expect(el).toHaveStyle({ '--cx-grid-columns': '16', '--cx-grid-gap': '1rem' })
      expect(el.style.gridTemplateRows).toBe('repeat(8, minmax(0, 1fr))')
    })

    test('applies columns and gap of one breakpoint together', () => {
      render(
        <Grid columns={{ md: 2 }} gap={{ md: 'lg' }}>
          Test
        </Grid>
      )
      expect(screen.getByText('Test')).toHaveClass('md:grid-cols-2', 'md:gap-lg')
    })

    test('applies grid-rows-{n} and grid-flow-* classes per breakpoint', () => {
      render(
        <Grid rows={{ base: 3, md: 2 }} flow={{ base: 'column', lg: 'row-dense' }}>
          Test
        </Grid>
      )
      expect(screen.getByText('Test').className).toBe(
        'grid grid-rows-3 grid-flow-col md:grid-rows-2 lg:grid-flow-row-dense'
      )
    })
  })

  describe('container breakpoints', () => {
    test('maps an @ key of a prop to the container-query classes', () => {
      render(
        <Grid
          columns={{ base: 1, '@sm': 2, '@md': 3, '@2xl': 6 }}
          gap={{ '@md': 'lg' }}
          rows={{ '@lg': 2 }}
          flow={{ '@xl': 'column' }}
        >
          Test
        </Grid>
      )
      expect(screen.getByText('Test').className).toBe(
        'grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @md:gap-lg @lg:grid-rows-2 ' +
          '@xl:grid-flow-col @2xl:grid-cols-6'
      )
    })

    // chassis-css writes the container rules last, so the class list reads in cascade order.
    test('puts the container classes after the breakpoint classes, whatever the key order', () => {
      render(<Grid columns={{ sm: 2, '2xl': 6, '@md': 3 }}>Test</Grid>)
      expect(screen.getByText('Test').className).toBe(
        'grid sm:grid-cols-2 2xl:grid-cols-6 @md:grid-cols-3'
      )
    })

    test('adds the contained class from the contained prop', () => {
      render(<Grid contained>Test</Grid>)
      expect(screen.getByText('Test').className).toBe('grid contained')
    })

    test('adds contained to a fill grid too', () => {
      render(
        <Grid fill contained>
          Test
        </Grid>
      )
      expect(screen.getByText('Test').className).toBe('grid-fill contained')
    })
  })

  describe('fill', () => {
    test('renders the grid-fill class instead of grid', () => {
      render(<Grid fill>Test</Grid>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('grid-fill')
      expect(el).not.toHaveClass('grid')
    })

    test('sets --cx-grid-gap from the gap prop, like a grid that is not fill', () => {
      render(
        <Grid fill gap="2rem">
          Test
        </Grid>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveStyle({ '--cx-grid-gap': '2rem' })
      expect(el.style.getPropertyValue('--cx-gap')).toBe('')
    })

    test('maps a Spacing token to the gap-{token} class too', () => {
      render(
        <Grid fill gap={{ base: 'sm', md: 'lg' }}>
          Test
        </Grid>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('grid-fill', 'gap-sm', 'md:gap-lg')
      expect(el).not.toHaveAttribute('style')
    })

    test('sets --cx-grid-min from the min prop', () => {
      render(
        <Grid fill min="12rem">
          Test
        </Grid>
      )
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-min': '12rem' })
    })

    test('ignores columns/rows when fill is set', () => {
      render(
        <Grid fill columns={4} rows={2}>
          Test
        </Grid>
      )
      const el = screen.getByText('Test')
      expect(el.className).toBe('grid-fill')
      expect(el).not.toHaveAttribute('style')
    })

    test('ignores a row count with no class when fill is set', () => {
      render(
        <Grid fill rows={8}>
          Test
        </Grid>
      )
      expect(screen.getByText('Test')).not.toHaveAttribute('style')
    })

    test('ignores the columns and rows of a breakpoint when fill is set', () => {
      render(
        <Grid fill columns={{ md: 3, '@lg': 4 }} rows={{ md: 2 }}>
          Test
        </Grid>
      )
      expect(screen.getByText('Test').className).toBe('grid-fill')
    })
  })

  describe('min', () => {
    test('ignores min when fill is not set', () => {
      render(<Grid min="12rem">Test</Grid>)
      expect(screen.getByText('Test')).not.toHaveAttribute('style')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Grid ref={ref}>Test</Grid>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Grid>Test</Grid>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
