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
      render(<Flex gap="md">Test</Flex>)
      expect(screen.getByText('Test')).toHaveClass('gap-md')
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
        <Flex rowGap="sm" columnGap="lg">
          Test
        </Flex>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass('row-gap-sm', 'column-gap-lg')
      expect(el.className.split(' ')).not.toContain('gap-sm')
      expect(el.className.split(' ')).not.toContain('gap-lg')
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
        <Flex gap="md" rowGap="sm" columnGap="lg">
          Test
        </Flex>
      )
      expect(screen.getByText('Test')).toHaveClass(
        'gap-md',
        'row-gap-sm',
        'column-gap-lg'
      )
    })
  })

  describe('responsive', () => {
    test('applies {breakpoint}:{class} per breakpoint, in ascending order, for every layout property', () => {
      render(
        <Flex
          direction="column"
          responsive={{
            sm: { direction: 'row', justify: 'center' },
            md: { wrap: 'wrap' },
            lg: { align: 'center' },
            xl: { alignContent: 'stretch' },
            '2xl': { gap: 'lg', rowGap: 'sm', columnGap: 'md' }
          }}
        >
          Test
        </Flex>
      )
      const el = screen.getByText('Test')
      expect(el).toHaveClass(
        'flex-column',
        'sm:flex-row',
        'sm:justify-content-center',
        'md:flex-wrap',
        'lg:align-items-center',
        'xl:align-content-stretch',
        '2xl:gap-lg',
        '2xl:row-gap-sm',
        '2xl:column-gap-md'
      )
      // ascending mobile-first order regardless of the object's key order
      const classes = el.className.split(' ')
      expect(classes.indexOf('sm:flex-row')).toBeLessThan(classes.indexOf('md:flex-wrap'))
      expect(classes.indexOf('md:flex-wrap')).toBeLessThan(
        classes.indexOf('lg:align-items-center')
      )
      expect(classes.indexOf('lg:align-items-center')).toBeLessThan(
        classes.indexOf('xl:align-content-stretch')
      )
      expect(classes.indexOf('xl:align-content-stretch')).toBeLessThan(
        classes.indexOf('2xl:gap-lg')
      )
    })

    test('only applies classes for breakpoints present in the responsive prop', () => {
      render(<Flex responsive={{ md: { direction: 'column' } }}>Test</Flex>)
      const el = screen.getByText('Test')
      expect(el).toHaveClass('md:flex-column')
      expect(el.className).not.toMatch(/sm:|lg:|xl:|2xl:/)
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
