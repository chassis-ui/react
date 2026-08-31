import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Flex } from '../../../src/index'

describe('Flex', () => {
  describe('rendering', () => {
    test('renders a div with the d-flex class by default', () => {
      render(<Flex>Test</Flex>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('d-flex')
      expect(el).not.toHaveClass('d-inline-flex')
      expect(el.tagName).toBe('DIV')
    })

    test('renders as a custom component', () => {
      render(
        <Flex className="bazinga" component="span">
          Test
        </Flex>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('d-flex', 'bazinga')
      expect(el.tagName).toBe('SPAN')
    })

    test('inline renders the d-inline-flex class instead', () => {
      render(<Flex inline>Test</Flex>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('d-inline-flex')
      expect(el).not.toHaveClass('d-flex')
    })
  })

  describe('layout props', () => {
    test('applies no layout classes when omitted', () => {
      render(<Flex>Test</Flex>)
      expect(screen.getByText('Test').className).toBe('d-flex')
    })

    test('direction maps to flex-{value}', () => {
      render(<Flex direction="column">Test</Flex>)
      expect(screen.getByText('Test')).toHaveClass('flex-column')
    })

    test('wrap maps to flex-{value}', () => {
      render(<Flex wrap="wrap">Test</Flex>)
      expect(screen.getByText('Test')).toHaveClass('flex-wrap')
    })

    test('justify maps to justify-content-{value}', () => {
      render(<Flex justify="between">Test</Flex>)
      expect(screen.getByText('Test')).toHaveClass('justify-content-between')
    })

    test('align maps to align-items-{value}', () => {
      render(<Flex align="center">Test</Flex>)
      expect(screen.getByText('Test')).toHaveClass('align-items-center')
    })

    test('alignContent maps to align-content-{value}', () => {
      render(<Flex alignContent="stretch">Test</Flex>)
      expect(screen.getByText('Test')).toHaveClass('align-content-stretch')
    })
  })

  describe('gap', () => {
    test('applies a gap-{value} class for a named spacing value', () => {
      render(<Flex gap="medium">Test</Flex>)
      expect(screen.getByText('Test')).toHaveClass('gap-medium')
    })

    test('applies the literal 0 gap shorthand', () => {
      render(<Flex gap={0}>Test</Flex>)
      expect(screen.getByText('Test')).toHaveClass('gap-0')
    })

    test('applies no gap class when gap is omitted', () => {
      render(<Flex>Test</Flex>)
      expect(screen.getByText('Test').className).not.toMatch(/gap-/)
    })

    test('rowGap and columnGap apply independently of gap and each other', () => {
      render(
        <Flex rowGap="small" columnGap="large">
          Test
        </Flex>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('row-gap-small', 'column-gap-large')
      expect(el.className.split(' ')).not.toContain('gap-small')
      expect(el.className.split(' ')).not.toContain('gap-large')
    })

    test('rowGap and columnGap support the literal 0 shorthand', () => {
      render(
        <Flex rowGap={0} columnGap={0}>
          Test
        </Flex>
      )
      expect(screen.getByText('Test')).toHaveClass('row-gap-0', 'column-gap-0')
    })

    test('gap, rowGap, and columnGap can all be set at once', () => {
      render(
        <Flex gap="medium" rowGap="small" columnGap="large">
          Test
        </Flex>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'gap-medium',
        'row-gap-small',
        'column-gap-large'
      )
    })
  })

  describe('responsive', () => {
    test('applies {breakpoint}:{class} per breakpoint, in ascending order, for every layout property', () => {
      render(
        <Flex
          direction="column"
          responsive={{
            small: { direction: 'row', justify: 'center' },
            medium: { wrap: 'wrap' },
            large: { align: 'center' },
            xlarge: { alignContent: 'stretch' },
            '2xlarge': { gap: 'large', rowGap: 'small', columnGap: 'medium' }
          }}
        >
          Test
        </Flex>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass(
        'flex-column',
        'small:flex-row',
        'small:justify-content-center',
        'medium:flex-wrap',
        'large:align-items-center',
        'xlarge:align-content-stretch',
        '2xlarge:gap-large',
        '2xlarge:row-gap-small',
        '2xlarge:column-gap-medium'
      )
      // ascending mobile-first order regardless of the object's key order
      const classes = el.className.split(' ')
      expect(classes.indexOf('small:flex-row')).toBeLessThan(classes.indexOf('medium:flex-wrap'))
      expect(classes.indexOf('medium:flex-wrap')).toBeLessThan(
        classes.indexOf('large:align-items-center')
      )
      expect(classes.indexOf('large:align-items-center')).toBeLessThan(
        classes.indexOf('xlarge:align-content-stretch')
      )
      expect(classes.indexOf('xlarge:align-content-stretch')).toBeLessThan(
        classes.indexOf('2xlarge:gap-large')
      )
    })

    test('only applies classes for breakpoints present in the responsive prop', () => {
      render(<Flex responsive={{ medium: { direction: 'column' } }}>Test</Flex>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('medium:flex-column')
      expect(el.className).not.toMatch(/small:|large:|xlarge:|2xlarge:/)
    })

    test('applies no responsive classes when responsive is omitted', () => {
      render(<Flex>Test</Flex>)
      expect(screen.getByText('Test').className).toBe('d-flex')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Flex ref={ref}>Test</Flex>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Flex>Test</Flex>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
