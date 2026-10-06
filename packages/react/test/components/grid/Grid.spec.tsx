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

    test('sets --cx-grid-rows from the rows prop', () => {
      render(<Grid rows={3}>Test</Grid>)
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-rows': '3' })
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
        <Grid rows={2} style={{ color: 'red' }}>
          Test
        </Grid>
      )
      expect(screen.getByText('Test')).toHaveStyle({
        '--cx-grid-rows': '2',
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
      render(
        <Grid
          columns={1}
          responsive={{
            sm: { columns: 2 },
            md: { columns: 3 },
            lg: { columns: 4 },
            xl: { columns: 6 },
            '2xl': { columns: 12 }
          }}
        >
          Test
        </Grid>
      )
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
      render(
        <Grid gap="md" responsive={{ lg: { gap: '3xl' } }}>
          Test
        </Grid>
      )
      expect(screen.getByText('Test')).toHaveClass('gap-md', 'lg:gap-3xl')
    })

    test('applies columns and gap of one breakpoint together', () => {
      render(<Grid responsive={{ md: { columns: 2, gap: 'lg' } }}>Test</Grid>)
      expect(screen.getByText('Test')).toHaveClass('md:grid-cols-2', 'md:gap-lg')
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
        <Grid fill gap="sm" responsive={{ md: { gap: 'lg' } }}>
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
      expect(el.style.getPropertyValue('--cx-grid-columns')).toBe('')
      expect(el.style.getPropertyValue('--cx-grid-rows')).toBe('')
    })

    test('ignores the columns of a breakpoint when fill is set', () => {
      render(
        <Grid fill responsive={{ md: { columns: 3 } }}>
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
