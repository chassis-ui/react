import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { InputGroup, InputGroupAddon } from '../../../src/index'

describe('InputGroup', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<InputGroup>Test</InputGroup>)
      const group = screen.getByText('Test')
      expect(group).toHaveClass('input-group')
      expect(group.tagName).toBe('DIV')
    })

    test('applies size class and className together', () => {
      render(
        <InputGroup className="bazinga" size="large">
          Test
        </InputGroup>
      )
      expect(screen.getByText('Test')).toHaveClass('input-group', 'large', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<InputGroup ref={ref}>Test</InputGroup>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('composed with InputGroupAddon', () => {
    test('an InputGroupAddon rendered as a label with a matching htmlFor resolves the input accessible name', () => {
      render(
        <InputGroup>
          <InputGroupAddon component="label" htmlFor="username">
            Username
          </InputGroupAddon>
          <input id="username" />
        </InputGroup>
      )
      expect(screen.getByRole('textbox', { name: 'Username' })).toHaveAttribute('id', 'username')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<InputGroup>Test</InputGroup>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
