import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Stack } from '../../../src/index'

describe('Stack', () => {
  describe('rendering', () => {
    test('renders a div with the hstack class by default', () => {
      render(<Stack>Test</Stack>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('hstack')
      expect(el).not.toHaveClass('vstack')
      expect(el.tagName).toBe('DIV')
    })

    test('renders as a custom component', () => {
      render(
        <Stack className="bazinga" component="span">
          Test
        </Stack>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('hstack', 'bazinga')
      expect(el.tagName).toBe('SPAN')
    })
  })

  describe('direction', () => {
    test('direction="vertical" renders the vstack class instead', () => {
      render(<Stack direction="vertical">Test</Stack>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('vstack')
      expect(el).not.toHaveClass('hstack')
    })
  })

  describe('gap', () => {
    test('applies a gap-{value} class for a named spacing value', () => {
      render(<Stack gap="medium">Test</Stack>)
      expect(screen.getByText('Test')).toHaveClass('gap-medium')
    })

    test('applies the literal 0 gap shorthand', () => {
      render(<Stack gap={0}>Test</Stack>)
      expect(screen.getByText('Test')).toHaveClass('gap-0')
    })

    test('applies no gap class when gap is omitted', () => {
      render(<Stack>Test</Stack>)
      expect(screen.getByText('Test').className).not.toMatch(/gap-/)
    })
  })

  describe('responsive', () => {
    test('applies a {breakpoint}:hstack/vstack class per breakpoint, in ascending order', () => {
      render(
        <Stack
          direction="vertical"
          responsive={{
            small: 'horizontal',
            medium: 'vertical',
            large: 'horizontal',
            xlarge: 'vertical',
            '2xlarge': 'horizontal'
          }}
        >
          Test
        </Stack>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass(
        'vstack',
        'small:hstack',
        'medium:vstack',
        'large:hstack',
        'xlarge:vstack',
        '2xlarge:hstack'
      )
      expect(el.className.split(' ')).toEqual([
        'vstack',
        'small:hstack',
        'medium:vstack',
        'large:hstack',
        'xlarge:vstack',
        '2xlarge:hstack'
      ])
    })

    test('only applies classes for breakpoints present in the responsive prop', () => {
      render(<Stack responsive={{ medium: 'vertical' }}>Test</Stack>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('hstack', 'medium:vstack')
      expect(el).not.toHaveClass('small:hstack', 'small:vstack', 'large:hstack', 'large:vstack')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Stack ref={ref}>Test</Stack>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Stack>Test</Stack>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
