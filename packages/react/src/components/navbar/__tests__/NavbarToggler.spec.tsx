import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { NavbarToggler } from '../../../index'

describe('NavbarToggler', () => {
  describe('rendering', () => {
    test('renders a button with the base class', () => {
      render(<NavbarToggler>Test</NavbarToggler>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('navbar-toggler')
      expect(button).toHaveAttribute('type', 'button')
    })

    test('renders a default toggler icon when no children are provided', () => {
      // Decorative default icon: no text, no role, so there's no accessible query for it.
      const { container } = render(<NavbarToggler />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('.navbar-toggler-icon')).toHaveLength(1)
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<NavbarToggler />)
      expect(container).toMatchSnapshot()
    })

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
      const { container } = render(<NavbarToggler aria-label="Toggle navigation" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
