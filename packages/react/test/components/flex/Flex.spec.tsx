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

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Flex>Test</Flex>)
      expect(container).toMatchSnapshot()
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
    test('applies no direction/wrap/justify/align classes when omitted', () => {
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
