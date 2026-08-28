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
    test('sets --cx-grid-columns from the columns prop', () => {
      render(<Grid columns={4}>Test</Grid>)
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-columns': '4' })
    })

    test('sets --cx-grid-rows from the rows prop', () => {
      render(<Grid rows={3}>Test</Grid>)
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-rows': '3' })
    })

    test('sets --cx-grid-gap from the gap prop', () => {
      render(<Grid gap="1rem">Test</Grid>)
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-gap': '1rem' })
    })

    test('resolves a Spacing token to the matching --cx-space-* custom property', () => {
      render(<Grid gap="medium">Test</Grid>)
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-grid-gap': 'var(--cx-space-medium)' })
    })

    test('sets no custom properties when props are omitted', () => {
      render(<Grid>Test</Grid>)
      expect(screen.getByText('Test')).not.toHaveAttribute('style')
    })

    test('preserves a caller-supplied style alongside the custom properties', () => {
      render(
        <Grid columns={4} style={{ color: 'red' }}>
          Test
        </Grid>
      )
      expect(screen.getByText('Test')).toHaveStyle({
        '--cx-grid-columns': '4',
        color: 'rgb(255, 0, 0)'
      })
    })
  })

  describe('fill', () => {
    test('renders the grid-fill class instead of grid', () => {
      render(<Grid fill>Test</Grid>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('grid-fill')
      expect(el).not.toHaveClass('grid')
    })

    test('sets --cx-gap (not --cx-grid-gap) from the gap prop', () => {
      render(
        <Grid fill gap="2rem">
          Test
        </Grid>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveStyle({ '--cx-gap': '2rem' })
      expect(el.style.getPropertyValue('--cx-grid-gap')).toBe('')
    })

    test('resolves a Spacing token to --cx-space-* on --cx-gap too', () => {
      render(
        <Grid fill gap="small">
          Test
        </Grid>
      )
      expect(screen.getByText('Test')).toHaveStyle({ '--cx-gap': 'var(--cx-space-small)' })
    })

    test('ignores columns/rows when fill is set', () => {
      render(
        <Grid fill columns={4} rows={2}>
          Test
        </Grid>
      )
      const el = screen.getByText('Test')
      expect(el.style.getPropertyValue('--cx-grid-columns')).toBe('')
      expect(el.style.getPropertyValue('--cx-grid-rows')).toBe('')
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
