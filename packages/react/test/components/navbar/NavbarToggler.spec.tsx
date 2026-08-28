import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { NavbarToggler } from '../../../src/index'

describe('NavbarToggler', () => {
  describe('rendering', () => {
    test('renders a button with the base class', () => {
      render(<NavbarToggler>Test</NavbarToggler>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('button', 'icon-only', 'navbar-toggler')
      expect(button).toHaveAttribute('type', 'button')
    })

    test('renders a default toggler icon with a default accessible name when no children are provided', () => {
      render(<NavbarToggler />)
      expect(screen.getByRole('button', { name: 'Toggle navigation' })).toBeInTheDocument()
      expect(screen.getByText('Toggle navigation')).toHaveClass('visually-hidden')
    })

    test('accepts a custom label for the default icon', () => {
      render(<NavbarToggler label="Open menu" />)
      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
    })

    // Decorative by default (aria-hidden), so there's no accessible query — needs raw node access.
    /* eslint-disable testing-library/no-node-access */
    test('renders the default toggler icon as a decorative svg', () => {
      render(<NavbarToggler />)
      const button = screen.getByRole('button', { name: 'Toggle navigation' })
      const svg = button.querySelector('svg') as SVGSVGElement
      expect(svg).toHaveClass('icon', 'navbar-toggler-icon')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('height', '24')
      expect(svg).toHaveAttribute('width', '24')
      expect(svg.querySelector('use')).toHaveAttribute(
        'href',
        '/static/icons/chassis-icons.svg#bars-outline'
      )
    })
    /* eslint-enable testing-library/no-node-access */

    test('applies a custom className', () => {
      render(<NavbarToggler className="bazinga" />)
      expect(screen.getByRole('button')).toHaveClass('navbar-toggler', 'bazinga')
    })
  })

  describe('click behavior', () => {
    test('fires onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<NavbarToggler onClick={onClick} />)
      await user.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<NavbarToggler ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<NavbarToggler />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
